# RIMWAKE

Independent educational lunar visibility explorer with NASA/JPL evidence. Two approximate historical lunar landing locations share a UTC cursor, calibrated sky plots, exact angle tables and a sampled availability timeline.

The original v4 briefs in `docs/` use former HORIZON / CAUSE branding, superseded by RIMWAKE. Work is local; source must not be pushed under the current user instruction.

## Start locally

Package root: `D:\Horizon`. Tested with Node 26.2.0, npm 11.13.0 and Python 3.12.10. Exact JavaScript dependencies are pinned by `package-lock.json`.

```powershell
npm.cmd ci
npm.cmd run dev
```

Open http://127.0.0.1:5173. For a production preview:

```powershell
npm.cmd run build
npm.cmd run preview -- --port 4173
```

The app is static and needs no API keys, database, account or runtime JPL requests. Deployable output is `dist/`; no deployment has been authorized under the latest local-only instruction. Use HTTPS for deployment because release integrity checks use Web Crypto (localhost also qualifies).

## Verify

```powershell
python -m pip install -r science/requirements.txt
npm.cmd run typecheck
npm.cmd run test
python -m pytest science/tests
python scripts/check_release.py
npm.cmd run build
npx.cmd playwright test
```

Browser tests use installed Google Chrome. If necessary, set `$env:PLAYWRIGHT_CHANNEL = 'msedge'` for installed Edge. Browser automation is local and does not open personal browser profiles. Scientific tests operate on archived responses and require no network.

## Scientific release

`rimwake-p0-20261114-v1`: 841 hourly UTC timestamps from 14 November to 19 December 2026, inclusive. Two locations × two bodies = 3,364 coarse readings. The first discovered crossing in processing order was refined at 10-minute steps, adding 28 readings. This choice is disclosed and is not a claim that the selected crossing is the earliest chronological event or representative of every lunar location.

Source coordinates: NASA NSSDCA’s lunar artifact catalog. Ephemerides: JPL Horizons, Sun 10 and Earth 399, Moon 301, user-defined geodetic observer, east-positive longitude, 0 km reference-ellipsoid height, apparent airless centre-of-disc azimuth/elevation. Returned frame: MEAN_ME (high precision); ephemeris DE441.

**Scientific status: provisional.** Raw source/hash/observer/target/time/cadence and derived-state tests pass. Separately requested initial Sun rows at both sites match (0° reported difference); this is query/parse consistency, not an independent ephemeris validation. Exact source-frame reconciliation remains open. Neither observer reproduces a real lander’s antenna or terrain height. Terrain, finite-disc visibility, eclipses, power and RF performance are excluded.

The frontend checks the release SHA-256 against its manifest and validates the scientific schema before showing any readings. A missing or invalid release fails closed. Null angles classify as unknown, never as zero. No sampled position is interpolated. Above-horizon markers use north 0°, east 90° clockwise; below-horizon bodies are shown numerically rather than clamped onto the sky ring.

The epsilon of 0.000001° is only a numerical state-classification tolerance, not physical uncertainty. Interval exports use inclusive sampled endpoints; crossing times remain bracketed. The Loom displays sampled states, not continuous availability guarantees.

### Reproduce ingestion deliberately

```powershell
python science/pipeline.py
python scripts/check_release.py
python scripts/inventory.py
```

This fetches JPL/NASA data and replaces the working release. Preserve the existing immutable release before refreshing; assign a new release ID in `science/pipeline.py` for a new scientific release. Normal installation/build/test never refreshes scientific values. Re-fetching later may change raw response text and metadata even when angle values agree.

## Artifacts and boundaries

- [Validation record](docs/validation.md) and [visual review](docs/visual-qa.md)
- [Source and asset ledger](docs/source-ledger.md), including actual raw hashes and retrieval times
- [Submission copy and remaining owner gates](docs/submission.md)
- [Six-slide local demo](docs/demo-slides.html), with PDF alongside it
- `public/data/release.json`, manifest, sampled intervals and downloadable raw evidence ZIP
- `science/raw/`: original full NASA/JPL responses; `science/tests/`: integrity and fault-injection checks
- [Architecture](docs/architecture.md) and [measured local performance](docs/performance.json)

Private remote: https://github.com/rana-m-ahmed/RIMWAKE. It is intentionally empty. All implementation commits are local. Public availability, anonymous deployed-URL tests, official challenge Resources eligibility and portal submission remain unverified. No certificate or award eligibility is claimed. P1 terrain work requires explicit owner approval after a stable deployed P0.
