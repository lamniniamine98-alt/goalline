const byId = (id) => document.getElementById(id);

function renderChrome() {
  setText("tagline", t("tagline"));
  setText("today", todayLabel());
  setText("year", new Date().getFullYear());
  setText("footer-tagline", t("footerTagline"));
  setText("footer-rights", t("footerRights"));
  setText("footer-home", t("home"));
  setText("footer-latest", t("footerLatest"));
  setText("crumb-home", t("home"));
  setText("related-head", t("related"));
  setText("share-link", t("shareCopy"));
  setText("share-twitter", t("shareX"));
}

function renderBody(article) {
  const raw = article.body || [];
  const body = byId("art-body");
  body.innerHTML = raw
    .map((line) => {
      const text = line.trim();
      if (/^##\s+/.test(text)) return `<h2>${escapeHtml(text.replace(/^##\s+/, ""))}</h2>`;
      if (/^>\s+/.test(text)) return `<blockquote>${escapeHtml(text.replace(/^>\s+/, ""))}</blockquote>`;
      return `<p>${escapeHtml(text)}</p>`;
    })
    .join("");
}

function renderSource(article) {
  const el = byId("art-source");
  if (!el) return;
  const html = sourceHtml(article);
  el.hidden = !html;
  el.innerHTML = html;
}

function renderRelated(article) {
  const others = ARTICLES.filter((a) => a.id !== article.id);
  const sameCat = others.filter((a) => a.category === article.category).sort(byNewest);
  const rest = others.filter((a) => a.category !== article.category).sort(byNewest);

  byId("related").innerHTML = sameCat.concat(rest).slice(0, 3).map(cardHtml).join("");
}

let sharingBound = false;

function initSharing(article) {
  const url = location.href;
  const text = article.title;

  if (sharingBound) return;
  sharingBound = true;

  byId("share-link").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast(t("shareCopy"));
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
    document.title = t("notFoundTitle") + " — GoalLine";
    byId("art-title").textContent = t("notFoundTitle");
    byId("art-lede").textContent = t("notFoundBody");
    byId("art-tag").hidden = true;
    byId("art-hero").hidden = true;
    const byline = document.querySelector(".byline");
    if (byline) byline.remove();
    byId("crumb-cat").textContent = "";
    byId("crumb-title").textContent = t("notFoundTitle");
    byId("related").innerHTML = ARTICLES.slice().sort(byNewest).slice(0, 3).map(cardHtml).join("");
    return;
  }

  const accent = accentFor(article);

  applyMeta(article.title);
  const desc = document.querySelector('meta[name="description"]');
  if (desc && article.excerpt) desc.content = article.excerpt;

  byId("crumb-cat").textContent = catLabel(article.category);
  byId("crumb-title").textContent = article.title;

  const tag = byId("art-tag");
  tag.hidden = false;
  tag.textContent = catLabel(article.category);
  tag.style.setProperty("--accent", accent);

  byId("art-title").textContent = article.title;
  byId("art-lede").textContent = article.excerpt || "";
  byId("art-author").textContent = article.author || "Staff";
  byId("art-meta").innerHTML = metaItemsHtml(article, true);

  const hero = byId("art-hero");
  hero.hidden = false;
  hero.style.setProperty("--accent", accent);
  hero.innerHTML = article.image
    ? `<img src="${escapeHtml(article.image)}" alt="${escapeHtml(article.imageAlt || "")}">`
    : `<span class="initials" aria-hidden="true">${escapeHtml(initials(article.title))}</span>`;

  renderBody(article);
  renderSource(article);
  renderRelated(article);
}

function renderAll() {
  renderChrome();
  render();
}

window.renderAll = renderAll;

initTheme(byId("theme"));
renderAll();