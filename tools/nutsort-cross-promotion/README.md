# Nut Sort cross-promotion

The root `cross_promo.json` preserves schema version 2 and every existing campaign.
Two new campaign objects represent the actual Free and Pro app identities. Each
contains separate Google Play and Amazon destinations for its edition; there is
no iOS destination because an iOS release has not been verified.

## Media fields

- `imageURL`: 1920x1080 landscape interstitial.
- `portraitImageURL`: 1080x1920 portrait interstitial.
- `videoURL`: direct landscape MP4 trailer, including gameplay sounds and Bolt dialogue.
- `portraitVideoURL`: direct portrait MP4 trailer with the same audio content.
- `bannerImageURL`: optional 320x50 banner extension.
- `bannerManifestURL`: optional link to `nutsort_banner_manifest.json`.

The MP4 URLs are hosted on this site's trusted media host. YouTube URLs remain
additional previews, not substitutes for direct video playback. The Pro YouTube
preview is intentionally unlisted to avoid a duplicate public channel trailer.

`nutsort_banner_manifest.json` follows the existing site's banner-manifest
convention. It supplies 320x50, 320x100, 728x90, 640x100 and 1280x200 images.
Its `requires_banner_renderer_support` status is deliberate: publishing artwork
does not add a banner renderer to already installed games. Legacy readers safely
ignore the extra main-feed banner fields.

## Edition weights

Pro has priority 165 and Free has priority 110. Readers that use priority as a
relative random-selection weight therefore select Pro 60% and Free 40% **among
eligible Nut Sort campaigns**. These are expected long-run shares, not a fixed
sequence of impressions. Existing non-Nut-Sort campaigns retain their weights;
this change does not allocate the whole cross-promotion network to Nut Sort.

The Nut Sort and newer Hexa readers use this weighted algorithm. Some older
clients do not: the inspected Football League reader chooses uniformly with an
80% Amazon paid-pool preference, while the inspected Boxing reader alternates
Amazon paid/free pools. Those released binaries override the JSON ratio and
require a future client update for an exact 60/40 policy. No misleading payment
flags or duplicate campaign entries were used to work around their behavior.

The Pro app is paid and ad-free, with optional purchases. The Free app contains
ads and optional purchases. `isAmazonPaid` reflects those actual editions.
Advertising host apps remain responsible for applying their store, age,
orientation, availability and self-promotion filters.
