# RIMWAKE product transformation

The application remains in the existing repository. No push, deployment or portal submission has been performed. Local production preview: http://127.0.0.1:4175 . Development server: http://127.0.0.1:5173 .

## Recoverability

- Original working release: `release/r0-snapshot`; pre-v6: `rimwake-pre-v6`.
- Complete pre-cinema worktree: `rimwake-pre-cinema`, commit `3646311`.
- Complete cinematic checkpoint before discovery expansion: `rimwake-cinema-checkpoint`, commit `1b16680`.
- Current branch: `design/lunar-cinema`. All commits local.

## Working feature matrix

| Capability | Implementation | Evidence |
|---|---|---|
| Silent six-chapter lunar story | Working; native scrolling, direct Explorer entry, real crossing handoff | Route/story/browser tests; final screenshots |
| NASA lunar visuals | Desktop 4096x2048 texture GLB, 2,007,328 bytes; mobile sphere and matched 19,556-byte opening poster | Source/transform hashes; geometry-buffer integrity checks |
| Synchronized local skies | Actual released azimuth/elevation; signed 3D direction with readable overlays; calibrated SVG alternative | Four-reading source equality and projection tests |
| Shared temporal controls | One exact UTC, keyboard/native slider, previous/next, swap, supported refinement and crossing brackets | Browser tests |
| Geographic site selection | Source-coordinate south-polar orthographic graticule; A/B assignment and native selectors | Cardinal/pole unit tests; map interaction/accessibility tests |
| Guided Discovery | Two real-data investigations, seven steps each; back/next, evidence, resume and free exploration | Complete guided browser investigation |
| Find a moment | Real sampled runs for joint/contrasting states; crossing brackets; unknown and empty states | Full-window run unit tests; finder browser tests |
| Horizon Loom | Visible default, exact sampled cells batched into SVG paths, explicit released crossing outlines | Shared selection/expanded accessibility checks |
| Comparison interpretation | Body-specific B-minus-A differences, honest same/unknown/boundary states | Fault injection and comparison tests |
| Deterministic links | Release, sites, cadence, exact UTC and view; valid state takes precedence; invalid state rejected | URL round trips, refresh, invalid-UTC tests |
| Exports | Four-row CSV, source-linked text summary, copy/download and manual clipboard fallback | Source equality unit tests; actual browser download |
| Evidence and Sources | In-place selected records; hashes, queries, observer assumptions, separate documentary resource qualification | Modal/keyboard tests; archived official guides |
| Progressive rendering | Static pre-rendered routes hydrated in place; no-JS first-screen content; delayed optional GPU enhancement | Production hydration/no-JS tests |
| Failure and accessibility paths | Missing/corrupt releases, retry, no WebGL, reduced motion, context loss, failed assets, focus restoration | Browser fault injection and axe checks |

## Scientific invariants

The release remains `rimwake-p0-20261114-v1`, SHA-256 `c29ea61969ba53cfcc6531288c92430330249f25caa1dc71638cb3c57ab17d32`. All original raw source bytes and the original evidence ZIP are preserved. Validation is now read-only. `scripts/package_evidence.py` explicitly writes a separate deterministic archive under ignored `deliverables/`, rather than rewriting the frozen public archive.

No new ephemeris values, interpolation, observer heights, terrain horizon, power result or RF-link result was introduced. Source integrity is verified; scientific status stays provisional. Independent ephemeris validation and exact frame reconciliation remain open. The source-backed observers are hypothetical, at approximate published landing coordinates and zero reference-ellipsoid height.

## Visual refinement record

1. Cinematic rounds 1-3 fixed leaked hidden labels, story/diagram overlap, mobile framing and portal cleanup. Retained under `docs/qa/cinema/round-*`.
2. Product pass 1 exposed tiny labels, empty initial 3D frames, duplicate cadence controls, map contrast/name failures and a heavy SVG timeline. Corrected camera orientation, pixel-sized overlays, control hierarchy, accessible map text and SVG batching.
3. Product pass 2 reorganized the Explorer so all four desktop readings fit the first screen, moved UTC above the views, simplified repeated copy, improved map layout and tested real-data discovery on phones.
4. A third product pass caught a double-Moon loading handoff. Corrected bounding-box diameter normalization and initial demand-frame setup; captured matching desktop/mobile opening stills (68,790 / 19,556 bytes), preserving the observed before image in `product-3/`.
5. Final production pass retains all routes at 1440, 768, 390, 360 and 320 px, plus map, finder, export, evidence, before/after threshold and calibrated/timeline states. Final artifacts: `docs/qa/cinema/product-final-visual/`.

The review is an engineering/visual inspection, not an independent human usability study. Owner review and first-time-user comprehension testing remain outstanding.

## Verification and performance

`docs/qa/cinema/product-final/results.json` contains actual command exit codes; individual logs retain counts and failures if any. `docs/qa/cinema/performance-final/cold-runs.json` contains twelve cold local production-preview runs, actual Content-Encoding, LCP, CLS and script-to-two-frame sample diagnostics. These are laboratory measurements, not field INP or a deployed-host guarantee. Performance results are summarized separately after the final run.

## Reproduce and review

```powershell
npm.cmd ci
npm.cmd run build
npm.cmd run preview -- --port 4175 --strictPort
```

In a second terminal:

```powershell
$env:RIMWAKE_BASE_URL = 'http://127.0.0.1:4175'
python scripts/run_checks.py product
$env:QA_ROUND = 'product-final-visual'
node scripts/cinema_visual.mjs
node scripts/product_visual.mjs
node scripts/measure_cinema.mjs
```

The build pre-renders route shells; scientific observations still load and verify in the browser. Static hosts must serve the dedicated `explore.html`, `field-guide.html` and `sources.html` at their matching paths. `vercel.json` and local preview middleware provide those mappings. HTTPS is required outside localhost for Web Crypto.

## Owner review and genuinely unfinished gates

- Review the complete local product, including the two investigations, phone layout and exports.
- Independent astronomical/frame validation and validated terrain remain scientific extensions; they are not represented as complete.
- Registered team, actual member names, event and applicable event timezone are unknown. Add the actual team information before publishing the demonstration.
- Official NASA-resource use is confirmed separately in `/data/resource-qualification.json`; overall Global Judging eligibility is not established.
- Public source/site/demo access and submission are not completed under the local-only restriction. Publication, final portal attestations and submission remain later owner actions.
- Six-slide PDF/HTML and a short walkthrough are local review materials. No video, external upload or submitted receipt is claimed.
