<#
  fetch_news.ps1 -- publishes the daily football digest.
  Pulls football headlines from public RSS feeds, keeps the newest ones from
  the last N hours, and writes them into assets/js/digest.js.
  Each item is a short digest entry: headline, the feed's own summary, and a
  link back to the publisher via the Source credit at the foot of the article.
  We do not copy article bodies -- the feed summary is what the publisher
  provides for aggregation, and the full report always stays on their site.
  Runs on a schedule from .github/workflows/daily-news.yml. Safe to run
  repeatedly: items already in digest.js are never added twice.
#>

[CmdletBinding()]
param(
  [int]$WindowHours = 48,
  [int]$MaxDays = 7,
  [int]$MaxItems = 30
)

$ErrorActionPreference = 'Stop'

$Root = Split-Path -Parent $PSScriptRoot
$DigestPath = Join-Path $Root 'assets/js/digest.js'
$Author = 'GoalLine Desk'

$Feeds = @(
  @{ Name = 'BBC Sport';   Url = 'https://feeds.bbci.co.uk/sport/football/rss.xml' },
  @{ Name = 'The Guardian'; Url = 'https://www.theguardian.com/football/rss' },
  @{ Name = 'ESPN';        Url = 'https://www.espn.com/espn/rss/soccer/news' }
)

function Remove-HtmlText {
  param([string]$Value)
  if ([string]::IsNullOrWhiteSpace($Value)) { return $null }
  $s = [regex]::Replace($Value, '<script[\s\S]*?</script>', ' ', 'IgnoreCase')
  $s = [regex]::Replace($s, '<style[\s\S]*?</style>', ' ', 'IgnoreCase')
  $s = [regex]::Replace($s, '<[^>]+>', ' ')
  $s = [System.Net.WebUtility]::HtmlDecode($s)
  $s = $s -replace [char]0x00A0, ' '
  $s = [regex]::Replace($s, '[\u0000-\u0008\u000B\u000C\u000E-\u001F\u2028\u2029]', '')
  $s = [regex]::Replace($s, '\s+', ' ')
  if ([string]::IsNullOrWhiteSpace($s)) { return $null }
  return $s.Trim()
}

function Limit-Text {
  param([string]$Value, [int]$Max)
  if ([string]::IsNullOrWhiteSpace($Value)) { return $null }
  $s = $Value.Trim()
  if ($s.Length -le $Max) { return $s }
  $cut = $s.Substring(0, $Max)
  $sp = $cut.LastIndexOf(' ')
  if ($sp -gt ($Max * 0.6)) { $cut = $cut.Substring(0, $sp) }
  return $cut.TrimEnd([char[]]" .,;:-") + [char]0x2026
}

function Get-FeedText {
  param($Node)
  if ($null -eq $Node) { return $null }
  if ($Node -is [System.Xml.XmlNode]) { $v = $Node.InnerText } else { $v = [string]$Node }
  if ([string]::IsNullOrWhiteSpace($v)) { return $null }
  return $v.Trim()
}

# Pick a realistic, royalty-friendly image for digest entries (uses images
# already in assets/img/). These are stock-like images served with the site;
# alt text is descriptive for accessibility.
function Get-DigestImage {
  param([string]$Category, [string]$Title)
  $c = if ([string]::IsNullOrWhiteSpace($Category)) { '' } else { $Category.ToLowerInvariant() }
  $t = if ([string]::IsNullOrWhiteSpace($Title)) { '' } else { $Title.ToLowerInvariant() }

  if ($c -eq "women's football" -or $t -match 'women|lionesses|wsl|female') {
    return @{ Image = 'assets/img/womens-football.jpg'; Alt = 'Women''s football match action' }
  }
  if ($c -eq 'injury news') {
    return @{ Image = 'assets/img/soccer-player.jpg'; Alt = 'Football player on the pitch' }
  }
  if ($c -eq 'transfers') {
    return @{ Image = 'assets/img/soccer-player.jpg'; Alt = 'Professional football player' }
  }
  if ($c -eq 'champions league' -or $t -match 'champions league|ucl|european champions') {
    return @{ Image = 'assets/img/ucl-night-stadium.jpg'; Alt = 'Stadium under floodlights for a European night match' }
  }
  if ($c -eq 'premier league' -or $c -eq 'la liga' -or $c -eq 'serie a' -or $c -eq 'international' -or $c -eq 'world football') {
    return @{ Image = 'assets/img/matchday-crowd.jpg'; Alt = 'Energetic football crowd at a stadium' }
  }
  if ($c -eq 'preview') {
    return @{ Image = 'assets/img/etihad-stadium.jpg'; Alt = 'Modern football stadium exterior' }
  }
  if ($t -match 'trophy|cup|final|champion') {
    return @{ Image = 'assets/img/golden-trophy.jpg'; Alt = 'Football trophy on display' }
  }
  return @{ Image = 'assets/img/supporters.jpg'; Alt = 'Football supporters in the stands' }
}

# Order matters: the most specific signals are checked first so that a
# "Transfers" headline mentioning the Premier League stays a Transfers item.
function Get-Category {
  param([string]$Text)
  $t = $Text.ToLowerInvariant()

  if ($t -match 'wsl|women|female|lionesses|barclays women') { return "Women's Football" }
  if ($t -match 'injur|hamstring|cruciate|ligament|fracture|sidelined|ruled out for|out for \d') { return 'Injury News' }
  if ($t -match 'transfer|fee |signed |signing |joins |joined |deal |loan |contract|sacked |sack |appointed |resign|bid for') { return 'Transfers' }
  if ($t -match 'champions league|league phase|ucl |european champions') { return 'Champions League' }
  if ($t -match 'nations league|world cup|qualif|fifa |national team|ballon d|england |lions |three lions') { return 'International' }
  if ($t -match 'la liga|barcelona|real madrid|atl.tico|sevilla|valencia|villarreal|betis|girona') { return 'La Liga' }
  if ($t -match 'serie a|juventus|inter |milan|napoli|lazio|atalanta|bologna') { return 'Serie A' }
  if ($t -match 'premier league|manchester |liverpool|arsenal|chelsea|tottenham|everton|newcastle|west ham|brighton|fulham|crystal palace|nottingham|brentford|wolves|bournemouth|burnley|leeds|sunderland|southampton|villa|epl|english football') { return 'Premier League' }
  if ($t -match 'preview|kick-off|predicted|when is|team news') { return 'Preview' }
  return 'World Football'
}

function Get-ShortId {
  param([string]$Title, [string]$Link)
  $words = ($Title.ToLowerInvariant() -replace '[^a-z0-9\s-]', '') -replace '\s+', ' '
  $parts = @(($words -split ' ') | Where-Object { $_ } | Select-Object -First 7)
  $slug = ($parts -join '-').Trim('-')
  if ([string]::IsNullOrWhiteSpace($slug)) { $slug = 'story' }

  $md5 = [System.Security.Cryptography.MD5]::Create()
  try {
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($Link)
    $hash = ($md5.ComputeHash($bytes) | Select-Object -First 3 | ForEach-Object { $_.ToString('x2') }) -join ''
  } finally {
    $md5.Dispose()
  }
  return "$slug-$hash"
}

function Read-DigestItems {
  param([string]$Path)
  if (-not (Test-Path -LiteralPath $Path)) { return @() }
  $raw = [System.IO.File]::ReadAllText($Path)
  $m = [regex]::Match($raw, 'const\s+DIGEST\s*=\s*(?<json>\[[\s\S]*\])\s*;?\s*$')
  if (-not $m.Success) { return @() }
  try {
    $parsed = ConvertFrom-Json -InputObject $m.Groups['json'].Value
    if ($null -eq $parsed) { return @() }
    return ,@($parsed)
  } catch {
    Write-Warning "digest.js could not be parsed, it will be rebuilt from scratch."
    return @()
  }
}

$existing = @(Read-DigestItems -Path $DigestPath) | Where-Object { $null -ne $_ }
$knownUrls = New-Object 'System.Collections.Generic.HashSet[string]'
foreach ($item in $existing) {
  if ($item.source -and $item.source.url) { [void]$knownUrls.Add([string]$item.source.url) }
}
Write-Host ("Loaded {0} existing digest item(s)." -f $existing.Count)

$cutoff = [DateTimeOffset]::UtcNow.AddHours(-$WindowHours)
$found = @()
$feedErrors = 0

foreach ($feed in $Feeds) {
  try {
    $resp = Invoke-WebRequest -Uri $feed.Url -UseBasicParsing -TimeoutSec 45 -Headers @{ 'User-Agent' = 'GoalLineDaily/1.0 (+https://lamniniamine98-alt.github.io/goalline)' }
    [xml]$xml = $resp.Content
    $items = @($xml.rss.channel.item)
    $kept = 0
    foreach ($it in $items) {
      $title = Remove-HtmlText (Get-FeedText $it.title)
      $link  = Get-FeedText $it.link
      if ([string]::IsNullOrWhiteSpace($title) -or [string]::IsNullOrWhiteSpace($link)) { continue }
      $pubRaw = Get-FeedText $it.pubDate
      if (-not $pubRaw) { continue }
      try { $dt = [DateTimeOffset]::Parse($pubRaw, [System.Globalization.CultureInfo]::InvariantCulture) } catch { continue }
      if ($dt.UtcDateTime -lt $cutoff.UtcDateTime) { continue }
      if ($knownUrls.Contains($link)) { continue }
      $desc = Remove-HtmlText (Get-FeedText $it.description)
      if (-not $desc) { continue }
      [void]$knownUrls.Add($link)
      $found += [pscustomobject][ordered]@{
        title = Limit-Text $title 140
        link = $link
        pubUtc = $dt.UtcDateTime
        summary = $desc
        source = $feed.Name
      }
      $kept++
    }
    Write-Host ("  {0,-14} {1} item(s) in window ({2} total in feed)" -f $feed.Name, $kept, $items.Count)
  } catch {
    $feedErrors++
    Write-Warning ("  {0} failed: {1}" -f $feed.Name, $_.Exception.Message)
  }
}

if ($feedErrors -eq $Feeds.Count) {
  Write-Error 'Every feed failed to download; nothing published.'
  exit 1
}

Write-Host ("{0} new item(s) inside the last {1}h." -f $found.Count, $WindowHours)

$cutoffDate = [DateTime]::UtcNow.AddDays(-$MaxDays).ToString('yyyy-MM-dd')

$built = @()
foreach ($n in $found) {
  $summary = Limit-Text $n.summary 420
  $excerpt = Limit-Text $n.summary 240
  $date = $n.pubUtc.ToString('yyyy-MM-dd')
  $cat = Get-Category -Text ($n.title + ' ' + $n.summary)
  $img = Get-DigestImage -Category $cat -Title $n.title
  $built += [pscustomobject][ordered]@{
    id = Get-ShortId -Title $n.title -Link $n.link
    title = $n.title
    category = $cat
    date = $date
    lang = 'en'
    author = $Author
    excerpt = $excerpt
    image = $img.Image
    imageAlt = $img.Alt
    source = [pscustomobject][ordered]@{ name = $n.source; url = $n.link }
    body = @($summary)
    _pub = $n.pubUtc
  }
}

$carried = @()
foreach ($e in $existing) {
  $dt = $null
  try { $dt = [DateTime]::ParseExact([string]$e.date, 'yyyy-MM-dd', [System.Globalization.CultureInfo]::InvariantCulture) } catch { }
  $imgCarry = $e.image
  $imgAltCarry = $e.imageAlt
  if ([string]::IsNullOrWhiteSpace($imgCarry)) {
    $imgC = Get-DigestImage -Category $e.category -Title $e.title
    $imgCarry = $imgC.Image
    $imgAltCarry = $imgC.Alt
  }
  $carried += [pscustomobject][ordered]@{
    id = $e.id; title = $e.title; category = $e.category; date = $e.date
    lang = $e.lang; author = $e.author; excerpt = $e.excerpt; image = $imgCarry
    imageAlt = if ($imgAltCarry) { $imgAltCarry } else { 'Football news image' }
    source = $e.source; body = $e.body; _pub = $dt
  }
}

$final = @($built + $carried | Where-Object { $_.date -ge $cutoffDate } | Sort-Object -Property @{ Expression = '_pub'; Descending = $true }, @{ Expression = 'date'; Descending = $true } | Group-Object { [string]($_.source.url) } | ForEach-Object { $_.Group[0] } | Select-Object -First $MaxItems)

$seenIds = New-Object 'System.Collections.Generic.HashSet[string]'
foreach ($f in $final) {
  $base = [string]$f.id
  $candidate = $base
  $i = 2
  while (-not $seenIds.Add($candidate)) { $candidate = "$base-$i"; $i++ }
  $f.id = $candidate
}

$out = @()
foreach ($f in $final) {
  $o = [ordered]@{
    id = $f.id; title = $f.title; category = $f.category; date = $f.date
    lang = $f.lang; author = $f.author; excerpt = $f.excerpt; image = $f.image
    imageAlt = if ($f.imageAlt) { $f.imageAlt } else { 'Football news image' }
    source = $f.source; body = @($f.body)
  }
  $out += [pscustomobject]$o
}

$json = ConvertTo-Json -InputObject @($out) -Depth 6
if ($json -notmatch '^\s*\[') { $json = '[' + $json + ']' }

$banner = @"
/* ==========================================================================
   GENERATED FILE -- do not edit by hand.
   Built by scripts/fetch_news.ps1 from public RSS feeds and republished
   every day by .github/workflows/daily-news.yml.

   These are digest entries: headline, the publisher's own summary, and a
   Source credit linking back to where it was reported. Story bodies belong
   to their publishers -- see the Source line on each article.
   ========================================================================== */
const DIGEST = $json;
"@

[System.IO.File]::WriteAllText($DigestPath, $banner, (New-Object System.Text.UTF8Encoding($false)))
Write-Host ("Wrote {0} item(s) to assets/js/digest.js" -f $out.Count)
exit 0
