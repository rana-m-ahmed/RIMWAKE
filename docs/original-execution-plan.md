# HORIZON / CAUSE — The Shadow Witness
## NASA Space Apps Challenge 2026 · Final Codex Execution Plan v4.0

**Status:** A carefully reviewed implementation **plan**, not a built or scientifically validated product.  
**Planning basis:** November 14, 2026, Asia/Karachi.  
**Official challenge:** [Lunar Landing Site Navigator](https://www.spaceappschallenge.org/2026/challenges/lunar-landing-site-navigator/).  
**Team:** One human entrant directing Codex; other developers, infrastructure or paid services are not presumed.  
**Delivery objective:** Public, source-backed, exceptional-looking website + completed NASA submission in approximately **300 minutes of focused execution**.  
**Award objective:** Preserve an upgrade path to explainable terrain-aware comparison, **only** after evidence-based gates pass.  
**Prior specifications:** v3 execution plan is superseded by this v4; v2 remains a supplementary research reference, not mandatory release scope.

> **Product decision:** Build **Shadow Budget's synchronized site/date visibility explorer** as the guaranteed user experience. Brand it **HORIZON / CAUSE**. Upgrade to the **Difference Engine**—physical obstruction tracing and uncertainty-aware explanation—only if the geometry and terrain models withstand independent verification. A complete, truthful and beautiful submission is more valuable than an elaborate unfinished one.

---

## 0. Three decisions to remember

1. **Never invent a scientific observation.** Sampled celestial coordinates, terrain, causal attributions, visibility intervals, site positions, comparisons and validation metrics must be backed by actual calculation and evidence. Decorative illustration must say so.
2. **Freeze the core before expanding.** Frontend and scientific preparation may progress together, but all components share one immutable release contract. At the first scientific blocker, use a scientifically honest fallback without threatening submission.
3. **The interface must be jaw-dropping without becoming a template.** Visual originality is not optional. It must be inspected in screenshots and evaluated together with functionality, accessibility and performance.

### Success matrix

| Outcome | Minimum credible proof | Priority |
|---|---|---|
| Participation/certificate objective | Correct registration + team/challenge + truthful completed submission; preserve confirmation | P0, must protect |
| Accessible public application | Anonymous visitor can open website, understand the question, navigate real data or accurately labeled source-derived exhibit | P0 |
| Exact challenge fit | Sites and dates compared; Sun/Earth relationship to declared horizon explained; limitations prominent | P0 if real ephemerides available; otherwise fallback is a weaker challenge response |
| Visual differentiation | Cohesive bespoke UI, beautiful typographic hierarchy, responsive diagram, no template-card filler | P0 |
| Competitive differentiation | Real explained terrain obstruction and reproducible before/after, verified across sources | P1, conditional |
| Research-grade robustness | Observer-height and alternative DEM study with explicit uncertainty semantics | P2, not P0 |

### Important wording

- **Geometric horizon** = local tangent plane, ignoring lunar terrain. For centre-of-disc model `elevation > 0°` is geometrically above that plane. It is **not** proof of sunlight reaching a solar panel or direct-to-Earth radio contact.
- **Terrain skyline** = elevation angle of actual modeled terrain in each azimuth. This requires reliable DEM projection, observer definition, far-field coverage and validation.
- **NASA site coordinates** are not automatically a measured spacecraft observer height, flight-approved candidate site, or a site inside Site01.
- A temporal comparison may honestly show **no difference**. Never create a contrast to impress a judge.

---

## 1. Official competition constraints and unresolved external checks

### Verified publicly, as of November 14

- NASA's 2026 event page says project submissions open **November 14 at 09:00** and close **November 15 at 23:59, applicable local time**. Submit via the **Project tab on the team's page**. NASA says project submission is the path to a participant certificate and Global Judging eligibility.
- NASA GO Team's November 5 guidance says for a **Universal Event** team, hackathon start uses the team owner's residence-local 09:00. It advises no project development before the official start; preliminary selection, research and resource review are allowed.
- The same GO Team response says **at least one NASA data source expressly listed under the chosen challenge's Resources** must be used for **Global Awards** eligibility, and that all sources/tools/assets must be cited.
- A November 12 response on NASA's `nasa/spaceapps` GitHub discussions describes a **video ≤30 seconds or ≤7 slides**, publicly accessible, plus project summary, NASA-data explanation and AI-tool disclosure. This is guidance, **not a substitute** for the current official Project Submission Guide and portal.
- NASA's Lunar Landing Site Navigator challenge asks for intuitive comparisons of site and date, showing Sun/Earth locations relative to the horizon for potential solar-power and direct-to-Earth communication assessment. The challenge does not imply an operational power system or RF link-budget calculation.

### Must be checked in the participant's account, never claimed done without evidence

| ID | Action | Evidence to record | Blocking? |
|---|---|---|---|
| C01 | Confirm registered 2026 entrant, solo team, correct virtual/Universal or local event and challenge | Screenshot/URL and event timezone in `docs/submission.md` | Yes, for user objective |
| C02 | Open the **specific challenge's** Resources tab, identify a qualifying NASA dataset/link and verify it is actually used | Literal dataset URL, source title, how used, retrieval date | Yes, for Global Awards assertion |
| C03 | Read current Submission Guide and actual Project tab fields | Checklist with portal-dependent fields | Yes, for portal completion |
| C04 | Verify AI assistance and external content disclosures | Source/AI ledger and final project text | Yes, for truthful submission |
| C05 | Test live site, repository and demo in anonymous/private window | URLs, screenshot, date/time, result | Yes |
| C06 | Submit **and confirm** submitted state rather than an editable draft | Confirmation screenshot or portal status | Yes |

**Owner actions:** Account login, permissions, project creation, OAuth approval, publishing, video upload and final submission may require human action. Codex should supply copy and instructions, but must not claim to have performed these operations without a returned success signal.

**Sources:** [2026 official event](https://www.spaceappschallenge.org/2026/); [challenge](https://www.spaceappschallenge.org/2026/challenges/lunar-landing-site-navigator/); [GO Team answer](https://github.com/nasa/spaceapps/discussions/1827); [submission answer](https://github.com/nasa/spaceapps/discussions/1973).

---

## 2. Product scope: ambitious design, bounded science

### Product promise

> **HORIZON / CAUSE** helps people see when the Sun and Earth rise above or sink below a defined lunar horizon, compare the same moment at two lunar sites, and discover what the model can—and cannot—explain.

### One coherent user journey

1. **Understand:** The entry screen poses a physical question: *Two places on the Moon. One moment in time. What can each see?*
2. **Set context:** User chooses two documented sites and a supported date range. The app displays each latitude, east longitude, observer-height assumption and scientific model.
3. **Scan:** The Horizon Loom displays sampled Sun, Earth and simultaneous **geometric** visibility. The timeline and both sky diagrams share the same UTC index.
4. **Compare:** The user selects a sample or verified transition bracket. A difference card presents actual numeric readings, not a fabricated verdict.
5. **Trust:** An Evidence Drawer reveals raw source lineage, calculation assumptions, and limitations. If the terrain model passes its gate, a Cause Lens can additionally trace a real obstruction.
6. **Learn:** A short independent-project methodology explains that geometric visibility is not guaranteed power/comms.

### Release tiers with precise acceptance boundaries

| Tier | Real features | Forbidden claims | Promotion condition |
|---|---|---|---|
| **P0 — targeted 5-hour release** | Two source-grounded locations; real JPL apparent airless Sun/Earth az/el at a small supported set of UTC times; synchronized diagrams; sample/interval navigator; actual numeric text table; source + method drawer; mobile/keyboard; deployment; submission package | No terrain obstruction, no power output, no RF link, no fabricated event or false precision | At least one validated ephemeris release + build/accessibility/deploy gates |
| **P0F — no real ephemeris available** | Verified NASA-published polar illumination/visibility product as an accurately dated educational exhibit; real original period/aggregation and model; source-visible comparison; polished website; no simulated astronomical positions | No date-specific Sun/Earth motion or invented numerical angle; no assertion equivalent to full challenge implementation | P0 unavailable by hard-stop; retain partial challenge relevance and complete submission |
| **P1 — competitive Cause Lens** | A genuinely terrain-aware horizon, physical obstruction sample with bearing/distance/elevation, comparison to ideal horizon, linked regional map and tested event | No guessed ridges or physical mechanism from a generic image | DEM + observer frame + near/far field + independent tests pass |
| **P2 — Robustness Lens** | Recomputed 1-m vs 5-m observer, alternate DEM realizations, model-agreement explanation | No probabilistic calibration unless independently justified; no continuous arbitrary-position slider without recalculation | P1 stable, event real, adequate time and tests |

**P0F is a rescue submission, not equal in challenge competitiveness to P0.** If it must be used, the site must say exactly what the NASA map/statistic does and does not represent. Do not disguise a published long-term mean as a 2026 observation window.

### Hard exclusions (even with Codex)

No accounts; no backend database; no operational mission prediction; no solar/battery or RF link-budget model; no generic AI assistant; no editable global Moon; no expansive provider/payload encyclopedia; no unvalidated 3D terrain; no machine-learning training; no dependency on paid software or a live NASA API for every cursor change.

---

## 3. Data strategy: first find truthful evidence, then polish it

### Critical timing correction from the v3 audit

A fixed **7-day** window at a south-polar site might not contain a crossing or a dramatic site disagreement. The Moon's changing illumination and Earth geometry do not promise a hero event on the dates a designer prefers.

**Revised discovery procedure:**

1. Choose **two grounded lunar locations** from NSSDCA, e.g. the historical IM-1 and IM-2 published approximate landing positions, **or** separately documented hypothetical south-polar candidate sites. Record the exact category. Do not say those two actual landers share Site01 terrain coverage.
2. Query Sun `10` and Earth `399` at each observer location across a **coarse ~35-day window** using an initial **60-minute step**. This is a *search*, not final high-precision event determination. It yields 841 timestamps per site/body inclusive if the full 35-day window is evenly sampled hourly. If a full-span Horizons request is rejected or cumbersome, **split into smaller date-scoped chunks**, preserve exact query settings, deduplicate shared endpoints, and report any gaps.
3. Detect sign changes for `elevation` against 0° and **candidate site/date differences**, including overlapping visibility states. Do not require a positive result: a null discovery is valid.
4. If a suitable real event exists, refine its interval with **10-minute or shorter** requests. Retain the unrefined bracket; do not claim exact seconds without tested numerical root-finding.
5. If the discovery window yields no visually useful contrast, try another **sourced** site/date window and preserve a search log; cap the discovery work to the planned science budget. **Never sample selectively then pretend the example was typical.**
6. Package an immutable static release. The app uses those timestamps, not extrapolated continuous daily conditions.

A 35-day hourly scan is a *computationally modest* discovery set, not a guarantee of a solar rise/set at either chosen point. Real returned results decide what can be demonstrated.

### Core source hierarchy

| Source | Intended use | Status |
|---|---|---|
| Official challenge Resources tab | At least one NASA dataset actually used for Global Awards eligibility | **UNVERIFIED FOR THIS TEAM** until checked |
| [JPL Horizons API](https://ssd-api.jpl.nasa.gov/doc/horizons.html) + [manual](https://ssd.jpl.nasa.gov/horizons/manual.html) | Observer-based Sun/Earth apparent airless azimuth/elevation | Primary P0 scientific source |
| [NSSDCA lunar lander/impact catalog](https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_artifact_impacts.html) | Approximate historical lat/lon and source-category context | Grounding of P0 locations, if used |
| [NASA Goddard Site01 DEM](https://pgda.gsfc.nasa.gov/products/78) | Regional high-resolution terrain, errors and alternate models | **P1/P2 only** |
| [NASA Goddard polar illumination products](https://pgda.gsfc.nasa.gov/products/69) | Historical long-period context or explicit P0F | Inapplicable as direct substitute for current topocentric angles |

### JPL Horizons query specification — **verify actual response before relying on it**

Use observer tables (`EPHEM_TYPE='OBSERVER'`), a **user-defined Moon site** (typically `CENTER='coord@301'`), `COORD_TYPE='GEODETIC'`, and `SITE_COORD='<east_lon_deg>,<planetodetic_lat_deg>,<height_km_above_reference_ellipsoid>'`. For the Moon, Horizons accepts east-positive longitude. Use `COMMAND='10'` for Sun and `COMMAND='399'` for Earth, `QUANTITIES='4'` for apparent azimuth/elevation, `APPARENT='AIRLESS'`, `TIME_TYPE='UT'`, with explicit start, stop and step. Query syntax and all assumptions must be confirmed against the current API response/header before any data release.

**Critical caveat:** NASA's historical NSSDCA horizontal coordinates are based on a DE421 mean-Earth/polar reference. A recorded horizontal location does **not** supply actual observer height above Horizons' reference ellipsoid. Setting `height_km=0` describes a **hypothetical reference-surface observer at that approximate horizontal position**, not the real lander's antenna or an observed terrain height. Label it in the app.

**Horizons parser requirements:** Confirm response status and absence of warning/error text; locate `$$SOE`/`$$EOE`; read declared header and unit/time conventions; reject blanks/nonfinite values; confirm site coordinates printed in header and target identity; compare timestamp sets for Sun and Earth; normalize azimuth to `[0,360)`; retain signed elevation in `[-90,+90]` (negative values are valid); store raw response SHA-256, retrieval timestamp, exact URL/parameters, and parser version. Horizons outer JSON, if used, may contain a text result; do not assume a directly structured coordinate array.

**Sampling/integrity:** `unknown`, `boundary` and `visible/blocked` are separate. A missing value is `null`, never `0`. No smooth motion may imply a precisely calculated event between samples. A 10-minute step brackets but does not timestamp an exact crossing. A display cursor should snap to samples, or show interpolation as cosmetic only.

### Validation ladder

**V0 — Input:** Source URLs/IDs/retrieval dates, sample count, requested vs returned body, observer definition and timezone.  
**V1 — Data:** Ordered UTC timestamps, valid angular ranges, matching site IDs, reproducible source hashes, nonempty result, no unexpected missing blocks.  
**V2 — Geometry:** Cross-check selected output rows against independently retrieved Horizons results **to verify query identity and parser correctness**. For genuinely **independent astronomical-model verification**, use a separately configured SPICE computation or another independent reference with matched observer position, time scales, lunar frames and apparent/geometric corrections. A second Horizons query is **not** an independent ephemeris engine, and copied values are not validation.  
**V3 — Logic:** Explicit truth table, sample boundaries, wraparound at azimuth 0/360, unknown propagation, UI consistency and failure fixture.  
**V4 — Terrain (P1 only):** DEM frame/height datum/projection, coordinate transform, local-plus-distant horizon coverage, coverage masks, sanity fixtures, sensitivity to sampling and an independent reference calculation.

**No hardcoded numerical accuracy claims.** A provisional target such as 0.1° angular agreement may be used for engineering checks only if meaningful after normalizing reference frames, observer height, time scales and apparent/geometric correction conventions. Report achieved numerical discrepancies with real observations.

### Visibility model

For a sampled body `b` at site `s`, `el_b(s,t)` is the Horizons apparent airless **centre** elevation relative to the observer's local tangent plane:

- `visible` if finite `el > epsilon`
- `blocked` if finite `el < -epsilon` (**below geometric horizon**, not necessarily terrain-blocked)
- `boundary` if `abs(el) <= epsilon` (numerical tolerance defined in the release)
- `unknown` if source, observer, or model is unresolved

For both visible: `visible AND visible => visible`; if either is confidently `blocked` the result is `blocked`; all other combinations propagate `boundary/unknown` explicitly. Define epsilon conservatively, with actual calculation reasoning; do not smuggle a display rounding precision into a physical error budget.

Finite solar/Earth discs, partial visibility, lunar eclipses, power generation and radio-link performance are **out of scope for P0**. Display those exclusions alongside findings.

### Site taxonomy

`reported_landing_position` | `published_candidate` | `hypothetical_study_point`. Source links are required for the first two. Every P0 point must also have a separate `observer_model` stating its ellipsoid height assumption. Do not silently relabel a historical lander position as an operational candidate.

---

## 4. Scientific run and frontend contract

**Rule:** the interface renders only released data. Frontend code never derives authoritative astronomy from its aesthetic animation.

### Artifact layout (minimal, no unnecessary monorepo framework)

```text
horizon-cause/
├── AGENTS.md
├── README.md
├── package.json + lockfile
├── web/
│   ├── public/data/manifest.json
│   ├── public/data/<release-id>/sites.json
│   ├── public/data/<release-id>/observations.json
│   ├── public/data/<release-id>/intervals.json
│   ├── src/components/{HorizonLoom,PairSky,EvidenceDrawer,SiteSelector}/
│   ├── src/lib/{schema,loader,time,visibility,format}.ts
│   ├── src/styles/{tokens,global}.css
│   ├── src/App.tsx
│   └── tests/
├── science/
│   ├── fetch_horizons.py
│   ├── parse_horizons.py
│   ├── derive_intervals.py
│   ├── validate_release.py
│   └── tests/
├── docs/
│   ├── source-ledger.md
│   ├── validation.md
│   ├── visual-qa.md
│   ├── submission.md
│   ├── rights-and-ai.md
│   └── decision-log.md
└── scripts/check_release.py
```

**Repo root decision:** Prefer one Vite project at repository root or `web/` **but never both conflicting package.json conventions**. Codex shall choose one layout after inspecting existing files, record its decision, and make package/deploy commands consistent. The tree above is a *logical architecture*, not an instruction to create duplicate nested app roots.

### Canonical science schema — normative field definitions

All downstream numeric data must be produced by the Python scientific pipeline, validated once, then frozen under a matching `release_id`. The following is a **schema skeleton with no fabricated observations**:

```json
{
  "schema_version": "2.0.0",
  "release_id": "NOT_GENERATED",
  "generated_at_utc": null,
  "scientific_status": "not_calculated",
  "model": "tangent_plane_center_airless",
  "time_scale": "UTC",
  "sites": [],
  "runs": [],
  "sources": [],
  "limitations": ["Planning-only schema; no data computed"]
}
```

Production records have these **required semantics**:

| Record | Required fields |
|---|---|
| `Site` | `id`, `name`, `latitude_deg`, `longitude_deg_east`, `location_type`, `horizontal_frame`, `source_ids[]`, `observer_model.height_km`, `observer_model.height_reference`, `observer_model.is_hypothetical` |
| `Source` | `id`, `title`, `publisher`, `url`, `retrieved_at_utc`, `type`, `rights_review`, optional `sha256`, `challenge_resource_eligible` (`true/false/unknown`) |
| `Run` | `run_id`, `site_id`, `body_id`, `start_utc`, `end_utc`, `step_seconds`, `horizons_query_parameters`, `raw_sha256`, `model`, `validation_status`, `validation_report_id` |
| `Sample` | `run_id`, `site_id`, `body_id`, `timestamp_utc`, `azimuth_deg`, `elevation_deg`, `quality_state`; `null` if unknown |
| `Interval` | `site_id`, `body_id_or_both`, `start_utc`, `end_utc`, `state`, `crossing_bracket_start/end`, `derivation_version`, `model`; interval endpoints refer to samples, not invented precision |
| `Validation` | `release_id`, `tests`, `reference_checks`, `discrepancies`, `known_limitations`, `reviewed_on`, `status` |

**App state:** `release_id`, `site_a`, `site_b`, `selected_utc`, `model`, `selected_event_id`. Every visualization and text description derives from that state and validated records. The `source_id` is inspectable at each important claim.

**Status enums:** historical claim = `confirmed/disputed_or_partial/unverified`; scientific run = `validated/provisional/unavailable/not_calculated`; body state = `visible/blocked/boundary/unknown`; model = `tangent_plane_center_airless/terrain_horizon_center_airless`. Never equate provenance source confirmation with calculation validation.

**Gate:** Zod validation and Python release validation must reject cross-release run IDs, missing timestamps, fake `0` substituted for missing values, unsourced locations and a `terrain_horizon` status without terrain method/coverage evidence.

---

## 5. Jaw-dropping visual experience: non-negotiable art direction

### Creative thesis: **An astronomical instrument you can understand at a glance**

Not a generic dark dashboard. Not a NASA-themed admin panel. Not a card grid with a moving orb. Imagine an editorial interaction somewhere between a premium space-science museum installation, a high-end scientific instrument and a precise data visual story.

### Layout contract

**Desktop ≥1200px:** quiet top navigation with small wordmark; powerful two-line headline and one factual subtitle; dominant central scientific horizon instrument (48–60% of first viewport); one finely crafted segmented Sun/Earth overlap Loom below; two-site settings to the side or in a concise top strip; Evidence Drawer collapsible without hiding data. Empty space is intentional. Visualizations occupy prime real estate; controls never overwhelm them.

**Tablet 768–1199px:** single large horizon with comparison selector or synchronized second panel; full-width time tracks; evidence in dismissible sheet.

**Mobile ≤767px:** present one site at a time with explicit A/B switch and persistent compare summary; timeline has native slider and previous/next sample controls; evidence drawer is modal/sheet with proper focus management; no horizontal page overflow; key numeric results readable without hover.

### Visual system

- **Colors:** Void `#080D17`; surface `#121D2D`; text `#EEF3F8`; subdued labels `#AABACC`; Sun `#F1C46C`; Earth `#84C8F2`; dual availability `#80D8B9`; actual error `#E98883`. Use categorical colors consistently, never color alone.
- **Typography:** Modern editorial sans for heading/body, tabular mono for UTC, azimuth, elevation and scientific IDs. Prefer installed/system fonts for fast loading; license-review any added font. Do not ship font binaries to users as standalone downloadable assets.
- **Scientific graphics:** azimuth compass ticks, explicit cardinal bearings, 0° reference, elevation labels, correct north-clockwise-east azimuth, true numeric table and axis domains. Do not render a mountain silhouette unless it is measured/modelled and clearly labeled.
- **Microinteractions:** time cursor and marker coordination; one restrained reveal sequence; elegantly animated highlighted time window; model/source badges that are genuinely informative. Hover has an equivalent tap/focus interaction. No decorative inert buttons.
- **Motion:** 120–220 ms contextual transitions; no auto-playing global camera flythrough, mandatory WebGL, loud audio, or fabricated smooth orbital inference. Reduced-motion mode removes nonessential transitions.
- **Imagery:** A light scientific lunar basemap or NASA public media only after asset-specific rights review; otherwise gradients, precise vector geometry and subtle CSS-generated stars/texture. Never present decoration as a terrain map.
- **Tone:** intelligent, calm and cinematic; no generic claims like “AI revolutionizes lunar landing”; every tooltip answers a real question.

### Screen-specific acceptance

| Screen/state | User should immediately grasp | Quality bar |
|---|---|---|
| Hero | Why sunlight and Earth geometry matter on Moon | One clear claim, one memorable diagram, no hero clutter |
| Explorer | Two grounded sites share a single clock | One authoritative UTC cursor, data labels and coherent hierarchy |
| Evidence | Exactly what numbers and NASA references support claim | One click, source URL/date/model/limits, readable typography |
| No valid event | No difference was measured in supported period | Graceful explanation, no invented highlight |
| Data unavailable | What was checked and why result is absent | Distinguish missing data from invisible body |
| Mobile | Same conclusion reachable without horizontal scrolling | Tap-friendly controls, visible numeric table |
| Reduced motion | Same data and outcome without animation | No loss of information |

### Scientific sky-plot projection contract

For an optional **overhead sky dome** (not a terrain panorama), preserve the actual azimuth/elevation convention: north = 0°, east = 90° clockwise; horizon = elevation 0° and zenith = +90°. One possible polar projection for above-horizon points is `r = R * (90° - elevation) / 90°`, `x = cx + r * sin(azimuth)`, `y = cy - r * cos(azimuth)`. **Below-horizon points must not be clamped to the horizon ring or rendered as visible**: show a separate below-horizon numeric/state readout or a clearly labeled exterior-zone projection. Axis labels and text alternatives are mandatory. This is a geometric sky chart, not a model of distant crater walls.

### Three-round design QA (mandatory)

1. **Pass 1 — Composition:** screenshot at **1440×900**, **768×1024**, **360×800**; inspect contrast, whitespace, typography, alignment, panel legibility, cropped axes and overflows. Record screenshots/defects.
2. **Pass 2 — Interaction:** use real site/time data. Verify same sampled UTC instant, correct marker az/el, state badges, source drawer and disclosure. Test keyboard, tap and reduced motion.
3. **Pass 3 — Critical polish:** fix the three highest-value visual or usability issues, retake screenshots, verify changes did not break build/data. Do not substitute extra animations for validated content.

**Design scoring (internal, subjective):** Visual composition ≥4/5; conceptual clarity ≥4/5; factual and numerical trust = all release gates pass; mobile usability ≥4/5; accessibility blockers = zero. Reviewer must write reasons; do not self-award perfect scores without screenshots.

---

## 6. Technology choices and handoff synchronization

| Concern | P0 choice | Reason / cutoff |
|---|---|---|
| Operator | **Codex + Git**, inspectable commits and test logs | One working tree by default; parallel agents only with clean file ownership |
| Frontend | Vite + React + TypeScript | Fast static output, no backend or SSR required |
| Visual styling | Tailwind with custom tokens **or** CSS Modules; choose one main system | Rapid craftsmanship without fighting duplicate styles; bespoke SVG/CSS essential |
| Components | Native HTML first; Radix only for an accessibility need | Avoid heavy and generic UI library appearance |
| Chart/horizon | Native SVG + `d3-scale`/`d3-shape` if needed | Precise, light and testable; no WebGL for P0 |
| Runtime data | JSON + Zod | Reliable schema validation and graceful invalid-data states |
| Science | Python 3.12, `requests`/`httpx`, NumPy, pytest | Lightweight reproducible preprocessing |
| Terrain (P1) | Rasterio/GDAL, PyProj, SciPy; optional SpiceyPy | Install only if actual terrain work authorized |
| E2E | Playwright with screenshots; Vitest for functions | Test interactions and responsive layouts |
| Deployment | Cloudflare Pages or equivalent existing static host | Public preview early; `dist` output; no secrets in client |
| Media | Licensed SVG/NASA public media with ledger | No broken attribution or license assumptions |

**Version contract:** Use compatible stable versions in the actual environment, commit lockfiles, run `npm run build`/`tsc` and report actual versions; never fabricate versions or installation success. Avoid setup of multiple monorepo task runners.

### Workstreams (one owner, optional multiple Codex workers)

- **Science worker:** owns `science/**`, science datasets, source and validation logs. Produces immutable release artifacts. Cannot edit React UI.
- **UI worker:** owns `web/src/**`, brand system, accessibility and responsive screenshots. Uses generated **schema fixtures explicitly marked test-only**, never portrayed as real measurements. Cannot edit the authoritative science JSON.
- **Integration/QA owner:** owns schema release contract, validates imported JSON, merges/coordinates changes, runs build/test/screenshot, controls deployment and acceptance. A single Codex session may execute the roles sequentially; do not assume simultaneous subagents.

**Integration API:** science emits JSON satisfying declared Zod schema and `release_id`; UI reads it without reinterpretation. A failed ingest displays `Data unavailable — release validation failed`, never defaults to invented readings. No UI computation of new Sun angles; state calculations are restricted to validated visibility logic.

**Merge discipline:** stable owner of schema, no two workers editing it concurrently; branch/worktree names meaningful; conflict = stop and reconcile, never overwrite source of truth; run release checks after each integration. Tag the first working deployed release `p0-submittable` before extensions.

### Canonical developer commands

Codex shall choose a single package root and make them actually work:

```bash
npm ci
npm run dev
npm run typecheck
npm run test
npm run build
python -m pytest science/tests
python scripts/check_release.py
npx playwright test
```

If a command is not configured or the environment lacks the relevant dependency, Codex must either configure it appropriately or record `NOT_RUN`/`NOT_APPLICABLE`. Do not claim a command passed without running it. Deployment-specific working directory is recorded in README.

---

## 7. The 300-minute focused build: hard gates and fallback

The sprint is **300 minutes of planned active work**, not a guarantee of elapsed runtime. The user remains responsible for account actions. The official submission deadline is independent of our sprint.

| Focused minutes | Required output | Gate / decision |
|---|---|---|
| **0–15** | Check registration/team/event, challenge resource, actual portal instructions; inspect repo | **C-gate:** resource and submission requirements recorded, unknown marked |
| **15–35** | Repo, dependency lockfile, test skeleton, schema, bespoke layout skeleton | UI boots, `npm run build` works; shell can be previewed |
| **35–95** | In parallel: source-grounded sites + Horizons coarse scan and verified sample parsing; UI composition progresses with `test_only` fixtures | **G1 at T+95:** authentic geometry + source trace or P0F pivot |
| **95–175** | Integrate immutable data with time-controlled skylines/loom and evidence; no false data; polish desktop/mobile | **G2 at T+175:** browser journey works and no fabricated scientific claim |
| **175–205** | Production build, first public preview deployment, private-window check | **G3:** public link exists or identify deployment blocker immediately |
| **205–240** | Science QA, UI screenshots, keyboard/mobile review, fix highest-priority defects | **G4:** no release-blocking defects; report actual tests |
| **240–270** | ≤30s demo **or** ≤7-slide deck, project summary, sources, rights, AI disclosure | Submission package ready |
| **270–300** | Fill official team Project tab, submit, capture receipt/status | **G5:** official submitted state verified |

**Science contingency:** A coarse 35-day query may be slow/unavailable. At **T+95**, stop API debugging if no reliable result and activate P0F; no continued speculative science work while submission clock runs. At **T+175**, freeze new functionality; at **T+205**, focus only on defects and submission. If preview deployment is broken, prioritize the public link and official submission ahead of minor motion/polish.

**Submission-before-expansion rule:** Put a complete version into the official portal as soon as the portal allows, after verifying the submission state. The owner may consider edits only after confirming the portal permits them and that the existing valid submission cannot be lost. If no edit policy is verified, do not rely on post-submission changes.

### Go/limited-go/stop decision after P0

| Decision | Evidence necessary | Authorized next work |
|---|---|---|
| **GO — award-focused** | Working deployed P0, representative ephemeris checks, adequate time, real candidate difference, no submission blocker | P1 terrain and causal obstruction with independent tests |
| **LIMITED GO** | P0 reliable, but terrain source/CRS/coverage remains unresolved | Improve clarity, evidenced interpretation, mobile/keyboard, storytelling |
| **STOP** | Cannot validate astronomical output or remaining time threatens official submission | Finish P0F, docs/demo/portal; no speculative P1/P2 |

Do not authorize P2 until P1 is stable and a specific real uncertainty-sensitive result is reproducible. Even Codex cannot compress scientific correctness into an unverified screenshot.

---

## 8. Terrain Cause Lens: only after competitive GO

### Scientific release gate

NASA Goddard's Site01 Connecting Ridge products provide 5-m/pixel high-resolution terrain, uncertainty and alternative terrain realizations. They also note approximately **90% of 5-m pixels were interpolated**. Pixel spacing does not equal independent measurement precision. [NASA source](https://pgda.gsfc.nasa.gov/products/78).

A responsible P1 must:

1. Choose **two study points documented inside Site01 coverage** with actual raster coordinates transformed into a consistent Moon reference system; do not recycle IM-1/IM-2 coordinates as if they lie inside that raster.
2. Read the exact raster metadata (Moon mean-Earth frame/DE421, south polar stereographic projection, vertical reference, pixel spacing, nodata and source versions).
3. Compute observer and terrain point positions in one **lunar body-fixed Cartesian frame**; calculate local East/North/Up; account for curvature and observer height above actual modeled surface.
4. Obtain the terrain **horizon maximum per bearing** with documented angular/radial resolution, local high-resolution terrain and adequate distant obstruction coverage. A bounded radius requires a convergence or coverage proof, not assumption.
5. Retain contributing sample locations/bearings/distances. A reported blocker may be **model-dependent** and must be described as a modeled obstruction, not an observed physical ridge from live imagery.
6. Compare representative terrain-horizon elevations with independent calculations and analytical/synthetic fixtures; verify coordinate transforms and azimuth wrap.
7. Display terrain-vs-ideal comparison only where provenance and numerical checks pass. Unknown far-field coverage => `unknown`, not `clear`.
8. Guard finite-disc claims: P1 remains centre-of-disc unless limb-aware obscuration is explicitly implemented, tested and disclosed.

### Difference Engine event object

A real candidate event requires a common UTC bracket, two observer IDs, body ID, model ID, state/clearance difference, horizon contributor evidence where valid, and a traceable `run_id`. Selecting an event highlights *when* in the Loom, *where* in a regional locator, and *why* in the skyline plus explanation. Missing contributor => show geometry-only explanation; never guess the obstruction.

### P2 robustness

Recompute chosen scenes for 1 m and 5 m heights (or other explicitly documented hypotheses), then optionally compare a small subset of NASA alternate DEMs. Report `models_agree: n/N` only as *conditional agreement among the sampled models*, not a calibrated probability of correctness. If the real model produces no meaningful height effect, report that result and do not manufacture an effect.

---

## 9. QA that Codex must execute, not assert

| QA group | Required tests and evidence | Release blocker |
|---|---|---|
| Requirements | Correct challenge/event; qualifying dataset checked; references/AI credits; demo length vs portal | Failure to submit; false eligibility statement |
| Data parsing | Real raw source archived; row count; time order; site/body IDs; non-finite rejection; `$$SOE/$$EOE`; source hash | Fake/malformed astronomy |
| Geometry | Moon longitude sign, height assumptions, az/el quadrant, boundary tolerance, reference output comparison; independent check logged | Failed numerical/observer check |
| Derived intervals | Visible/blocked/boundary/unknown truth table; missing values; no off-grid exact timestamps; timeline matches table | Wrong scientific outcome |
| Source provenance | Every site/fact/source and displayed model links to verifiable source; no unlicensed visual | Untraceable central claim |
| UI function | All controls work; shared cursor; selected sample exact; evidence drawer; alternate event/no-event states | Broken core journey |
| Visual | Screenshots at 1440×900 / 768×1024 / 360×800; critique/fixes repeated; no overflow, cropped visualization, decorative template cards | Severe visual obstruction |
| Accessibility | Tab/focus, labels/roles, numeric table, contrast, reduced motion, previous/next controls; no color-only states | Core function inaccessible |
| Performance | Production build sizes; simulated slow network run; no network requests during loaded cursor scrubbing; lazy media | Broken or unusably slow |
| Deployment | Build, public URL, anonymous test, no leaked keys, mobile view | Broken external link |
| Submission | Demo and description show *only* built functions; complete portal, status screenshot | Unsubmitted/draft |

### Mandatory fault injection

- Swap one sample's `site_id` or `release_id`: release validation must fail.
- Insert null elevation, NaN, an impossible azimuth, and out-of-order UTC: reject or display unknown with explicit error; do not treat as a valid zero.
- Remove scientific source metadata: a claimed validated run must not load as validated.
- Disable optional terrain data: site/date comparison remains functioning and makes no terrain claims.
- Select two sites with no genuine difference: UI must show a neutral, accurate state.
- Toggle reduced motion: core information must remain available.
- Open source/deploy URLs anonymously: inaccessible resources must be labeled as external failures, not quietly hidden.

### Reporting convention

`PASS` = test executed and passed. `FAIL` = executed and failed. `NOT_RUN` = did not execute. `BLOCKED` = external prerequisite prevented the test. `N/A` = deliberately excluded feature. No synthetic placeholder, mock screenshot or unrun assertion may be presented as a passed test.

---

## 10. Submission pack and judged story

### Required owner submission bundle

- Public site with accurately presented state of scientific validation.
- Public source repository and README with exact run/deploy commands.
- Short project title, plain-language summary, project description, challenge selection and intended audience.
- Source/asset ledger including **the actual challenge Resources-tab NASA item** if verified, plus JPL/NSSDCA/PGDA as used.
- Explanation of data and tools: NASA/JPL, programming libraries, Codex/AI assistance, image generation if actually used, attribution and limitations.
- Public **≤30-second demo video or ≤7 slides**, based on November 12 guidance; recheck current portal/guide and obey the stricter applicable instructions.
- Actual completed submission + receipt/status captured by owner.

### First 30-second demo storyboard (do not pre-assert outcomes)

| Time | What it shows |
|---|---|
| 0–5s | One beautifully designed lunar instrument; physical question in 10 words or fewer |
| 5–13s | Two real lunar sites; one shared UTC control moves Sun/Earth numerical markers and timeline |
| 13–21s | A **real** time difference or direct comparison, if supported; otherwise a truthful site-to-site reading |
| 21–27s | Evidence Drawer: NASA/JPL references, observer assumptions and geometric-only disclaimer; terrain only if validated |
| 27–30s | Independent-project name, functioning public URL and concise impact statement |

### Submission description template (revise to reflect actual features only)

> HORIZON / CAUSE is an independent educational lunar-visibility explorer built for NASA Space Apps 2026. It compares time-dependent Sun and Earth positions from documented lunar observation locations using cited NASA/JPL resources. A synchronized horizon interface and evidence panel help users understand the geometric visibility conditions and the limits of those calculations. Where independently validated terrain data is available, the project can additionally investigate modeled horizon obstructions. It is not an operational power or telecommunications planner.

**Never claim P1 is built merely because it appears in this plan.** Avoid marketing the educational viewer as flight-certified or an official NASA product.

---

## 11. Pre-mortem and decisive responses

| Failure | Earliest indicator | Owner action |
|---|---|---|
| Horizons unavailable/wrong observer setup | API error, missing `$$SOE`, inconsistent site header at G1 | Use verified alternative route once; then P0F, protect submission |
| No crossing/difference found | Honest 35-day scan yields none | Show real site readings and no-difference result; consider alternate sourced window within time gate |
| Science UI mismatch | Two panels show different UTC/run or state | Block release; use one normalized app state; test |
| Terrain model false certainty | Missing far-field, projection mismatch, untested ridge | Disable Cause Lens; keep P0 geometric only |
| Codex produces template aesthetic | Card grid, meaningless 3D, generic hero slogans | Enforce custom instrument composition; screenshot critique top three defects |
| Overbuilding | P1 started before deployed P0 | Immediately stop; return to publish/submit gates |
| Deployment surprise | Build passes locally but host URL fails | Fall back to another existing static host; ensure public link first |
| Invalid NASA media rights | No source/attribution for photo | Remove asset; replace with license-safe CSS/vector design |
| Demo exceeds requirement | Long narrative or video > allowable limit | Use 30-second capture or 7 slides; portal is source of truth |
| Completed website, unsubmitted project | No portal confirmation at deadline | Stop all development and submit immediately |

---

## 12. Traceability matrix

| Requirement | Code/data component | Validation artifact | Release gate |
|---|---|---|---|
| Site/date comparison | site picker, UTC sample selector | Playwright site/date flow | G2 |
| Sun/Earth horizon relationship | paired sky, az/el table | Raw Horizons samples + numerical check | G1, G4 |
| Simultaneous geometric availability | Loom and state logic | Truth-table tests | G2, G4 |
| Explanation and limitations | Evidence Drawer, method page | Source/observer/model inventory | G2 |
| NASA data-use eligibility | actual challenge source item | Screenshot + source entry + usage trace | C02 |
| Jaw-dropping UI | art system, hero and responsive layouts | Three screenshot sizes, defect log and second pass | G4 |
| Accessible core task | semantic controls, table, reduced motion | Keyboard + Playwright accessibility checks | G4 |
| Public availability | static build and host | Anonymous URL tests | G3 |
| Certificate/submission | project portal fields, demo | Confirmation/status capture | G5 |
| Optional terrain cause | DEM ray/horizon engine | Projection, coverage and reference tests | P1 only |
| Optional uncertainty | ensemble/height outputs | Scenario/clone comparison log | P2 only |

---

## 13. Source register and evidence strength

**Official competition** (live source verification during this plan revision):

1. [NASA Space Apps 2026 event](https://www.spaceappschallenge.org/2026/) — event timeline, project submission, certificate.
2. [Lunar Landing Site Navigator](https://www.spaceappschallenge.org/2026/challenges/lunar-landing-site-navigator/) — official challenge statement.
3. [NASA GO Team answer, November 5](https://github.com/nasa/spaceapps/discussions/1827) — start restrictions, Resources-tab data source and attribution.
4. [Submission answer, November 12](https://github.com/nasa/spaceapps/discussions/1973) — 30-second demo/7 slides and disclosure guidance; portal authority unresolved.

**Science** (live source verification during this plan revision):

5. [JPL Horizons API](https://ssd-api.jpl.nasa.gov/doc/horizons.html) — observer ephemeris fields, API settings.
6. [JPL Horizons manual](https://ssd.jpl.nasa.gov/horizons/manual.html) — Moon user-defined site, east-positive longitude exception, quantity 4 (apparent azimuth/elevation), reference meaning.
7. [NASA NSSDCA lunar artifact catalog](https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_artifact_impacts.html) — approximate IM-1 and IM-2 actual landing coordinates, source convention.
8. [NASA Goddard Site01 high-res DEM](https://pgda.gsfc.nasa.gov/products/78) — regional Site01 5-m model, uncertainty, clone data, large interpolation fraction.
9. [NASA Goddard polar illumination products](https://pgda.gsfc.nasa.gov/products/69) — averaged products; precise definitions must be checked for fallback.
10. [NASA image/media guidelines](https://www.nasa.gov/nasa-brand-center/images-and-media/) — use and brand considerations.

**Open evidence, not asserted solved:** exact selected challenge Resources-tab inventory; participant account/event/team; live submission portal and full guide; actual ephemeris/DEM downloads and independent checks; UI screenshots and benchmark scores; public deployment; completed submission.

---

## 14. Final handoff instruction

Treat **this v4 document and `HORIZON_CAUSE_v4_Codex_Kickoff.md`** as the authoritative **P0** implementation contract. Older v2/v3 materials are references only and must not expand release scope. Start Codex from the repository root. Demand a live site, a complete source trail, executed QA evidence and submission-ready materials; do not accept a design-only mockup, imaginary numerical results or a perfect-looking app that has not been published.

**Recommendation:** **GO for the focused 300-minute build**. Earn the option to expand to P1 through evidence. A completed submission is the non-negotiable outcome; award-quality differentiation is a conditional extension, not a substitute for delivery.
