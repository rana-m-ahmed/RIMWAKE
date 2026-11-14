# RIMWAKE v6 — Engineering Roadmap, Release Gates and Scientific Product Contract

## 1. Product tracks and first release contract

**Track A — competition-critical visual and UX reconstruction:** The existing geometric visibility app is assumed to be functioning based on user report/screenshots, **not source-verified here**. Preserve it, upgrade branding, develop the editorial Discover page, rebuild the Explorer hierarchy, improve responsive plotting and evidence. Do not rewrite the scientific pipeline merely to add 3D. The first stable submission-capable release must exist **before** advanced feature work.

**Track B — full intended scientific product:** validated terrain Difference Engine, cause attribution, height sensitivity, alternative DEM realizations, wider reproducible case catalog, scientific export. These are conditional research dependencies; do not describe them as shipped.

## 2. Implementation architecture — adapt to the actual repository

```text
app/
  pages/Discover, Explore, Method
  components/Brand, SitePicker, SharedTimeRail, MeridianSplit,
             SignedSkyInstrument, HorizonLoom, DifferenceNote,
             EvidenceSheet, ModelStatus
  story/GuidedChapter, CaseChooser, NarrativeCopy
  visuals/LunarContextPoster, OptionalMoonScene
  science/recordTypes, selectors, threeValuedLogic, evidenceLinker
  data/manifest, sourceRegistry, runRegistry, siteRegistry
  styles/tokens, typography, rhythm, motion
  tests/unit, ui, visual, accessibility, science-regression
public/assets/ (source and license manifest)
docs/ (plan, change register, QA, demo, submission ledger)
```

Do not force a migration if the current app's React/Vite stack already solves these needs. Use React+TypeScript for UI, SVG/D3-like functions only where helpful, optional Canvas/WebGL for supplementary scene. Keep computational precomputation in Python or existing pipeline, not in high-frequency React renders. Static Vercel deploy remains the default if its routes and data fit static hosting.

## 3. Single scientific state and data contracts

```ts
type SampleID = string;
type ModelKind = 'geometric_center' | 'terrain_center';
type ScienceState = 'above'|'below'|'boundary'|'unknown';
type Validation = 'verified'|'provisional'|'invalid'|'not_run';
interface Observation {
  runId:string; siteId:string; sampleId:SampleID; target:'SUN'|'EARTH';
  utc:string; azimuthDeg:number|null; elevationDeg:number|null;
  state:ScienceState; model:ModelKind; validation:Validation;
  evidenceIds:string[];
}
interface Selection {
  siteAId:string; siteBId:string; sampleId:SampleID;
  model:ModelKind; datasetReleaseId:string; caseId?:string;
}
```

Rules: one atomic selection updates sky plots, reads, timeline, evidence; all numbers come from records. `null` means unknown, not zero. A sample transition is not a continuously valid visibility interval. If A and B use different data releases or incompatible reference frames, **block** the scientific comparison pending normalization. Always report whether the observer is a hypothetical point on a reference ellipsoid or an actual surface position.

## 4. Scientific integrity: concrete acceptance gates

| Gate | Minimum evidence | Fail state |
|---|---|---|
| P0 astronomy | JPL raw response / parsed test fixtures, exact target/center/observer coordinates and frame, reproducible time grid | No numbers, render error state |
| P0 site identity | Authoritative source for mission landing coordinate versus experimental observation point; longitude east positive | Label hypothetical, do not assert actual lander observer |
| P0 computed visibility | Signed azimuth/elevation at both sites and both bodies with same UTC/model, classified using documented threshold | Unknown/boundary, not invented clear/blocked |
| P0 verification | Parser round-trip and independent check where available; record reference to verified Horizons response | `Provisional`, never independently validated |
| P0 crossing | Bracket [t_i,t_i+1] if sign changes; no exact second from hourly samples | Show bracket or `not resolved` |
| P1 DEM | Source CRS `MOON_ME`/DE421 alignment; 5m interpolation not equated to independent measurements | Terrain disabled |
| P1 far-field | Coverage and horizon convergence tests across distance, azimuth and resolution; sightline trace | `incomplete coverage`, not `clear` |
| P1 near-horizon | Angular clearance/error budget, finite disc policy, uncertainty category | Boundary/unknown |
| P2 robustness | Named supported terrain realizations and manifest, counts, no false calibrated probabilities | Feature disabled |

JPL source: https://ssd.jpl.nasa.gov/horizons/manual.html (`4` apparent AZ/EL; lunar east-positive); PGDA source: https://pgda.gsfc.nasa.gov/products/78 (5m DEM, ~90% interpolated, frame and uncertainty products). Scientific comparison must maintain its own evidence revision and not borrow visual-asset metadata as computational provenance.

### Three-valued simultaneous condition

| Sun | Earth | Both |
|---|---|---|
| above | above | above |
| below | unknown | below |
| unknown | below | below |
| above | unknown | unknown |
| unknown | above | unknown |
| unknown | unknown | unknown |
| boundary | above | boundary (not guaranteed) |

This is qualitative center-of-disc geometry only. Terrain blocker + unknown other input follows logically verified false ∧ unknown = false; true ∧ unknown = unknown. Define policy for `boundary` explicitly and test. Never interpret `both` as guaranteed available solar power or an RF link.

## 5. Release plan and effort estimates

**Phase A0 (30–60min):** snapshot working branch, tests, data release manifest, verify selected event/team/resources and submission requirement. Save screenshots and deployed URL. **STOP if no baseline can be restored.**

**Phase A1 (2–4h):** implement Meridian Cut tokens, typography, clear nav, Discover hero, interactive CTA, new Explorer hierarchy; preserve real data bindings. Focus on actual 1440×900/360×800 display. If there is only time for one implementation feature, make *comparison legibility* better, not add 3D.

**Phase A2 (2–4h):** integrate signed altitude charts, scientific state labels, one time axis, chart alternatives, Evidence sheet and guided narrative. Validate existing parser/data samples; avoid making the entire UI data-less. Do screenshot-based review.

**Phase A3 (1–3h):** polish transitions, cut responsive overflow, test keyboard/touch and source links, optimize assets, record 30s demo, deploy and complete submission. Have a stable version ready **well before** portal closing; aim for ≥3 hours buffer, not the final minute.

**Phase B1 (8–16h additional, contingent):** inspect and establish verified DEM + long-range horizon; only then connect Cause to existing sample records, with full source→run→case→trace lineage.

**Phase B2 (8–20h additional):** height/clones robustness, selected research cases, performance and accessibility extended testing. Do not assume these can fit before competition deadline; the total engineering time is scenario-dependent.

Effort ranges are **estimates, not promises or elapsed hours measured in Codex**. Parallel agents may shorten critical path but increase integration risk.

## 6. Release gates (strict)

- **R0**: current functioning baseline frozen; commit/hash and public URL documented.
- **R1**: layout and route reconstruction works, no scientific regression.
- **R2**: source-backed A/B flow, signed elevations, timeline and evidence all coherent.
- **R3**: landing/story refined, mobile + keyboard + no-WebGL passes; browser screenshots reviewed.
- **R4**: public deploy, direct route refresh, source credits, AI disclosures, submitted project confirmed.
- **R5 conditional**: terrain Cause mode only on confirmed scientific inputs with numeric proof and regression tests.
- **R6 optional**: validated robustness analysis.

A release may be promoted only on actual test evidence. If R3 fails close to submission, revert to R2 or R0 and submit working product. No dangerous last-minute branch replacement.

## 7. Implementation priorities (benefit vs risk)

| Feature | User/design value /5 | Science dependency | Estimated work | Decision |
|---|---:|---|---|---|
| Distinctive hero + clear CTA | 5 | None | 2–3h | MUST SHIP if feasible |
| A/B synchronized data stage with readable signed altitude | 5 | Existing P0 | 2–4h | MUST SHIP |
| Evidence drawer and explicit model | 5 | Existing manifest | 1–2h | MUST SHIP |
| Mobile A/B switch and persistent UTC | 5 | Existing P0 | 1–3h | MUST SHIP |
| Guided discovery case | 4.5 | Verified selected case | 2–4h | STRONGLY RECOMMENDED |
| Brand motion and transition | 3 | None | 1–2h | AFTER critical QA |
| NASA light globe context | 3 | Asset and coordinate checks | 2–4h | OPTIONAL |
| Full WebGL Moon GLB | 2 | Asset/texture/perf | 4–8h | DEFER |
| Terrain-aware Cause | 5 science | PGDA + far-field + model | 8–16+h | RESEARCH GATE |
| Robustness ensemble | 4 science | Clone computations | 8–20+h | DEFER |
| Fake 3D blocked ridge | 0 | Scientifically invalid | Any | REJECT |

## 8. QA and user-value definition

At minimum test: selectors, keyboard, exact source sample indexing, no fake interpolation, visible signed angles, A/B swap, source deep links, page reload/deep-link, 320px overflow, reduced motion, no-WebGL, invalid data and source access, semantic alternative table, and one real judge journey from initial arrival to evidence. Use Playwright after local app available; snapshot after each major change. A visual director should reject the design if it could be mistaken for any generic “moon + gradient + cards” template even if it passes tests.

## 9. Competition protections

Capture a short genuine live product video rather than playing a conceptual mock. Ensure challenge-specific qualifying NASA resource documented; source and third-party asset credits; AI tools disclosed; team and selected event eligibility confirmed separately; English project description; public links private-window accessible; final portal state **submitted**, not draft. Official 2026 page: https://www.spaceappschallenge.org/2026/ ; GO submission: https://github.com/nasa/spaceapps/discussions/1973 ; GO resources: https://github.com/nasa/spaceapps/discussions/1827 .
