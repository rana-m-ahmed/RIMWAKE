# Explorer regression and accepted identity

Local production review, 15 November 2026. No push or deployment.

## Fixed Globe → Sky → Globe

The disappearance reproduced at 1440px and 390px. Both regression cases failed before the fix: returning to Globe produced no canvas. R3F intentionally loses its disposed renderer's WebGL context after unmounting. The old context-loss listener remained attached and permanently set the active Explorer's failure flag.

The listener now belongs to a mounted canvas child and is removed during cleanup before renderer disposal. Switching views can create a new renderer normally. Genuine context loss still selects the functional map/sky fallback; that existing browser test passes. Cleanup also clears the pointer cursor.

Both new regression cases exercise five round trips, alternating immediate switches with waits for asynchronous teardown. They verify the returned camera settles, source UTC stays unchanged, and another selected site works.

## Actual checks

- 43 TypeScript unit tests and 39 Python scientific tests passed in this follow-up's full check run.
- The corrected production application passes all 62 browser tests, including both new regressions, genuine context loss, unavailable WebGL, exact UTC, delayed comparisons, links/exports, stale data, integrity rejection, accessibility and legacy routes.
- Nine route/viewport cases at 1440px, 390px and 320px report no page errors or horizontal overflow. Sky and returned-Globe captures visibly retain the Moon. The logo was inspected on dark/paper surfaces and at 24/32/48/72px.
- Final production build passes. Original science remains SHA-256 `c29ea61969ba53cfcc6531288c92430330249f25caa1dc71638cb3c57ab17d32`.
- The refreshed review PDF has six pages; all six content-fit checks pass.

Evidence: [native results](qa/atlas/logo-review/results.json), [visual cases](qa/atlas/logo-review/visual-results.json), and screenshots/logs in `qa/atlas/logo-review/`, including both failing-before cases. This is bounded engineering verification, not proof that every possible interaction is bug-free. Cold performance measurements and independent ephemeris validation were not repeated; existing open gates remain.

## Accepted logo

The accepted 1254×1254 transparent PNG is retained unchanged. The production SVG reconstructs its open-rim R concept for crisp small-scale use without downloading the 512 KB raster into each header. Header, footer and favicon use the new identity.

- [Accepted original PNG](../public/assets/brand/rimwake-mark-ai.png)
- [Production SVG](../public/assets/brand/rimwake-mark.svg), [dark SVG](../public/assets/brand/rimwake-mark-dark.svg), [favicon](../public/assets/brand/favicon.svg)
- [Brand preview](rimwake-brand.html)
- [Exact initial/refinement prompts and file hashes](../public/assets/brand/generation.json)

Generation used the built-in image tool. The native SVG implements that concept; it is not an AI-generated vector. Branding is disclosed separately from unchanged NASA/JPL records and credited lunar imagery. Pre-logo assets remain recoverable in Git.
