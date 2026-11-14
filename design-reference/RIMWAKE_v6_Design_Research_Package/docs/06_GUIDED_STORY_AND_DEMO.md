# RIMWAKE v6 — Scientific Storytelling and the Signature Interaction

## Story thesis

**One moment. Two lunar skies.** The visitor should notice that Sun and Earth geometry is a local measurement, not a global wallpaper. The story does **not** promise that every pair differs dramatically or that site choice alone causes all changes. It invites a real comparison and shows exactly which model supports the result.

**Signature interaction: Meridian Split.** Two scientifically equivalent visual frames (A and B) share one UTC cursor. The center seam is the explanatory control: clicking it opens a small structured difference note, while the timeline beneath both panels reveals which *sampled* instants are meaningfully different, similar, borderline, or unknown. If a terrain-horizon model is validated, the user can switch `geometric` ↔ `terrain modeled` and see the distinct skyline as a documented input to an obstruction calculation. The seam is a functional affordance, not merely a graphic stripe.

## Alternate signature concepts evaluated

| Concept | Learning value | Demo value | Main failure | Decision |
|---|---|---|---|---|
| Lunar globe fly-to | Shows where sites are | High spectacle | Not novel, may not clarify sky geometry | Supporting only |
| Dramatic terrain shadow theater | Physically compelling | Very high if validated | Requires complete DEM and sightline; risky | Conditional research |
| **Meridian Split** | Makes shared-time comparison directly perceptible | Very high for working P0 data | Must not overclaim local terrain | **SELECT** |
| Viewpoint height “magic slider” | Shows sensitivity | Good if real data | Can fabricate extrapolations | Gated P2 |
| Fake sunbeam sweeping a canyon | Misleading | Initially attractive | False physical interpretation | **REJECT** |

## Narrative architecture: six skippable acts

| Act | Visitor question | On-screen movement | Required genuine source | Exit |
|---|---|---|---|---|
| I — Encounter | Can two skies differ on the same Moon? | Moon context/cut to meridian seam | Artistic lunar imagery is illustrative only | `Explore now` |
| II — Two locations | What places are we comparing? | A and B site/observer metadata come into focus | Named source coordinates, observer model, types | `Swap sites` |
| III — One time | When are we observing? | One UTC cursor connects both sides | Actual record index, known cadence | `Choose time` |
| IV — The evidence | What do the angles say? | Signed Sun/Earth altitudes appear for both | Genuine ephemeris records, same model | `Inspect difference` |
| V — The limits | Does the visible tangent-plane Sun mean power? | Geometric plane reference becomes explicit | Model metadata and caveat, terrain only if validated | `See method` |
| VI — The result | What have we learned? | Comparison summary and source trail | Data-backed difference or truthful similarity | `Explore your own` |

The guided path must not block navigation or require the user to complete a cinematic animation. It uses **the same state store and sample IDs** as open exploration. A report may preselect one verified case but cannot cache an invented narrative data record.

## Final recommended product copy (proposed, not observed results)

**Primary hero:** `Same moment. Different sky.`

**Hero subtitle:** `On the Moon, where you stand changes what you can see. Compare two places against one clock—and look closer at the evidence.`

**Microhead:** `RIMWAKE / LUNAR VISIBILITY FIELD NOTES`

**CTA:** `Enter the Explorer ↗`

**Scientific state:** `Geometric view · terrain not modeled`

**Site note:** `Observer is hypothetical at the documented coordinates; mission landing facts are a separate source field.`

**Time note:** `UTC time is shared by Site A and Site B. Readings are sampled at the intervals shown.`

**Below-zero body:** `The [Sun/Earth] center is [x°] below the modeled geometric tangent plane. This is not a terrain-obstruction finding.` (Only fill `x` from source record.)

**Above-zero body:** `The [Sun/Earth] center is [x°] above the ideal geometric plane. Local terrain and practical power/communications feasibility are not assessed.`

**Unknown:** `No validated reading is available for this combination. The interface will not estimate an unsupported result.`

**Boundary:** `The horizon crossing lies between sampled times [t1] and [t2]; a more precise crossing is not established.`

**No difference:** `At this recorded instant, both site observations share the same classified geometric visibility state. Their exact angles may still differ.`

**Difference:** `At the same UTC instant, the sites differ in [specific computed quantity]. See the corresponding azimuth/elevation values and source record.`

**Terrain extension:** `Modeled terrain produces [state] for [target] at [UTC] from [site], under [DEM/run/frame/coverage]. This is not an operational certification.`

**Evidence CTA:** `See the measurement, not just the picture.`

**Conclusion:** `The Moon is one world. The horizon is local.`

Avoid: “the ridge stole sunlight,” “guaranteed communication blackout,” “optimal landing site,” “NASA-certified mission planning,” “real-time,” “100% accurate,” unless external evidence specifically supports a much narrower claim.

## 5 / 15 / 60 / 180-second attention targets

- **5s:** visual seam and headline convey the difference between two perspectives. User can immediately enter Explorer.
- **15s:** users recognize two selected sites, shared UTC and body colors; they know the model is geometric-only if terrain absent.
- **60s:** users can change one sampled time and inspect one real signed elevation comparison, with accessible explanation.
- **180s:** a reviewer can check source provenance and uncertainties; optional Cause may demonstrate a true terrain-based event if validated.

These are **acceptance targets** to measure in actual testing, not claims of achieved usability.

## Competition demo storyboard (30 seconds max; update from actual release)

| Seconds | Video capture | Narration/caption | Proof gate |
|---:|---|---|---|
| 0–4 | Meridian Cut hero, enter Explorer | `The same Moon. Two local skies.` | Actual release hero shown |
| 4–9 | A/B observer names and UTC | `Choose two documented lunar locations at one instant.` | Coordinates/source visible |
| 9–17 | Change UTC to validated preselected sample | `Their Sun and Earth angles update together.` | Both records real and synchronized |
| 17–24 | Highlight actual difference, or meaningful similarity | `The comparison reveals what the model really shows.` | No fabricated contrast |
| 24–29 | Open evidence and caveat | `Every observation has a source—and a limit.` | Clickable URLs and model status |
| 29–30 | RIMWAKE identity/credits | `RIMWAKE.` | Submission info truthful |

**Required capture:** direct screen recording of functioning deployed page, not a purely rendered design mock. Final format per portal; 2026 GO Team answer permits <=30s video or <=7 slides; see https://github.com/nasa/spaceapps/discussions/1973 . Keep a 3–5s live screen interaction as proof if compressed video legibility is poor.

## Motion semantics and failure states

The moving seam is a reading guide, not an invisible slider. If used to compare angle differences, it snaps to discrete sample IDs. Intermediate 3D camera animation does not update the numerical readout until a validated record is selected. If selection produces `unknown`, the visual fades to a hatched unavailable state with plain text explanation; it never animates to zero. If `Cause` isn't available, the story stops at geometric comparison and says why.

## Screen-reader and reduced-motion story

All acts have headings, concise transcript and explicit Next/Skip controls. `prefers-reduced-motion` disables pans, zooms, parallax and smooth scroll; a screen reader hears a structured ordered narrative, not dozens of unlabeled decorative curves. The same data and source links are available as table text.
