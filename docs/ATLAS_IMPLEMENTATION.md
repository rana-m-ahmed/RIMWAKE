# RIMWAKE mission atlas

Current local product: an immersive geographic workspace for comparing two mission windows. No push, deployment or submission is performed. Review at http://127.0.0.1:4175 and http://127.0.0.1:4175/explore .

## The completed workflow

Select A/B from six documented landing coordinates, choose an exact UTC start and a 1/3/7/14-day or custom hourly window, and compare it with the same window after a schedule slip. The original and delayed summaries are visible together. The atlas, focused horizon chart and exact angle readings always use one active inspection UTC.

The default seven-day example starts 14 November 2026 and shifts by 72 hours. Its hourly joint-above counts are 117/169 to 169/169 at Odysseus and 165/169 to 169/169 at Athena. These are sampled geometric classifications. They do not establish uninterrupted sunlight, usable power or a communication link.

The linked timeline supports archive-window movement, elapsed-hour inspection, discrete playback, condition filters, zoom and chronological crossing brackets. Camera movement lasts 750 ms; numerical values never interpolate. The globe uses credited NASA imagery and illustrative lighting. Its pins use longitude zero at texture centre, east-positive X and north-positive Y; a map/list remains available without WebGL.

The six-act landing now follows place, horizon, baseline window, schedule slip and a handoff into that same comparison state. The story loads its scientific bundles when the explanatory chapters are reached. Optional historical LROC images and Apollo previews are distinct from selected-date lighting. The image sources, original hashes and transformations are in `public/assets/atlas-sites/provenance.json`.

## Scientific archive and compatibility

`rimwake-p0-atlas-20261115-v1` contains 25,932 hourly readings: six sites, two bodies and 2,161 UTC endpoints from 14 November 2026 through 12 February 2027, 00:00 UTC. The master index and per-site bundles have SHA-256 manifests. Worker validation checks release/site/target/run identity, model, coordinates, complete cadence, finite signed angles and quality state before returning an analysis. Stale worker replies are discarded. Only selected sites load initially; their compressed default-pair payload is about 159 KB over the measured preview connection.

The live API returned signature 1.2 while the current API documentation is labeled 1.3. This difference is recorded explicitly. Response headers, airless apparent azimuth/elevation columns, Moon centre, MEAN_ME frame, observer coordinates and the full UTC grid were reviewed and checked. Northern-site responses express zero observer height as approximately -4.3e-13 km; the parser now accepts scientific notation while retaining the existing coordinate tolerance. This is parsing roundoff, not an introduced observer height.

Science remains provisional. Independent ephemeris validation and exact coordinate-frame reconciliation are open. Terrain obstruction, finite discs, eclipses, solar-array yield and RF-link performance are excluded. The 1e-6-degree epsilon is a numerical classification tolerance, not physical uncertainty.

The original `rimwake-p0-20261114-v1` release remains byte-identical, SHA-256 `c29ea61969ba53cfcc6531288c92430330249f25caa1dc71638cb3c57ab17d32`. Original raw responses and evidence ZIP remain unchanged. Existing full observation URLs and the two named investigations still open the preserved Explorer. `?legacy=1` is an explicit compatibility entry. The default `/explore` opens the atlas. A common initial route shell avoids query-dependent hydration mismatches.

Window summaries include both endpoints: seven days contain 169 hourly samples. Unknowns break runs and suppress comparative verdicts. Boundary states never count as above. Run spans measure sampled endpoints, not continuous availability; a single point spans zero hours. Zero delay, same-site comparisons and unsupported date ranges have explicit outcomes.

## Implementation and review artifacts

- Pure comparison engine, typed request/summary model, worker validation and loaders: `src/atlas/`.
- Exact observation links retain their release. New links encode schema v2, release, sites, window, delay, active scenario, elapsed cursor, focused site, layer and view.
- Exports: comparison JSON, source-linked samples CSV, copy/manual-copy URL and a native printable brief. No runtime external science service or backend is required.
- Runtime data acquisition is confined to the explicit preparation script; tests and builds do not fetch new ephemerides.
- Source equality: `scripts/check_atlas_archive.py` reparses every raw response and compares every published record, then checks image provenance and the frozen original release.
- Verification logs and native exit codes: `docs/qa/atlas/final/`.
- Screenshot iterations: `docs/qa/atlas/round-1/`, `round-2/` and subsequent numbered passes where needed.
- Performance measurements: `docs/qa/atlas/performance/`, with exact lab profile and recorded misses; interpretation in [ATLAS_PERFORMANCE.md](ATLAS_PERFORMANCE.md).

### Reproduce

```powershell
npm.cmd ci
npm.cmd run build
npm.cmd run preview -- --port 4175 --strictPort
```

In another terminal:

```powershell
$env:RIMWAKE_BASE_URL = 'http://127.0.0.1:4175'
python scripts/run_checks.py atlas
node scripts/atlas_visual.mjs
```

To deliberately prepare the same separate archive from retained responses, run `python scripts/build_atlas_archive.py`. Saved receipts preserve retrieval times and the generated index timestamp; missing source responses trigger network acquisition. Use a new release identity for a future scientific refresh. Do not overwrite a published archive under the same ID.

Photo preparation is separate: install `scripts/requirements-assets.txt`, then run `python scripts/prepare_atlas_photos.py`. Existing matching provenance preserves the actual original retrieval time. A retained original without matching provenance fails rather than treating checkout modification time as retrieval. The normal build never runs either acquisition script.

## Actual refinement and outstanding gates

The first browser passes caught duplicate development-worker startup, focus loss after choosing a UTC while its trigger was temporarily disabled, timeline/chapter accessible-name mismatches and transient contrast loss during sheet opacity animation. Corrected worker creation/cleanup, restored focus only after the matching result arrives, used native timeline names, included visible chapter numbers, and retained transform-only sheet motion. A camera-settled marker makes the GPU-idle test observe the end of the actual flight rather than assume a fixed startup delay.

The first screenshot pass exposed overly small SVG text, a buried comparison result, a wrapped mobile headline and one blank capture during concurrent hot reload. The horizon now sizes its coordinate system to its actual display width, the outcome precedes the atlas, phone settings/catalogs expand on demand, and final captures use the completed production build. Retained before captures are evidence of those issues, not final acceptance screenshots.

Final verification: 43 TypeScript unit tests, 39 Python scientific tests and 60 production browser tests passed. Automated axe checks cover all four routes plus flagship phone/desktop and dialog states. The four screenshot iterations end with 73 PNGs across six widths; all 24 final route reports show no horizontal overflow or page errors. The generated demonstration PDF contains six pages and passes all six slide-content fit checks. Photo preparation reproduces identical derivatives and provenance; every new observation is rechecked against its raw source, and the original scientific bytes remain unchanged.

The final mobile lab profile meets LCP and layout-shift targets. Four-second first-verified Explorer readiness and the 200 KB normal-motion JavaScript budget remain open; exact measurements, enhancement costs and probe limits are recorded in [the performance report](ATLAS_PERFORMANCE.md). The local product is ready for owner review, with those acceptance gaps disclosed.

Five unfamiliar-user sessions have not been conducted. Automated task journeys and engineering review do not prove the first-minute comprehension target. Owner review remains open. Independent scientific/frame validation, terrain extensions, actual team/member information, public publication and portal submission remain later gates. No award outcome is claimed.

## Recoverability

The implementation started from local commit `38998a4`, preserved by `rimwake-pre-atlas`; all earlier recovery tags remain. Active branch: `design/mission-atlas`. The finished review checkpoint is tagged `rimwake-mission-atlas-local`. Local commits only; nothing is pushed or deployed.
