const STORAGE_KEY = "cervezometro-v1";
const state = loadState();
let volumeUnit = "L";
const $ = (selector) => document.querySelector(selector);
const els = {
  todayCount: $("#today-count"), yearCount: $("#year-count"),
  weekCount: $("#week-count"), monthCount: $("#month-count"), streak: $("#streak-count"),
  history: $("#history-list"),
  empty: $("#empty-state"), addDialog: $("#add-dialog"), settingsDialog: $("#settings-dialog"), moreDialog: $("#more-dialog"), lateDialog: $("#late-dialog"),
  toast: $("#toast")
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return { drinks: Array.isArray(saved?.drinks) ? saved.drinks : [], imports: saved?.imports || {} };
  } catch { return { drinks: [], imports: {} }; }
}
function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
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
importInitialTotals();
function correctFormatVolumes() {
  if (state.imports.formatVolumesV2) return;
  state.drinks.forEach((drink) => {
    if (drink.type === "Lata gordita" && Number(drink.volume) === 500) drink.volume = 330;
    if (drink.type === "Grande" && Number(drink.volume) === 500) drink.volume = 400;
  });
  state.imports.formatVolumesV2 = new Date().toISOString(); save();
}
correctFormatVolumes();
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
spreadInitialTally();
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
document.querySelectorAll(".nav-item").forEach((button) => button.addEventListener("click", () => {
  const target = document.getElementById(button.dataset.target); if (!target) return;
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("is-active", item === button));
  target.scrollIntoView({behavior:"smooth", block:"start"});
}));
if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver((entries) => { entries.forEach((entry) => { if (!entry.isIntersecting) return; document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("is-active", item.dataset.target === entry.target.id)); }); }, {rootMargin:"-25% 0px -65% 0px"});
  ["inicio","formatos","datos","historial"].forEach((id) => { const section = document.getElementById(id); if (section) navObserver.observe(section); });
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
