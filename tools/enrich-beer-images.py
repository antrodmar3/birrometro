"""Enriquece beer-catalog.js con imágenes verificadas de Wikimedia Commons.

La búsqueda usa el nombre completo y una variante sin paréntesis. Solo acepta
resultados cuyo título coincide de forma suficientemente fuerte con la cerveza.
Guarda una caché para que las siguientes ejecuciones no repitan consultas.
"""

from __future__ import annotations

import concurrent.futures
import csv
import json
import re
import sys
import time
import unicodedata
import urllib.parse
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
CATALOG_PATH = ROOT / "beer-catalog.js"
CACHE_PATH = ROOT / "tools" / "beer-image-cache.json"
AUDIT_PATH = ROOT / "tools" / "beer-image-audit.csv"
API_URL = "https://commons.wikimedia.org/w/api.php"
USER_AGENT = "Birrometro/1.0 (https://github.com/antrodmar3/birrometro)"
MAX_WORKERS = 6
SEARCH_VERSION = 2
INVALID_MATCHES = {
    ("Sol", "File:Best of Madeira - Coral Beer at Ponta do Sol.webm"),
    ("Bitter XX", "File:Ale Bitter.jpg"),
    ("Biere du Desert", "File:Into the (Food) Desert- Day 6 - beer bread made from convenience store purchases.jpg"),
    ("St. Louis (Melocotón)", "File:E. Anheuser Co.'s Brewing Association Bock (Beer), St. Louis, MO.jpg"),
    ("St. Louis (Cereza)", "File:E. Anheuser Co.'s Brewing Association Bock (Beer), St. Louis, MO.jpg"),
    ("St. Louis (Frambuesa)", "File:E. Anheuser Co.'s Brewing Association Bock (Beer), St. Louis, MO.jpg"),
    ("St. Louis (Trigo)", "File:E. Anheuser Co.'s Brewing Association Bock (Beer), St. Louis, MO.jpg"),
}

IMAGE_HINTS = {
    "beer", "bier", "biere", "cerveza", "brew", "brewery", "bottle",
    "bottles", "can", "cans", "label", "logo", "glass", "pint", "ale",
    "lager", "stout", "trappist", "tripel", "lambic",
}
LANGUAGE_STOPWORDS = {
    "the", "de", "del", "la", "le", "les", "van", "von", "and", "et",
    "beer", "bier", "biere", "cerveza", "brewery", "brasserie", "brouwerij",
}
STYLE_STOPWORDS = {
    "ale", "lager", "stout", "porter", "pale", "india", "especial", "special",
    "triple", "tripel", "dubble", "dubbel", "double", "doppel", "bock", "blonde",
    "blond", "brune", "bruin", "dark", "red", "amber", "strong", "premium",
}
STOPWORDS = LANGUAGE_STOPWORDS | STYLE_STOPWORDS


def normalize(value: str) -> str:
    value = unicodedata.normalize("NFKD", value or "")
    value = "".join(char for char in value if not unicodedata.combining(char))
    value = " ".join(re.findall(r"[a-z0-9]+", value.lower()))
    return (
        value.replace("india pale ale", "ipa")
        .replace("doppel bock", "doppelbock")
        .replace("triple", "tripel")
        .replace("dubble", "dubbel")
    )


def load_catalog() -> list[dict]:
    raw = CATALOG_PATH.read_text(encoding="utf-8")
    start, end = raw.index("["), raw.rindex("]")
    return json.loads(raw[start : end + 1])


def save_catalog(catalog: list[dict]) -> None:
    payload = json.dumps(catalog, ensure_ascii=False, indent=2)
    CATALOG_PATH.write_text(
        "// Generado desde Cervezas.xlsx y enriquecido con imágenes abiertas. No editar manualmente.\n"
        f"window.BEER_CATALOG = {payload};\n",
        encoding="utf-8",
    )


def load_cache() -> dict:
    if not CACHE_PATH.exists():
        return {}
    return json.loads(CACHE_PATH.read_text(encoding="utf-8"))


def request_json(params: dict, attempts: int = 3) -> dict:
    url = f"{API_URL}?{urllib.parse.urlencode(params)}"
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    for attempt in range(attempts):
        try:
            with urllib.request.urlopen(request, timeout=25) as response:
                return json.load(response)
        except Exception:
            if attempt + 1 == attempts:
                raise
            time.sleep(0.7 * (attempt + 1))
    return {}


def search_commons(query: str) -> list[dict]:
    data = request_json(
        {
            "action": "query",
            "generator": "search",
            "gsrsearch": query,
            "gsrnamespace": 6,
            "gsrlimit": 10,
            "prop": "imageinfo",
            "iiprop": "url|mime",
            "iiurlwidth": 480,
            "format": "json",
            "formatversion": 2,
            "origin": "*",
        }
    )
    return (data.get("query") or {}).get("pages") or []


def beer_tokens(name: str) -> set[str]:
    return {
        token for token in normalize(name).split()
        if token not in LANGUAGE_STOPWORDS and (len(token) >= 3 or token.isdigit())
    }


def score_candidate(beer: dict, page: dict) -> tuple[float, bool]:
    name = beer["name"]
    title = normalize(page.get("title", "").removeprefix("File:"))
    full = normalize(name)
    base = normalize(re.sub(r"\s*\([^)]*\)\s*", " ", name))
    tokens = beer_tokens(name)
    title_tokens = set(title.split())
    overlap = len(tokens & title_tokens) / max(1, len(tokens))
    compact_title = title.replace(" ", "")
    full_direct = len(full) >= 4 and (full in title or full.replace(" ", "") in compact_title)
    base_direct = len(base) >= 4 and (base in title or base.replace(" ", "") in compact_title)
    alpha_overlap = any(token.isalpha() and token in title_tokens for token in tokens)
    direct = bool(full_direct or (base_direct and ("(" not in name or (overlap >= 0.5 and alpha_overlap))))
    hinted = bool(title_tokens & IMAGE_HINTS)
    ordered_tokens = [token for token in normalize(name).split() if token not in STOPWORDS and len(token) >= 3]
    anchor = ordered_tokens[0] if ordered_tokens else ""
    brand_match = bool(anchor and anchor in title_tokens and hinted)

    score = overlap * 72
    if direct:
        score += 95
    if brand_match:
        score += 48
    if hinted:
        score += 9
    if not direct and not hinted:
        score -= 28

    accepted = direct or (overlap >= 0.8 and hinted and score >= 62)
    return score, accepted


def best_result(beer: dict, pages: list[dict]) -> dict | None:
    ranked: list[tuple[float, dict]] = []
    for page in pages:
        image_info = (page.get("imageinfo") or [{}])[0]
        if not image_info.get("url") or not str(image_info.get("mime", "")).startswith("image/"):
            continue
        score, accepted = score_candidate(beer, page)
        if accepted:
            ranked.append((score, page))
    if not ranked:
        return None
    score, page = max(ranked, key=lambda item: item[0])
    image_info = page["imageinfo"][0]
    return {
        "image": image_info.get("thumburl") or image_info["url"],
        "page": image_info.get("descriptionurl") or "",
        "title": page.get("title", ""),
        "score": round(score, 1),
        "source": "Wikimedia Commons",
    }


def find_image(beer: dict) -> tuple[str, dict | None]:
    name = beer["name"].strip()
    base = re.sub(r"\s*\([^)]*\)\s*", " ", name).strip()
    queries = [f'"{name}" beer']
    if base and base.casefold() != name.casefold():
        queries.append(f'"{base}" beer')
    variants = {
        name.replace("India Pale Ale", "IPA").replace("Doppel Bock", "Doppelbock").replace("Triple", "Tripel").replace("Dubble", "Dubbel"),
        base.replace("India Pale Ale", "IPA").replace("Doppel Bock", "Doppelbock").replace("Triple", "Tripel").replace("Dubble", "Dubbel"),
    }
    queries.extend(f'"{variant}" beer' for variant in variants if variant and variant.casefold() not in {name.casefold(), base.casefold()})
    ordered_tokens = [token for token in normalize(base).split() if token not in STOPWORDS and len(token) >= 3]
    brand = " ".join(ordered_tokens[:2])
    if brand:
        local_word = "cerveza" if beer.get("country") in {"España", "México", "Argentina", "Cuba", "Ecuador", "Perú"} else "bier" if beer.get("country") in {"Alemania", "Austria", "Países Bajos"} else "beer"
        queries.append(f"{brand} {local_word}")
    queries.append(f"{name} brewery")

    for query in queries:
        try:
            match = best_result(beer, search_commons(query))
        except Exception as error:
            return beer["id"], {"error": str(error), "searched": True}
        if match:
            match["searched"] = True
            match["version"] = SEARCH_VERSION
            return beer["id"], match
    return beer["id"], {"searched": True, "version": SEARCH_VERSION}


def write_audit(catalog: list[dict], cache: dict) -> None:
    with AUDIT_PATH.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=["name", "country", "status", "match_title", "score", "image"])
        writer.writeheader()
        for beer in catalog:
            cached = cache.get(beer["id"]) or {}
            writer.writerow(
                {
                    "name": beer["name"],
                    "country": beer["country"],
                    "status": "found" if beer.get("image") else "fallback",
                    "match_title": cached.get("title", "existing" if beer.get("image") else ""),
                    "score": cached.get("score", ""),
                    "image": beer.get("image", ""),
                }
            )


def revalidate_cached_images(catalog: list[dict], cache: dict) -> int:
    removed = 0
    for beer in catalog:
        cached = cache.get(beer["id"]) or {}
        title = cached.get("title", "")
        if not beer.get("image") or not title:
            continue
        invalid_file = title.lower().endswith((".pdf", ".djvu", ".webm", ".ogg"))
        _, accepted = score_candidate(beer, {"title": title})
        if invalid_file or not accepted or (beer["name"], title) in INVALID_MATCHES:
            beer["image"] = ""
            cached["image"] = ""
            cached["rejected"] = True
            cached["version"] = SEARCH_VERSION
            removed += 1
    return removed


def main() -> int:
    catalog = load_catalog()
    cache = load_cache()
    for cached in cache.values():
        if cached and cached.get("searched"):
            cached.setdefault("version", SEARCH_VERSION)
    removed = revalidate_cached_images(catalog, cache)
    if removed:
        print(f"Auditoría estricta: {removed} coincidencias ambiguas descartadas", flush=True)
    pending = [beer for beer in catalog if not beer.get("image") and (beer["id"] not in cache or (cache[beer["id"]] or {}).get("version", 0) < SEARCH_VERSION)]
    print(f"Catálogo: {len(catalog)} | con imagen previa: {sum(bool(b.get('image')) for b in catalog)} | por buscar: {len(pending)}", flush=True)

    if pending:
        with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
            futures = {executor.submit(find_image, beer): beer for beer in pending}
            for index, future in enumerate(concurrent.futures.as_completed(futures), start=1):
                beer_id, result = future.result()
                cache[beer_id] = result or {"searched": True}
                if index % 25 == 0 or index == len(pending):
                    found = sum(bool(item.get("image")) for item in cache.values())
                    print(f"Procesadas {index}/{len(pending)} · coincidencias nuevas {found}", flush=True)
                    CACHE_PATH.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding="utf-8")

    for beer in catalog:
        result = cache.get(beer["id"]) or {}
        if not beer.get("image") and result.get("image"):
            beer["image"] = result["image"]

    save_catalog(catalog)
    CACHE_PATH.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding="utf-8")
    write_audit(catalog, cache)
    total = sum(bool(beer.get("image")) for beer in catalog)
    print(f"Resultado: {total}/{len(catalog)} imágenes reales · {len(catalog) - total} fallbacks ilustrados", flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
