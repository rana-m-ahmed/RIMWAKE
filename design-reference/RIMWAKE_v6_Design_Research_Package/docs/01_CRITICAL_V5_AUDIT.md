# RIMWAKE v6 — Adversarial Audit of v5 and the Existing Screenshots

**Evidence boundary:** Four supplied screenshots and the v5 planning package were inspected; the actual working repository was not accessible for source inspection or browser interaction. A connected GitHub search found `rana-m-ahmed/RIMWAKE` but it reported an empty repository at the time checked; this is **not proof that the local working code is absent**. Ratings below are design assessments, not instrument measurements or user-testing results.

## Executive verdict

v5 improved the constraints and the list of intended pages, but **it substituted one predictable aesthetic for another**. A midnight-blue background, Space Grotesk/Inter, an illuminated 3D Moon and gold/cyan/purple accents are a familiar generated-space-site grammar; they do not express the core intellectual idea of RIMWAKE: **the same instant produces different local skies depending on the observation location**. v5 is a usable implementation specification, not a validated creative direction. Its “50/50” status concerns document integrity, not visual quality. This v6 effort changes the design concept, navigation shape, hierarchy, narrative and proof requirements.

## Baseline observations from screenshots

1. **Composition:** screenshot 1 devotes a large portion of the viewport to a text hero followed immediately by a huge dark instrument shell. The story and instrument are neither separated into meaningful modes nor blended as a coherent one.
2. **Scientific stage:** screenshot 2 uses two modest radial charts surrounded by unproductive negative space, very small mono metadata, and horizontally scattered site controls. A user must scan many regions to answer a basic question.
3. **Unclear visual hierarchy:** the site/time controls, selected observation and chart are similar in intensity. “Next crossing,” dates, evidence and science states compete without a designed reading order.
4. **Color:** warm gray + olive and very deep green create a muted administrative aesthetic that conflicts with the wonder of lunar exploration; primary actions are difficult to identify.
5. **Temporal data:** screenshot 4 contains useful compact horizon-loom information, but the temporal story is far below the primary chart and is presented as an anonymous barcode. The time comparison itself should be the signature interaction.
6. **Scientific honesty to preserve:** the app explicitly labels “Geometric horizon · terrain excluded,” “Hypothetical observer,” 60-minute samples, bracketed crossings and provenance. These are important merits, not flaws.
7. **Current example:** screenshot site labels refer to Odysseus IM-1 / Athena IM-2. Their displayed coordinates, observer heights and associated Horizons runs must be checked against the actual manifest and original mission sources. No screenshot proves that either location is the exact landing site or that the scientific pipeline is independently validated.

## Keep / Rework / Replace / Eliminate register

| ID | v5 idea | Decision | Evidence / failure mode | Concrete correction | Priority |
|---|---|---|---|---|---|
| D01 | Centralized source/state contract | **KEEP** | Prevents disagreement among charts | Preserve immutable scientific records and IDs | P0 |
| D02 | Two-site synchronized observer comparison | **KEEP** | Direct official challenge fit | Make visible within first meaningful interaction | P0 |
| D03 | Separate landing and Explorer | **KEEP/REFINE** | Current root panel confuses intent | Direct arrival `/`, one-click launch `/explore` | P0 |
| D04 | Dedicated Cause + Robustness pages | **REWORK** | Too many destinations for a time-limited product | Progressive “Investigate” workspace tabs; future direct deep links | P1 |
| D05 | Space Grotesk + Inter + mono | **REPLACE** | Typical AI-generated space UI | Editorial Newsreader + IBM Plex Sans + IBM Plex Mono | P0 |
| D06 | Uniform dark midnight aesthetic | **REPLACE** | Familiar, weak page rhythm | Contrast warm paper editorial surfaces and dark observation stage | P0 |
| D07 | Massive hero Moon globe | **REWORK** | NASA Eyes/Moon Trek already have globes | Crop Moon as context; large **two-sky seam** is identity | P0 |
| D08 | Gold/cyan/purple everywhere | **REWORK** | Purple simultaneous state increases visual noise | Limit gold Sun, blue Earth, simultaneous as interlocked pattern—not another dominant color | P0 |
| D09 | Many boxed panels and cards | **ELIMINATE** | Recreates dashboard DNA | Use one stage, one timeline and one contextual reading rail | P0 |
| D10 | Generic scrolling animations | **REPLACE** | Motion not connected to learning | Motion follows *selection, temporal change, viewpoint switch* | P1 |
| D11 | Decorative terrain behind science plots | **ELIMINATE** | Misleads terrain model state | Illustrative landscape may exist only on story stage with clear label | P0 |
| D12 | `Next crossing` precision | **REWORK** | Hourly samples can only bound events | Show [t0, t1] bracket; refine only if computed | P0 |
| D13 | Entire globe as scientific evidence | **REJECT** | Render texture isn't DEM nor line of sight | Separate visual globe from terrain proof | P0 |
| D14 | Large multi-route site map | **REWORK** | Fragmented for a first-time judge | Nav: Discover / Explore / Method; nested Investigate | P0 |
| D15 | Simultaneous state color only | **REWORK** | Accessibility and truth-table risk | Pattern+label+explicit 3-valued logic | P0 |
| D16 | Robustness as mandatory competition feature | **DEFER** | Uncertainty clones need validated computation | Feature flag and scientific activation gate | P2 |
| D17 | Lighthouse/contrast planning targets | **KEEP WITH CAVEAT** | Not evidence of implemented accessibility | Browser measurement + keyboard tests | P0 |
| D18 | v5 planning QA score as a quality signal | **REJECT** | Mechanical checks cannot validate design | Screenshot reviews and human evidence rubric | P0 |

## Red-team objections

**Design director:** “This is just another dark space dashboard with a Moon PNG.” Counter: brand identity must work without a Moon image and be visible in a plain chart. We choose a **bisected meridian line** repeated in the heading, slider cursor, paired instrument and story chapters.

**Scientific reviewer:** “The chart implies local terrain blockage, but its threshold is an ideal tangent plane.” Counter: title every chart with `Geometric / terrain not modeled`; make below-zero readings visible instead of hiding them off a hemisphere plot; inspect datum and observer height.

**Usability reviewer:** “There are too many destinations before I can compare two sites.” Counter: an instantly available `/explore` with default verified A/B state and `Begin guided discovery` route; advanced work behind `Investigate` progressive disclosure.

**Performance reviewer:** “A large animated Moon model makes the product slower to demonstrate.” Counter: static image/CSS-first hero, optional lazy-loaded WebGL only after the first useful render, explicit no-WebGL path.

**Competition judge:** “I see impressive graphics but no original result.” Counter: first 30 seconds must show one genuine dataset-backed observation, a selected UTC time, a transparent comparison and an evidence link; if no computed result exists, show correct limitations rather than a manufactured event.

## Risk grading and stop conditions

| Severity | Defect | Release decision |
|---|---|---|
| BLOCKER | Fake observation, unsupported terrain finding, wrong coordinate sign/frame, lost source record | STOP; roll back to verified release |
| BLOCKER | Site/date flow broken, no accessible submission link, cannot deploy | STOP feature work; restore usable build |
| HIGH | Hero visually attractive but charts unreadable; mobile overflow; inaccessible controls | Fix before acceptance |
| HIGH | Globe adds >2.5MB transfer to first useful explorer view or delays interaction materially | Defer loading / simplify |
| MEDIUM | Typography/spacing/panel hierarchy still generic | Another deliberate design pass |
| LOW | Minor decorative alignment | Fix only after core quality passes |

## What v6 changes

v6 is not v5 repainted. It changes: visual concept (from midnight-template to **Meridian Cut**), the meaning of layout (two reference frames in one continuous visual), navigation (3 destinations rather than 7), signature interaction (synchronized divide and inspect), scientific visibility treatment (positive/negative altitude on calibrated strips), narrative (guided, dismissible act sequence), asset use (Moon as atmosphere not proof), and QA (real prototype screenshots). The working scientific backend remains an upstream dependency, not something to rewrite casually.
