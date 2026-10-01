const byId = (id) => document.getElementById(id);

function renderBody(article) {
  byId("art-body").innerHTML = (article.body || [])
    .map((line) => {
      const raw = line.trim();
      if (/^##\s+/.test(raw)) return `<h2>${escapeHtml(raw.replace(/^##\s+/, ""))}</h2>`;
      if (/^>\s+/.test(raw)) return `<blockquote>${escapeHtml(raw.replace(/^>\s+/, ""))}</blockquote>`;
      return `<p>${escapeHtml(raw)}</p>`;
    })
    .join("");
}

function renderRelated(article) {
  const related = ARTICLES
    .filter((a) => a.id !== article.id)
    .sort(byNewest)
    .filter((a) => a.category === article.category)
    .concat(ARTICLES.filter((a) => a.id !== article.id && a.category !== article.category).sort(byNewest))
    .slice(0, 3);

  byId("related").innerHTML = related.map(cardHtml).join("");
}

function initSharing(article) {
  const url = location.href;
  const text = article.title;

  byId("share-link").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast("Link copied");
    } catch (e) {
      toast(url);
    }
  });

  byId("share-twitter").addEventListener("click", () => {
    window.open(
      "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text) + "&url=" + encodeURIComponent(url),
      "_blank", "noopener,width=600,height=480"
    );
  });

  byId("share-whatsapp").addEventListener("click", () => {
    window.open(
      "https://api.whatsapp.com/send?text=" + encodeURIComponent(text + " " + url),
      "_blank", "noopener,width=600,height=480"
    );
  });
}

function render() {
  const id = new URLSearchParams(location.search).get("id");
  const article = id ? findArticle(id) : null;

  if (!article) {
    byId("art-title").textContent = "Article not found";
    byId("art-lede").textContent = "This post may have been removed, or the link is wrong.";
    byId("art-hero").hidden = true;
    document.querySelector(".byline").remove();
    byId("related").innerHTML = ARTICLES.slice().sort(byNewest).slice(0, 3).map(cardHtml).join("");
    return;
  }

  const accent = accentFor(article);

  document.title = article.title + " — GoalLine";
  document.documentElement.style.setProperty("--accent", accent);

  byId("crumb-cat").textContent = article.category;
  byId("crumb-title").textContent = article.title;

  const tag = byId("art-tag");
  tag.textContent = article.category;
  tag.style.setProperty("--accent", accent);

  byId("art-title").textContent = article.title;
  byId("art-lede").textContent = article.excerpt || "";
  byId("art-author").textContent = article.author || "Staff";
  byId("art-meta").innerHTML = metaItemsHtml(article, true);

  const hero = byId("art-hero");
  hero.style.setProperty("--accent", accent);
  hero.innerHTML = article.image
    ? `<img src="${escapeHtml(article.image)}" alt="">`
    : `<span class="initials" aria-hidden="true">${escapeHtml(initials(article.title))}</span>`;

  renderBody(article);
  renderRelated(article);
  initSharing(article);
}

byId("today").textContent = new Date().toLocaleDateString("en-GB", {
  weekday: "long", day: "numeric", month: "long", year: "numeric"
});
byId("year").textContent = new Date().getFullYear();

initTheme(byId("theme"));
render();