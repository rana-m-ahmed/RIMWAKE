# RIMWAKE submission preparation

Status on 14 November 2026, Asia/Karachi: **local P0 application; not submitted; not deployed**. The owner explicitly requested local commits only and no push. The private GitHub repository exists but is intentionally empty remotely. Do not put that empty/private URL in a public submission as if it contains accessible source.

## External gates

| Gate | Actual status | Next owner action |
|---|---|---|
| Registered team/event/timezone | UNKNOWN | Supply team/event URL and confirm applicable event timezone |
| Exact selected challenge | Proposed: Lunar Landing Site Navigator | Confirm challenge on team page |
| Challenge Resources-tab NASA source actually used | UNKNOWN | Open specific Resources tab and identify a qualifying used source; no Global Awards claim until verified |
| Current official guide/portal fields and deadline | UNKNOWN | Read current guide and actual Project tab |
| Public source/site/demo | NOT PUBLISHED, per user restriction | Owner authorizes publication when ready; then test anonymously |
| Portal submitted state | NOT SUBMITTED | Complete submission and retain returned confirmation/status screenshot |
| Certificate / Global Awards eligibility | NOT ESTABLISHED | Depends on external registration, rules and completed submission |

Live verification attempted: official [event](https://www.spaceappschallenge.org/2026/) and [challenge](https://www.spaceappschallenge.org/2026/challenges/lunar-landing-site-navigator/) pages returned gateway/time-out errors to the research tool. Do not treat those failed fetches as proof that the public service is globally unavailable.

[NASA GO Team discussion 1827](https://github.com/nasa/spaceapps/discussions/1827) is available and discusses event start and NASA Resources requirements. [Discussion 1973](https://github.com/nasa/spaceapps/discussions/1973) contains a community answer describing a public video of at most 30 seconds or at most seven slides, English submission and AI disclosure. This is **not a verified replacement for the actual guide/portal**. The six-slide local deck fits that reported slide cap, pending portal confirmation. Dates/deadlines in the original brief are not independently re-certified here.

## Paste-ready title

RIMWAKE — Two places. One lunar sky.

## Short summary

RIMWAKE is an independent educational lunar visibility explorer. It compares sampled Sun and Earth positions from two documented southern lunar locations on one UTC clock, using NASA NSSDCA coordinates and archived JPL Horizons output. Calibrated sky plots, numerical readings and a Horizon Loom make geometric differences visible, while an evidence register exposes the source trail and model limits.

## Description

Choosing a lunar location also means choosing a view of the Sun and Earth. RIMWAKE makes that geometry inspectable. Users select two approximate published landing locations, move through a shared hourly UTC scan and compare apparent airless centre-of-disc azimuth and elevation relative to a local geometric tangent plane. The same selected sample drives both sky plots, the tables and the availability timeline.

The current release covers 14 November through 19 December 2026, inclusive, with 3,364 hourly body/site readings. Eight coarse crossing brackets occur across the two sites. The first crossing in processing order was refined to ten-minute steps, producing a Sun-rise bracket at the IM-1 coordinate observer between 03:30 and 03:40 UTC on 16 November. These are modelled hypothetical observers, not actual lander instrumentation. A no-crossing case is displayed honestly when the selected sites/window contain none.

NASA NSSDCA supplies the approximate historical horizontal coordinates. JPL Horizons supplies the Sun and Earth positions. Full source responses, exact queries, hashes, retrieval timestamps and parsing lineage are retained and downloadable. The frontend validates the release schema and SHA-256 manifest before presenting measurements.

Science remains provisional. Independent ephemeris validation and exact frame reconciliation have not been completed. The release excludes local lunar terrain, finite-disc effects, eclipses, power generation and radio-link performance. Geometric visibility is not a guarantee of usable light or communications. The project is independent and does not imply NASA endorsement.

## NASA-data explanation

The [NSSDCA lunar artifact catalog](https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_artifact_impacts.html) grounds two approximate horizontal positions: IM-1 at −80.13°, 1.44° east and IM-2 at −84.7906°, 29.1957° east. [JPL Horizons](https://ssd-api.jpl.nasa.gov/doc/horizons.html) generates Moon-observer apparent airless azimuth/elevation, with exact observer assumptions shown in the evidence register. Challenge Resources-tab qualification of these sources remains unverified.

## Tools / AI disclosure

OpenAI Codex assisted with implementation, data-ingestion scripts, tests, visual review and preparation of this description. The project uses React, Vite, TypeScript, Zod, Python Requests, pytest, Vitest, Playwright, axe-core, Prettier, DM Sans and IBM Plex Mono. No generated imagery is used. Source/asset rights and versions are documented in the source ledger and lockfiles. The owner reviews and submits the final project.

## 30-second demonstration outline

| Time | Demonstrate only implemented behavior |
|---|---|
| 0–5 s | RIMWAKE wordmark and “Two places. One lunar sky.” |
| 5–13 s | Shared UTC slider changes both source-backed sky plots and exact numeric readings |
| 13–21 s | Select ten-minute detail; step through the real 16 November crossing bracket, explaining that exact crossing time is unresolved |
| 21–27 s | Open evidence: NASA/JPL sources, hypothetical observer and geometric-only model |
| 27–30 s | State educational purpose and show the real public URL only after publication |

The local six-slide HTML/PDF is an alternative to a video, not evidence that media has been uploaded or accepted. Final portal text must not claim deployment, independent science validation, terrain modelling or completed submission until those facts exist.

## Scope decision

**LIMITED GO**: local integrity and interaction checks support finishing this educational P0. Public deployment is withheld by owner instruction; independent science/frame checks and challenge-source qualification remain open. P1 terrain is not authorized and has not started.
