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

## Assets and tools

- Original wordmark, calibrated sky plots and interface vectors were created in code. No NASA logo, third-party photos or generated images are used.
- DM Sans and IBM Plex Mono are locally bundled through Fontsource. Their SIL Open Font License files are distributed in `public/licenses/`.
- React and React DOM (MIT), Vite (MIT), TypeScript (Apache-2.0), Zod (MIT); development tools Vitest (MIT), Playwright (Apache-2.0), axe-core (MPL-2.0), Prettier (MIT). Exact versions are locked in package-lock.json.
- Python Requests (Apache-2.0), pytest (MIT); requirements are pinned in science/requirements.txt.
- OpenAI Codex assisted with planning, code, scientific ingestion, tests, visual review and submission copy. The owner must review final claims and submit.
- NASA/JPL data use does not imply endorsement. This is an independent educational project.
