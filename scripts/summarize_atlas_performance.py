"""Summarize the retained local lab runs without turning misses into passes."""
import json
from pathlib import Path
from statistics import median

ROOT = Path(__file__).resolve().parents[1]
FOLDER = ROOT / 'docs/qa/atlas/performance'
raw = json.loads((FOLDER / 'cold-runs.json').read_bytes())
assert len(raw['reports']) == 12, 'Incomplete cold-run matrix'
for run in raw['reports']:
    if run['motion']=='no-preference':
        assert run.get('enhancementObserved') and any('/Line-' in t['url'] for t in run['transfers']), 'Normal-motion renderer transfer is missing'
groups = []

def stats(values):
    return dict(median=round(median(values), 3), minimum=round(min(values), 3), maximum=round(max(values), 3))

for motion in ['no-preference', 'reduce']:
    for route in ['/', '/explore']:
        runs = [r for r in raw['reports'] if r['motion'] == motion and r['route'] == route]
        assert len(runs)==3, 'Each route/motion group needs three cold runs'
        js = [sum(t['encodedBytes'] for t in r['transfers'] if t['url'].endswith('.js')) for r in runs]
        group = dict(route=route, motion=motion, runs=len(runs), lcp_ms=stats([r['lcp'] for r in runs]),
                     cls=stats([r['cls'] for r in runs]), ready_ms=stats([r['readyMs'] for r in runs]),
                     observed_javascript_encoded_bytes=stats(js), browser_errors=sum(len(r['errors']) for r in runs))
        if route == '/explore':group['sample_diagnostic_ms']=stats([r['sampleDiagnosticMs'] for r in runs])
        group['targets'] = dict(lcp_median_under_2500ms=group['lcp_ms']['median'] <= 2500,
                                cls_max_under_0_1=group['cls']['maximum'] <= .1,
                                ready_median_under_4000ms=group['ready_ms']['median'] <= 4000,
                                observed_js_max_under_200000bytes=group['observed_javascript_encoded_bytes']['maximum'] <= 200000)
        groups.append(group)

summary = dict(measured_at_utc=raw['measured_at_utc'], profile=raw['profile'], groups=groups,
               scope=raw['scope'], readiness='Landing: hydrated story after poster/font decode. Explorer: first verified source sample. Neither waits for a complete optional 3D scene.',
               enhancement_observation='After recording readiness, wait 2200ms, then require the rendered normal-motion Moon (poster handoff or settled atlas camera), followed by a fresh 800ms request-quiet period and another 400ms. A historical load-state signal is not used as proof of late enhancement completion.',
               javascript_budget='All observed JavaScript transfers through post-readiness network idle, including worker and optional renderer chunks. Decimal KB. Includes optional enhancement cost; no renderer exclusion used to claim a pass.',
               target_method='LCP and readiness use three-run medians. CLS and observed JavaScript use maximum recorded value. This is local lab evidence, not field certification.')
(FOLDER / 'summary.json').write_text(json.dumps(summary, indent=2), encoding='utf-8')

lines = ['# Mission atlas performance', '', f"Measured {raw['measured_at_utc']} against the local production preview.", '',
         'Twelve cold Chrome contexts: three for each route and motion setting, 390x844, shared 1.5 Mbps download and 150 ms latency per request. The wire proxy constrains worker fetches as well as page resources. Main-thread CPU is slowed 4x; dedicated-worker CPU is not emulated. After recording readiness, the probe observes the rendered normal-motion Moon, then requires a fresh 800 ms request-quiet period and another 400 ms before counting transfers. This is a repeatable local lab profile, not deployed measurements or a physical-device guarantee.', '',
         '| Route / motion | LCP median (range), ms | Max CLS | Ready median (range), ms | Observed JS max, KB |',
         '|---|---:|---:|---:|---:|']
for g in groups:
    def spread(key):
        s=g[key];return f"{s['median']:.0f} ({s['minimum']:.0f}-{s['maximum']:.0f})"
    lines.append(f"| `{g['route']}` / {g['motion']} | {spread('lcp_ms')} | {g['cls']['maximum']:.4f} | {spread('ready_ms')} | {g['observed_javascript_encoded_bytes']['maximum']/1000:.1f} |")
lines += ['', 'Targets: LCP median <=2,500 ms, maximum CLS <=0.1, readiness median <=4,000 ms, and maximum observed JavaScript <=200 decimal KB. Exact pass/miss flags are in [summary.json](qa/atlas/performance/summary.json).', '',
          'Readiness means hydrated landing controls after poster/font decoding, or the first verified scientific sample in Explorer. The Moon renderer is a later enhancement. JavaScript totals nevertheless include every observed renderer/worker chunk through post-readiness network idle. Optional 3D cost is not hidden from the budget.', '',
          'The four-second Explorer readiness target remains open on this profile. The normal-motion 3D enhancement also exceeds the 200 KB JavaScript target. The controls and verified scientific comparison remain available while enhancement loads. These misses do not justify skipping integrity validation or removing the required scientific limits.', '',
          'The inspection-hour diagnostic waits for the exact requested UTC and then two animation frames. It includes worker round-trip, result serialization and UI work under the CPU profile. It is not field INP:']
for g in groups:
    if 'sample_diagnostic_ms' in g:
        d=g['sample_diagnostic_ms'];lines.append(f"- Explorer / {g['motion']}: median {d['median']:.0f} ms, range {d['minimum']:.0f}-{d['maximum']:.0f} ms.")
lines += ['', 'Route separation removed the landing animation library from Explorer startup. Matching loading/finished headers removed the header shift; reserving loading-stage height removed the footer shift. Memoizing the geographic scene avoids reconstructing it when the scientific cursor changes. The canvas-idle browser check separately confirms that settled geographic views stop drawing.', '',
          '[Raw runs, transfer encodings and layout-shift sources](qa/atlas/performance/cold-runs.json) retain actual measurements. Earlier exploratory records remain in `qa/atlas/performance-before-route-split/` and `qa/atlas/performance-after-route-split-before-probe-fix/`; their landing readiness probe could stop at static content, so they are not final landing-interactivity evidence.', '',
          '`qa/atlas/performance-hydrated-before-enhancement-settle/` and `qa/atlas/performance-before-scene-ready-probe/` retain subsequent probes that could stop before all delayed 3D dependencies completed. Final normal-motion measurements require the rendered scene and a new quiet period, so their cost includes that enhancement.', '',
          'Reproduce after building and serving port 4175, with no other browser QA running:', '', '```powershell', 'node scripts/measure_atlas.mjs', 'python scripts/summarize_atlas_performance.py', '```', '']
(ROOT/'docs/ATLAS_PERFORMANCE.md').write_text('\n'.join(lines), encoding='utf-8')
print(json.dumps(groups, indent=2))
