# RIMWAKE v6 — Meaningful 3D, Motion and Performance Plan

## 1. Why we are not building a giant 3D Moon as the entire app

The official challenge asks users to compare **sites, dates, and local Sun/Earth horizon positions**. A rotating globe primarily explains geographic orientation; it does not directly express local azimuth/elevation nor prove terrain obstruction. NASA Moon Trek and NASA Eyes already provide impressive 3D lunar context. RIMWAKE should distinguish itself with the scientifically readable **paired meridian instrument**. Optional 3D can improve context if its costs are controlled.

## 2. Ranked asset and rendering options

| Option | Scientific role | Visual value | Cost/data | Ship decision |
|---|---|---|---|---|
| Custom graphic lunar silhouette / sourced lightweight still | Context only | High with deliberate art direction | ~150–500KB target | **P0 safe** |
| NASA CGI Moon Kit 2K color texture on basic sphere | Authentic visual surface but **not quantitative terrain** | High | Official file ~447KB; Three.js bundle additional | **P1 optional** |
| NASA 2026 `moon_small.glb` | Detailed globe visualization | High | ~13.2MB official listing | **Defer and lazy-load** |
| NASA 2026 topographic small GLB | Visualized relief, not local obstruction solution by itself | High | ~77.7MB official listing | **Reject for initial page** |
| Data-derived local terrain mesh | Actual obstruction explanation if correctly aligned | Very high scientifically | GIS/DEM/raycast pipeline | **P2, gated** |
| Procedurally generated mountain for “Site01” | Fake terrain | Dangerous | Low computation, high integrity cost | **Reject** |

Official references: https://svs.gsfc.nasa.gov/4720/ and https://svs.gsfc.nasa.gov/14959/ . NASA distinguishes aesthetics-optimized color imagery from scientific terrain models. Reusing assets requires credits and appropriate rights/third-party restrictions review.

## 3. Hero effect specification

**P0:** CSS art / authentic low-bandwidth color-mapped Moon image (if acquired and credited), cropped behind the meridian seam. Subtle 1–2% pointer-dependent perspective is optional, but shall not distract on touch devices. Two viewpoint lines are **symbolic**, never asserted to correspond to genuine site coordinates unless transformed/verified. The first render shall not wait for GPU initialization.

**P1 if valuable:** lazily import a lightweight React Three Fiber scene after idle or when user explicitly opens `Locate on Moon`. Track camera orbit target separately from scientific site vectors, use correctly oriented texture and checked longitude handedness. On mobile, default to a still unless performance is measured good.

**P2 scientific:** local raycast view with verified topography, height, offset datum, near+far-field coverage, signed geometry and obstruction trace. Disable unless test fixture and full evidence lineage pass. This is not achieved by placing an image-mapped Moon model behind a Sun icon.

## 4. Transition language

- **Landing entrance (0.6–0.9s):** headline and seam settle; no mandatory cinematic delay; CTA remains clickable at once.
- **Enter Explore (0.25–0.4s):** seam expands into two comparison frames, then route changes. The content loads independently of animation.
- **Change sample (<=0.18s):** source IDs/readouts update atomically, shared time tick snaps; chart vector transitions are optional but must not display intermediate values as measured.
- **Swap sites (0.24s):** labels and plots exchange within the same fixed scales; not a camera relocation pretending to be science.
- **Open Evidence (0.25s):** quiet paper sheet from the right; background inert while dialog is open, focus trapped, Escape closes, focus restored.
- **3D context (0.35–0.6s):** explicit button, no automatically initiated orbit; fallback jump works if WebGL unsupported.

## 5. Suggested performance budgets — targets, NOT observations

| Budget | P0 proposed target | How to verify |
|---|---|---|
| Largest Contentful Paint | <= 2.5s on measured mobile lab profile | Lighthouse/Chrome performance, multiple cold runs |
| Interaction to Next Paint | <= 200ms field-good target | Field telemetry / browser profiling; lab interaction tracing when unavailable |
| Cumulative Layout Shift | <= 0.1 | Lighthouse/layout-shift logs |
| Initial JS transfer | <= 250KB gzip preferred | Vite build analysis, uncompressed+gzip report |
| Hero visual transfer | <= 500KB preferred | DevTools network content-encoding sizes |
| P0 first load media | No 13MB GLB / no heavy topo asset | Network tab assertions |
| Chart response | <100ms script computation preferred for local discrete state | Performance marks; profile actual hardware |
| GPU | 0 MB WebGL requirement for P0 | Disable WebGL and re-test |
| Mobile width | 320px minimum no horizontal overflow | Playwright viewport check |

A WebGL scene may exceed these budgets only **after explicit opt-in** and a clear fallback. Asset sizes and performance vary by device and compression; never claim targets met based on CSS design alone.

## 6. Accessibility and low-energy modes

`prefers-reduced-motion:reduce` disables parallax, orbital drift, auto-played transitions and scroll choreography. Media uses source/alt/credit. Chart data always has an equivalent HTML table or accessible summary. All motion is pausable/interruption-safe. Use a visibility observer to suspend hidden animated contexts. Use `ResizeObserver` carefully for plots, no unconstrained rerender per pointer event. Canvas/WebGL errors must degrade gracefully. Test forced color/contrast where possible.

## 7. 3D scientific activation evidence

Required before a terrain overlay can be called scientific: data provenance/format/datum/CRS, lunar body rotation frame aligned to ephemeris, ground observer height above **local terrain**, consistent lunar globe reference, interpolation/void handling, >tile far-field obstruction plan, line-of-sight ray sampling convergence, numeric bracketing at near-tangent cases, representative independent check, no ambiguity about Sun/Earth finite-disc. Only then may the UI render an obstruction trace and call it modeled. Else it remains `not available`.
