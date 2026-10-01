/* ==========================================================================
   NEWS CONTENT  --  this is the ONLY file you edit to post news
   ==========================================================================
   Add a new post: copy an existing block inside ARTICLES, paste it at the top
   (newest first), and change the text. Save the file, refresh the page.

   id       : unique, no spaces. Used for the link. e.g. "arsenal-chelsea"
   title    : the headline
   category : must be one of the CATEGORIES keys below, or add your own
   league   : free text, e.g. "Premier League"
   date     : YYYY-MM-DD
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
   ---------------------------------------------------------------- */

const ARTICLES = [
  {
    id: "sample-match-report",
    title: "SAMPLE: Extra-time thriller decides the derby",
    category: "Premier League",
    league: "Premier League",
    date: "2026-09-30",
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
    id: "sample-transfer",
    title: "SAMPLE: Record fee agreed as window closes",
    category: "Transfers",
    league: "Premier League",
    date: "2026-09-28",
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
    id: "sample-preview",
    title: "SAMPLE: Three things to watch in this weekend's fixtures",
    category: "Preview",
    league: "Champions League",
    date: "2026-09-26",
    author: "Newsroom",
    excerpt: "A preview-style sample post. Useful for testing longer headlines.",
    accent: "#c084fc",
    image: "",
    body: [
      "Preview posts work well for build-ups to a big game. Lead with the match and the stakes.",
      "## Key battles",
      "Then list the individual matchups you want to highlight.",
      "> Keep it short. Readers scan the first line."
    ]
  },
  {
    id: "sample-injury",
    title: "SAMPLE: Captain faces spell out after scan results",
    category: "Injury News",
    league: "La Liga",
    date: "2026-09-22",
    author: "Newsroom",
    excerpt: "A short breaking-news sample post.",
    accent: "#fb923c",
    image: "",
    body: [
      "For breaking news, keep the first sentence to the point and put the detail below it."
    ]
  }
];