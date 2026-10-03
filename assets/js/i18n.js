/* ==========================================================================
   TRANSLATIONS -- interface text for English, French and Arabic.
   Articles are NOT translated here: each post carries its own `lang` field,
   so you write news in whichever language you like.
   Use {n} as a placeholder, e.g. "{n} min read".
   ========================================================================== */

const I18N = {
  en: {
    dir: "ltr",
    locale: "en-GB",
    tagline: "Independent football news, updated daily",
    navLatest: "Latest",
    sectionLatest: "Latest News",
    mostRead: "Most Read",
    byCategory: "By Category",
    searchPlaceholder: "Search news",
    langAria: "Language",
    emptyNone: "No posts yet. Add one in assets/js/articles.js",
    emptyNoMatch: "Nothing matches that. Try another search or category.",
    byAuthor: "by {name}",
    readTime: "{n} min read",
    home: "Home",
    related: "Related articles",
    shareCopy: "Copy link",
    shareX: "Share on X",
    notFoundTitle: "Article not found",
    notFoundBody: "This post may have been removed, or the link is wrong.",
    footerTagline: "football news",
    footerRights: "All match details belong to their respective clubs.",
    footerLatest: "Latest",
    footerTop: "Back to top",
    metaTitle: "GoalLine — Football News, Match Reports & Transfer Updates",
    metaDesc: "Daily football news: match reports, transfer updates, previews and injury news from the Premier League, La Liga, Serie A and the Champions League."
  },

  fr: {
    dir: "ltr",
    locale: "fr-FR",
    tagline: "L'actualité football, mise à jour chaque jour",
    navLatest: "À la une",
    sectionLatest: "Dernières actualités",
    mostRead: "Les plus lus",
    byCategory: "Par catégorie",
    searchPlaceholder: "Rechercher une actualité",
    langAria: "Langue",
    emptyNone: "Aucun article pour le moment. Ajoutez-en un dans assets/js/articles.js",
    emptyNoMatch: "Aucun résultat. Essayez une autre recherche ou une autre catégorie.",
    byAuthor: "par {name}",
    readTime: "{n} min de lecture",
    home: "Accueil",
    related: "Articles similaires",
    shareCopy: "Copier le lien",
    shareX: "Partager sur X",
    notFoundTitle: "Article introuvable",
    notFoundBody: "Cet article a peut-être été supprimé, ou le lien est incorrect.",
    footerTagline: "l'actualité football",
    footerRights: "Toutes les informations appartiennent aux clubs concernés.",
    footerLatest: "À la une",
    footerTop: "Haut de page",
    metaTitle: "GoalLine — Actualités football, résumés de matchs et transferts",
    metaDesc: "L'actualité football : résumés de matchs, transferts, avant-match et actualités des blessures."
  },

  ar: {
    dir: "rtl",
    locale: "ar-u-nu-latn",
    tagline: "أخبار كرة القدم، تُحدَّث يومياً",
    navLatest: "الأحدث",
    sectionLatest: "آخر الأخبار",
    mostRead: "الأكثر قراءة",
    byCategory: "حسب التصنيف",
    searchPlaceholder: "ابحث في الأخبار",
    langAria: "اللغة",
    emptyNone: "لا توجد أخبار بعد. أضف خبراً في assets/js/articles.js",
    emptyNoMatch: "لا توجد نتائج. جرّب بحثاً أو تصنيفاً آخر.",
    byAuthor: "بقلم {name}",
    readTime: "{n} دقائق قراءة",
    home: "الرئيسية",
    related: "أخبار ذات صلة",
    shareCopy: "نسخ الرابط",
    shareX: "مشاركة على X",
    notFoundTitle: "الخبر غير موجود",
    notFoundBody: "ربما تم حذف هذا الخبر أو أن الرابط غير صحيح.",
    footerTagline: "أخبار كرة القدم",
    footerRights: "جميع المعلومات تخص الأندية المعنية.",
    footerLatest: "الأحدث",
    footerTop: "العودة إلى الأعلى",
    metaTitle: "جول لاين — أخبار كرة القدم وتقارير المباريات والانتقالات",
    metaDesc: "أخبار كرة القدم اليومية: تقارير المباريات، الانتقالات، معاينات المباريات وأخبار الإصابات."
  }
};

/* Category names, keyed by the English id used in articles.js */
const CAT_LABELS = {
  "Premier League": {
    en: "Premier League",
    fr: "Premier League",
    ar: "الدوري الإنجليزي"
  },
  "Champions League": {
    en: "Champions League",
    fr: "Ligue des champions",
    ar: "دوري الأبطال"
  },
  "La Liga": {
    en: "La Liga",
    fr: "La Liga",
    ar: "الدوري الإسباني"
  },
  "Serie A": {
    en: "Serie A",
    fr: "Serie A",
    ar: "الدوري الإيطالي"
  },
  "Transfers": {
    en: "Transfers",
    fr: "Transferts",
    ar: "الانتقالات"
  },
  "Injury News": {
    en: "Injury News",
    fr: "Actualités blessures",
    ar: "أخبار الإصابات"
  },
  "Preview": {
    en: "Preview",
    fr: "Avant-match",
    ar: "معاينة المباراة"
  },
  "Opinion": {
    en: "Opinion",
    fr: "Opinion",
    ar: "رأي"
  }
};