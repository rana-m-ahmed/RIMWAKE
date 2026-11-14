# RIMWAKE v6 — Three Real Creative Directions and Final Decision

This review intentionally does **not** assume v5's Midnight Lunar Observatory should win. Each alternative changes the cognitive model of the application as well as its appearance.

## Concept A — NOCTURNE / The Mission Instrument

**Thesis:** RIMWAKE is a dark, expertly crafted instrument in an orbital operations room. First frame: a moonlit sphere floating off-axis against black, with a large scientific heading overlaid; secondary control strip shows two sites and selected UTC. Workspace: black-on-charcoal vertical mission-console with two 45% panorama panels, analog sky discs and a timeline running along the bottom. Typography: restrained neo-grotesk headings, monospaced coordinates. Palette: #080D16 / #152231 / #F4F6F8 with solar amber and blue. Navigation: Observe / Compare / Evidence. Motion: orbital push-in, gauge ticks, restrained lighting. 3D is central.

**Strength:** intuitive “NASA instrument” category, cinematic cohesion, easy to deploy with existing dark charts. **Weakness:** highly derivative; repeating v5's generic “dark space with glowing globe” in a better implementation may still fail the originality standard. **Science risk:** decorative 3D easily mistaken for actual terrain. **Mobile:** two-column instruments collapse awkwardly. **Award fit:** Science/Data more than Art/Storytelling. **Feasibility:** moderate.

## Concept B — MERIDIAN CUT / The Two-Sky Field Folio — **SELECTED**

**Thesis:** The product is a scientific field folio split by a single **meridian seam**: two sites, one UTC instant. The visual grammar emerges from the *comparison itself*. The visual transition from light editorial paper into a dark instrument stage literally crosses a horizon boundary. A diagonal or vertical cut makes A/B comparison instantly legible without forcing the user to decode two unrelated charts.

**Hero:** left 43% pale mineral paper with giant expressive editorial typography and minimal scientific annotation; right 57% ink-black lunar context or a cropped NASA-sourced lunar surface. A thin measured line cuts across both halves; the left label `A` and right `B` are connected by the time tick. A large title is legible without animation. One primary CTA. A narrow bottom filmstrip previews 3 scientific reading steps instead of cards.

**Workspace:** a compact light-metal masthead (wordmark, Observe/Guided/Method, source-state), then an immersive charcoal scientific sheet. One shared, visually commanding temporal axis under the headline; a 50/50 optical diptych with two equally scaled *calibrated* horizon instruments; a narrow collapsible 22% evidence and insight rail. The selected UTC is shown once in the common divider, not repeated everywhere. **Below-zero as well as above-zero elevations are shown**, so the scientific plot is not merely a celestial dome.

**Type:** Newsreader for human-facing narrative (`font-optical-sizing:auto`), IBM Plex Sans for controls and prose, IBM Plex Mono for numeric values and source IDs. **Colors:** mineral paper #F0F1ED, porcelain #FBFCF8, charcoal #0B121B, deep panel #111E2B, warm solar #EEB66B, Earth #86C7EB, typographic ink #17212B; no broad purple UI.

**Signature interaction: `The Meridian Split`:** one UTC cursor scrubs two synchronized sky sections; selecting an actual sample changes both sides. User can tap the center seam to see a compact difference summary, click a band in the Horizon Loom to jump to a computed sample, and inspect exact data provenance. The local terrain skyline replaces the geometric reference **only** when supported, without switching to a separate invented simulation.

**3D:** secondary contextual cutaway, optional. An authentic small-texture lunar sphere can introduce site context but is **not** the primary metaphor. **Motion:** seam expands on entry; camera/crop is interrupted by direct navigation. **Narrative:** short editorial Acts (Question / Observe / Compare / Explain) with a skip option. **Mobile:** one site at a time but the shared cursor and comparison summary persist. **Accessibility:** high contrast and text equivalents; reduced motion does not change content.

**Science risk:** the visual split could imply causality beyond geometry. Mitigation: the evidence summary explicitly names which model produces each difference and differentiates observed geometric angles from proven terrain obstruction. **Award fit:** particularly strong Storytelling/Art & Technology with Data support. **Feasibility:** relatively favorable because bespoke 2D/CSS is lightweight. **Memorability:** the meridian seam becomes the logo, the cursor, the story cut and the scientific split.

## Concept C — SELENOGRAPH / The Cartographic Expedition

**Thesis:** Begin with an excellent south-pole map, plan two stops, then open a foldout with their skies. Visual reference: field surveying notebook / museum map collection. Hero uses monochrome lunar relief, coordinate rulers and typography more like an atlas than a space site. Palette: off-white #F7F6F1, rust copper #A46248, granite #27313A, glacial blue #477DA1. Type: tightly edited serif titles + engineered sans map labels. Full-bleed map takes ~68% desktop viewport; right 32% comparison inspector. Motion: cartographic zoom and foldout. 3D: one optional terrain flyover. Narrative: select two locations, compare in a map-first spatial story.

**Strength:** visually differentiated, serious scientific mapping association. **Weakness:** more dependence on trustworthy basemap projections, high-res data, coordinate correct pins, and viewport-sensitive GIS UI. The official challenge focuses **time + sky** rather than general mapping; spatial-first can obscure the main task. **Mobile:** map+inspector is difficult. **Award fit:** Data/Science. **Feasibility:** lower for the competition.

## Transparent decision model

Weights reflect immediate task: visual identity 18%; scientific clarity 18%; storytelling 15%; UX 15%; direct challenge fit 10%; implementation feasibility 9%; mobile 5%; performance 4%; accessibility 3%; brand recall 3% (sum **100%**). Scores are prospective expert judgments on a 1–10 scale, **not** empirical performance data.

| Criterion (weight) | A: Nocturne | B: Meridian Cut | C: Selenograph |
|---|---:|---:|---:|
| Visual identity (18) | 6.0 | 9.2 | 8.8 |
| Scientific clarity (18) | 8.0 | 9.0 | 8.1 |
| Storytelling (15) | 6.7 | 9.3 | 8.0 |
| UX clarity (15) | 7.4 | 9.0 | 7.0 |
| Challenge fit (10) | 8.8 | 9.4 | 7.4 |
| Feasibility (9) | 7.4 | 8.4 | 5.8 |
| Mobile (5) | 7.0 | 8.8 | 6.0 |
| Performance (4) | 6.2 | 9.1 | 5.7 |
| Accessibility (3) | 7.0 | 8.6 | 7.0 |
| Memorability (3) | 6.4 | 9.4 | 8.4 |
| **Weighted /100** | **71.8** | **90.6** | **75.4** |

The numeric scores indicate a **selection preference**, not a prediction of implementation quality or awards. Direction B is deliberately chosen because it expresses the application's scientific proposition through its *layout*: a local perspective split synchronized by time. It needs no large external library to make the concept coherent.

## Final decision

**Select B — MERIDIAN CUT**, borrowing only the scientific accuracy and chart discipline of A and the quiet map annotations of C. Do not merge the three into a messy hybrid. Reject purple/cyan nebula gradients, card grids, sci-fi HUD copy, planet-as-hero-only pages and compulsory movie-length transitions.

**Critical test:** If we remove the Moon art, the page must still be unmistakably RIMWAKE because its typography, seam motif, scientific time axis and diptych remain distinct. If it fails, the design is not finished.
