# CODEX / ANTIGRAVITY — RIMWAKE v6 MERIDIAN CUT EXECUTION DIRECTIVE

**MISSION:** Transform the existing, working RIMWAKE 2026 lunar visibility application into an extraordinary, lucid, source-grounded scientific product. The previous UI was rejected. v5 produced a conventional dark-space website concept; **v6 deliberately chooses MERIDIAN CUT**, a precise editorial/scientific product organized around one UTC line and two local lunar views. This is a directive to work **inside the existing repository**, not start a new unconnected demo. The enclosed `prototype/` is an interaction/visual *layout proof* with **no live scientific data**; it must never be shipped as though scientific values were loaded.

## Non-negotiable behavior

**Do not stop after writing documentation. Implement the redesign and validate it in the actual running application.** Preserve all real ephemeris/site data and working scientific logic. Do not invent observations, terrain, landing-site coordinates, event timings, tests, scores, user studies, model reliability, source access or NASA endorsement. Prioritize a working entry and verified submission over unproven features. Make strong decisions within the specified design system without asking many routine questions.

### Mandatory files — read in this order

1. `docs/01_CRITICAL_V5_AUDIT.md`
2. `docs/03_CREATIVE_DIRECTIONS_AND_DECISION.md`
3. `docs/04_VISUAL_IDENTITY_AND_DESIGN_TOKENS.md`
4. `docs/05_INFORMATION_ARCHITECTURE_AND_SCREEN_UX.md`
5. `docs/06_GUIDED_STORY_AND_DEMO.md`
6. `docs/07_3D_MOTION_AND_PERFORMANCE.md`
7. `docs/08_EXECUTION_AND_SCIENTIFIC_ROADMAP.md`
8. `docs/02_AWARDS_COMPETITION_AND_BENCHMARKS.md`
9. `docs/09_INDEPENDENT_QA_DECISION_AND_LIMITATIONS.md`
10. `prototype/index.html` + `prototype/style.css` + `prototype/app.js` + screenshots, if included.

Read the old v4/v5 source plans in the repository only to recover validated scientific and platform context. **v6 is authoritative for art direction, hierarchy and route design**; existing genuine data records are authoritative for observations. If a scientific contradiction occurs, prefer data+validated computation and document the discrepancy before display.

## Phase 0 — verify reality and protect the working release

- Determine actual repo root, git origin, branch, commit, package manager, tests, commands, deploy target, data filenames, manifest versions, server/API assumptions and external link dependencies. Do not infer from name alone.
- Capture `git status`, current production deployment URL/version if available; create `release/r0-snapshot` branch or safe tagged reference and a reconstruction branch. Do not overwrite working build without rollback.
- Run existing build/typecheck/tests **before changes**. Save logs. Capture screenshots at 1440×900 / 768×1024 / 360×800 using your available browser tooling. Annotate the visual defects in the baseline.
- Inventory implemented/provisional/missing functionality from *source inspection*: actual routes, site selection, shared UTC, Horizons run, comparison, Horizon Loom, evidence, Cause/Robustness, settings, mobile behavior, tests. Distinguish plan from implementation.
- Check selected official NASA challenge Resources tab, identify exactly which qualifying NASA dataset is used, confirm event/team eligibility, note remaining submission time. Do not claim submission/eligibility from a code artifact.
- Commit `docs/V6_ACTUAL_REPO_AUDIT.md` and `docs/FEATURE_STATUS.md` with observed evidence; create `docs/RELEASE_LEDGER.md`.

## Phase 1 — rebuild structural UX, not cosmetic styling

- Implement three clear navigation destinations: Discover `/`, Explore `/explore`, Method `/method`. Integrate Guided Discovery as a skippable flow and Cause/Robustness as gated investigative panels; retain backward-compatible deep links and ensure Vercel direct-refresh works.
- Create reusable tokens from doc 04. **Reject Space Grotesk/Inter as the principal visual identity**; use Newsreader for large editorial headings (verify rights/availability), IBM Plex Sans controls, IBM Plex Mono scientific numerics. Fallback gracefully; never deliver font files to user outside standard open-licensed app asset workflow.
- Construct Meridian Cut visual signature: precise A/B seam at a common time; use it in logo, headline transition, comparison and timeline. The page must remain distinctive when decorative lunar art is removed.
- Rebuild the landing hero at 1440×900 with 43/57 split, readable immediate purpose, cropped lunar context and one prominent `Enter the Explorer`. No giant marketing-card grid, no extra long introduction, no mandatory 3D. Use NASA imagery only after asset attribution/rights checks; do not call a lunar color texture scientific DEM.
- Create a genuinely different mobile layout with a 44px+ touch interaction and legible chart, not just scaled desktop.
- Do **not** transplant the separate design prototype into production with its placeholder values; use the working site's actual data selectors and metadata.

## Phase 2 — world-class scientific workspace

- Build one dominant A/B instrument with a single global UTC state. Site selectors and reference/observer status visible; same signed scale and axis definitions on both sides. Show Sun and Earth positions for *actual valid samples*, including **below-zero** elevation. Date scrubbing snaps to known sample IDs; no made-up interpolated measurements.
- Add a compact Horizon Loom; exact difference note derived from records; model badge `Geometric / terrain excluded` where P0 only; evidence source drawer with run IDs, source URL, coordinates/frame, time resolution, elevation assumptions and limitations.
- Handle `above`, `below`, `boundary` and `unknown` and combined states correctly; `unknown` never silently zero or blocked. Bracket hourly crossings instead of claiming exact time. Provide text/table equivalents to SVG.
- `Swap A/B` must change all dependent record and legend state consistently. An inactive scientific module must present an honest research-stage state, not an empty interactive widget.
- Preserve working science: Horizons apparent AZ/EL for Moon topocentric observers, same UTC, appropriately defined east-positive longitude, documented offset from Moon reference surface, independent check where actually run. **Never claim** Sun above geometric plane guarantees power or that Earth above guarantees RF link.
- Make first useful chart load with zero WebGL requirement.

## Phase 3 — guided story and meaningful craft

- Implement 4–6 concise acts drawing from one **verified case manifest**, skippable, with no separate fictitious sample. Source-aware fallback if no dramatic contrast exists.
- Use purposeful motion (~120–900ms as defined in doc 04) for seam/story/selection only. Respect reduced-motion and interrupted interactions.
- Optional lightweight NASA texture sphere or context model may be lazy imported **only if the main experience remains fast and scientific accuracy is unaffected**. NASA `moon_small.glb` is ~13.2MB, so not a default first-paint asset. No random terrain mesh masquerading as LRO data.
- Add coherent loading, error, boundary and uncomputed states. All buttons and controls must work; do not ship decorative interactions.

## Phase 4 — scientific expansion (explicitly gated, **not** competition critical)

Only when source/coordinate and geodesy tests prove correctness, implement Cause Lab: local LDEM, near/far skyline, ray trace, obstruction coordinates and lineage. Verify MOON_ME/DE421 alignment, observer height from terrain surface, far-field coverage, resolution convergence, near-zero clearance errors and source permissions. Then optional height/clone experiments may be developed. If gates fail, show honest unavailable state; **do not** keep generating simulated obstructions to satisfy the product concept.

## Phase 5 — five independent QA loops and remediation

**Loop A Creative:** Compare actual screenshots against old screenshots; judge whether it feels like a generic dark SaaS app, and reject if so. `MERIDIAN CUT` should be apparent even in plain charts.

**Loop B Composition:** Capture 1440×900 / 768×1024 / 390×844 / 360×800 / 320px if possible. Inspect typography, contrast, alignment, chart scaling, negative space, overflow, readability, labels and focus. Fix issues then **recapture**. Do not claim screenshots exist unless saved.

**Loop C Scientific:** Run existing unit tests, current source fixture regressions, AZ/EL signed plot tests, three-valued logic, site/time consistency, invalid data, source-provenance links. Record *actual* test results and exact commands.

**Loop D Mobile/A11y/Performance:** Test keyboard focus/escape/drawer, semantic text table, touch targets, reduced motion, blocked/unavailable records, no-WebGL; test route reloads. Run production bundle analysis and page performance with cold runs. Performance targets are goals, **not achieved results** until measured.

**Loop E Judge demo:** first 5s distinct, 15s understandable, 60s actual comparison, 3min verifiable; record a 30s or shorter genuine app demo **or** up to seven slides as applicable from portal. Show exact NASA source in challenge Resources tab, model assumptions, contributors and AI tools. Verify public links in private browsing mode and submit before portal deadline. **Confirm submitted state** rather than saying “done” after typing fields.

### Release safety

`R0` baseline saved → `R1` navigation/design stable → `R2` source-backed science coherent → `R3` visual/mobile/a11y refined → `R4` deployed and submission-ready. Each gate has test logs and commit. If late failures occur, roll back to the last working R2/R0 rather than rushing unverified scientific features. Keep work atomic and commit coherent units. Parallel agents may work only in non-overlapping files/branches with integration owner and test gate.

## Deliverables / expected final report

1. `docs/V6_ACTUAL_REPO_AUDIT.md` identifying actual implemented and missing pieces.
2. `docs/V6_PRODUCT_MASTERPLAN.md` adapted from v6 package and repo evidence (do not restate generic adjectives).
3. A functioning landing, Explore, Method route system implemented in existing source.
4. Actual screenshot files at supported sizes, before-and-after comparison and specific defects fixed.
5. Real build/typecheck/test/playwright/Lighthouse results with PASS/FAIL/BLOCKED/NOT RUN.
6. Updated real-data provenance, credit/AI disclosure and science limitation pages.
7. Release commit, live link, deployment method and rollback path, if actually performed.
8. 30s demo/submission checklist, actual status and proof, if permitted access.
9. Feature matrix `working / provisional / research-gated / not implemented`.
10. Prioritized next steps with estimated effort, and no false claims of scientific validation or award eligibility.

## Final acceptance definition

I will **not** accept: another navy gradient with floating Moon and card grid; tiny illegible science labels; speculative terrain shown as fact; inaccessible decorative controls; invented readings; landing page disconnected from instrument; placeholder prototype shipped as live data; unsupported screenshot/test/award success claims; or a report that describes work but does not implement it.

I **will** accept: a distinctive Meridian Cut design, immediate discoverability, a magnificent *and readable* twin-view scientific instrument, genuine synchronized data, clear evidence access, purposeful motion, reliable mobile interaction, measured performance and explicit scientific uncertainty. **The scientific interaction should be the art direction.**
