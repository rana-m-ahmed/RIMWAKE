# RIMWAKE v6 — Competition, Award Alignment, Precedents and Design Research
**Official 2026 challenge:** Lunar Landing Site Navigator.

**Research date:** 14 November 2026. Evidence labels: **CONFIRMED 2026** official competition page/organizer; **HISTORICAL** 2023–25 pages; **DESIGN INFERENCE** principle inferred from a reference. Award odds are not quantified.

## Verified competition constraints

| Rule / finding | Status | Action and evidence |
|---|---|---|
| Challenge asks for quick landing-site/date comparison and Sun/Earth horizon views | CONFIRMED 2026 | Preserve two sites, shared UTC, visible geometric state; https://www.spaceappschallenge.org/2026/challenges/lunar-landing-site-navigator/ |
| Submit by **15 Nov 2026, 23:59 local time** | CONFIRMED 2026, local time subject to registered event context | Protect stable deployment and submit early; https://www.spaceappschallenge.org/2026/ |
| 30-second or shorter video **or** presentation up to 7 slides | 2026 GO-team answer, verify portal | Design a 25–30s real screen recording; https://github.com/nasa/spaceapps/discussions/1973 |
| Use at least one dataset listed in **this specific challenge's Resources tab** for Global Awards | CONFIRMED 2026 GO Team | Identify exact qualifying item, evidence link and implementation use; not enough to cite NASA photos; https://github.com/nasa/spaceapps/discussions/1827 |
| 2–6 team members needed for **Universal Event Global Judging** | GO Team Nov 12 answer; other event details may differ | Verify selected event and registered roster; https://github.com/nasa/spaceapps/discussions/1947 |
| AI tools and resources need disclosure | CONFIRMED GO guidance | Record Codex/ChatGPT and all artwork/code/data sources; https://github.com/nasa/spaceapps/discussions/1973 |
| General local judging dimensions Impact / Creativity / Validity / Relevance / Presentation | Published on a 2026 local-event page; global rubric should be confirmed if separately published | Use as practical evaluation factors, not invented universal weights; https://www.spaceappschallenge.org/2026/local-events/ajmer/ |
| Global award category wording | **HISTORICAL 2025** | Do not call 2025 categories official for 2026 without further verification; https://www.spaceappschallenge.org/2025/awards/ |

**Open eligibility blockers:** full 2026 PDF guide and the authenticated challenge-specific Resources tab were not inspected in this audit. The user's actual team roster, selected event, license ledger, and submission status are unknown. Resolve inside the official account rather than infer.

## Published historic awards and plausible positioning

2025 official definitions: Storytelling = most creative communication of potential of open data; Art & Technology = strongest combined technical/creative skills; Data = accessibility or novel application of space data; Science = valid use of scientific method. From https://www.spaceappschallenge.org/2025/awards/ .

| Historical category | Fit if work succeeds | Demonstrable evidence needed | Best improvement | Risk / effort |
|---|---|---|---|---|
| Best Use of Storytelling | **High** | 30s narrative that a person can understand and interact with, using real readings | Guided compare: question → observation → explanation → proof | Medium / 3–5h |
| Art & Technology | **High potential** | Bespoke chart graphics + precise interaction + original art direction | Meridian split as single scientific interaction motif | Medium / 5–9h |
| Best Use of Data | **High** | Qualifying NASA dataset visibly linked to working instrument | Side-by-side angle traces + inspectable data & source run | Medium / 3–6h |
| Best Use of Science | **Conditional** | Independent numerical verification, stated assumptions, error bounds | Validated terrain/height case or rigorous P0 comparisons | High / 8–20h |
| Best Use of Technology | Modest | Real technical innovation beyond ordinary Three.js charting | Testable data/evidence pipeline; no buzzword claims | High |
| Best Mission Concept | Conditional | Plausible decision-context with caveats, not power/RF guarantees | Explicit observation-vs-engineering-viability separation | High |
| Most Inspirational | Possible, difficult to predict | Genuine communication value to educators/public | Explain surprising physical geography in a humane narrative | Medium |

**Priority:** craft one coherent **Storytelling + Data + Art/Technology** experience, not disconnected features built for award names. A geometric-only version has a lower scientific ceiling than validated terrain analysis, but can still be honest and useful. No award nomination or win is predicted.

## 2023–2025 precedent evidence

| Year | Verified winning project | Why relevant | What we should learn; what not to imitate |
|---|---|---|---|
| 2023 | **TeamVoyagers**, Best Storytelling | NASA lists a storytelling winner; actual implementation not independently inspected | Link interactive narrative to explicit NASA data, not genre aesthetics. https://science.nasa.gov/directorates/smd/2023-nasa-international-space-apps-challenge-announces-10-global-winners/ |
| 2023 | **Oogway Comics**, Art & Technology | A distinct creative format can coexist with technical delivery | Originality of medium matters; do not copy comic style. Same NASA source |
| 2024 | **Connected Earth Museum**, Art & Technology | NASA describes immersive 2D/3D gallery and climate-science narrative | Immersion needs curated navigation. Avoid giant spatial scenes with weak data interaction. https://www.nasa.gov/learning-resources/stem-engagement-at-nasa/nasa-international-space-apps-challenge-announces-2024-global-winners/ |
| 2024 | **TerraTales**, Storytelling | NASA reports a regional climate narrative and interactivity | Anchor stories in identifiable measurements; avoid invented causality. Same NASA source |
| 2025 | **HerCode Space**, Storytelling | NASA describes engaging illustration teaching space weather | Educators and nonexperts value clear concepts; avoid unverified artistic claims. https://www.nasa.gov/learning-resources/stem-engagement-at-nasa/nasa-announces-2025-international-space-apps-challenge-global-winners/ |
| 2025 | **Zumorroda-X**, Art & Technology | NASA describes interactive farmer mini-games conveying real science | Participation beats spectacle alone; do not convert the lunar instrument into a game. Same NASA source |
| 2025 | **Resonant Exoplanets**, Data | NASA describes data-to-analysis pipeline with explicit use | Expose provenance and user agency; do not fake ML novelty. Same NASA source |

**Caution:** These are NASA summaries, not hands-on benchmark audits of all winners' live applications. No claims are made about their animation frame rate, typography or source-code quality.

## Interactive design benchmark matrix

| Reference | Verified behavior / subject | Transferable principle | Do NOT copy | Cost to adopt |
|---|---|---|---|---|
| [NASA Eyes](https://science.nasa.gov/eyes/) | Browser-based data-informed 3D exploration and time controls | Spatial context can be an enjoyable entry point | Globe-centric navigation for everything | Medium–high |
| [NASA Moon Trek](https://science.nasa.gov/moon/interactives/) | 3D lunar flyovers and measurements | Real geographic context; deliberate source selection | Pretend globe alone is novel | High |
| [NASA Climate Time Machine](https://climate.nasa.gov/interactives/climate_time_machine) | User moves temporal control and sees data change | Time interaction is the story; simple direct manipulation | Flat generic sliders with no physical explanation | Low–medium |
| [Distill: Communicating with Interactive Articles](https://distill.pub/2020/communicating-with-interactive-articles/) | Published analysis of interactive-explanation techniques | Invite a prediction, then reveal true recorded result to improve understanding | Add games detached from scientific evidence | Low–medium |
| [NASA SVS CGI Moon Kit](https://svs.gsfc.nasa.gov/4720/) | Lunar cartographic texture, explicitly aesthetically optimized | Use authentic Moon context at low bandwidth | Treat color texture as quantitative terrain | Low |
| [NASA SVS 2026 Moon 3D](https://svs.gsfc.nasa.gov/14959/) | Real LRO-based web models: 13.2MB small flat, 77.7MB smallest listed topo | Pre-load only if 3D creates concrete value | Add 77.7MB model before first interaction | High |
| [LROC QuickMap (NASA Moon interactives)](https://science.nasa.gov/moon/interactives/) | Extensive lunar mapping and investigation controls | Maps are powerful secondary evidence views | Duplicate full GIS product | Medium–high |

These are **principle-level comparisons** grounded in official descriptions and published interactive-article analysis. This audit did not conduct fully instrumented browser testing across every external benchmark.

## Differentiation: competitors and constraints

A generic Moon globe + site selector + two Sun/Earth gauges is unsurprising and overlaps NASA existing tools and 2026 participant projects. A truly distinctive RIMWAKE interaction pairs a verified temporal difference with an **immediately inspectable evidence trail and a tangible viewpoint split**. Novelty is in integrated explanatory design and transparency, **not** a claim to invent ephemeris computation. Terrain and robustness work increase scientific differentiation only when validated and supported by evidence; present as research extensions otherwise.

## Short demonstration structure

0–4s: the split hero asks “Same moment. Same Moon. Different sky?” 4–10s: directly enter A/B compare. 10–18s: move one shared time selector to an actually computed contrasting sample. 18–24s: point to the different Sun/Earth readouts (or a documented non-contrast if data dictate). 24–29s: open “Why?” showing model assumptions, source link and uncertainty. Last second: project and NASA-data credit. No unvalidated terrain obstruction animation or fake data storytelling.

## Research conclusion

**Most defensible opportunity:** Storytelling + Art & Technology **supported by** Data and rigorous geometric science. **Greatest failure risk:** the team spends the remaining time perfecting lunar CGI, neglects an actual validated result or fails to complete the portal submission. Prioritize state synchronization and proof first, visual distinctiveness second, optional 3D third. In the user experience, however, these should look like one seamless product.
