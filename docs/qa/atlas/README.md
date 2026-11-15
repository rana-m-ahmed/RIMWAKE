# Mission atlas review evidence

This directory records the local implementation review. It is not a deployment, submission receipt, independent scientific certification or unfamiliar-user study.

- `final/results.json`: actual native exit codes for type, unit, science, original release/integrity, new archive integrity, production build and production browser checks. Browser base URL is recorded explicitly.
- `final/default-comparison.json` and `default-samples.csv`: downloaded through the real Share & export controls, with original and delayed windows and source lineage.
- `round-1/`: initial captures that exposed small chart text, buried outcomes, mobile wrapping and one capture during a hot reload.
- `round-2/`: second responsive pass; mobile review showed that the Moon still appeared too far below the decision.
- `round-3/`: refined phone hierarchy, direct A/B Moon markers and readable comparison/timeline views.
- `round-4/`: final production screenshots. Four routes at 1440, 1024, 768, 390, 360 and 320 pixels; comparison, timeline, evidence, export, far-side and historical-image states; desktop/phone story chapters and applied-delay state. 73 PNGs, 24 route reports, no recorded horizontal overflow or browser errors.
- `performance/`: final twelve-run, hydration-aware cold lab results. See [performance interpretation](../../ATLAS_PERFORMANCE.md), including the remaining readiness and JavaScript-budget misses.
- Earlier performance directories retain exploratory measurements and their probe limitations, including static-text readiness and incomplete late-renderer observation. Final normal-motion runs require the rendered scene and a fresh request-quiet period. `final/first-gate/` retains original-integrity enumeration failures before the checks were corrected to enumerate the immutable original source set.
- `final/demo-render.json`: six PDF pages and content-fit checks; rendered slides 1, 3, 4 and 6 are retained alongside it.

Manual visual inspection included the final desktop opening, phone Explorer, delayed phone story, desktop atlas region, source-backed comparison and review slides. The final major changes moved the decision before the atlas, brought the Moon earlier on phones, gave charts real display-sized labels and kept secondary settings expandable. The settled screen hierarchy is identical across the last loading/performance refinements.

Automated accessibility checks cover all four routes, the flagship comparison at desktop and phone widths, its evidence dialog, and preserved original controls. Keyboard and exact-UTC focus restoration are exercised in browser journeys. These are bounded automated checks, not a comprehensive human accessibility or comprehension assessment. Five unfamiliar-user sessions and owner review remain open.

Archived source HTML, image provenance and captured native console output retain their original whitespace. The code whitespace check excludes those evidence directories. Staged scientific/archive/image bytes are separately compared with their working originals before the checkpoint, so Git line-ending normalization cannot silently change an archived hash.

Run screenshot QA only against an already completed production build:

```powershell
$env:RIMWAKE_BASE_URL = 'http://127.0.0.1:4175'
$env:ATLAS_QA_ROUND = 'round-review'
node scripts/atlas_visual.mjs
```
