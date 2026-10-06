/* Shared helpers used by every page. Loaded before the page script. */

const LANGS = ["en", "fr", "ar"];

function detectLang() {
  const fromUrl = new URLSearchParams(location.search).get("lang");
  if (LANGS.includes(fromUrl)) return fromUrl;

  let saved = null;
  try { saved = localStorage.getItem("gl-lang"); } catch (e) {}
  if (LANGS.includes(saved)) return saved;

  const tags = navigator.languages && navigator.languages.length
    ? navigator.languages
    : [navigator.language || ""];
  for (const tag of tags) {
    const base = String(tag).toLowerCase().split("-")[0];
    if (LANGS.includes(base)) return base;
  }
  return "en";
}

let CURRENT_LANG = detectLang();

function conf(lang) {
  return I18N[lang] || I18N.en;
}

/* Look up a UI string; falls back to English, then to the key itself. */
function t(key, vars) {
  let value = conf(CURRENT_LANG)[key];
  if (typeof value !== "string") value = I18N.en[key];
  if (typeof value !== "string") return key;
  return value.replace(/\{(\w+)\}/g, (m, name) =>
    vars && vars[name] != null ? vars[name] : m
  );
}

function catLabel(category) {
  const group = CAT_LABELS[category];
  if (!group) return category;
  return group[CURRENT_LANG] || group.en || category;
}

function dirFor(lang) {
  return conf(lang).dir;
}

function localeFor(lang) {
  return conf(lang).locale || conf(lang).dir;
}

function isRtl(lang) {
  return dirFor(lang || CURRENT_LANG) === "rtl";
}

/* A post declares its own language so a French post stays LTR and an
   Arabic post stays RTL even when the menus are in another language. */
function postLang(article) {
  return LANGS.includes(article.lang) ? article.lang : "en";
}

function escapeHtml(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function byNewest(a, b) {
  return new Date(b.date) - new Date(a.date);
}

function formatDate(iso, lang) {
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d)) return "";
  return d.toLocaleDateString(localeFor(lang || CURRENT_LANG));
}

function todayLabel(lang) {
  return new Date().toLocaleDateString(localeFor(lang || CURRENT_LANG), {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });
}

function accentFor(article) {
  return article.accent || (typeof CATEGORIES !== "undefined" && CATEGORIES[article.category]) || "#22d3ee";
}

function readingTime(article) {
  const words = (article.body || []).join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 210));
}

/* Two letters from the headline, used when a post has no picture. */
function initials(title) {
  return String(title || "")
    .replace(/^SAMPLE:\s*/i, "")
    .replace(/^EXEMPLE:\s*/i, "")
    .replace(/^مثال:\s*/, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

/* Cover block: a picture if one is set, otherwise a coloured placeholder. */
function mediaHtml(article, extraClass) {
  const accent = accentFor(article);
  const cls = "media" + (extraClass ? " " + extraClass : "");
  const dir = dirFor(postLang(article));
  if (article.image) {
    return `<div class="${cls}" style="--accent:${accent}" dir="${dir}">
      <img src="${escapeHtml(article.image)}" alt="" loading="lazy" onerror="this.remove()">
    </div>`;
  }
  return `<div class="${cls}" style="--accent:${accent}" dir="${dir}">
    <span class="initials" aria-hidden="true">${escapeHtml(initials(article.title))}</span>
    <span class="badge"><span class="tag">${escapeHtml(catLabel(article.category))}</span></span>
  </div>`;
}

function metaItemsHtml(article, withReadingTime) {
  const lang = postLang(article);
  const bits = [
    `<span>${escapeHtml(formatDate(article.date, lang))}</span>`,
    `<span class="dot">${escapeHtml(article.league || catLabel(article.category))}</span>`,
    `<span class="dot">${escapeHtml(t("byAuthor", { name: article.author || "Staff" }))}</span>`
  ];
  if (withReadingTime) {
    bits.push(`<span class="dot">${escapeHtml(t("readTime", { n: readingTime(article) }))}</span>`);
  }
  /* Show the post's language only when it differs from the interface. */
  if (lang !== CURRENT_LANG) {
    bits.push(`<span class="lang-mark" title="${escapeHtml(langLabel(lang))}">${lang.toUpperCase()}</span>`);
  }
  return bits.join("");
}

function metaHtml(article, withReadingTime) {
  return `<div class="meta">${metaItemsHtml(article, withReadingTime)}</div>`;
}

function langLabel(lang) {
  return { en: "English", fr: "Français", ar: "العربية" }[lang] || lang;
}

/* Credit line at the end of a post: where the reporting came from.
   Only http(s) links are rendered, so a bad value can never inject markup. */
function sourceHtml(article) {
  const src = article.source;
  if (!src || !src.name) return "";
  const name = escapeHtml(src.name);
  const safe = /^https?:\/\//i.test(src.url || "");
  const credit = safe
    ? `<a href="${escapeHtml(src.url)}" target="_blank" rel="noopener noreferrer">${name}</a>`
    : name;
  return `<span class="source-label">${escapeHtml(t("sourceLabel"))}:</span> ${credit}`;
}

function cardHtml(article) {
  const href = `article.html?id=${encodeURIComponent(article.id)}&lang=${CURRENT_LANG}`;
  const dir = dirFor(postLang(article));
  return `<article class="card reveal" dir="${dir}" lang="${postLang(article)}">
    <a href="${href}">${mediaHtml(article)}</a>
    <div class="card-body">
      <h3><a href="${href}">${escapeHtml(article.title)}</a></h3>
      <p>${escapeHtml(article.excerpt || "")}</p>
      ${metaHtml(article, false)}
    </div>
  </article>`;
}

function findArticle(id) {
  return ARTICLES.find((a) => a.id === id);
}

/* Theme: remember the reader's choice. */
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem("gl-theme", theme); } catch (e) {}
}

function initTheme(button) {
  let saved = null;
  try { saved = localStorage.getItem("gl-theme"); } catch (e) {}
  applyTheme(saved || "dark");
  if (!button) return;
  const label = () => {
    const dark = document.documentElement.dataset.theme !== "light";
    button.textContent = dark ? "\u263E" : "\u2600";
    button.title = "Light / dark";
    button.setAttribute("aria-label", "Light / dark");
  };
  label();
  button.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    applyTheme(next);
    label();
  });
}

/* Language: apply to <html>, remember it, and let the page redraw. */
function setLang(lang) {
  if (!LANGS.includes(lang)) return;
  CURRENT_LANG = lang;
  const dir = dirFor(lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = dir;
  try { localStorage.setItem("gl-lang", lang); } catch (e) {}

  const url = new URL(location.href);
  url.searchParams.set("lang", lang);
  history.replaceState(null, "", url);

  document.title = t("metaTitle");
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.content = t("metaDesc");

  if (typeof window.renderAll === "function") window.renderAll();
}

function initLangSwitcher(select) {
  if (!select) return;
  select.value = CURRENT_LANG;
  select.addEventListener("change", () => setLang(select.value));
  const label = document.getElementById("lang-label");
  if (label) label.textContent = t("langAria");
}

/* Set text only when the element is on the page: the "not found" view
   removes the byline, so its buttons must not be assumed to exist. */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
  return el;
}

function toast(message) {
  let el = document.querySelector(".toast");
  if (!el) {
    el = document.createElement("div");
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove("show"), 2200);
}