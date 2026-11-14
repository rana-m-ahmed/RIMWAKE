# RIMWAKE v6 — Information Architecture, Journeys and Screen-by-Screen UX

## Final sitemap and route contract

```text
/                         DISCOVER: editorial gateway, optional guided invitation
/explore                  EXPLORE: shared UTC + A/B instrument + Horizon Loom
/explore?case=<id>        Deep link to verified investigation case, same explorer
/method                   METHOD: scientific explanation, data, provenance, credits
     └─ Explore panels: Inspect → Cause (gated) → Robustness (gated)
     └─ Contextual sheets: Select site / Evidence / Model assumptions / Help
```

**Removed as mandatory separate navigation:** `/about` becomes a section in Method; `/investigations` becomes a guided case chooser inside Discover/Explore; `/cause` and `/robustness` become progressive disclosure tabs in an Inspect panel. Deep links may exist as aliases after validation; do not expose broken empty routes. Only three primary navigation destinations must be cognitively visible.

## Four primary workflows

1. **Judge, first 30 seconds:** Landing purpose in 4 seconds → Enter Explore → one source-backed A/B comparison at a selected UTC → open Evidence/Why → understand geometric caveat. No 3D loading requirement.
2. **Casual visitor:** optional “See one discovery” → short story preview → interaction with site/time → one meaningful interpretation → direct open exploration.
3. **Scientific reviewer:** Explore → model badge → raw IDs, Moon frame/longitude, observer radius/elevation assumption, exact Horizons query/release, sampling, validation checks, limitations and source URL. Ability to copy a reproducibility summary.
4. **Returning researcher:** direct `/explore?case=id` or manually select sites/time → inspect signed elevations and timeline → export only if backend supports it; user preferences may persist only with clear state/version rules.

## Screen 1 — Discover (desktop)

**First 1440×900 viewport:** 76px navigation; 43/57 split; left small `LUNAR / FIELD STUDY 01` above a distinctive 100px Newsreader headline; two-sentence explanation; `Explore the two skies →` primary CTA and `Watch the 25-second story` secondary link. Right: a dramatically cropped Moon illustration or verified NASA image, framed by meridian seam and modest annotations: `A` and `B` **are viewpoint concepts**, not fictitious pinned coordinates. At bottom, subtle strip shows the workflow. Avoid huge stats or automatic signup form.

**Subsequent scroll:** one `Question` section with an annotated two-view schematic; one `Try the instrument` section with a genuine (if available) embed or clear link; `What the instrument can—and cannot—tell you` with terrain limitation; one source-backed proof record and a final CTA. Aim for 3–4 substantial sections, not six similar marketing blocks.

**Behavior:** nav stays concise, CTA directly loads existing app state, narrative is skippable, fallback art shown without WebGL. Focus and Escape semantics preserved.

## Screen 2 — Explore (desktop)

**Visual read order:** `Compare two lunar skies` → choose Site A/B → shared UTC ribbon → largest side-by-side signed elevation/sky displays → immediate difference note → Horizon Loom → Evidence access.

**Header:** 70px paper background to distinguish navigation from dark scientific stage. Persistent `P0 · geometric horizon` badge with accessible explanation; primary focus is not an arbitrary floating sidebar.

**Stage layout at 1440:** stage margin 24–40px; within it, A and B each ~46%, central meridian divider ~8% including UTC cursor and difference summary. Exact width may adapt to data density. Header labels share baseline. All chart axes use matching scale. Left and right bodies have labeled Sun/Earth traces and signed elevation readings. Horizon track spans both columns. Evidence is a discreet 280px slide-in sheet, not a permanent empty rail.

**Interactions:** site picker changes both metadata and source records; time slider can only choose supported samples; click a band in a loom track to select that exact interval/sample and highlight both views; `Next crossing` uses computed bracket and explains resolution; `Swap A/B` swaps all tied state; `Inspect` opens a sheet preserving focus/selected record; chart textual equivalents always visible in compact readouts.

**Scientific nuance:** if the displayed Sun or Earth is below 0°, the plot must either include negative elevation in its calibrated scale **or** use a separate signed strip that clearly shows below-horizon bearing. A sky dome clipped at 0° would conceal meaningful records. `Unknown`, `boundary`, `below`, `above` are distinct. Only actual processed results should populate readouts.

## Screen 3 — Guided Discovery (within Discover/Explore)

Entry: `See a real contrast` with manifest-backed selected case. If no validated contrast, entry reads `Understand a real comparison` and uses a truthful equality case. Step 1 `The same instant`; step 2 `Choose which sky to inspect`; step 3 `Change the shared time`; step 4 `Read the two observations`; step 5 `Open the evidence`; final `Explore your own`. No compulsory tutorial after return visit; don't copy a separate fake demo dataset.

## Screen 4 — Inspect: Cause (conditional)

**No public, enabled scientific controls before numeric gate.** On validated datasets, show 2-layer skyline: geometric reference, actual terrain horizon β(azimuth); user chooses one Sun/Earth sightline, sees a ray trace with terrain intersection, azimuth/distance, DEM identity, far-field support and uncertainty status. A location map is secondary proof. Exact terms: `modeled terrain obstruction at this sampled time`, never `confirmed power blackout`. When unvalidated, show `Cause study not yet available; current view models only the geometric tangent plane` with link to Method.

## Screen 5 — Inspect: Robustness (conditional)

On validated height/clone runs, expose a single variable control (`Observer height`, `DEM realization`) and the fixed assumptions; record output changes across genuine supported data. State ensemble agreement fraction and sample count without claiming calibrated probability. Export run IDs if present; otherwise unavailable. No spurious probabilities or fictitious sliders.

## Screen 6 — Method and source library

Editorial light surface, an anchored table of contents (mobile collapsible). Chapters: `1 What is a geometric horizon?`; `2 What does Horizons compute?`; `3 Where do lunar sites come from?`; `4 What is not modeled?`; `5 Data provenance and reproduction`; `6 Asset and AI disclosure`; `7 Team/independence/credits`. Include one small explanatory diagram with no event numbers. Public source links are distinct from internal artifact IDs. A reader should be able to verify the current data release without requiring a programming background.

## Component/state interaction matrix

| Component | Input | Output and synchronization | Loading/empty/error | Accessibility |
|---|---|---|---|---|
| `SitePicker` | `siteId`, supported site list | New observer metadata and derived records | No fake placeholder site | Native combo, labels and form state |
| `SharedTimeRail` | `selectedSampleId`, list of timestamps | One sample chosen for both sites | Empty means no values | Arrow/Page key semantics, visible timestamps |
| `SkyInstrument` | site/sample/target records | Correct AZ/EL + signed range and marker | Unknown hatch, never zero | Table or text alternative |
| `MeridianComparison` | current A and B records | ΔEL, body state difference, qualitative statement | Graceful “no comparison” | Screen-reader announcement limited |
| `HorizonLoom` | real sample series | Click selects actual sample only | Uncomputed portion grey & labeled | Keyboard-selectable samples / table |
| `EvidenceSheet` | runId, sources, model | Source URLs, method/assumptions | Missing manifest flagged | Dialog focus trap/restore, Escape |
| `OptionalMoonScene` | site coords, asset status | Context only; never scientific elevation | Poster + descriptive text | Decorative graphics hidden from SR when appropriate |
| `CausePanel` | validated terrain ray | Bearing/distance/evidence | Research-stage state | Tab and caption accessible |
| `RobustnessPanel` | supported heights/clones | computed comparison and caveat | Disabled gated modules | Form fields with direct labels |

## Layout contracts

| Width | Discover | Explore | Interaction adaptation |
|---|---|---|---|
| ≥1440 | 43/57 immersive cut, lower editorial narrative | A and B together, date center, compact proof rail | Mouse + keyboard, panels nonblocking |
| 1024–1439 | 45/55 or 50/50 hero | Two-column charts only if label readability passes | Evidence opens as side sheet |
| 768–1023 | stacked hero visual; reduced artwork | A/B vertical stack with shared UTC in sticky row | No horizontal diagram scroll by default |
| 360–767 | hero copy then small lunar context | one site at a time with persistent A/B summary and sticky time | 44px touch targets, bottom evidence sheet |
| 320–359 | typography clamp, buttons stack | simplified signed chart & numeric readouts | no inaccessible mini-elements |

## Error and recovery flows

- No data: explanatory block `Ephemeris record unavailable for this selected time` with supported-range link; never silently choose a different time without updating state.
- Source mismatch: mark record `provisional/invalid` and disable confident claims; keep prior validated case accessible.
- Network unavailable: use versioned cached data only if present and identified; never silently replace data with demonstrative samples.
- WebGL absent: functional science proceeds; context image fallback.
- Invalid deep link: route into Explorer default with a visible explanation, not blank screen.
- Unsupported mobile device: 2D/flat art only, charts still accessible.
- Reduced motion: transitions disabled while state and scientific values stay identical.

## Acceptance tests

The `Discover → Explore → alter shared UTC → compare A/B → inspect evidence` journey must be possible with keyboard and touch. A first-time user should know the selected sites, shared time, model class and evidence location within one glance. Test 1440×900, 768×1024, 390×844 and 360×800; include 320px width where feasible. No chart clipped, no uncontrolled horizontal overflow, no inactive visible affordance, no unresolved sci claims rendered as true.
