# Mission atlas performance

Measured 2026-11-15T06:48:59.611Z against the local production preview.

Twelve cold Chrome contexts: three for each route and motion setting, 390x844, shared 1.5 Mbps download and 150 ms latency per request. The wire proxy constrains worker fetches as well as page resources. Main-thread CPU is slowed 4x; dedicated-worker CPU is not emulated. After recording readiness, the probe observes the rendered normal-motion Moon, then requires a fresh 800 ms request-quiet period and another 400 ms before counting transfers. This is a repeatable local lab profile, not deployed measurements or a physical-device guarantee.

| Route / motion | LCP median (range), ms | Max CLS | Ready median (range), ms | Observed JS max, KB |
|---|---:|---:|---:|---:|
| `/` / no-preference | 2008 (1996-2060) | 0.0000 | 3148 (3146-3205) | 410.4 |
| `/explore` / no-preference | 1536 (1336-1564) | 0.0000 | 5264 (5212-5324) | 359.0 |
| `/` / reduce | 2052 (2048-2076) | 0.0000 | 3250 (3220-3282) | 129.9 |
| `/explore` / reduce | 1352 (1336-1512) | 0.0000 | 5318 (5243-5324) | 95.4 |

Targets: LCP median <=2,500 ms, maximum CLS <=0.1, readiness median <=4,000 ms, and maximum observed JavaScript <=200 decimal KB. Exact pass/miss flags are in [summary.json](qa/atlas/performance/summary.json).

Readiness means hydrated landing controls after poster/font decoding, or the first verified scientific sample in Explorer. The Moon renderer is a later enhancement. JavaScript totals nevertheless include every observed renderer/worker chunk through post-readiness network idle. Optional 3D cost is not hidden from the budget.

The four-second Explorer readiness target remains open on this profile. The normal-motion 3D enhancement also exceeds the 200 KB JavaScript target. The controls and verified scientific comparison remain available while enhancement loads. These misses do not justify skipping integrity validation or removing the required scientific limits.

The inspection-hour diagnostic waits for the exact requested UTC and then two animation frames. It includes worker round-trip, result serialization and UI work under the CPU profile. It is not field INP:
- Explorer / no-preference: median 306 ms, range 265-306 ms.
- Explorer / reduce: median 326 ms, range 323-328 ms.

Route separation removed the landing animation library from Explorer startup. Matching loading/finished headers removed the header shift; reserving loading-stage height removed the footer shift. Memoizing the geographic scene avoids reconstructing it when the scientific cursor changes. The canvas-idle browser check separately confirms that settled geographic views stop drawing.

[Raw runs, transfer encodings and layout-shift sources](qa/atlas/performance/cold-runs.json) retain actual measurements. Earlier exploratory records remain in `qa/atlas/performance-before-route-split/` and `qa/atlas/performance-after-route-split-before-probe-fix/`; their landing readiness probe could stop at static content, so they are not final landing-interactivity evidence.

`qa/atlas/performance-hydrated-before-enhancement-settle/` and `qa/atlas/performance-before-scene-ready-probe/` retain subsequent probes that could stop before all delayed 3D dependencies completed. Final normal-motion measurements require the rendered scene and a new quiet period, so their cost includes that enhancement.

Reproduce after building and serving port 4175, with no other browser QA running:

```powershell
node scripts/measure_atlas.mjs
python scripts/summarize_atlas_performance.py
```
