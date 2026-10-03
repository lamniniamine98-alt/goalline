/* ==========================================================================
   NEWS CONTENT  --  this is the ONLY file you edit to post news
   ==========================================================================
   Add a new post: copy an existing block inside ARTICLES, paste it at the top
   (newest first), and change the text. Save the file, refresh the page.

   id       : unique, no spaces. Used for the link. e.g. "arsenal-chelsea"
   title    : the headline
   category : one of the CATEGORIES keys below (add your own if needed)
   league   : free text, e.g. "Premier League"
   date     : YYYY-MM-DD
   lang     : "en", "fr" or "ar" -- the language this post is written in.
              The menus follow the reader's chosen language; the post itself
              keeps this language, including right-to-left for Arabic.
   author   : your name
   excerpt  : one or two sentences, shown on cards
   accent   : hex colour used for the cover block and the category label
   image    : optional. Path to a picture, e.g. "assets/img/match.jpg".
              Leave as "" and a coloured block is shown instead.
   body     : array of paragraphs.
              "## text"  -> sub-heading
              "> text"   -> pull quote
   ========================================================================== */

const CATEGORIES = {
  "Premier League":   "#22d3ee",
  "Champions League": "#818cf8",
  "La Liga":          "#f87171",
  "Serie A":          "#4ade80",
  "Transfers":        "#fbbf24",
  "Injury News":      "#fb923c",
  "Preview":          "#c084fc",
  "Opinion":          "#f472b6"
};

/* ------------------------- SAMPLE POSTS -------------------------
   Delete everything from here down once you add your own news.
   One post per language is included so you can see how each one looks.
   ---------------------------------------------------------------- */

const ARTICLES = [
  {
    id: "sample-en",
    title: "SAMPLE: Extra-time thriller decides the derby",
    category: "Premier League",
    league: "Premier League",
    date: "2026-09-30",
    lang: "en",
    author: "Newsroom",
    excerpt: "Replace this with your own headline. This sample post shows how a match report card and article page look.",
    accent: "#22d3ee",
    image: "",
    body: [
      "Replace this text with your report. Write the opening paragraph to say who won, by how much, and who scored.",
      "## What decided it",
      "Use a line starting with two hashes to add a sub-heading like this one.",
      "Add as many paragraphs as you need. Each array item becomes one paragraph.",
      "> Pull quotes look like this: start a line with a greater-than sign."
    ]
  },
  {
    id: "sample-fr",
    title: "EXEMPLE : un derby decided dans les prolongations",
    category: "La Liga",
    league: "La Liga",
    date: "2026-09-29",
    lang: "fr",
    author: "La rédaction",
    excerpt: "Un exemple de post en français. Le menu suit la langue du lecteur, mais le texte reste en français.",
    accent: "#f87171",
    image: "",
    body: [
      "Remplacez ce texte par votre article. Commencez par dire qui a gagné, sur quel score et qui a marqué.",
      "## Ce qui a tout décidé",
      "Une ligne commençant par deux dièses crée un sous-titre comme celui-ci.",
      "> Les citations commencent par un signe supérieur."
    ]
  },
  {
    id: "sample-ar",
    title: "مثال: مباراة ديربي حُسمت في الوقت الإضافي",
    category: "Champions League",
    league: "Champions League",
    date: "2026-09-28",
    lang: "ar",
    author: "غرفة الأخبار",
    excerpt: "مثال على خبر بالعربية. يُعرض النص من اليمين إلى اليسار تلقائياً.",
    accent: "#818cf8",
    image: "",
    body: [
      "استبدل هذا النص بأخبارك. اكتب في الفقرة الأولى من فاز وبأي نتيجة ومن سجّل الأهداف.",
      "## ما الذي حسم المباراة",
      "السطر الذي يبدأ بعلامة ## يصبح عنواناً فرعياً.",
      "> تبدأ الاقتباسات بعلامة أكبر من."
    ]
  },
  {
    id: "sample-transfer",
    title: "SAMPLE: Record fee agreed as window closes",
    category: "Transfers",
    league: "Premier League",
    date: "2026-09-27",
    lang: "en",
    author: "Newsroom",
    excerpt: "A second sample post so the homepage has more than one card to lay out.",
    accent: "#fbbf24",
    image: "",
    body: [
      "Replace this with the transfer story. Include the clubs, the fee, and the length of the contract.",
      "## Deal details",
      "The same rules apply here as in every other post."
    ]
  },
  {
    id: "sample-injury",
    title: "SAMPLE: Captain faces spell out after scan results",
    category: "Injury News",
    league: "Premier League",
    date: "2026-09-24",
    lang: "en",
    author: "Newsroom",
    excerpt: "A short breaking-news sample post.",
    accent: "#fb923c",
    image: "",
    body: [
      "For breaking news, keep the first sentence to the point and put the detail below it."
    ]
  }
];