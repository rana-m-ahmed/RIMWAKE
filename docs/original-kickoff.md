# CODEX KICKOFF v4.0 — HORIZON / CAUSE: THE SHADOW WITNESS
## Build the best small scientific experience we can honestly submit

**Read first:** `HORIZON_CAUSE_v4_Master_Execution_Plan.md` is the authoritative scientific, product, timing and quality contract. Previous plans are historical reference material only. We are already within the NASA Space Apps 2026 event development period; the owner must still confirm their registered event and time zone.

---

## Your role

Act as the combined principal creative director, senior frontend engineer, NASA/JPL data integrator, test automation engineer and skeptical scientific QA reviewer. **Execute code and tests, not another general plan.** You may propose alternatives only when they reduce verified risk. Work autonomously within the P0 scope; stop only for real permission/account dependencies or material scientific blockers, in which case implement the defined truthful fallback.

One human directs you. Other agents/worktrees are optional—use them only if actually available and conflicts can be controlled. Optimize for a **complete public website in roughly five focused hours**, with scientific legitimacy and strong award-upgrade potential; no silent scope growth.

## Objective and creative standard

Build **HORIZON / CAUSE**, an independent educational site/date lunar visibility explorer for the official 2026 **Lunar Landing Site Navigator** challenge. Its guaranteed experience is the Shadow Budget foundation: select two grounded lunar locations, explore a common UTC clock, inspect actual JPL Sun/Earth apparent azimuth/elevation and geometric-horizon states, then understand the evidence. The physical terrain-obstruction Difference Engine is P1 and **not authorized until after the validated, deployed P0 is stable and the owner approves**.

### UI AND UX MUST BE **JAW-DROPPING**

This requirement is explicit, serious and testable—not rhetorical. The site must feel like a premium, bespoke space-science instrument and editorial data story. Compete visually with world-class space-data explorers and expertly crafted digital exhibits, not student dashboards.

Build a unified, memorable screen with:

- striking but restrained lunar editorial typography, generous negative space and perfect visual hierarchy;
- a hero scientific visualization that **actually responds to data**;
- synchronized Sun (amber), Earth (cool blue), combined availability (teal), a crisp UTC Loom, calibrated azimuth and elevation labels, and elegant readable numerical values;
- consistent detailed design tokens, microtypography, precise borders and custom-crafted SVG primitives;
- refined microinteractions that clarify state changes, never invent smooth celestial data or move markers into unsampled positions;
- mobile interaction designed intentionally, not merely shrunk desktop columns;
- a beautiful, legible Evidence Drawer; clean empty/error/unknown states;
- meaningful keyboard focus, textual data equivalents, reduced-motion support and accessible contrasts.

**Do not produce** a card-grid home page, generic Tailwind component showcase, arbitrary black/blue gradient, decorative unusable 3D Moon, NASA logo as branding, splash screen that delays access to data, placeholder marketing copy, fake geographic results, placeholder values disguised as measurements, nonworking buttons, or an interface that only looks correct at one viewport.

Choose a strong art direction fast. **Capture real browser screenshots at 1440×900, 768×1024 and 360×800** whenever tooling permits. Critique them like a demanding design director, fix the top three problems, and repeat. If screenshot capture is impossible, report `NOT_RUN`, not a fictional QA pass.

---

## Step 0 — inspect and establish reality (do this first)

1. Inspect current repository/files. Do not overwrite user work blindly.
2. Read all of `HORIZON_CAUSE_v4_Master_Execution_Plan.md`, especially sections on science, site selection, geometry, submission and release gates.
3. Create `AGENTS.md` that encodes the scientifically truthful UI/implementation rules, P0/P1 boundaries and test expectations.
4. Determine actual Node/Python versions, package manager, install permissions, network capabilities and browser automation availability. Record facts—not imagined environments.
5. Give the owner an explicit short checklist for: their registered virtual event/team, the official challenge's **Resources-tab qualifying NASA source**, actual submission form/guide, and any account permissions you need. Do not block unrelated frontend/science work while awaiting account actions.
6. Record all unknown competition fields in `docs/submission.md`; never claim Global Awards eligibility before using a Resources-tab-listed NASA dataset.

**The exact challenge:** https://www.spaceappschallenge.org/2026/challenges/lunar-landing-site-navigator/

**Official rules:** https://www.spaceappschallenge.org/2026/ and https://github.com/nasa/spaceapps/discussions/1827

## Step 1 — create one stable integration contract

Use a single consistent Vite + React + TypeScript app root. Select Tailwind custom tokens **or** CSS Modules as the main styling system, with bespoke CSS/SVG; do not add redundant frameworks. Data preprocessing in Python 3.12 with `requests` or `httpx`, NumPy and pytest. UI types/Zod must match the Python release validator. SVG with small D3 helpers if helpful; do not install Three.js or a global Moon engine for P0.

Define **versioned immutable scientific releases** containing:

- `release_id`, `schema_version`, `generated_at_utc`, model identity and validation report;
- sites with source-backed `latitude_deg`, `longitude_deg_east`, `location_type`, horizontal-frame description and **observer-model height assumption**;
- source objects with exact URLs, title/publisher, retrieved time, source hash where possible, rights review and Resources-tab eligibility flag (`unknown` allowed);
- JPL run IDs, exact query params, raw data hashes, selected `COMMAND` target, observer settings, UTC window/cadence and validation state;
- samples with site/body ID, timestamp UTC, azimuth/elevation in degrees or `null` with honest error state;
- genuine derived intervals/boundary brackets and a three/four-valued visibility state.

All UI components must use the same `release_id` and selected UTC sample. No client-side invented Sun/Earth angles. Missing data means unavailable/unknown, **not zero**. Freeze authoritative scientific records after validation; never modify those JSON values for aesthetics.

## Step 2 — obtain authentic Sun/Earth observations (highest science priority)

**Primary source:** https://ssd-api.jpl.nasa.gov/doc/horizons.html and https://ssd.jpl.nasa.gov/horizons/manual.html

**Candidate sites:** independently source the approximate historical IM-1 and IM-2 landing coordinates from https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_artifact_impacts.html, or use other explicitly sourced sites. If IM-1/IM-2 are selected, label them `reported_landing_position` and explicitly label the observer **hypothetical at the published horizontal coordinates**, not a real instrument/antenna with known height. These sites are **not** silently the NASA Goddard Site01 Connecting Ridge raster.

**Horizons verification recipe (do not assume it works until tested):**

- `EPHEM_TYPE='OBSERVER'`, with an observer on Moon `301` using a user-defined observing location (manual indicates `CENTER='coord@301'`); `COORD_TYPE='GEODETIC'` and `SITE_COORD='<east-longitude-deg>,<planetodetic-latitude-deg>,<height-km-above-reference-ellipsoid>'`;
- Moon east-positive longitude; default `height_km=0` means a **hypothetical reference-ellipsoid** observer, not actual ground/lander height;
- Sun `COMMAND='10'`, Earth `COMMAND='399'`; `QUANTITIES='4'` for apparent azimuth/elevation, `APPARENT='AIRLESS'`, `TIME_TYPE='UT'`;
- explicitly record `START_TIME`, `STOP_TIME`, `STEP_SIZE`, target, header reference frame, output units and source retrieval timestamp;
- archive complete raw response plus SHA-256; validate target IDs and observing-site settings in the actual returned header; parse between `$$SOE` and `$$EOE` and reject error, missing or malformed rows;
- preserve signed negative elevations. They are valid below-horizon observations.

**Do not assume a seven-day window includes a dramatic event.** Initially scan about **35 days in 60-minute steps** (841 UTC sample times per target/site if both endpoints included); split into smaller date-scoped requests if required, deduplicate shared endpoints and retain query lineage. Discover genuine time differences or sign changes; if one exists, refine a narrow interval to 10-minute steps and retain the crossing bracket. If none exists, show the real no-difference result or try another source-grounded site/date within the science gate. Log searches; never cherry-pick without disclosure.

**Validation:** Run strict parser/time/unit tests and verify site/header conventions. A separately fetched Horizons response may check request/parse consistency, **but is not an independent ephemeris model**. Use separately configured SPICE or another independent astronomical reference if available; carefully match observer position, lunar frame, time scales and apparent/geometric corrections. Report exactly which kind of check was performed and the actual discrepancies. Never claim independent validation without that evidence.

**Scientific labeling:** P0 = `geometric horizon — lunar terrain excluded`, centre-of-disc observations only, no power or RF link performance. If a point is below the ideal horizon, label `below tangent plane`, not `blocked by lunar ridge`.

**P0 fallback:** If real ephemerides cannot be sourced/validated by **T+95 focused minutes**, stop prolonged debugging and use truly published NASA polar illumination/visibility data as a clearly labeled educational exhibit. Preserve its original reference period and aggregation, do not pretend it supplies specific 2026 az/el or the exact official comparison functionality. Continue building and submitting the truthful smaller project. Record the consequence for competitiveness.

## Step 3 — build the exceptional website while science proceeds

Create one coherent product, not disconnected pages:

**A. Hero / orientation.** A clean, cinematic statement of the problem; trustworthy model/source indicator; subtle vector-led lunar/sky visual; immediate entry to a live scientific view. No NASA branding impersonation.

**B. Explorer.** Two source-named sites; one shared UTC cursor and sample navigation; a beautiful calibrated overhead sky/horizon representation, Sun/Earth markers and text labels; compact Sun/Earth/overlap interval Loom. Correct azimuth: north 0°, east 90° clockwise. In an overhead polar sky plot, horizon ring is elevation 0°, zenith +90°; never clamp below-horizon points onto the horizon ring as though visible. Show them in a below-horizon zone or via separately labeled numeric state.

**C. Comparison statement.** At one instant, give real az/el for each site and a concise explanation. If nothing differs, say so. A visually emphasized event must correspond to an actual computed sample/transition.

**D. Evidence Drawer.** Show NASA/JPL/NSSDCA sources actually used, retrieved-on date, site and observer assumptions, raw release provenance, sampling precision, model status and honest limits. No simulated assurance badges.

**E. Mobile + access.** At 360px, coherent single-site focus with A/B switch, next/previous sample buttons, readable table, no horizontal overflow. Keyboard navigation, focus, reduced motion and no color-only classifications.

**F. Quality.** Build a premium bespoke experience with deliberate type scale, harmonic spacing, calibrated axis labels and restrained transitions. Make it feel like a polished instrument someone would remember after judging; scientific clarity always comes first.

**Performance targets (measure, do not assume):** fast initial shell, small compressed bundle, lightweight precomputed data, no API calls during sample scrubbing, lazy optional images, stable layouts, readable on weak connections. Never claim measured LCP/CLS without running performance checks.

## Step 4 — execute tests and adversarial review

At each gate, execute the commands and retain the results:

```bash
npm ci
npm run typecheck
npm run test
npm run build
python -m pytest science/tests
python scripts/check_release.py
npx playwright test
```

Adapt paths to the single actual app root and log which commands are configured. If a tool is not available, mark `NOT_RUN`, not PASS.

**Science tests:** source and query hash, response integrity, observer and target identity, Moon longitude, UTC sample order, signed elevations, azimuth domain, crossing brackets, `unknown` logic, no terrain claims under the P0 model, and intentional invalid/missing input fixtures. Test that source mismatch and `release_id` mismatch fail closed.

**Interaction tests:** both site selectors, single shared UTC, values in table match marker and Loom, evidence links, no-event state, failed data state, keyboard focus and reduced motion. Test the published URL in an unauthenticated browser.

**Visual QA:** screenshots at 1440×900, 768×1024 and 360×800; describe top three defects and fix them. Retake. Verify mobile layout and that the scientific content is not subordinated to decorative UI.

**Adversarial pass:** First play a skeptical lunar-data scientist: challenge every conclusion, coordinate convention and uncertainty claim. Then play a world-class product designer: challenge information hierarchy, motion, readability and aesthetic originality. Fix release blockers before extra polish. Record `PASS / FAIL / NOT_RUN / BLOCKED / N/A` accurately in `docs/validation.md` and `docs/visual-qa.md`.

## Step 5 — time and submission control

**5-hour active-work map:**

| T+ | Gate |
|---|---|
| 0–15 min | Owner account/resource/portal facts; repo inspection |
| 15–35 min | Testable app skeleton, frozen schema and design direction |
| 35–95 min | Data work + layout in parallel; **G1 real data or P0F pivot** |
| 95–175 min | Integrated synchronized experience; no P1 feature |
| 175–205 min | Public preview deployed and tested anonymously |
| 205–240 min | Data, functionality, visual and accessibility QA |
| 240–270 min | Short demo/slides, citations, accurate submission copy |
| 270–300 min | Owner completes official team submission; confirmation captured |

At **T+175** feature-freeze. Never sacrifice live deployment or submission for terrain, animation, extra page, optional science or marginal aesthetic detail. The user originally prioritized certificate eligibility and explicitly allows additional investment only if the prototype has genuine award potential.

**Submission guidance:** November 12 NASA discussion describes a public video ≤30s **or** up to 7 slides. Actual portal/current Project Submission Guide takes precedence. Include GitHub, public deploy, English summary/description, NASA sources from the specific challenge Resources tab when confirmed, all external code/media/data, and Codex/AI-use disclosure. The owner must confirm the final status is **submitted**, not just saved. Do not claim you submitted without success evidence.

## Step 6 — expansion is *explicitly forbidden* until user approval

At the end of P0, give an evidence-based `GO / LIMITED GO / STOP` recommendation for P1. **Do not automatically start terrain work**. P1 requires a true NASA Goddard Site01 DEM workflow: projection and body-fixed frame, vertical reference, observer height, local+far-field terrain coverage, numeric horizon/obstruction validation and only then causal explanation. If validated, the same UX can add a terrain Difference Engine and later a Robustness Lens (model agreement, not calibrated certainty). The first website must already be credible without this.

---

## Final Codex output contract — produce working artifacts

Report in a compact table:

1. **What works** with a direct link or local route, and **what does not**.
2. **Actual run status**: P0 geometric, P0F fallback, or authorized terrain P1. Never conflate them.
3. **Source inventory**: source URLs, NASA qualifying-resource verification (true/false/unknown), retrieval times, hashes, observer assumptions and true science-validation state.
4. **Executed command log**: exact commands/results and status including failed/skipped checks.
5. **Visual evidence**: actual screenshot paths and documented improvements, or `NOT_RUN`.
6. **Release details**: package root, build command, public URL **only if real**, Git commit/tag and remaining limitations.
7. **Submission copy and demo outline** that match implemented functions only; all sources/media/AI disclosures.
8. **Human action list**: login, permissions, deployment ownership, demo upload, official submission and receipt screenshot.
9. **Risk decision**: GO / LIMITED GO / STOP for optional Difference Engine, with measured evidence rather than optimism.

**Begin implementing immediately after reading the plan.** Avoid extended brainstorming, unneeded clarification and unnecessary package sprawl. If a real blocker appears, narrow the scope and make the truthful application work. Deliver a **jaw-dropping, genuine, submitted** small science experience—not an unfinished giant one.
