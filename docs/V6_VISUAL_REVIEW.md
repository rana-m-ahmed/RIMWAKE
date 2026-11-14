# Meridian Cut rendered visual review

Actual browser captures are in `docs/qa/v6/`; supplied art-direction boards remain under `design-reference/` and are not labelled browser evidence.

## Baseline

`baseline/rimwake-{1440,768,360}.png`: single-page pale/olive composition, small radial sky plots, negative elevations hidden from the graphic, scientific readings and timeline spread down the page. Source/observer caveats were useful and are retained.

## Round 1 — structural reconstruction

Captured Discover, Explore and Method at 1440×900, 768×1024, 390×844, 360×800 and 320×800. `round-1/observations.json` reports no horizontal overflow or uncaught page errors in those captures.

The rendered Discover matches the 43/57 Meridian Cut: Newsreader editorial left, cropped authentic lunar context right, a shared seam, one strong entry action and a compact process strip. Method reads as a field folio with anchored chapters. Signed A/B azimuth/elevation charts plot all actual negative values instead of hiding them. The design is identifiable without Moon artwork through its type, datum lines and comparison seam.

Observed weaknesses: Explorer vertical chrome delayed the numeric comparison; on phones the chart began below the first screen; chart captions were too small. Separate axe execution found visible-label/accessible-name mismatches in Brand and Swap.

## Round 2 — hierarchy, mobile and axis refinement

Reduced Explorer header/control spacing and desktop plot height while retaining identical calibrated signed scales. Enlarged axis and table labels. Replaced the phone’s always-expanded site controls with a working observer sheet; moved A/B tabs first and retained a sticky shared UTC/transport. The 360px screenshot now reaches the active signed chart in the initial viewport; the desktop shows all four exact readings together. No page overflow or uncaught errors at the five captured sizes.

Visible-name mismatches were corrected. The real plot remains readable at 320px because ResizeObserver gives the SVG a matching pixel-coordinate viewBox instead of shrinking desktop text. Source values snap immediately; only editorial entry/seam/sheet transitions animate.

## Final polish / evidence

Further real screenshots and final test records will be placed in `round-3/` and `final/`. Optional 3D must be opt-in, source-attributed and retain a no-WebGL fallback. Scientific chart data, glyphs and numbers never depend on it. No perfect design score or user-testing success is inferred from these technical checks.
