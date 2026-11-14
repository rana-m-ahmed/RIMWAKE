# RIMWAKE v6 — Meridian Cut / Design Research and Implementation Handoff

This package executes the v6 adversarial-audit brief against the user's existing screenshots and v5 master plan, with official 2026 NASA/JPL source research. It **does not** contain the actual RIMWAKE source repository or validated lunar observations. No existing production code was modified.

## Ten deliverable documents

1. `docs/01_CRITICAL_V5_AUDIT.md` — observable UX defects, 18 keep/rework/replace/eliminate decisions.
2. `docs/02_AWARDS_COMPETITION_AND_BENCHMARKS.md` — official/historical competition findings, winners, product benchmarks, category alignment.
3. `docs/03_CREATIVE_DIRECTIONS_AND_DECISION.md` — three materially different concepts and weighted selection.
4. `docs/04_VISUAL_IDENTITY_AND_DESIGN_TOKENS.md` — production-scale brand rules, colors, typography, components, motion.
5. `docs/05_INFORMATION_ARCHITECTURE_AND_SCREEN_UX.md` — sitemap, journeys, page-specific experiences and state rules.
6. `docs/06_GUIDED_STORY_AND_DEMO.md` — signature interaction, scientifically cautious copy and 30s storyboard.
7. `docs/07_3D_MOTION_AND_PERFORMANCE.md` — NASA assets, 3D options, scientific gates and loading budgets.
8. `docs/08_EXECUTION_AND_SCIENTIFIC_ROADMAP.md` — phased releases, source contracts, risk controls, acceptance tests.
9. `docs/09_INDEPENDENT_QA_DECISION_AND_LIMITATIONS.md` — adversarial review, unverified issues and execution QA contract.
10. `docs/10_CODEX_IMPLEMENTATION_HANDOFF.md` — direct executable instructions for a coding agent.

## Visual and interactive proof

- `prototype/index.html` + `style.css` + `app.js` is a self-contained **interface prototype** of the selected Meridian Cut direction. It implements navigation, 5 illustrative UI frames, site selectors and accessible evidence drawer, but **does not contain any astronomical observations**. Its charts are correctly left empty. The Moon art in `assets/illustrative_moon.png` is algorithmically generated as a **non-scientific illustration**, not NASA data.
- Browser navigation in this analysis environment was blocked by system security policy (including local pages), so there are **no verified Chromium screenshots** or verified click-through metrics. The receiving agent must run screenshot/interaction QA. Where static art-direction compositions are included, they are **illustrative mockups**, not captures of running code.

## Use with Codex

Copy the `docs/` directory and `prototype/` into the **real project repository** on a reconstruction branch, retaining the existing working code. Give Codex `docs/10_CODEX_IMPLEMENTATION_HANDOFF.md` as the first instruction. It must inspect the actual source, create safe baseline, then implement v6; **do not publish the standalone prototype in place of the scientific app**.

## Two event-critical tasks

1. The official NASA challenge-specific **Resources tab** must contain a NASA dataset actually used in the submitted app; this audit could not inspect the authenticated tab.
2. If the team is in the **Universal Event**, GO-team guidance requires 2–6 members for Global Judging; confirm actual team status and official submission state separately.

## Status

Planning/research: prepared. Static file validation: see `QA_EXECUTION_RESULTS.json`. Real app scientific QA: NOT RUN. Production visual QA: BLOCKED/NOT RUN. Live deploy/submission: NOT RUN. Award prospects: speculative and not a probability.

## Visual comps included

`prototype/previews/design_proof_hero_1440x900.png`, `design_proof_explorer_1440x900.png`, and `design_proof_mobile_390x844.png` are independently composed **art-direction boards**, not captured pages or verified browser renders. The included `prototype/index.html` is the executable layout sketch. The `source_notes/` folder preserves the user's v6 instructions, four original interface screenshots, and the earlier v5 package so Codex can compare before/after design intent.

## Visual and scientific QA distinction

Static checks cover syntax, dimensions, contrast tokens, structure and handoff consistency. The actual application source, astronomical values, user accounts, deployment, browser-generated screenshots and real interaction testing still require execution in Codex's actual repository environment.
