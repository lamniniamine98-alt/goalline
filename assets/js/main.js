const byId = (id) => document.getElementById(id);

const sorted = ARTICLES.slice().sort(byNewest);
let activeCategory = "All";
let query = "";

function usedCategories() {
  return Object.keys(CATEGORIES).filter((c) => sorted.some((a) => a.category === c));
}

function renderChrome() {
  setText("tagline", t("tagline"));
  setText("today", todayLabel());
  setText("year", new Date().getFullYear());
  setText("footer-tagline", t("footerTagline"));
  setText("footer-rights", t("footerRights"));
  setText("footer-home", t("home"));
  setText("footer-latest", t("footerLatest"));
  setText("footer-top", t("footerTop"));
  setText("most-read-head", t("mostRead"));
  setText("by-category-head", t("byCategory"));
  applyMeta();

  const search = byId("search");
  search.placeholder = t("searchPlaceholder");
  search.setAttribute("aria-label", t("searchPlaceholder"));
}

function renderNav() {
  const cats = usedCategories();
  const items = [["All", t("navLatest")]].concat(
    cats.map((c) => [c, catLabel(c)])
  );
  byId("nav").innerHTML = items
    .map(([cat, label]) =>
      `<a href="#news" data-cat="${escapeHtml(cat)}">${escapeHtml(label)}</a>`)
    .join("");
  markActiveNav();
}

function markActiveNav() {
  const cats = usedCategories();
  const keys = ["All"].concat(cats);
  byId("nav").querySelectorAll("a").forEach((a, i) => {
    a.classList.toggle("active", keys[i] === activeCategory);
  });
}

function renderFilters() {
  byId("filters").innerHTML = ["All"].concat(usedCategories())
    .map((cat) => {
      const label = cat === "All" ? t("navLatest") : catLabel(cat);
      return `<button class="chip${cat === activeCategory ? " active" : ""}" type="button" data-cat="${escapeHtml(cat)}">${escapeHtml(label)}</button>`;
    })
    .join("");
  markActiveNav();
}

function renderHero() {
  const [lead, ...rest] = sorted;
  const main = byId("hero-main");

  if (!lead) {
    main.hidden = true;
    byId("hero-side").innerHTML = `<div class="empty">${escapeHtml(t("emptyNone"))}</div>`;
    return;
  }

  const href = articleHref(lead);
  main.href = href;
  main.style.setProperty("--accent", accentFor(lead));
  main.innerHTML = `
    ${mediaHtml(lead)}
    <div class="hero-body">
      <span class="tag" style="--accent:${accentFor(lead)}">${escapeHtml(catLabel(lead.category))}</span>
      <h1>${escapeHtml(lead.title)}</h1>
      <p>${escapeHtml(lead.excerpt || "")}</p>
      ${metaHtml(lead, true)}
    </div>`;

  byId("hero-side").innerHTML = rest.slice(0, 4).map((a) => `
    <a class="mini" href="${articleHref(a)}">
      ${mediaHtml(a)}
      <div>
        <span class="tag" style="--accent:${accentFor(a)}">${escapeHtml(catLabel(a.category))}</span>
        <h3>${escapeHtml(a.title)}</h3>
      </div>
    </a>`).join("");
}

function matches(article) {
  const okCat = activeCategory === "All" || article.category === activeCategory;
  if (!query) return okCat;
  const haystack = [article.title, article.excerpt, article.category, article.league, article.author]
    .join(" ").toLowerCase();
  return okCat && haystack.includes(query);
}

function renderGrid() {
  const list = sorted.filter(matches);
  byId("grid").innerHTML = list.length
    ? list.map(cardHtml).join("")
    : `<div class="empty">${escapeHtml(t("emptyNoMatch"))}</div>`;

  byId("section-title").textContent = activeCategory === "All" ? t("sectionLatest") : catLabel(activeCategory);
  byId("result-count").textContent = list.length + " / " + sorted.length;
}

function renderSidebar() {
  byId("most-read").innerHTML = sorted
    .slice()
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5)
    .map((a, i) => `
<li><a href="${articleHref(a)}">
             <span class="rank">${i + 1}</span>
        ${mediaHtml(a)}
        <span class="t">${escapeHtml(a.title)}</span>
      </a></li>`)
    .join("");

  const counts = {};
  sorted.forEach((a) => { counts[a.category] = (counts[a.category] || 0) + 1; });

  byId("by-category").innerHTML = Object.keys(counts)
    .sort((a, b) => counts[b] - counts[a])
    .map((c) => `
      <li><a href="#news" data-cat="${escapeHtml(c)}">
        <span class="tag" style="--accent:${escapeHtml(CATEGORIES[c] || "#22d3ee")}">${escapeHtml(catLabel(c))}</span>
        <span class="t">${counts[c]}</span>
      </a></li>`)
    .join("");
}

function selectCategory(cat, scroll) {
  activeCategory = cat;
  renderFilters();
  renderGrid();
  if (scroll) {
    byId("news").scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function renderAll() {
  renderChrome();
  renderNav();
  renderFilters();
  renderHero();
  renderGrid();
  renderSidebar();
}

function bindEvents() {
  byId("filters").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (chip) selectCategory(chip.dataset.cat, false);
  });

  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-cat]");
    if (!link || link.classList.contains("chip")) return;
    e.preventDefault();
    selectCategory(link.dataset.cat, true);
  });

  const search = byId("search");
  let timer;
  search.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => { query = search.value.trim().toLowerCase(); renderGrid(); }, 150);
  });

  byId("footer-latest").addEventListener("click", (e) => {
    e.preventDefault();
    selectCategory("All", true);
  });

  byId("footer-top").addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

window.renderAll = renderAll;

initTheme(byId("theme"));
bindEvents();
renderAll();