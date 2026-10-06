/* Shared helpers used by every page. Loaded before the page script. */

const LOCALE = "en-GB";

/* Look up a UI string; falls back to the key itself. */
function t(key, vars) {
  let value = I18N[key];
  if (typeof value !== "string") return key;
  return value.replace(/\{(\w+)\}/g, (m, name) =>
    vars && vars[name] != null ? vars[name] : m
  );
}

function catLabel(category) {
  return CAT_LABELS[category] || category;
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

function formatDate(iso) {
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d)) return "";
  return d.toLocaleDateString(LOCALE);
}

function todayLabel() {
  return new Date().toLocaleDateString(LOCALE, {
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
  if (article.image) {
    return `<div class="${cls}" style="--accent:${accent}">
      <img src="${escapeHtml(article.image)}" alt="${escapeHtml(article.imageAlt || "")}" loading="lazy" onerror="this.remove()">
    </div>`;
  }
  return `<div class="${cls}" style="--accent:${accent}">
    <span class="initials" aria-hidden="true">${escapeHtml(initials(article.title))}</span>
    <span class="badge"><span class="tag">${escapeHtml(catLabel(article.category))}</span></span>
  </div>`;
}

function metaItemsHtml(article, withReadingTime) {
  const bits = [
    `<span>${escapeHtml(formatDate(article.date))}</span>`,
    `<span class="dot">${escapeHtml(article.league || catLabel(article.category))}</span>`,
    `<span class="dot">${escapeHtml(t("byAuthor", { name: article.author || "Staff" }))}</span>`
  ];
  if (withReadingTime) {
    bits.push(`<span class="dot">${escapeHtml(t("readTime", { n: readingTime(article) }))}</span>`);
  }
  return bits.join("");
}

function metaHtml(article, withReadingTime) {
  return `<div class="meta">${metaItemsHtml(article, withReadingTime)}</div>`;
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

function articleHref(article) {
  return `article.html?id=${encodeURIComponent(article.id)}`;
}

function cardHtml(article) {
  const href = articleHref(article);
  return `<article class="card reveal">
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

/* Document title and description, kept in step with the UI text. */
function applyMeta(title) {
  document.title = (title ? title + " — " : "") + t("metaTitle");
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.content = t("metaDesc");
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