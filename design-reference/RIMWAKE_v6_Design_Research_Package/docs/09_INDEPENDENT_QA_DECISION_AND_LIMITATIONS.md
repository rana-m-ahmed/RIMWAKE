# RIMWAKE v6 — Independent QA, Decision and Residual-Risk Ledger

**Review scope:** planning artifacts, supplied original screenshots, v5 content, official and external source summaries, locally generated design-proof HTML/CSS/JS. **Not reviewed:** actual RIMWAKE source checkout, validated NASA ephemerides, Vercel live website, NASA project submission, user account/team status. The design proof intentionally has no scientific records. A browser security policy in this execution environment blocked navigation even to local `file:` / localhost pages; **real browser screenshot QA is not a PASS**.

## Evidence classes

`OBSERVED`: directly visible in screenshots or local file content. `OFFICIAL`: supported by NASA/JPL primary source. `INFERRED`: design/research conclusion from observations. `PROPOSED`: planned artifact or acceptance target. `NOT TESTED`: cannot verify with available runtime. No single judgment score is an award probability.

## Independent v5 → v6 change results

| # | Material weakness | v6 change | Evidence type | Assessment |
|---:|---|---|---|---|
| 01 | Standard dark space theme | Meridian Cut editorial/science hybrid | Observed v5 tokens; design proposal | Clear conceptual distinction |
| 02 | Space Grotesk/Inter template appearance | Newsreader/Plex typographic contrast | Observed v5 plan | Strong rationale; actual rendering awaits browser |
| 03 | Seven-way site navigation | Three main routes; science progressive panels | Observed v5 sitemap | Less cognitive overhead, but validate with users |
| 04 | 3D globe as hero guarantee | 2D meridian interaction first; 3D optional | NASA Moon models and NASA Eyes | Smaller critical dependency |
| 05 | Split comparison hard to parse | One shared UTC, one seam, two identical scales | Screenshots | Better conceptual mapping on paper |
| 06 | Tiny chart labels | Explicit 13–15px chart targets and layout | Screenshot | Must measure at mobile |
| 07 | Hidden negative altitude | Signed vertical scale in instrument | v5 science audit | Corrects crucial visualization defect |
| 08 | Geometric model could be confused with terrain | Model pill and evidence visibility | NASA/JPL definitions | Integrity guard |
| 09 | No verified narrative | Source-record-driven skippable guided case | Screenshot and v5 | Narratively stronger, still dependent on case selection |
| 10 | No visual production evidence | Interactive HTML design proof + art | New artifact | Partial design evidence; browser screenshots blocked |
| 11 | Too much optional functionality at P0 | Track A/B and activation gates | v5 plan | Deadline protective |
| 12 | Unresolved submission rule risks | Team/Resources/demo/AI gates prominent | GO Team 2026 | Action still required in official account |
| 13 | Generic microcopy | Precise source-aware story text | Proposed | Appropriate claim boundaries |
| 14 | Big 3D assets could dominate first load | Low-bandwidth stage; 13MB GLB lazy only | NASA SVS size listings | Test actual transfer when implemented |
| 15 | Static QA mislabeled as design quality | Separate parse, art, science, interaction, mobile gates | v5 QA reported scope | More candid acceptance definition |

## Creative-direction decision recheck

**Meridian Cut** selected at 90.6/100 *prospective weighted diagnostic score*, vs Nocturne 71.8 and Selenograph 75.4 in the concept register. The numerical evaluation is a preference model, not a measured A/B user preference. Main concern: editorial serif treatment could distract in a technical workbench. Mitigation: large type reserved for headlines, Plex for measurement and scientific control; no decorative serif labels on charts. Main concern #2: half-light/half-dark hero may reproduce screenshot's beige issue. Mitigation: cool mineral porcelain, high-contrast ink, specific typographic ratio and dark scientific sheet, not olive/green administrative fill.

## v6 acceptance rubric (diagnostic, 100 weights)

| Criterion | Weight | Target acceptance evidence | Status now |
|---|---:|---|---|
| Visual identity/type/craft | 20 | Browser screenshots and critique at ≥3 sizes, not just tokens | **NOT TESTED** actual browser |
| UX and architecture | 15 | Direct judged flow + keyboard/mobile testing | **PROPOSED**; prototype JS exists |
| Interactive storytelling | 15 | Source-backed Guided Discovery in live app | **NOT IMPLEMENTED** in production |
| Scientific trust and visualization | 15 | P0 validation fixtures + unambiguous model and signed plots | **NOT VERIFIED** live backend |
| Originality/meaningful innovation | 10 | Recognizable seam motif + real A/B evidence interaction | **INFERRED**, not user tested |
| Award presentation | 10 | Genuine <=30s screen recording and source disclosures | **NOT PRODUCED** |
| Engineering/performance | 10 | Build, performance trace, source registry, WebGL fallback | **NOT TESTED** live app |
| Accessibility/mobile | 5 | Keyboard focus, semantic alternative charts, 320px, no overflow | **NOT TESTED** browser |

No composite “quality score” will be declared for a website not visually or scientifically tested. The earlier v5 static 50/50 is not comparable to this rubric.

## Red-team blockers and mitigations

1. **No functioning repo provided for audit.** Codex must inspect the actual source and avoid overwriting working logic; local HTML proof is not a replacement app.
2. **Qualifying 2026 NASA data source unknown.** Log into specific challenge Resources tab; choose and demonstrate source use. This is a **Global Awards eligibility gate**, independent of code quality.
3. **Universal Event minimum roster unknown.** If applicable, confirm 2–6 registered participants; do not promise global judging if solo.
4. **App scientific data revision unknown.** Coordinates in screenshots need source and frame verification, P0 sample hashes, signed output tests; no terrain claim now.
5. **Data-source/model scientific completeness.** Local 5m DEM ~90% interpolated; far-field and angular uncertainty must pass before Cause.
6. **Narrative case evidence gap.** Without a validated contrast, use a truthful similar comparison, not dramatic fabricated states.
7. **Canvas/prototype visual QA blocked by browser security.** Deliver static conceptual comps and runnable standalone HTML; receiving environment/Codex must capture true screenshots and run interactions before approval.
8. **Remaining event window finite.** Do not ship 3D if it jeopardizes a stable deploy or official submission.

## Required implementation QA cycles

1. **Creative:** compare rendered page (not token list) against the screenshot baseline; reject generic moon+cards.
2. **Composition:** verify heading proportions, responsive breakpoints, repeated component alignment and chart readability.
3. **Scientific:** test sample invariants, observer frame and truthful unknown/boundary/negative states.
4. **Accessible/mobile:** 1440×900, 768×1024, 390×844, 360×800, and 320px overflow; keyboard, focus trap, reduced motion and textual plot equivalents.
5. **Presentation:** capture actual working release, 30s edit, public source URLs, final portal confirmation.

**Final decision:** **GO** for v6 Meridian Cut as a *design direction and implementation handoff*. **NO PASS** for production UI or scientific fidelity, because the actual code/measurements/browser were not validated here. Preserve the existing verified baseline and promote iteratively.

## Source list and limits

- Official 2026 task: https://www.spaceappschallenge.org/2026/challenges/lunar-landing-site-navigator/
- 2026 submission: https://www.spaceappschallenge.org/2026/
- Organizer dataset requirement: https://github.com/nasa/spaceapps/discussions/1827
- Organizer video/submission guidance: https://github.com/nasa/spaceapps/discussions/1973
- Organizer Universal Event team rule: https://github.com/nasa/spaceapps/discussions/1947
- JPL Horizons: https://ssd.jpl.nasa.gov/horizons/manual.html
- LOLA PGDA: https://pgda.gsfc.nasa.gov/products/78
- NASA imagery: https://svs.gsfc.nasa.gov/4720/ and https://svs.gsfc.nasa.gov/14959/
- 2025 historical awards: https://www.spaceappschallenge.org/2025/awards/
- NASA 2024/2025 winner summaries: NASA official URLs in document 02.
