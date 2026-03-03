const INVITE = {
  toName: "Алякони",
  fromName: "С любовью\nТвой любимый Ильек",
  when: {
    // Локальное время. Пример: 2026-03-08 19:30
    isoLocal: "2026-01-05T19:00",
    displayFallback: "05.01.2026 | 19:00",
  },
  where: "The Moon — улица Акмешит, 1 блок 6",
  whereLink: "https://2gis.kz/astana/geo/70000001088180882",
  map: {
    // Координаты из 2GIS для The Moon (Астана)
    lat: 51.121149,
    lon: 71.424089,
    provider: "yandex",
    zoom: 16,
    zoomBoxDelta: { lat: 0.01, lon: 0.015 },
  },

  timeline: [
    { time: "17:00", text: "Заберу тебя из дома" },
    { time: "18:00", text: "Романтический ужин" },
    { time: "19:30", text: "Сюрприз для тебя" },
    { time: "20:30", text: "Фототайм и прогулка по нашим любимым местам" },
  ],
  dressDesc: "Коктейльное или вечернее платье",
  dressCode: "Ты прекрасна во всём",
  message: "Приглашаю тебя на свидание\n05.01.2026 | 19:00",
};

function formatWhen(isoLocal, fallback) {
  // Без внешних библиотек: пытаемся красиво отформатировать, иначе используем fallback.
  try {
    const dt = new Date(isoLocal);
    if (Number.isNaN(dt.getTime())) return fallback;
    const date = new Intl.DateTimeFormat("ru-RU", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(dt);
    const time = new Intl.DateTimeFormat("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(dt);
    return `${capitalize(date)}, ${time}`;
  } catch {
    return fallback;
  }
}

function capitalize(s) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function normalizeToName(name) {
  // Trim + remove common invisible chars that can sneak in from copy/paste.
  const n = String(name || "")
    .normalize("NFC")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .trim();
  if (!n) return "";

  const first = n.charAt(0);
  const rest = n.slice(1);

  // Enforce Cyrillic capital "А" for the first letter.
  // Users sometimes paste Latin A/a (U+0041/U+0061) or Cyrillic "а" (U+0430).
  if (first === "A" || first === "a" || first === "А" || first === "а") {
    return "А" + rest;
  }

  return first.toUpperCase() + rest;
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function setHtml(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = value;
}

function setHref(id, href) {
  const el = document.getElementById(id);
  if (el && el instanceof HTMLAnchorElement) el.href = href;
}

function buildOsmEmbed({ lat, lon, zoomBoxDelta }) {
  const dLat = zoomBoxDelta?.lat ?? 0.01;
  const dLon = zoomBoxDelta?.lon ?? 0.015;
  const left = lon - dLon;
  const right = lon + dLon;
  const bottom = lat - dLat;
  const top = lat + dLat;

  const bbox = [left, bottom, right, top]
    .map((n) => n.toFixed(6))
    .join(",");

  const marker = `${lat.toFixed(6)}%2C${lon.toFixed(6)}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${marker}`;
}

function buildYandexEmbed({ lat, lon, zoom }) {
  const z = Number.isFinite(zoom) ? zoom : 16;
  const ll = `${lon.toFixed(6)}%2C${lat.toFixed(6)}`;
  const pt = `${lon.toFixed(6)}%2C${lat.toFixed(6)}%2Cpm2rdm`;
  return `https://yandex.ru/map-widget/v1/?ll=${ll}&z=${encodeURIComponent(String(z))}&pt=${pt}&l=map&lang=ru_RU`;
}

function pickTimelineIcon(text) {
  const t = (text || "").toLowerCase();

  // Simple stroke icons (inline SVG), no external assets.
  const pin =
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" fill="none"/><path d="M12 13.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" fill="none"/></svg>';
  const dinner =
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 3v8a3 3 0 0 0 3 3v7" fill="none"/><path d="M7 3v8" fill="none"/><path d="M10 3v8" fill="none"/><path d="M14 3v10a4 4 0 0 0 4 4v4" fill="none"/></svg>';
  const gift =
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 9h18v4H3z" fill="none"/><path d="M5 13v8h14v-8" fill="none"/><path d="M12 9v12" fill="none"/><path d="M12 9c-2.5 0-4.5-1.1-4.5-3S9 3 11 5.2" fill="none"/><path d="M12 9c2.5 0 4.5-1.1 4.5-3S15 3 13 5.2" fill="none"/></svg>';
  const camera =
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 7h3l1-2h2l1 2h3a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-7a3 3 0 0 1 3-3Z" fill="none"/><path d="M12 17.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" fill="none"/></svg>';
  const heart =
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 21s-7-4.7-9.2-9.2A5.7 5.7 0 0 1 12 5.6a5.7 5.7 0 0 1 9.2 6.2C19 16.3 12 21 12 21Z" fill="none"/></svg>';

  if (t.includes("дом")) return pin;
  if (t.includes("ужин") || t.includes("ресторан") || t.includes("роман")) return dinner;
  if (t.includes("сюрпр")) return gift;
  if (t.includes("фото") || t.includes("прогул")) return camera;
  return heart;
}

function init() {
  const app = document.querySelector(".app");
  const openBtn = document.getElementById("openBtn");
  const closeBtn = document.getElementById("closeBtn");
  const overlay = document.getElementById("details");
  const timelineList = document.getElementById("timelineList");
  const mapFrame = document.getElementById("mapFrame");

  setText("detailsTitle", "Любовь моя!");
  setHtml(
    "detailsSub",
    "Я хочу пригласить тебя на<br>свидание!<br>05.01.2026&nbsp;|&nbsp;19:00"
  );

  setText("whenText", INVITE.when.displayFallback);
  setText("whereText", INVITE.where || "—");
  if (INVITE.whereLink) setHref("whereLink", INVITE.whereLink);
  setText("fromText", INVITE.fromName || "");

  setText("dressDesc", INVITE.dressDesc || "");
  setText("dressText", INVITE.dressCode || "");
  setText("messageText", INVITE.message || "");

  if (timelineList && Array.isArray(INVITE.timeline)) {
    timelineList.innerHTML = "";
    for (const [idx, item] of INVITE.timeline.entries()) {
      const li = document.createElement("li");
      const timeEl = document.createElement("div");
      const content = document.createElement("div");
      const t = document.createElement("div");
      const d = document.createElement("div");
      const ico = document.createElement("div");

      li.className = "timelineItem";
      li.dataset.side = idx % 2 === 0 ? "left" : "right";

      timeEl.className = "time";
      timeEl.textContent = item.time;

      content.className = "content";
      t.className = "t";
      d.className = "d";
      ico.className = "ico";

      d.textContent = item.text;
      ico.innerHTML = pickTimelineIcon(item.text);

      content.appendChild(t);
      content.appendChild(d);
      content.appendChild(ico);
      li.appendChild(timeEl);
      li.appendChild(content);
      timelineList.appendChild(li);
    }
  }

  if (mapFrame && INVITE.map?.lat && INVITE.map?.lon) {
    const provider = (INVITE.map.provider || "yandex").toLowerCase();
    const src = provider === "osm" ? buildOsmEmbed(INVITE.map) : buildYandexEmbed(INVITE.map);
    mapFrame.setAttribute("src", src);
  }

  const open = () => {
    if (!app) return;
    app.dataset.anim = "opening";
    app.dataset.state = "open";
    if (openBtn) openBtn.setAttribute("aria-expanded", "true");

    window.setTimeout(() => {
      if (app.dataset.anim === "opening") delete app.dataset.anim;
    }, 700);
  };

  const close = () => {
    if (!app) return;
    app.dataset.state = "closed";
    if (openBtn) openBtn.setAttribute("aria-expanded", "false");
  };

  openBtn?.addEventListener("click", open);
  closeBtn?.addEventListener("click", close);

  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && app?.dataset.state === "open") close();
  });
}

document.addEventListener("DOMContentLoaded", init);
