"""Descarga en local las banderas de Twemoji usadas por el catálogo."""

from pathlib import Path
import urllib.request


ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "assets" / "flags"
COUNTRY_CODES = {
    "DE", "AR", "AU", "AT", "BE", "BR", "CA", "CN", "CU", "DK",
    "EC", "ES", "US", "FI", "FR", "IN", "IE", "IT", "JM", "JP",
    "MA", "MX", "NL", "PE", "PL", "PT", "GB", "CZ", "SG", "TH",
}


def twemoji_name(code: str) -> str:
    return "-".join(f"{0x1F1E6 + ord(letter) - ord('A'):x}" for letter in code)


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for code in sorted(COUNTRY_CODES):
        target = OUTPUT / f"{code.lower()}.svg"
        if target.exists():
            continue
        source = f"https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/{twemoji_name(code)}.svg"
        request = urllib.request.Request(source, headers={"User-Agent": "Birrometro/1.0"})
        with urllib.request.urlopen(request, timeout=20) as response:
            target.write_bytes(response.read())
    print(f"Banderas disponibles: {len(list(OUTPUT.glob('*.svg')))}")


if __name__ == "__main__":
    main()
