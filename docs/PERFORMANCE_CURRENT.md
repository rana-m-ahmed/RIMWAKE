# Current local performance measurements

Twelve isolated cold-cache Chrome runs, 390x844, 150 ms RTT, 1.5 Mbps download and 4x CPU slowdown against the already built local production preview. Normal and reduced motion each have three runs per route. Actual response Content-Encoding and resource transfer sizes are retained in [the raw record](qa/cinema/performance-final/cold-runs.json).

| Route | Motion | LCP median (range) | Maximum CLS | Ready median |
|---|---|---|---|---|
| `/` | no-preference | 2.756 s (2.420-2.904) | 0 | 3.640 s |
| `/explore` | no-preference | 1.628 s (1.552-1.684) | 0 | 5.041 s |
| `/` | reduce | 2.748 s (2.744-2.952) | 0 | 3.732 s |
| `/explore` | reduce | 1.776 s (1.728-1.816) | 0 | 5.628 s |

Initial JavaScript: 125,109 bytes gzip. Explorer sample-change to two animation frames: 112.6 ms median, 97.0-130.8 ms range. The probe verifies that the displayed exact UTC changed; it is a script diagnostic, not a user-input or field INP measurement.

Explorer LCP, CLS and initial-JavaScript targets pass in this profile. The landing page's 2.5-second LCP target is not met consistently and remains a performance refinement. A diagnostic identified the matched opening image as the final LCP element. Synchronous decoding did not remove the delay and was reverted. The hero remains source-credited, small and available before optional 3D.

These are local laboratory results, not deployed-host measurements. Ready time is the heading-ready point on the landing and verified-slider-ready point in Explorer, not the same metric across routes. Earlier runs with concurrent QA work are retained in `qa/cinema/performance-concurrent/`; they are not substituted for this final record. No performance guarantee, public deployment or field telemetry is claimed.
