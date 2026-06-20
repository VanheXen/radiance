# Capturing Radiance - local wish-link extractor.
# Reads Genshin's local web cache, finds the most recent VALID wish-history URL,
# prints it and copies it to the clipboard. Uploads nothing, reads nothing but the cache.
# Run:  irm https://radiance.vanhexen.deno.net/wish | iex
# (CN client: grab this file and run it with the argument "china".)

Add-Type -AssemblyName System.Web
[Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor 3072  # TLS 1.2 on old Win10

$reg     = $args[0]
$apiHost = "public-operation-hk4e-sg.hoyoverse.com"
$logPath = "$env:USERPROFILE\AppData\LocalLow\miHoYo\Genshin Impact\output_log.txt"
if ($reg -eq "china") {
  $apiHost = "public-operation-hk4e.mihoyo.com"
  $logPath = "$env:USERPROFILE\AppData\LocalLow\miHoYo\$([char]0x539f)$([char]0x795e)\output_log.txt"   # CN client folder name
}

if (-not (Test-Path $logPath)) {
  Write-Host "Can't find Genshin's log. Open Wishes > History in-game first, then re-run." -ForegroundColor Red
  return
}

# The log records the game install dir (e.g. C:/.../GenshinImpact_Data). Grab the last one.
$gameDir = (Select-String -Path $logPath -Pattern "(.:/.+?(GenshinImpact_Data|YuanShen_Data))" -AllMatches |
            Select-Object -Last 1).Matches.Groups[1].Value
if (-not $gameDir) {
  Write-Host "Can't find the game directory in the log. Open Wishes > History first." -ForegroundColor Red
  return
}

# The newest webCaches\<ver>\Cache\Cache_Data\data_2 holds the wish URLs.
$verDir = Get-ChildItem -Path (Join-Path $gameDir "webCaches") -Directory |
          Sort-Object LastWriteTime -Descending | Select-Object -First 1
$cacheFile = Join-Path $verDir.FullName "Cache\Cache_Data\data_2"
if (-not (Test-Path $cacheFile)) {
  Write-Host "Can't find the wish cache. Open Wishes > History in-game first." -ForegroundColor Red
  return
}

# The live file is locked - copy it out, then scan for wish URLs.
$tmp = Join-Path $env:TEMP "cr_data_2"
Copy-Item $cacheFile $tmp -Force
$content = Get-Content -Raw -Encoding UTF8 $tmp
Remove-Item $tmp -Force

# Validate a candidate by hitting getGachaLog; retcode 0 means the authkey is live.
function Test-WishUrl($url) {
  try {
    $u = [System.UriBuilder]::new($url)
    $u.Host = $apiHost; $u.Path = "gacha_info/api/getGachaLog"; $u.Fragment = ""
    $q = [System.Web.HttpUtility]::ParseQueryString($u.Query)
    $q.Set("lang", "en"); $q.Set("gacha_type", "301"); $q.Set("size", "5")
    $u.Query = $q.ToString()
    $r = Invoke-WebRequest -Uri $u.Uri.AbsoluteUri -UseBasicParsing -TimeoutSec 10 | ConvertFrom-Json
    return $r.retcode -eq 0
  } catch { return $false }
}

# Newest cache entries are last; walk backward to the freshest still-valid link.
$candidates = ($content -split "1/0/") -match "webview_gacha"
$link = $null
for ($i = $candidates.Length - 1; $i -ge 0; $i--) {
  if ($candidates[$i] -match "(https.+?game_biz=)") {
    Write-Host "`rChecking link $i ...   " -NoNewline
    if (Test-WishUrl $matches[1]) { $link = $matches[1]; break }
  }
}
Write-Host ""

if (-not $link) {
  Write-Host "No valid wish link found. Open Wishes > History in-game, then re-run." -ForegroundColor Red
  return
}

Set-Clipboard -Value $link
Write-Host $link
Write-Host "Link copied to clipboard - paste it into the Capturing Radiance app." -ForegroundColor Green
