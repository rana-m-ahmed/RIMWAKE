# RIMWAKE

An immersive lunar atlas for comparing what a changed mission date does to the geometric Sun/Earth conditions at two places. Six documented landing coordinates, a ninety-day archived JPL dataset, original/delayed window summaries, signed horizon charts, linked timelines and source-traceable exports.

Current interface: **Mission Atlas**. Four destinations: Experience `/`, Explorer `/explore`, Field Guide `/field-guide`, Sources `/sources`. `/method` remains a compatibility alias. [Implementation, evidence and remaining gates](docs/ATLAS_IMPLEMENTATION.md).

The owner authorized GitHub publication on 15 November 2026. Website deployment remains separate and has not been performed. The original scientific release is immutable. Complete pre-atlas recovery: `rimwake-pre-atlas` at `38998a4`; active branch: `design/mission-atlas`.

[Complete standalone NASA Space Apps project report](RIMWAKE_COMPLETE_PROJECT_REPORT.md).

## Start locally

Package root: `D:\Horizon`. Tested with Node 26.2.0, npm 11.13.0 and Python 3.12.10. Exact JavaScript dependencies are pinned by `package-lock.json`.

```powershell
npm.cmd ci
npm.cmd run dev
```

Open http://127.0.0.1:5173. For a production preview:

```powershell
npm.cmd run build
npm.cmd run preview -- --port 4175
```

The app is static and needs no API keys, database, account or runtime JPL requests. Deployable output is `dist/`; no deployment has been authorized under the latest local-only instruction. Use HTTPS for deployment because release integrity checks use Web Crypto (localhost also qualifies).

## Verify

```powershell
python -m pip install -r science/requirements.txt
npm.cmd run typecheck
npm.cmd run test
python -m pytest science/tests
python scripts/check_release.py
python scripts/check_atlas_archive.py
npm.cmd run build
$env:RIMWAKE_BASE_URL = 'http://127.0.0.1:4175'
npx.cmd playwright test
python scripts/check_cinema_integrity.py
```

Browser tests use installed Google Chrome. If necessary, set `$env:PLAYWRIGHT_CHANNEL = 'msedge'` for installed Edge. Browser automation is local and does not open personal browser profiles. Scientific tests operate on archived responses and require no network.

## Product review

Open the production preview and choose **Open the mission atlas**. The initial scenario compares seven days at Odysseus and Athena, then applies a 72-hour delay. Pick another site, edit the window, inspect a shared UTC, or export the comparison and its source samples. **Evidence & limits** explains exactly what is modeled.

[Current implementation and QA record](docs/ATLAS_IMPLEMENTATION.md), [measured performance and open targets](docs/ATLAS_PERFORMANCE.md), [actual before/after captures](docs/before-after.html), and [six-slide review deck](docs/demo-slides.pdf). Historical cinema and Meridian Cut reports remain in `docs/` and are not current atlas acceptance records.

## Preserved original scientific release

`rimwake-p0-20261114-v1`: 841 hourly UTC timestamps from 14 November to 19 December 2026, inclusive. Two locations × two bodies = 3,364 coarse readings. The first discovered crossing in processing order was refined at 10-minute steps, adding 28 readings. This choice is disclosed and is not a claim that the selected crossing is the earliest chronological event or representative of every lunar location.

Source coordinates: NASA NSSDCA’s lunar artifact catalog. Ephemerides: JPL Horizons, Sun 10 and Earth 399, Moon 301, user-defined geodetic observer, east-positive longitude, 0 km reference-ellipsoid height, apparent airless centre-of-disc azimuth/elevation. Returned frame: MEAN_ME (high precision); ephemeris DE441.

**Scientific status: provisional.** Raw source/hash/observer/target/time/cadence and derived-state tests pass. Separately requested initial Sun rows at both sites match (0° reported difference); this is query/parse consistency, not an independent ephemeris validation. Exact source-frame reconciliation remains open. Neither observer reproduces a real lander’s antenna or terrain height. Terrain, finite-disc visibility, eclipses, power and RF performance are excluded.

The frontend checks the release SHA-256 against its manifest and validates the scientific schema before showing any readings. A missing or invalid release fails closed. Null angles classify as unknown, never as zero. No sampled position is interpolated. Spatial directions use north 0 degrees, east 90 degrees clockwise, with signed elevation preserved. Negative directions remain below the reference plane. A calibrated SVG view remains available; reduced motion, missing WebGL or context loss selects it automatically.

The epsilon of 0.000001° is only a numerical state-classification tolerance, not physical uncertainty. Interval exports use inclusive sampled endpoints; crossing times remain bracketed. The Loom displays sampled states, not continuous availability guarantees.

### Reproduce ingestion deliberately

```powershell
python science/pipeline.py
python scripts/check_release.py
python scripts/inventory.py
```

This fetches JPL/NASA data and replaces the working release. Preserve the existing immutable release before refreshing; assign a new release ID in `science/pipeline.py` for a new scientific release. Normal installation/build/test never refreshes scientific values. Re-fetching later may change raw response text and metadata even when angle values agree.

## Historical cinema verification

For the current product use `python scripts/run_checks.py atlas`. The older `python scripts/run_checks.py product` retains native exit codes and logs in `docs/qa/cinema/product-final/`. `node scripts/cinema_visual.mjs` captures all four routes at five widths; set `QA_ROUND` to retain another iteration. `node scripts/measure_cinema.mjs` runs twelve cold local production-preview measurements on port 4175. The preview must be serving an already completed build; do not rebuild during measurement.

3D is a progressively enhanced, on-demand renderer. It uses real released azimuth/elevation for reference-plane views. The Moon globe, lighting and camera journey provide visual context and never calculate terrain obstruction. Mobile uses the smaller NASA color map on a sphere. The desktop GLB is 2.007 MB; mesh buffers are unchanged. Source/transform hashes and credits are in `public/assets/cinema-provenance.json`.

## Artifacts and boundaries

- [Current validation results](docs/qa/atlas/final/results.json) and [visual review record](docs/qa/atlas/README.md)
- [Source and asset ledger](docs/source-ledger.md), including actual raw hashes and retrieval times
- [Submission copy and remaining owner gates](docs/submission.md)
- [Six-slide local demo](docs/demo-slides.html), with PDF alongside it
- `public/data/release.json`, manifest, sampled intervals and downloadable raw evidence ZIP
- `science/raw/`: original full NASA/JPL responses; `science/tests/`: integrity and fault-injection checks
- [Architecture](docs/architecture.md) and [measured local performance](docs/qa/atlas/performance/summary.json)

Configured private remote: https://github.com/rana-m-ahmed/RIMWAKE. GitHub publication was authorized by the owner on 15 November 2026. Repository publication does not deploy the website. Public availability, anonymous deployed-URL tests, overall team/event eligibility and portal submission remain unverified. No certificate or award eligibility is claimed. P1 terrain work requires explicit owner approval after a stable deployed P0.
