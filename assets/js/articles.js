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
   author   : your name
   excerpt  : one or two sentences, shown on cards
   accent   : hex colour used for the cover block and the category label
   image    : optional. Path to a picture, e.g. "assets/img/match.jpg".
              Leave as "" and a coloured block is shown instead.
   source   : optional. { name, url } -- credited at the end of the post.
              Write the summary in your own words and link to the report
              instead of copying the publisher's text.
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
  "Women's Football": "#f472b6",
  "International":    "#38bdf8",
  "Preview":          "#c084fc",
  "Opinion":          "#fb7185"
};

const ARTICLES = [
  {
    id: "man-city-appeal",
    title: "Manchester City appeal as a points deduction stays on the table",
    category: "Premier League",
    league: "Premier League",
    date: "2026-10-04",
    author: "Newsroom",
    excerpt: "The champions have formally appealed the ruling that found them guilty on almost every one of 115 charges. Sanctions are a separate process, and the league has said a points deduction cannot be ruled out.",
    accent: "#22d3ee",
    image: "",
    source: {
      name: "Premier League statement",
      url: "https://www.premierleague.com/en/news/4729207/premier-league-statement-manchester-city-fc-appeal-decision-of-independent-commission-02-october-2026"
    },
    body: [
      "An independent commission found Manchester City guilty of every serious-breach charge relating to the Premier League's financial rules review, covering nine seasons from 2009/10 to 2017/18, and guilty of three of the four charges concerning the club's failure to cooperate with the investigation. City announced on 2 October that it had appealed, arguing that the opinion contains clear material errors of law, principle and fact. The appeal goes to the Chair of the Judicial Panel and will be heard in private.",
      "## What the commission found",
      "City's defence was that the money it received was genuine sponsorship income. The commission rejected that. It found that a series of commercial agreements were shams, or at least bore no relation to their economic substance: sponsors were asked to pay only a fraction of the agreed fee, with the remainder covered by the club's Abu Dhabi owners. That arrangement was valued at £830.69m, and the distortion to reported revenue and costs was found to exceed £900m.",
      "The ruling also recorded that a number of club witnesses gave evidence that was false in key respects, which is why three of the four non-cooperation charges were upheld.",
      "## What happens next",
      "Sanctions are handled separately. The Premier League's rules allow a fine, a points deduction and other sporting sanctions, and the league has said it will push for the strongest punishment available. A deduction large enough to change the destination of the title race is not being ruled out.",
      "Under the fast-track procedure, the appeal hearing should be held within twelve weeks of the decision, with a ruling issued within thirty days of the hearing concluding.",
      "> Pep Guardiola, speaking after the ruling, said he was behind his club.",
      "City top the table and return to European action at home to Paris Saint-Germain before travelling to Liverpool on 11 October."
    ]
  },
  {
    id: "ucl-matchday-two",
    title: "Champions League matchday 2: City host PSG, Real Madrid go to Rome",
    category: "Preview",
    league: "Champions League",
    date: "2026-10-04",
    author: "Newsroom",
    excerpt: "The league phase resumes on 13 and 14 October with the tie of the round in Manchester, where the holders Paris Saint-Germain travel to the Etihad.",
    accent: "#c084fc",
    image: "",
    source: {
      name: "UEFA Champions League",
      url: "https://www.uefa.com/uefachampionsleague/"
    },
    body: [
      "Matchday 2 of the Champions League league phase is played on 13 and 14 October, and the tie of the round is in Manchester: Manchester City host the holders Paris Saint-Germain at the Etihad.",
      "Real Madrid travel to Rome to face Roma, Arsenal welcome Lille, Manchester United go to Atletico Madrid, Liverpool are away to LASK, Aston Villa host Fenerbahce, Borussia Dortmund face Bodo/Glimt, and Galatasaray welcome Barcelona.",
      "## A short turnaround",
      "City have not played since the international break and now face the side that won the competition last season, with a congested domestic calendar still ahead. Four league-phase fixtures would remain after this one, so a win here would put them in a very strong position.",
      "For Arsenal, Lille is the first of two difficult home ties in the group, and the return of European football brings a congested November into view."
    ]
  },
  {
    id: "premier-league-returns",
    title: "Premier League returns with Liverpool hosting Manchester City",
    category: "Preview",
    league: "Premier League",
    date: "2026-10-04",
    author: "Newsroom",
    excerpt: "Domestic football is back after the international break, and the weekend's headline fixture is at Anfield. Several kick-off times have been moved to suit television.",
    accent: "#c084fc",
    image: "",
    source: {
      name: "BBC Sport",
      url: "https://www.bbc.com/sport/football/premier-league"
    },
    body: [
      "The Premier League resumes on 10 and 11 October. Arsenal travel to Leeds in the early fixture on the Saturday, while Crystal Palace face Nottingham Forest on the Sunday. Arsenal's visit to Forest on 18 October has also been moved, part of a reshuffle agreed with broadcasters.",
      "## What to watch",
      "Liverpool and Manchester City have both played three times already, which makes this effectively a fifth-round meeting for two of the league's busiest schedules. Any result that separates them at the top matters more than the bare table position suggests.",
      "Six of the ten fixtures are shown on live television, which is why several weekend kick-off times differ from a normal Saturday."
    ]
  },
  {
    id: "transfer-window-roundup",
    title: "Transfer roundup: Barcola to Liverpool, Martinelli to Saudi Arabia",
    category: "Transfers",
    league: "Premier League",
    date: "2026-10-03",
    author: "Newsroom",
    excerpt: "Liverpool have agreed a fee in the region of £123m for Bradley Barcola, while Manchester United completed a £70m move for Baleba. Several deals remain in progress.",
    accent: "#fbbf24",
    image: "",
    source: {
      name: "BBC Sport transfers",
      url: "https://www.bbc.com/sport/football/transfer"
    },
    body: [
      "Liverpool have agreed a fee in the region of £123m for Bradley Barcola, the Paris Saint-Germain winger, in one of the most expensive deals of the window.",
      "Arsenal have sold Martinelli to Al-Hilal for around £60m, Manchester United completed the £70m signing of Baleba from Brighton, and Manchester City have agreed terms for the Palmeiras winger Allan. Fulham paid roughly £30m for Charles from Southampton, Nottingham Forest signed the Ivory Coast defender Diomande from Sporting, and West Ham brought in Solomon from Tottenham.",
      "Chelsea forward Kellyman joined Strasbourg, and Everton and Palace completed a swap involving McNeil-Johnson.",
      "## Still in progress",
      "Not everything in this window is finished. Chelsea are understood to have explored a move for the Fulham midfielder Berge, Tottenham turned down a loan request for Danso from Sunderland, and Nottingham Forest are working on a deal for the Chelsea striker Delap. Aston Villa have also opened talks with Club Brugge over the defender Ordonez.",
      "> Deals described here as agreed or completed are reported by BBC Sport; the rest are talks, and can still change."
    ]
  },
  {
    id: "ballon-dor-london",
    title: "Ballon d'Or comes to London with Lamine Yamal the name in the frame",
    category: "La Liga",
    league: "La Liga",
    date: "2026-10-03",
    author: "Newsroom",
    excerpt: "The 70th Ballon d'Or is awarded at the London Palladium on 26 October, with the Barcelona forward leading the debate after a strong start to his season.",
    accent: "#f87171",
    image: "",
    source: {
      name: "ESPN soccer",
      url: "https://www.espn.com/soccer/"
    },
    body: [
      "The Ballon d'Or will be awarded in London on 26 October, the first time the ceremony has been staged in the United Kingdom. The 70th edition is being held at the London Palladium.",
      "Lamine Yamal is the name most often mentioned in the debate. The 19-year-old has started the season with seven goals in seven La Liga appearances, and was named the league's player of the season for a second consecutive year. Hansi Flick has publicly backed his claim.",
      "> Mbappe and I are the best players, but the Ballon d'Or should be mine.",
      "Real Madrid's Jude Bellingham, Barcelona's Pau Cubarsi, the Chelsea and Real Madrid defender Marc Cucurella and the PSG forward Ousmane Dembele are also in contention. Real Madrid goalkeeper Andriy Lunin insisted his team-mate remains the favourite, while Cucurella joked that he would vote for himself.",
      "## The wider picture",
      "Yamal has also spoken openly about the racism he has faced, saying he has experienced it thousands of times. His season so far has made the case a serious one, with the usual caveat that the winner is chosen by journalists rather than by results on the pitch alone."
    ]
  },
  {
    id: "chelsea-end-arsenal-run",
    title: "Chelsea end Arsenal's 20-game WSL unbeaten run",
    category: "Women's Football",
    league: "Women's Super League",
    date: "2026-09-27",
    author: "Newsroom",
    excerpt: "Alyssa Thompson scored the only goal at Stamford Bridge on a night Arsenal hit the post twice and lost ground in the Women's Super League title race.",
    accent: "#f472b6",
    image: "",
    source: {
      name: "BBC Sport",
      url: "https://www.bbc.com/sport/football/womens-super-league"
    },
    body: [
      "Alyssa Thompson scored the only goal of the match at Stamford Bridge to end Arsenal's 20-game unbeaten run in the Women's Super League.",
      "Thompson's 39th-minute strike came after Keira Walsh's first-time effort was parried by the Arsenal goalkeeper, and it was enough on a night when the visitors hit the post twice through Kim Little and Mariona Caldentey.",
      "## What it means for the title race",
      "The result takes Chelsea to within two points of leaders Manchester City and level with Tottenham on ten points. Arsenal drop to seventh and seven points adrift of the leaders, a measure of how far the momentum has shifted since Katie McCabe moved from Arsenal to Chelsea this summer.",
      "Arsenal travel to Manchester City on 4 October. Head coach Renee Slegers said afterwards that the scoreline did not reflect the effort her players had put in."
    ]
  },
  {
    id: "international-window",
    title: "International roundup: Nations League window and Morocco's WAFCON record",
    category: "International",
    league: "Nations League",
    date: "2026-10-03",
    author: "Newsroom",
    excerpt: "European nations play Nations League fixtures in early October, while Morocco remain the only leading side to go through the Africa Cup of Nations group stage unbeaten.",
    accent: "#38bdf8",
    image: "",
    source: {
      name: "ESPN soccer",
      url: "https://www.espn.com/soccer/"
    },
    body: [
      "The international window opens with UEFA Nations League fixtures, with several European sides in action before domestic football resumes this weekend. The competition's league phase is approaching its conclusion, which makes these matches worth more than routine friendlies.",
      "## Morocco's clean record",
      "At the Women's Africa Cup of Nations, Morocco are the only side among the tournament's leading teams to have come through the group stage without defeat. Nigeria, South Africa and Ghana have each lost at least once, which leaves them needing wins from their remaining fixtures to keep their knockout positions alive.",
      "Morocco go into the knockout rounds with the strongest record in the group, and a semi-final place would also strengthen their case for a place at the next Women's World Cup."
    ]
  }
];
