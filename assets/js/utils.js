/* Shared helpers used by every page. Loaded before the page script. */

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
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
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
      <img src="${escapeHtml(article.image)}" alt="" loading="lazy"
           onerror="this.remove()">
    </div>`;
  }
  return `<div class="${cls}" style="--accent:${accent}">
    <span class="initials" aria-hidden="true">${escapeHtml(initials(article.title))}</span>
    <span class="badge"><span class="tag">${escapeHtml(article.category)}</span></span>
  </div>`;
}

function metaItemsHtml(article, withReadingTime) {
  const bits = [
    `<span>${escapeHtml(formatDate(article.date))}</span>`,
    `<span class="dot">${escapeHtml(article.league || article.category)}</span>`,
    `<span class="dot">by ${escapeHtml(article.author || "Staff")}</span>`
  ];
  if (withReadingTime) {
    bits.push(`<span class="dot">${readingTime(article)} min read</span>`);
  }
  return bits.join("");
}

function metaHtml(article, withReadingTime) {
  return `<div class="meta">${metaItemsHtml(article, withReadingTime)}</div>`;
}

function cardHtml(article) {
  return `<article class="card reveal">
    <a href="article.html?id=${encodeURIComponent(article.id)}">${mediaHtml(article)}</a>
    <div class="card-body">
      <h3><a href="article.html?id=${encodeURIComponent(article.id)}">${escapeHtml(article.title)}</a></h3>
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
    button.textContent = document.documentElement.dataset.theme === "light" ? "\u263D" : "\u263E";
    button.title = "Switch theme";
    button.setAttribute("aria-label", "Switch between dark and light theme");
  };
  label();
  button.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    applyTheme(next);
    label();
  });
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