import json
import sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from science.pipeline import ROOT

r=json.loads((ROOT/'public/data/release.json').read_text())
parts=['# RIMWAKE source and asset ledger','',f"Release: `{r['release_id']}`. Generated: {r['generated_at_utc']}. Model: `{r['model']}`.",'','Scientific status: **provisional**. Raw-response identity and numerical parsing have been checked. No independent astronomical-model validation or frame reconciliation is claimed. Challenge Resources-tab qualification remains **unknown**.','']
for source in r['sources']:
    parts.extend([f"## {source['title']}",f"- Publisher: {source['publisher']}",f"- URL: {source['url']}",f"- Retrieved: {source['retrieved_at_utc']}",f"- SHA-256: `{source['sha256']}`",f"- Raw snapshot: `{source['raw_path']}`",f"- Rights review: {source['rights_review']}",'- Challenge Resources eligibility: **unknown**',''])
parts.extend(['## Observers','', '| Site | Latitude | East longitude | Height | Category |','|---|---:|---:|---:|---|'])
for s in r['sites']:
    parts.append(f"| {s['name']} | {s['latitude_deg']} | {s['longitude_deg_east']} | 0 km, reference ellipsoid | reported_landing_position |")
parts.extend(['','These are hypothetical Horizons observers using approximate reported horizontal coordinates, not the historical landers’ actual ground/antenna heights. The returned frame is MEAN_ME (high precision), source DE441, lunar radii 1737.4 km. Input catalog frame is DE421 mean-Earth/polar; exact frame equivalence has not been independently reconciled.','', '## Horizons runs','', '| Run | Retrieved UTC | Raw SHA-256 |','|---|---|---|'])
for run in r['runs']:parts.append(f"| {run['run_id']} | {run['retrieved_at_utc']} | `{run['raw_sha256']}` |")
parts.extend(['','Exact query URLs, parameters, header settings and raw file paths are recorded in `public/data/release.json`. All raw data are in `science/raw/` and the downloadable evidence archive.','', '## Assets and tools','', '- Original wordmark, calibrated sky plots and interface vectors were created in code. No NASA logo, third-party photos or generated images are used.', '- DM Sans and IBM Plex Mono are locally bundled through Fontsource. Their SIL Open Font License files are distributed in `public/licenses/`.', '- React and React DOM (MIT), Vite (MIT), TypeScript (Apache-2.0), Zod (MIT); development tools Vitest (MIT), Playwright (Apache-2.0), axe-core (MPL-2.0), Prettier (MIT). Exact versions are locked in package-lock.json.', '- Python Requests (Apache-2.0), pytest (MIT); requirements are pinned in science/requirements.txt.', '- OpenAI Codex assisted with planning, code, scientific ingestion, tests, visual review and submission copy. The owner must review final claims and submit.', '- NASA/JPL data use does not imply endorsement. This is an independent educational project.',''])
(ROOT/'docs/source-ledger.md').write_text('\n'.join(parts),encoding='utf8')
print('Wrote source and asset ledger from actual release provenance.')
