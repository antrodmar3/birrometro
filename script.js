const CLOSED_BEER_CATALOG = [
  {id:"Q610086",name:"Achel",country:"Bélgica",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Achellogo.png"},
  {id:"Q478119",name:"Amstel",country:"Países Bajos",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Amstel%20coaster.jpg"},
  {id:"Q3624753",name:"Asahi Super Dry",country:"Japón",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Asahi%20superdry%20japan.JPG"},
  {id:"Q26974604",name:"Beamish",country:"Irlanda",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Beamish%20Genuine%20Irish%20Stout.jpg"},
  {id:"Q971751",name:"Bintang",country:"Indonesia",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Bintang%20Beer%20by%20the%20Beach.jpg"},
  {id:"Q519781",name:"Blanche de Namur",country:"Bélgica",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Blanche%20de%20Namur.JPG"},
  {id:"Q8248915",name:"Blue Moon",country:"Estados Unidos",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Blue%20Moon%20beer%20with%20orange.jpg"},
  {id:"Q897293",name:"Brahma",country:"Brasil",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Logotipo%20da%20Brahma%20%282025%29.svg"},
  {id:"Q610672",name:"Budweiser",country:"Estados Unidos",image:"https://commons.wikimedia.org/wiki/Special:FilePath/StLouisABPackaging%20Plant.JPG"},
  {id:"Q33105701",name:"Chimay",country:"Bélgica",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Chimays.jpg"},
  {id:"Q1104762",name:"Cobra Beer",country:"Reino Unido",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Cobra%20beer%202.jpg"},
  {id:"Q864987",name:"Corona Extra",country:"México",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Corona%20Extra%20text%20logo.svg"},
  {id:"Q1142160",name:"Cruzcampo",country:"España",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Logo%20de%20Cruzcampo.png"},
  {id:"Q2646636",name:"Desperados",country:"Francia",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Desperados.jpg"},
  {id:"Q3136656",name:"Dos Equis",country:"México",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Cerveca%20xxlager.jpg"},
  {id:"Q1773786",name:"Duvel",country:"Bélgica",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Duvel%20Logo.png"},
  {id:"Q1295815",name:"Efes Pilsener",country:"Turquía",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Efes%20Pilsener.JPG"},
  {id:"Q3394030",name:"Estrella Galicia",country:"España",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Estrella%20Galicia%20escudo%20color%20vectorial%20HDJR.svg"},
  {id:"Q1370611",name:"Estrella Damm",country:"España",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Primera%20botella%20Estrella%20Damm.jpg"},
  {id:"Q1423785",name:"Foster's Lager",country:"Australia",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Logo%20of%20Foster%27s%20Lager.svg"},
  {id:"Q153075",name:"Grolsch",country:"Países Bajos",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Grolsch%20Logo.png"},
  {id:"Q1959068",name:"Gulden Draak",country:"Bélgica",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Guldendraak.jpg"},
  {id:"Q194297",name:"Guinness",country:"Irlanda",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Guinness-Werbung%20%28G%C3%B6rlitz%29.jpg"},
  {id:"Q854383",name:"Heineken",country:"Países Bajos",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Heineken%20logo.svg"},
  {id:"Q2239073",name:"Hertog Jan",country:"Países Bajos",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Mus%C3%A9e%20Europ%C3%A9en%20de%20la%20Bi%C3%A8re%2C%20Beer%20coaster%20pic-091.JPG"},
  {id:"Q153960",name:"Jupiler",country:"Bélgica",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Jupiler%20logo.jpg"},
  {id:"Q129487",name:"Kamenitza",country:"Bulgaria",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Kamenitza%20logo.jpg"},
  {id:"Q798067",name:"Karhu",country:"Finlandia",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Karhu.jpg"},
  {id:"Q1572281",name:"Kingfisher",country:"India",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Kingfisher%20beer%20bottle.jpg"},
  {id:"Q1741320",name:"Kilkenny",country:"Irlanda",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Kilkenny%20Irish%20beer.JPG"},
  {id:"Q615718",name:"Kwak",country:"Bélgica",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Kwak.jpg"},
  {id:"Q2744746",name:"La Chouffe",country:"Bélgica",image:"https://commons.wikimedia.org/wiki/Special:FilePath/La%20Chouffe%20bottle.jpg"},
  {id:"Q590921",name:"La Trappe",country:"Países Bajos",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Trappist%20003.JPG"},
  {id:"Q1341618",name:"Leffe",country:"Bélgica",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Leffe%20Bier%2C%20historisches%20Plakat.JPG"},
  {id:"Q18161195",name:"London Pride",country:"Reino Unido",image:"https://commons.wikimedia.org/wiki/Special:FilePath/London%20Pride%20bottle%20and%20glass.jpg"},
  {id:"Q2253723",name:"Nastro Azzurro",country:"Italia",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Bottiglia%20di%20birra%20Nastro%20Azzurro.jpg"},
  {id:"Q2080900",name:"Norrlands Guld",country:"Suecia",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Norrlands%20Guld%20%287449915078%29.jpg"},
  {id:"Q2045297",name:"Pabst Blue Ribbon",country:"Estados Unidos",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Pabst%20Blue%20Ribbon%20bottle.jpg"},
  {id:"Q331630",name:"Pilsner Urquell",country:"República Checa",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Pilsner%20Urquell%20logo.svg"},
  {id:"Q503112",name:"Pilsen Callao",country:"Perú",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Pilsencallao.jpg"},
  {id:"Q595750",name:"Quilmes",country:"Argentina",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Quilmes%20Logo.svg"},
  {id:"Q2417742",name:"Red Stripe",country:"Jamaica",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Red%20Stripe%202012.JPG"},
  {id:"Q134454567",name:"Sagres",country:"Portugal",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Sagres%20beer.jpg"},
  {id:"Q21286736",name:"Samuel Adams",country:"Estados Unidos",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Samuel%20Adams%20beer%20glass.JPG"},
  {id:"Q2140520",name:"Singha",country:"Tailandia",image:"https://commons.wikimedia.org/wiki/Special:FilePath/BiereSingha.jpg"},
  {id:"Q1073087",name:"Smithwick's",country:"Irlanda",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Smithwicks%20pint.JPG"},
  {id:"Q929276",name:"Stella Artois",country:"Bélgica",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Stella%20Artois%20new%20logo.png"},
  {id:"Q935317",name:"Staropramen",country:"República Checa",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Staropramen.jpg"},
  {id:"Q1862698",name:"Tiger",country:"Singapur",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Tiger%20-%20Asian%20Lager%2C%202019.jpg"},
  {id:"Q2388771",name:"Tripel Karmeliet",country:"Bélgica",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Tripel%20Karmeliet%20glas.jpg"},
  {id:"Q1071385",name:"Velkopopovický Kozel",country:"República Checa",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Velkopopovick%C3%BD%20Kozel%20logo.svg"},
  {id:"Q3390014",name:"Voll-Damm",country:"España",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Voll-DammBotella33cl.jpg"},
  {id:"Q3503168",name:"Żywiec",country:"Polonia",image:"https://commons.wikimedia.org/wiki/Special:FilePath/Zywiec%20Beer.JPG"}
];
const state = loadState();
let activeUserId = null;
let volumeUnit = "L";
const beerCatalog = CLOSED_BEER_CATALOG;
let albumFilter = "all";
const beerCatalogById = new Map(beerCatalog.map((beer) => [beer.id, beer]));
function sanitizeAlbum(entries) {
  return (Array.isArray(entries) ? entries : []).filter((entry) => beerCatalogById.has(entry.id)).map((entry) => ({...beerCatalogById.get(entry.id),markedAt:entry.markedAt || new Date().toISOString()}));
}
state.album = sanitizeAlbum(state.album);
const $ = (selector) => document.querySelector(selector);
const els = {
  todayCount: $("#today-count"), yearCount: $("#year-count"),
  weekCount: $("#week-count"), monthCount: $("#month-count"), streak: $("#streak-count"),
  history: $("#history-list"),
  empty: $("#empty-state"), addDialog: $("#add-dialog"), settingsDialog: $("#settings-dialog"), moreDialog: $("#more-dialog"), lateDialog: $("#late-dialog"),
  toast: $("#toast")
};

function loadState() {
  return { drinks: [], imports: {}, album: [] };
}
function userStorageKey(uid) { return `birrometro-user-${uid}`; }
function readUserState(uid) {
  try {
    const saved = JSON.parse(localStorage.getItem(userStorageKey(uid)) || "{}");
    return {drinks:Array.isArray(saved.drinks) ? saved.drinks : [],imports:saved.imports || {},album:sanitizeAlbum(saved.album)};
  } catch { return {drinks:[],imports:{},album:[]}; }
}
function applyState(nextState) {
  state.drinks = Array.isArray(nextState?.drinks) ? nextState.drinks : [];
  state.imports = nextState?.imports || {};
  state.album = sanitizeAlbum(nextState?.album);
}
function save() {
  if (!activeUserId) return;
  localStorage.setItem(userStorageKey(activeUserId), JSON.stringify(state));
  window.dispatchEvent(new CustomEvent("birrometro-state-save", {detail:state}));
}
function importInitialTotals() {
  if (state.imports.initialTally207) return;
  const tally = [
    [82, "Lata", 330], [9, "Lata gordita", 330], [5, "Copa", 300],
    [70, "Cortá", 200], [19, "Tercio", 330], [6, "Botellín", 250],
    [3, "Pinta", 568], [7, "Caña", 200], [3, "Grande", 400], [3, "Yonkilata", 500]
  ];
  const importedAt = new Date().toISOString(); let index = 0;
  tally.forEach(([count, type, volume]) => {
    for (let item = 0; item < count; item += 1) state.drinks.push({ id:`initial-tally-${index++}`, volume, type, abv:5, date:importedAt, note:"Importación inicial" });
  });
  state.imports.initialTally207 = importedAt; save();
}
function correctFormatVolumes() {
  if (state.imports.formatVolumesV2) return;
  state.drinks.forEach((drink) => {
    if (drink.type === "Lata gordita" && Number(drink.volume) === 500) drink.volume = 330;
    if (drink.type === "Grande" && Number(drink.volume) === 500) drink.volume = 400;
  });
  state.imports.formatVolumesV2 = new Date().toISOString(); save();
}
function spreadInitialTally() {
  if (state.imports.spreadInitialTallyV2) return;
  const imported = state.drinks.filter((drink) => String(drink.id).startsWith("initial-tally-"));
  if (!imported.length) { state.imports.spreadInitialTallyV2 = new Date().toISOString(); save(); return; }

  const start = new Date(2026, 0, 13, 0, 0, 0, 0);
  const end = new Date();
  const slots = [];
  const cursor = new Date(start);
  let dayIndex = 0;
  while (cursor <= end) {
    const weekday = cursor.getDay();
    const isWeekendPeak = weekday === 5 || weekday === 6;
    const isActiveDay = isWeekendPeak || ((dayIndex * 37 + 11) % 10) < 5;
    if (!isActiveDay) { cursor.setDate(cursor.getDate() + 1); dayIndex += 1; continue; }
    const times = isWeekendPeak
      ? [[13,45], [19,30], [22,15]]
      : weekday === 0 ? [[13,30], [20,15]] : [[19,15], [21,30]];
    times.forEach(([hour, minute]) => {
      const slot = new Date(cursor); slot.setHours(hour, minute + ((cursor.getDate() * 7 + hour) % 17), 0, 0);
      if (slot <= end) slots.push(slot);
    });
    cursor.setDate(cursor.getDate() + 1);
    dayIndex += 1;
  }

  const ordered = [...imported].sort((a, b) => {
    const aIndex = Number(String(a.id).split("-").pop()); const bIndex = Number(String(b.id).split("-").pop());
    return ((aIndex * 73) % imported.length) - ((bIndex * 73) % imported.length);
  });
  ordered.forEach((drink, index) => {
    const slotIndex = ordered.length === 1 ? 0 : Math.round(index * (slots.length - 1) / (ordered.length - 1));
    drink.date = slots[slotIndex].toISOString(); drink.note = "Importación inicial extrapolada";
  });
  state.imports.spreadInitialTallyV2 = new Date().toISOString(); save();
}
function startOfDay(date = new Date()) { const d = new Date(date); d.setHours(0,0,0,0); return d; }
function startOfWeek() { const d = startOfDay(); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d; }
function startOfMonth() { const d = startOfDay(); d.setDate(1); return d; }
function startOfYear() { const d = startOfDay(); d.setMonth(0, 1); return d; }
function since(date) { return state.drinks.filter((drink) => new Date(drink.date) >= date); }
function localDateTime(date = new Date()) {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0,16);
}
function dayKey(date) {
  const d = new Date(date); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}
function currentStreak() {
  const activeDays = new Set(state.drinks.map((drink) => dayKey(drink.date)));
  let cursor = startOfDay();
  if (!activeDays.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (activeDays.has(dayKey(cursor))) { streak += 1; cursor.setDate(cursor.getDate() - 1); }
  return streak;
}
function renderBars(container, labels, values) {
  const max = Math.max(...values, 1);
  container.innerHTML = labels.map((label, index) => `<div class="bar-item"><span class="bar-value">${values[index] || ""}</span><i style="height:${Math.max((values[index] / max) * 100, values[index] ? 12 : 3)}%"></i><small>${label}</small></div>`).join("");
}
function renderPatterns() {
  const weekdayValues = [0,0,0,0,0,0,0];
  const hourValues = Array(24).fill(0);
  state.drinks.forEach((drink) => {
    const date = new Date(drink.date); weekdayValues[(date.getDay() + 6) % 7] += 1;
    hourValues[date.getHours()] += 1;
  });
  renderBars($("#weekday-chart"), ["L","M","X","J","V","S","D"], weekdayValues);
  renderBars($("#hour-chart"), Array.from({length:24},(_,hour) => String(hour).padStart(2,"0")), hourValues);
  const max = Math.max(...hourValues); const peakIndex = hourValues.indexOf(max);
  $("#peak-label").textContent = max ? `Tu pico: ${String(peakIndex).padStart(2,"0")}:00` : "Sin datos";
}
function renderVolumes(today, week, month) {
  const currentYear = new Date().getFullYear();
  const year = state.drinks.filter((drink) => new Date(drink.date).getFullYear() === currentYear);
  const total = (drinks) => drinks.reduce((sum, drink) => sum + Number(drink.volume || 0), 0);
  const values = [total(today), total(week), total(month), total(year)];
  const formatter = new Intl.NumberFormat("es-ES", volumeUnit === "L" ? {maximumFractionDigits:2} : {maximumFractionDigits:0});
  ["#volume-day", "#volume-week", "#volume-month", "#volume-year"].forEach((selector, index) => { $(selector).textContent = formatter.format(volumeUnit === "L" ? values[index] / 1000 : values[index]); });
  document.querySelectorAll(".volume-unit").forEach((element) => { element.textContent = volumeUnit; });
  $("#unit-toggle").textContent = volumeUnit;
}
const FORMAT_COLORS = ["#ffb21a", "#ff6b35", "#6c5ce7", "#16a085", "#e84393", "#0984e3", "#8e6b48", "#d63031", "#00a884", "#7f8c8d", "#f39c12"];
function getFormatStats() {
  const stats = new Map();
  state.drinks.forEach((drink) => {
    const current = stats.get(drink.type) || {type:drink.type, count:0, volume:0};
    current.count += 1; current.volume += Number(drink.volume || 0); stats.set(drink.type, current);
  });
  return [...stats.values()].sort((a,b) => b.count - a.count || a.type.localeCompare(b.type, "es", {sensitivity:"base"}));
}
function reorderFormatOptions() {
  const counts = new Map();
  state.drinks.forEach((drink) => counts.set(drink.type, (counts.get(drink.type) || 0) + 1));
  const container = $(".size-options");
  [...container.querySelectorAll(".size-option")]
    .sort((a, b) => (counts.get(b.dataset.type) || 0) - (counts.get(a.dataset.type) || 0) || a.dataset.type.localeCompare(b.dataset.type, "es", {sensitivity:"base"}))
    .forEach((option) => container.appendChild(option));
}
function renderFormatStats() {
  const formats = getFormatStats(); const total = state.drinks.length || 1;
  $("#formats-total").textContent = `${state.drinks.length} en total`;
  const favorite = formats[0]; const favoritePercent = favorite ? Math.round(favorite.count / total * 100) : 0;
  $("#favorite-percent").textContent = `${favoritePercent}%`; $("#favorite-format").textContent = favorite?.type || "Sin datos";
  $("#insight-favorite").textContent = favorite?.type || "—";
  let cursor = 0;
  const svg = $("#format-donut svg");
  svg.innerHTML = `<circle class="donut-track" cx="60" cy="60" r="48" pathLength="100"></circle>` + formats.map((format,index) => {
    const share = format.count / total * 100; const offset = -cursor; cursor += share;
    return `<circle class="donut-segment" cx="60" cy="60" r="48" pathLength="100" tabindex="0" role="button" aria-label="${escapeHtml(format.type)}: ${format.count}, ${Math.round(share)}%" data-format="${escapeHtml(format.type)}" data-count="${format.count}" data-percent="${Math.round(share)}" style="--segment-color:${FORMAT_COLORS[index % FORMAT_COLORS.length]};stroke-dasharray:${share} ${100-share};stroke-dashoffset:${offset}"></circle>`;
  }).join("");
  const centerLabel = $("#format-donut small"); const tooltip = $("#donut-tooltip"); let donutPinned = false;
  const resetDonut = () => { $("#favorite-percent").textContent = `${favoritePercent}%`; centerLabel.textContent = "favorito"; tooltip.textContent = "Toca un segmento para identificarlo"; };
  svg.querySelectorAll(".donut-segment").forEach((segment) => {
    const showSegment = () => { $("#favorite-percent").textContent = `${segment.dataset.percent}%`; centerLabel.textContent = segment.dataset.format; tooltip.textContent = `${segment.dataset.format} · ${segment.dataset.count} consumiciones · ${segment.dataset.percent}%`; };
    segment.addEventListener("pointerenter", showSegment); segment.addEventListener("focus", showSegment);
    segment.addEventListener("click", () => { donutPinned = true; showSegment(); });
    segment.addEventListener("pointerleave", () => { if (!donutPinned) resetDonut(); });
    segment.addEventListener("blur", () => { if (!donutPinned) resetDonut(); });
  });
  $("#format-ranking").innerHTML = formats.map((format,index) => {
    const percent = Math.round(format.count / total * 100); const liters = (format.volume / 1000).toLocaleString("es-ES",{maximumFractionDigits:1});
    return `<article class="format-row"><span class="format-color" style="--format-color:${FORMAT_COLORS[index % FORMAT_COLORS.length]}">${index + 1}</span><div><div class="format-row__head"><strong>${escapeHtml(format.type)}</strong><span>${format.count} · ${liters} L</span></div><div class="format-bar"><i style="width:${percent}%;--format-color:${FORMAT_COLORS[index % FORMAT_COLORS.length]}"></i></div></div><b>${percent}%</b></article>`;
  }).join("");
}
function renderInsights() {
  const dayCounts = [0,0,0,0,0,0,0]; state.drinks.forEach((drink) => dayCounts[new Date(drink.date).getDay()] += 1);
  const maxDay = Math.max(...dayCounts); const activeDay = maxDay ? dayCounts.indexOf(maxDay) : -1;
  $("#insight-day").textContent = activeDay >= 0 ? ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"][activeDay] : "—";
  const firstDate = state.drinks.length ? Math.min(...state.drinks.map((drink) => new Date(drink.date).getTime())) : Date.now();
  const elapsedWeeks = Math.max((Date.now() - firstDate) / 604800000, 1); $("#insight-average").textContent = `${(state.drinks.length / elapsedWeeks).toFixed(1)} / sem.`;
  const months = []; const now = new Date();
  for (let offset = 5; offset >= 0; offset -= 1) { const date = new Date(now.getFullYear(), now.getMonth() - offset, 1); months.push({year:date.getFullYear(),month:date.getMonth(),label:new Intl.DateTimeFormat("es-ES",{month:"short"}).format(date).replace(".",""),count:0}); }
  state.drinks.forEach((drink) => { const date = new Date(drink.date); const month = months.find((item) => item.year === date.getFullYear() && item.month === date.getMonth()); if (month) month.count += 1; });
  const max = Math.max(...months.map((month) => month.count),1); $("#trend-total").textContent = `${months.reduce((sum,month) => sum + month.count,0)} cervezas`;
  $("#trend-chart").innerHTML = months.map((month) => `<div class="trend-bar"><span>${month.count || ""}</span><i style="height:${Math.max(month.count / max * 100, month.count ? 12 : 3)}%"></i><small>${month.label}</small></div>`).join("");
}
function showToast(message) {
  els.toast.textContent = message; els.toast.classList.add("show");
  clearTimeout(showToast.timer); showToast.timer = setTimeout(() => els.toast.classList.remove("show"), 2600);
}
function normalizeCommonsImage(value) {
  if (!value) return "";
  try {
    const url = new URL(value);
    if (url.protocol === "http:") url.protocol = "https:";
    if (url.protocol !== "https:" || !["commons.wikimedia.org", "upload.wikimedia.org"].includes(url.hostname)) return "";
    return url.href;
  } catch { return ""; }
}
function renderBeerAlbum() {
  const catalogIds = new Set(beerCatalog.map((beer) => beer.id));
  const marked = new Map((state.album || []).filter((beer) => catalogIds.has(beer.id)).map((beer) => [beer.id, beer]));
  const term = ($("#beer-search")?.value || "").trim().toLocaleLowerCase("es");
  const visible = beerCatalog.filter((beer) => albumFilter !== "tried" || marked.has(beer.id))
    .filter((beer) => !term || `${beer.name} ${beer.country}`.toLocaleLowerCase("es").includes(term))
    .sort((a,b) => Number(marked.has(b.id)) - Number(marked.has(a.id)) || a.name.localeCompare(b.name,"es",{sensitivity:"base"}));
  $("#album-progress").textContent = `${marked.size} probadas`; $("#album-tried-count").textContent = marked.size;
  $("#album-catalog-count").textContent = beerCatalog.length || "—";
  $("#beer-album-grid").innerHTML = visible.map((beer) => {
    const tried = marked.has(beer.id); const image = normalizeCommonsImage(beer.image); const initial = beer.name.trim().charAt(0).toUpperCase();
    return `<button class="beer-card${tried ? " is-tried" : ""}" type="button" data-beer-id="${beer.id}" aria-pressed="${tried}"><span class="beer-card__image">${image ? `<img src="${escapeHtml(image)}" alt="Logo de ${escapeHtml(beer.name)}" loading="lazy" referrerpolicy="no-referrer" />` : `<span class="beer-card__fallback">${escapeHtml(initial)}</span>`}</span><span class="beer-card__copy"><strong>${escapeHtml(beer.name)}</strong><small><span class="country-dot" aria-hidden="true"></span>${escapeHtml(beer.country)}</small></span><span class="beer-card__check" aria-hidden="true">${tried ? "✓" : "+"}</span></button>`;
  }).join("");
  $("#album-empty").hidden = visible.length > 0;
}
function render() {
  const today = since(startOfDay()); const week = since(startOfWeek()); const month = since(startOfMonth());
  const currentYear = new Date().getFullYear();
  const year = state.drinks.filter((drink) => new Date(drink.date).getFullYear() === currentYear);
  els.todayCount.textContent = today.length; els.yearCount.textContent = year.length;
  $("#marker-year").textContent = currentYear;
  els.weekCount.textContent = week.length; els.monthCount.textContent = month.length;
  els.streak.textContent = currentStreak();
  $("#hero-week-count").textContent = week.length; $("#hero-streak-count").textContent = currentStreak();
  els.history.innerHTML = "";
  [...state.drinks].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0,30).forEach((drink) => {
    const date = new Date(drink.date); const li = document.createElement("li"); li.className = "history-item";
    li.innerHTML = `<span class="beer-dot">●</span><span class="history-main"><strong>${escapeHtml(drink.type)} · ${drink.volume} ml</strong><small>${escapeHtml(drink.note || `${drink.abv}% vol.`)}</small></span><span class="history-meta">${new Intl.DateTimeFormat("es-ES",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}).format(date)}</span><button class="delete-entry" data-id="${drink.id}" aria-label="Eliminar registro">×</button>`;
    els.history.appendChild(li);
  });
  els.empty.hidden = state.drinks.length > 0; els.history.hidden = state.drinks.length === 0;
  const latest = [...state.drinks].sort((a,b) => new Date(b.date) - new Date(a.date))[0];
  $("#undo-last").disabled = !latest;
  $("#undo-hint").textContent = latest ? `${latest.type} · ${new Intl.DateTimeFormat("es-ES", {day:"numeric", month:"short", hour:"2-digit", minute:"2-digit"}).format(new Date(latest.date))}` : "No hay registros";
  renderPatterns();
  renderVolumes(today, week, month);
  renderFormatStats();
  reorderFormatOptions();
  renderInsights();
  const favorite = getFormatStats()[0];
  $("#profile-total").textContent = state.drinks.length;
  $("#profile-liters").textContent = `${(state.drinks.reduce((sum, drink) => sum + Number(drink.volume || 0), 0) / 1000).toLocaleString("es-ES", {maximumFractionDigits:1})} L`;
  $("#profile-favorite").textContent = favorite?.type || "—";
  renderBeerAlbum();
}
function escapeHtml(value) { const node = document.createElement("span"); node.textContent = value; return node.innerHTML; }

$("#open-add").addEventListener("click", () => els.addDialog.showModal());
$("#open-more").addEventListener("click", () => els.moreDialog.showModal());
$("#open-settings").addEventListener("click", () => els.settingsDialog.showModal());
$("#unit-toggle").addEventListener("click", () => { volumeUnit = volumeUnit === "L" ? "mL" : "L"; render(); });
document.querySelectorAll(".size-option").forEach((button) => button.addEventListener("click", () => {
  const addedAt = new Date();
  state.drinks.push({ id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), volume:Number(button.dataset.volume), type:button.dataset.type, abv:Number(button.dataset.abv ?? 5), date:addedAt.toISOString(), note:"" });
  if (navigator.vibrate) navigator.vibrate(18);
  save(); render(); els.addDialog.close();
  showToast(`${button.dataset.type} añadida · ${new Intl.DateTimeFormat("es-ES", {hour:"2-digit", minute:"2-digit"}).format(addedAt)}`);
}));
$("#open-late").addEventListener("click", () => { els.moreDialog.close(); $("#late-date").value = localDateTime(); els.lateDialog.showModal(); });
$("#late-form").addEventListener("submit", (event) => {
  event.preventDefault(); const data = new FormData(event.currentTarget); const [volume, type, abv = "5"] = String(data.get("format")).split("|");
  state.drinks.push({ id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), volume:Number(volume), type, abv:Number(abv), date:new Date(String(data.get("date"))).toISOString(), note:"" });
  if (navigator.vibrate) navigator.vibrate(18);
  save(); render(); els.lateDialog.close(); showToast("Cerveza añadida al historial");
});
$("#undo-last").addEventListener("click", () => {
  const latest = [...state.drinks].sort((a,b) => new Date(b.date) - new Date(a.date))[0]; if (!latest) return;
  state.drinks = state.drinks.filter((drink) => drink.id !== latest.id); save(); render(); els.moreDialog.close(); showToast("Último registro deshecho");
});
$("#go-patterns").addEventListener("click", () => { els.moreDialog.close(); $("#patterns-title").scrollIntoView({behavior:"smooth", block:"start"}); });
const appShell = document.querySelector(".app-shell");
document.querySelectorAll(".nav-item").forEach((button) => button.addEventListener("click", () => {
  const targetId = button.dataset.target; const target = document.getElementById(targetId); if (!target) return;
  const standalone = targetId === "historial" || targetId === "perfil" || targetId === "album";
  appShell.dataset.view = standalone ? targetId : "home";
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("is-active", item === button));
  if (standalone) { window.scrollTo({top:0, behavior:"smooth"}); return; }
  requestAnimationFrame(() => target.scrollIntoView({behavior:"smooth", block:"start"}));
}));
if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver((entries) => { entries.forEach((entry) => { if (!entry.isIntersecting || appShell.dataset.view !== "home") return; document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("is-active", item.dataset.target === entry.target.id)); }); }, {rootMargin:"-25% 0px -65% 0px"});
  ["inicio","formatos","datos"].forEach((id) => { const section = document.getElementById(id); if (section) navObserver.observe(section); });
}
els.history.addEventListener("click", (event) => { const button = event.target.closest("[data-id]"); if (!button) return; state.drinks = state.drinks.filter((drink) => drink.id !== button.dataset.id); save(); render(); showToast("Registro eliminado"); });
$("#clear-data").addEventListener("click", () => { if (!confirm("¿Seguro que quieres borrar todo el historial?")) return; state.drinks = []; save(); render(); els.settingsDialog.close(); showToast("Historial borrado"); });
function exportData() {
  const blob = new Blob([JSON.stringify({ exportedAt:new Date().toISOString(), ...state }, null, 2)], {type:"application/json"}); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href=url; link.download=`birrometro-${new Date().toISOString().slice(0,10)}.json`; link.click(); URL.revokeObjectURL(url); showToast("Datos exportados");
}
$("#export-data").addEventListener("click", exportData);
$("#export-data-settings").addEventListener("click", exportData);
document.querySelectorAll("dialog").forEach((dialog) => dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); }));
document.querySelectorAll("[data-close-dialog]").forEach((button) => button.addEventListener("click", () => button.closest("dialog").close()));
function requestLogin() {
  $("#gate-google-login").disabled = true;
  $("#auth-gate-status").textContent = "Abriendo Google…";
  window.dispatchEvent(new Event("birrometro-login"));
}
$("#google-login").addEventListener("click", requestLogin);
$("#gate-google-login").addEventListener("click", requestLogin);
$("#google-logout").addEventListener("click", () => { appShell.dataset.auth = "pending"; window.dispatchEvent(new Event("birrometro-logout")); });
window.addEventListener("birrometro-auth", (event) => {
  const user = event.detail;
  if (user) {
    activeUserId = user.uid;
    applyState(readUserState(user.uid));
    appShell.dataset.auth = "ready";
  } else {
    activeUserId = null;
    applyState({drinks:[],imports:{},album:[]});
    appShell.dataset.auth = "locked";
    appShell.dataset.view = "home";
    $("#gate-google-login").disabled = false;
    $("#auth-gate-status").textContent = "Necesitas iniciar sesión para acceder a tus datos.";
  }
  $("#profile-sync").textContent = user ? "Sincronizado" : "Sin conectar";
  $("#google-login").hidden = Boolean(user); $("#google-logout").hidden = !user;
  $("#profile-name").textContent = user?.displayName || "Tus datos, en todos tus dispositivos";
  $("#profile-email").textContent = user?.email || "Inicia sesión para sincronizar Birrómetro";
  $("#profile-avatar").innerHTML = user?.photoURL ? `<img src="${escapeHtml(user.photoURL)}" alt="" referrerpolicy="no-referrer" />` : "B";
  render();
});
window.addEventListener("birrometro-cloud-state", (event) => {
  if (!activeUserId || !Array.isArray(event.detail?.drinks)) return;
  applyState(event.detail);
  localStorage.setItem(userStorageKey(activeUserId), JSON.stringify(state));
  localStorage.removeItem("birrometro-v1");
  localStorage.removeItem(["cervezo", "metro-v1"].join(""));
  appShell.dataset.auth = "ready"; render(); showToast("Datos sincronizados");
});
window.addEventListener("birrometro-sync-error", () => showToast("Sin conexión · mostrando la copia de esta cuenta"));
window.addEventListener("birrometro-auth-error", () => {
  $("#gate-google-login").disabled = false;
  $("#auth-gate-status").textContent = "No se pudo iniciar sesión. Inténtalo de nuevo.";
  if (!activeUserId) appShell.dataset.auth = "locked";
  showToast("No se pudo iniciar sesión con Google");
});
$("#beer-album-grid").addEventListener("click", (event) => {
  const card = event.target.closest("[data-beer-id]"); if (!card) return;
  const beer = beerCatalog.find((item) => item.id === card.dataset.beerId) || state.album.find((item) => item.id === card.dataset.beerId); if (!beer) return;
  const wasTried = state.album.some((item) => item.id === beer.id);
  state.album = wasTried ? state.album.filter((item) => item.id !== beer.id) : [...state.album, {...beer,markedAt:new Date().toISOString()}];
  save(); renderBeerAlbum(); showToast(wasTried ? `${beer.name} eliminada del álbum` : `${beer.name} añadida al álbum`);
});
document.querySelectorAll("[data-album-filter]").forEach((button) => button.addEventListener("click", () => {
  albumFilter = button.dataset.albumFilter;
  document.querySelectorAll("[data-album-filter]").forEach((item) => item.classList.toggle("is-active", item === button)); renderBeerAlbum();
}));
$("#beer-search").addEventListener("input", renderBeerAlbum);
if ("serviceWorker" in navigator && location.protocol !== "file:") {
  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing) return;
    refreshing = true;
    location.reload();
  });
  navigator.serviceWorker.register("service-worker.js").then((registration) => registration.update());
}
render();
