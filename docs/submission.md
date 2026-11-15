# RIMWAKE submission preparation

Status: functioning local product, not deployed, not pushed, not submitted. The owner requested local commits and a demo review first. Do not use a private or empty repository URL as evidence of publicly accessible source.

## Verified official requirements

The [current submission guide](https://www.spaceappschallenge.org/resources/project-submission-guide/) and [judging guide](https://www.spaceappschallenge.org/resources/judging-awards-guide/) were retrieved on 14 November 2026. Captured documents and hashes are recorded in `docs/research/official-2026/` and `public/data/resource-qualification.json`.

- Demo: up to seven slides including title/intro, or a video no longer than 30 seconds. A six-slide local HTML/PDF is prepared.
- Demo and final-project links must be publicly accessible without permission, registration or passwords.
- Required form fields cover project name, summary, demo link, final-project link, detailed description, SI use, NASA data and other references. Use English; non-English demo speech requires English subtitles.
- At least one NASA data source/resource is required for a Global Award. The official challenge Resources tab lists JPL Horizons System, which supplies this release's positions. This requirement is documented; overall team eligibility is not certified.
- Submission closes 15 November 2026 at 23:59 in the registered Local Event timezone. The Universal Event uses the Team Owner's local timezone. The actual registered event/timezone is still unknown.
- Registration, membership, complete fields, attestations and the actual returned **Submit for Judging** confirmation are separate requirements. None has been performed or assumed here.

## Owner gates

| Item | Status |
|---|---|
| NASA Horizons source use and official Resources listing | CONFIRMED |
| Registered team, members, selected event and timezone | UNKNOWN |
| Actual team/member names in the demo | OWNER INPUT REQUIRED |
| Independent ephemeris/frame validation | NOT RUN / OPEN |
| Public site, source and demonstration links | NOT PUBLISHED, per owner instruction |
| Anonymous access to public links | NOT RUN |
| Portal submission and receipt | NOT SUBMITTED |
| Certificate / overall award eligibility | NOT ESTABLISHED |

## Project name

RIMWAKE

## High-level summary

On the Moon, where you stand changes your view. RIMWAKE turns NASA/JPL Sun and Earth observations into a synchronized comparison of two viewpoints selected from six documented lunar locations. An immersive atlas, ninety-day archive and linked horizon charts/timelines help people compare an original mission window with a delayed one, inspect exact supported samples and export the evidence.

## Detailed description

RIMWAKE compares apparent airless centre-of-disc azimuth and signed elevation from hypothetical observers at six documented landing coordinates. A shared UTC drives every scientific reading. The separate atlas release contains 25,932 hourly body/site readings from 14 November 2026 through 12 February 2027. The original two-site release and its refined crossing example remain intact and accessible through existing links.

The flagship interaction compares a mission window with the same duration after a schedule delay. Visitors choose two viewpoints, move the original window, adjust the delay, inspect exact supported samples, filter linked timeline tracks and follow chronological crossing brackets. Globe and signed sky views share one inspection cursor. Reproducible comparison links, source-linked CSV, comparison JSON and a printable brief keep the evidence with the result. Unknown and boundary values remain distinct; no numerical positions are interpolated.

NASA NSSDCA supplies approximate historical coordinates. JPL Horizons supplies Sun/Earth positions and archived request/response lineage. The frontend verifies the release manifest and schema before displaying observations. NASA Goddard's Moon model and CGI Moon Kit imagery provide credited visual context only. Static pre-rendering improves first paint while essential results retain readable HTML and SVG alternatives.

Science is provisional. Independent astronomical-model validation and exact source-frame reconciliation remain open. Terrain obstruction, finite-disc effects, eclipses, power generation and RF-link performance are excluded. Above-plane geometry alone does not establish usable sunlight or communications.

## NASA data

JPL Horizons System, explicitly listed in the [official challenge Resources](https://www.spaceappschallenge.org/2026/challenges/lunar-landing-site-navigator/?tab=resources), is the numerical foundation. NASA NSSDCA's lunar artifact catalog supplies source coordinates. NASA SVS Moon 3D models and CGI Moon Kit supply the visual assets. Full requests, raw hashes, source assumptions and limitations are available through the instrument and downloadable evidence.

## SI / AI disclosure

The human owner supplied the project concept, goals, name and creative direction. OpenAI Codex assisted implementation, scientific-ingestion code, asset optimization, scientific and UI tests, visual review and preparation of text. NASA/JPL source observations are not generated values. The brand mark was developed using AI image generation and reconstructed as a lightweight vector. Scientific records and lunar imagery are sourced from the credited NASA/JPL archives; no generated scientific imagery, video or audio is used. The owner must review final claims and provide the actual team/member details before publication.

The implementation uses React, TypeScript, Vite, GSAP, Three.js, React Three Fiber, Drei, SVG, Zod, Python, Playwright, axe-core, Vitest and pytest. Self-hosted Barlow Condensed and IBM Plex fonts and their license notices are included. Asset/source/tool references are recorded in the source ledger.

## Local review artifacts

- `docs/demo-slides.html` and `docs/demo-slides.pdf`: six-slide review deck.
- `docs/DEMO_WALKTHROUGH.md`: short real-data demonstration sequence.
- `docs/ATLAS_IMPLEMENTATION.md`: current product, QA evidence and remaining gates.
- `docs/before-after.html`: actual rendered comparison images.

No submission, public access, independent scientific certification or award outcome is claimed.
