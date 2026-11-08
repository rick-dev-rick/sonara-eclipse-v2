# SONARA Eclipse refinement — 2026-11-08

The user brief is the approved specification and explicitly delegates design and publication.
Approach: retain React/Vite, catalogue, navigation and saved favourites. Extract Art, Legacy and Player. Replace accumulated CSS with a single token-based stylesheet and a dedicated, ordinary-flow Legacy stylesheet. No document-sized textured overlays or visibility effects. Album artwork stays square, unfiltered and local. Archive photography, graphite, aged paper and editorial type preserve the homage.

1. Record production/reference evidence; preserve backup branch; verify images and current UI failures.
2. Pin catalogue assets locally, obtain a larger 17 original, record provenance and dimensions. Stop fetching mutable assets on every deployment.
3. Extract/rebuild Legacy with bounded imagery, 13 original selections, history, photographic impact composition and accessible favourites.
4. Consolidate shared styles, improve Home/artists/albums, route history/search, truthful player selection, queue and accessible modal.
5. Build; inspect all seven required widths and multiple heights in browser via a dev-only iframe viewport harness. Check full Legacy scrolling, favourites persistence, navigation, search and player controls. Save screenshots.
6. Independent whole-branch review, correct substantive issues, publish main and verify Pages build plus public UI/assets.

Risks: Chrome cannot prove Safari/WebKit paint behavior or the ChatGPT iOS webview. Explicitly report that limit. Source image quality and resolution differ; never infer rights from image availability. Commercial catalogue references remain editorial; no recordings hosted.

Progress: initial production measured at 1363×936. Cover 17 is 500×500; nested 230×230 frame has unequal borders, making image viewport nonsquare. Fallback x-seventeen is 320×320 and is a different stylized image. Published WIU source is identical to trio (failed crop fallback). Repeated CSS visibility and compositing hotfixes do not establish iOS cause. Backup branch created at b0712bb.
