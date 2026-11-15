# RIMWAKE source and asset ledger

Release: `rimwake-p0-20261114-v1`. Generated: 2026-11-14T06:40:47.392594Z. Model: `tangent_plane_center_airless`.

Scientific status: **provisional**. Raw-response identity and numerical parsing have been checked. No independent astronomical-model validation or frame reconciliation is claimed. Challenge Resources-tab qualification remains **unknown**.

## Lunar artifact catalog
- Publisher: NASA NSSDCA
- URL: https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_artifact_impacts.html
- Retrieved: 2026-11-14T06:39:34.654235Z
- SHA-256: `586aef752114a651b5a056299fdf2d850b6dfbb418580f49b6c099dfe70e705f`
- Raw snapshot: `science/raw/nssdca.html`
- Rights review: Scientific numerical data and cited factual coordinates; no NASA logo or third-party imagery reused.
- Challenge Resources eligibility: **unknown**

## Horizons API documentation
- Publisher: NASA / JPL
- URL: https://ssd-api.jpl.nasa.gov/doc/horizons.html
- Retrieved: 2026-11-14T06:39:41.774763Z
- SHA-256: `6ca45d9c222d6e5c425ae3e0a3c44225cf8b6d30c4a14892b0f1157b0ab4cfe4`
- Raw snapshot: `science/raw/horizons-api.html`
- Rights review: Scientific numerical data and cited factual coordinates; no NASA logo or third-party imagery reused.
- Challenge Resources eligibility: **unknown**

## Horizons system manual
- Publisher: NASA / JPL
- URL: https://ssd.jpl.nasa.gov/horizons/manual.html
- Retrieved: 2026-11-14T06:40:06.049796Z
- SHA-256: `be45b0137b37068c48760bbaf306f52a72c10239c175ba91119a30eb30612a81`
- Raw snapshot: `science/raw/horizons-manual.html`
- Rights review: Scientific numerical data and cited factual coordinates; no NASA logo or third-party imagery reused.
- Challenge Resources eligibility: **unknown**

## Observers

| Site | Latitude | East longitude | Height | Category |
|---|---:|---:|---:|---|
| Odysseus · IM-1 | -80.13 | 1.44 | 0 km, reference ellipsoid | reported_landing_position |
| Athena · IM-2 | -84.7906 | 29.1957 | 0 km, reference ellipsoid | reported_landing_position |

These are hypothetical Horizons observers using approximate reported horizontal coordinates, not the historical landers’ actual ground/antenna heights. The returned frame is MEAN_ME (high precision), source DE441, lunar radii 1737.4 km. Input catalog frame is DE421 mean-Earth/polar; exact frame equivalence has not been independently reconciled.

## Horizons runs

| Run | Retrieved UTC | Raw SHA-256 |
|---|---|---|
| im1-10-coarse | 2026-11-14T06:40:10.369603Z | `ca7463db6f5803f6e378e9ee247a9b022d48fd1b32baf2838ec91630a2121a99` |
| im1-399-coarse | 2026-11-14T06:40:21.615334Z | `7730385127f67d396d41eccaf58df2bccbcffa451e30242fc2fe7c1736f8425a` |
| im2-10-coarse | 2026-11-14T06:40:28.696074Z | `9b03af09b3002520dcb7beb1cedf9640a19937e6154e59855c9fa06dac58e2a6` |
| im2-399-coarse | 2026-11-14T06:40:31.811803Z | `19fe73513b9fdab599e940d33294740afb4711949b15e35bc29ac7b352a3dea7` |
| im1-10-refined | 2026-11-14T06:40:33.574675Z | `2cc698bae2423527276336a219a50099ca97306e58265f9072899a5107ba47ac` |
| im1-399-refined | 2026-11-14T06:40:35.444189Z | `263d15d55b2769e734d6ab273c1aec0450745c1387423221576ee5fccccbda3c` |
| im2-10-refined | 2026-11-14T06:40:37.527945Z | `a2fdec0c0b9dbe64d89862045fa17b424da5bff91a861ba57908d93e96bd3cd6` |
| im2-399-refined | 2026-11-14T06:40:42.909545Z | `87a017bf2c4863850f739a20f813ae78bb4b93c18cd5535a6066dba4c158929a` |
| im1-10-check | 2026-11-14T06:40:44.714659Z | `f26c4bd39fdcd04a1074a62bf37f9dc798744fb6918cc6b793904f7d1feb9334` |
| im2-10-check | 2026-11-14T06:40:47.390594Z | `f91c8284d4aeed3542362a8d51b45d89e90a39f540cc3569f1e1e42ea7984971` |

Exact query URLs, parameters, header settings and raw file paths are recorded in `public/data/release.json`. All raw data are in `science/raw/` and the downloadable evidence archive.

## Current cinema assets and tools

- Original wordmark, signed reference planes, calibrated SVG plots, compass and concept graphics are created in code. No NASA logo or generated image is used.
- NASA Goddard Moon model: https://svs.gsfc.nasa.gov/14959/ ; production Dan Gallagher, data Ernie Wright / LRO. Original source GLB: 13,799,876 bytes, SHA-256 `12d3b0bb7fe214903f51447d1bc61710f442e92a11c703fcaca6d4e7ff8e67d4`. Shipped GLB: 2,007,328 bytes, SHA-256 `a710b32e92ced4942501cd3f591c880cb7726a0a0b9b27d35b94bbcd82f83d50`. All geometry buffers preserved; embedded color map resized to 4096x2048 WebP quality 88. Reproduction: `scripts/optimize_moon.py`. Download and transform metadata: `public/assets/cinema-provenance.json`.
- NASA SVS / Ernie Wright, LRO / LROC / LOLA, CGI Moon Kit: https://svs.gsfc.nasa.gov/4720/ . Mobile color sphere and fallback poster use the existing verified map; original transformation hashes remain in `public/assets/visual-provenance.json`. Polar regions include lower-resolution albedo fill.
- The globe is color-only visual context. Camera and lighting are illustrative, not an ephemeris or DEM. Terrain gating is unchanged. A color map never enters the scientific model.
- Self-hosted Barlow Condensed 600, IBM Plex Sans 400/500/600, IBM Plex Mono 400 via Fontsource; SIL Open Font License notices in `public/licenses/`. Earlier font notices are retained for historical releases.
- React / React DOM, Three.js, React Three Fiber and Drei (MIT); Vite (MIT), TypeScript (Apache-2.0), Zod (MIT), GSAP / @gsap/react (GreenSock standard license). Exact versions and transitive notices remain in `package-lock.json` and installed package license files.
- Playwright, axe-core, Vitest, pytest and Prettier provide local checks. This is an independent educational project. No soundtrack is used.
- OpenAI Codex assisted design, code, asset preparation, ingestion, tests and copy. Human creative direction and final submission remain with the owner. NASA/JPL source use does not imply endorsement.

## Documentary qualification update

Official 2026 challenge Resources lists Horizons System. The current submission guide requires at least one NASA source/resource; this project uses JPL Horizons numerical output. Captured official Resources, judging and submission guides are in `docs/research/official-2026/`, with capture times and snapshot hashes in `public/data/resource-qualification.json`. This does not certify team or award eligibility. Frozen release-time qualification flags remain unchanged. The official demo limit is seven slides including title or a video of at most 30 seconds.

The mobile fallback poster is a deterministic 640 px WebP derivative of the existing credited poster, 31,236 bytes. Its SHA-256 and transformation are in `public/assets/visual-provenance.json`; no generated imagery is used. Desktop asset source retrieval time and later optimization time are separate fields.

Opening-frame handoff update: desktop/mobile posters are captured from the actual initialized NASA scenes, at 1440x900 and 390x844, encoded WebP quality 84 (68,790 and 19,556 bytes). Source asset identities and output hashes are in `cinema-provenance.json`. Reproduction starts with `node scripts/render_opening_posters.mjs`; GPU/compositor differences can change encoded pixels, so provenance records actual resulting hashes. These are rendered visual-context frames, not generated science or terrain results.
## Mission atlas addition / 15 November 2026

The separate release `rimwake-p0-atlas-20261115-v1` contains 25,932 hourly positions for six hypothetical observers at documented landing coordinates. Its range is 14 November 2026 through 12 February 2027, inclusive. NASA NSSDCA is the coordinate source; JPL Horizons is the position source. `public/data/atlas/index.json` lists the per-site hashes and exact source frame caveat; each bundle lists query URLs, raw SHA-256, response signature and original retrieval time. The live response signature 1.2 differs from the current documentation label 1.3 and is explicitly reviewed through observer/target/frame/column/time-grid checks. Scientific status remains provisional.

Six historical LROC site images/previews are sourced from NASA/GSFC/Arizona State University. Originals are retained under `science/raw/atlas-visual/`; display derivatives and credits are recorded in `public/assets/atlas-sites/provenance.json`. They never determine selected-date lighting or computed horizon states. The two Apollo images are official 200px previews with links to full-resolution source pages.

The earlier source/archive entries are retained historical records. The original P0 release, its raw source files and evidence ZIP remain unchanged.

## Accepted RIMWAKE brand / 15 November 2026

The owner accepted an AI-generated open-rim R symbol. The original transparent PNG is retained unchanged at `public/assets/brand/rimwake-mark-ai.png`. Its production SVG, dark variant and favicon reconstruct that concept as small native vectors. Exact prompts, generation disclosure and file hashes are in `public/assets/brand/generation.json`. Only the branding is AI-generated; NASA/JPL scientific records and credited lunar imagery are unchanged. Earlier no-generated-image statements describe the preceding release.
