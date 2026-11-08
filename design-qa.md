# Reference fidelity — SONARA ECLIPSE

final result: passed

Validated on 2026-11-08 against the user-selected Home, Artist, Album and Legacy references. This result covers the implemented visual direction and Chromium validation; it does not certify Safari iOS rendering.

## Evidence and comparison method

Home, Artist and Album references are 1536 × 864. Runtime captures use an iframe of exactly 1536 × 864 at 1× scale. Because the browser surface is 1363 pixels wide, two overlapping captures at horizontal offsets 0 and 173 were cropped below the 40px QA toolbar and stitched without scaling. Legacy uses the desktop application region of the 1448 × 1086 design board, normalized to 1024 × 704, compared against an actual 1024 × 704 runtime viewport. Mobile captures are 390 × 844, without simulated phone chrome.

- [Home comparison](docs/reference-style/comparison-home.jpg)
- [Artist comparison](docs/reference-style/comparison-artist.jpg)
- [Album comparison](docs/reference-style/comparison-album.jpg)
- [Legacy comparison](docs/reference-style/comparison-legacy.jpg)
- [Mobile Legacy](docs/reference-style/legacy-mobile.jpg)
- [Mobile artist](docs/reference-style/artist-mobile.jpg)
- [Mobile expanded player](docs/reference-style/player-mobile.jpg)
- [Mobile collection](docs/reference-style/legacy-collection-mobile.jpg)
- [Responsive measurements](docs/reference-style/responsive-results.json)

## Five fidelity surfaces

| Surface | Inspection and result |
| --- | --- |
| Typography | Bold sans-serif music interface, spaced SONARA branding, large editorial serif LEGACY, handwritten FOREVER JAHSEH and restrained metadata hierarchy. Text remains real selectable UI. |
| Spacing | Three desktop columns, compact popular tracks and horizontal album cards, fixed native player. Mobile switches to a single content column and independently composed portrait hero. |
| Colors | Near-black and graphite panels, red eclipse/action accents; Legacy switches to charcoal, aged paper and warm off-white. |
| Imagery | Cinematic portrait and smoke banners, red eclipse arcs, archival polaroid/paper collage and photographic navigation thumbnails. Real catalogue covers retain their original square ratio. |
| Copy | Existing catalogue and selected memorial tracks preserved. Controls state the actual demo capability. No fabricated streams, friends activity or audio playback. |

## Iteration and resolved findings

Replaced image-of-interface banner crops with original decorative raster artwork and native text/buttons. Replaced flat Legacy treatment with finite desktop/mobile archival artwork. Removed baked mood labels and overlaid native icons/text. Enlarged the memorial polaroid and tightened desktop list density. Consolidated duplicate base CSS and corrected the mobile player cascade after consolidation. Neutralized mood navigation heading to avoid false personalization and documented generated artwork in public credits. Screenshots precede that last heading-only wording change; visual geometry is unchanged.

No unresolved P0, P1 or P2 visual defects were found in the inspected screens. Remaining intentional differences: original generated portrait compositions, actual catalogue covers/content, honest demo controls and the existing full-width player. The result reproduces the reference art direction, not every pixel or fictional statistic.

## Verification

- 10 automated tests passed; production build passed.
- Home, Legacy, XXXTENTACION artist and album 17: 28 browser viewport cases at widths 320, 375, 390, 430, 768, 1024 and 1440; no horizontal overflow.
- Track selection, player expansion, queue, Escape dismissal, Legacy collection navigation and favorite persistence checked in browser.
- Album 17 source remains 1500 × 1500, rendered proportionally.
- Legacy uses finite raster artwork and a small repeated texture; no whole-page blend/filter/reveal compositing effects.
- Safari/WebKit and the iPhone ChatGPT internal browser were unavailable. The reported iOS black-region bug cannot be declared definitively resolved on that device from Chromium evidence alone.
