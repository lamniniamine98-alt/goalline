const byId = (id) => document.getElementById(id);

const sorted = ARTICLES.slice().sort(byNewest);
let activeCategory = "All";
let query = "";

function renderNav() {
  const cats = Object.keys(CATEGORIES).filter((c) => sorted.some((a) => a.category === c));
  byId("nav").innerHTML = ["Latest"].concat(cats)
    .map((c) => `<a href="#news" data-cat="${escapeHtml(c)}">${escapeHtml(c)}</a>`)
    .join("");
}

function renderFilters() {
  const cats = Object.keys(CATEGORIES).filter((c) => sorted.some((a) => a.category === c));
  byId("filters").innerHTML = ["All"].concat(cats)
    .map((c) => `<button class="chip${c === activeCategory ? " active" : ""}" type="button" data-cat="${escapeHtml(c)}">${escapeHtml(c)}</button>`)
    .join("");
}

function renderHero() {
  const [lead, ...rest] = sorted;
  const main = byId("hero-main");

  if (!lead) {
    main.hidden = true;
    byId("hero-side").innerHTML = `<div class="empty">No posts yet. Add one in <code>assets/js/articles.js</code>.</div>`;
    return;
  }

  main.href = `article.html?id=${encodeURIComponent(lead.id)}`;
  main.style.setProperty("--accent", accentFor(lead));
  main.innerHTML = `
    ${mediaHtml(lead)}
    <div class="hero-body">
      <span class="tag">${escapeHtml(lead.category)}</span>
      <h1>${escapeHtml(lead.title)}</h1>
      <p>${escapeHtml(lead.excerpt || "")}</p>
      ${metaHtml(lead, true)}
    </div>`;

  byId("hero-side").innerHTML = rest.slice(0, 4).map((a) => `
    <a class="mini" href="article.html?id=${encodeURIComponent(a.id)}">
      ${mediaHtml(a)}
      <div>
        <span class="tag" style="--accent:${accentFor(a)}">${escapeHtml(a.category)}</span>
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
    : `<div class="empty">Nothing matches that. Try another search or category.</div>`;

  byId("section-title").textContent = activeCategory === "All" ? "Latest News" : activeCategory;
  byId("result-count").textContent = list.length + (list.length === 1 ? " post" : " posts");
}

function renderSidebar() {
  const readCount = {};
  sorted.forEach((a) => { readCount[a.id] = (readCount[a.id] || 0) + 1; });

  byId("most-read").innerHTML = sorted
    .slice()
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5)
    .map((a, i) => `
      <li><a href="article.html?id=${encodeURIComponent(a.id)}">
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
        <span class="tag" style="--accent:${escapeHtml((CATEGORIES[c] || "#22d3ee"))}">${escapeHtml(c)}</span>
        <span class="t">${counts[c]} post${counts[c] === 1 ? "" : "s"}</span>
      </a></li>`)
    .join("");
}

function selectCategory(cat, scroll) {
  activeCategory = cat;
  renderFilters();
  renderGrid();
  if (scroll) {
    document.getElementById("news")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
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
}

function renderChrome() {
  byId("today").textContent = new Date().toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });
  byId("year").textContent = new Date().getFullYear();
}

initTheme(byId("theme"));
renderChrome();
renderNav();
renderFilters();
renderHero();
renderGrid();
renderSidebar();
bindEvents();