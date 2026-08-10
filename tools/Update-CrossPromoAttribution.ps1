param([string]$FeedPath = (Join-Path $PSScriptRoot '..\cross_promo.json'))

$feed = Get-Content -LiteralPath $FeedPath -Raw | ConvertFrom-Json
foreach ($promotion in $feed.promotions) {
    if ([string]::IsNullOrWhiteSpace($promotion.googlePlayURL)) { continue }

    $creativeId = [string]$promotion.creativeId
    if ([string]::IsNullOrWhiteSpace($creativeId)) {
        $creativeId = ([string]$promotion.gameTitle).ToLowerInvariant()
        $creativeId = [regex]::Replace($creativeId, '[^a-z0-9]+', '-').Trim('-')
        $promotion | Add-Member -NotePropertyName creativeId -NotePropertyValue $creativeId -Force
    }

    $baseUrl = ([string]$promotion.googlePlayURL) -replace '&referrer=.*$', ''
    $referrer = "utm_source=legacy_crosspromo&utm_medium=house_ad&utm_campaign=$creativeId"
    $promotion.googlePlayURL = $baseUrl + '&referrer=' + [Uri]::EscapeDataString($referrer)
}

$feed.updatedAt = (Get-Date).ToString('yyyy-MM-ddTHH:mm:sszzz')
$json = $feed | ConvertTo-Json -Depth 12
[IO.File]::WriteAllText((Resolve-Path -LiteralPath $FeedPath), $json + [Environment]::NewLine,
    [Text.UTF8Encoding]::new($false))
