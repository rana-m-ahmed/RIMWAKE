# RIMWAKE v6 — Definitive Visual Identity: MERIDIAN CUT

**Brand promise:** *One moment. Two lunar skies.* The product should feel like a scientific folio opening into a precision instrument. Its visual power comes from editorial proportion and aligned measurement, not glowing widgets.

## 1. The graphic signature

**Meridian seam:** one line spanning both observations at a shared UTC. It appears (a) as a small split-horizon mark to the left of the logotype; (b) as a 1px graphite cut between hero columns; (c) as a 2px calibrated cursor crossing both charts; (d) as a source-link gutter; and (e) as the storyboard cut between two scientific explanations. It may be diagonal **only** in decorative page transitions; scientific axes remain orthogonal.

**Object grammar:** circular observation boundary, thin datum line, two datum ticks labelled A/B, arc reserved for real angular measurement, coordinate grid only where calibrated. Use 1px/1.5px precision strokes, not glowing random arcs. A/B should share scales, bearing conventions and selected time. Numbers are displayed using tabular digits.

**Page-light balance:** Landing ≈55% mineral light + 45% lunar dark by area, Explorer ≈12% light shell + 88% functional dark instrument, Methods ≈85% pale editorial, Evidence overlay ≈90% pale. This alternation is intentional, not a dark/light toggle.

## 2. Token contract

```css
:root {
  --paper: #F0F1ED;          /* editorial field */
  --porcelain: #FBFCF8;      /* elevated editorial surface */
  --ink: #16212B;            /* body text on paper */
  --graphite: #35424B;       /* secondary ink */
  --quiet: #5B6A70;          /* secondary ink, verify contrast */
  --space: #0B121B;          /* observation stage */
  --space-2: #111E2B;        /* inset instrument */
  --space-3: #1A2A37;        /* selected state */
  --night-text: #F3F4F0;     /* primary on dark */
  --night-subtle: #B6C4CB;   /* secondary on dark */
  --rule-light: #CCD2D0;     /* background dividers */
  --rule-dark: #364551;      /* structural grid on dark */
  --sun: #EEB66B;           /* Sun series only */
  --earth: #86C7EB;         /* Earth series only */
  --warning: #E69A89;       /* invalid/caution label with icon */
  --focus: #F1CF88;         /* 3px focus ring on dark; ink on light */
  --shadow-stage: 0 24px 58px rgba(2, 10, 20, .16);
}
```

**Contrast:** proposed normal text pairs must be checked against WCAG AA 4.5:1 in opaque and composite cases. Semi-transparent labels do not inherit opaque-token contrast. State lines and focus cues require at least 3:1 when applicable; use shape, pattern and visible labels as redundant encoding. Do not use accent colors for small body text against light paper without testing; solar gold belongs on dark surfaces and graphics, not 12px yellow captions on white.

**Color distribution:** on Explorer, approximately 70–80% quiet dark, 15–25% text/axis neutrality, less than 7% combined gold/cyan, no third “both” accent. Simultaneous Sun-and-Earth state = a paired double bar / woven hatch and literal `BOTH` label. Unknown = distinct hatched grey; boundary = dotted line and explicit interval, not fabricated interpolated crossing.

## 3. Typography choices

| Candidate | Strength | Weakness | Decision |
|---|---|---|---|
| **Newsreader** + IBM Plex Sans/Mono | Literary but readable serif, adjustable optical size; engineered text/numerals | Serif can look old-fashioned if overused | **SELECT** for editorial large headings only |
| **Fraunces** + IBM Plex | Strong personality and variable controls | Decorative softness can weaken scientific authority | Backup art-direction experiment |
| **IBM Plex Serif/Sans/Mono only** | Coherent, well documented OFL family | Less emotional contrast for hero | Accessibility fallback |
| Space Grotesk + Inter | Easy, common | v5 uses it and it feels templated | Reject |

**Font availability and licensing:** IBM Plex family is released under SIL OFL 1.1: https://github.com/IBM/plex/blob/master/LICENSE.txt . Newsreader is released under SIL OFL 1.1 by Production Type: https://github.com/productiontype/NewsReader ; inspect the upstream OFL file and keep license metadata if self-hosted. Do **not** include binary fonts in this handoff. Use system fallbacks if network fonts are unavailable. Verify the actual glyphs `°`, `±`, `−`, `Δ`, `″`, the minus sign U+2212, degree signs and both tabular-numeral support before approval.

```css
--font-display: 'Newsreader', Georgia, 'Times New Roman', serif;
--font-body: 'IBM Plex Sans', 'Helvetica Neue', Arial, sans-serif;
--font-data: 'IBM Plex Mono', 'SFMono-Regular', Consolas, monospace;
```

| Use | Desktop | Tablet | Phone | Notes |
|---|---|---|---|---|
| Wordmark | 18–20px | 18px | 17px | Sans 600, tracking .12em, custom line mark |
| Landing H1 | clamp(64px, 6.8vw, 112px) | 62–72px | 46–56px | Serif 400; 1.0–1.05 line-height, no fake uppercase |
| Section headline | 48–64px | 38–48px | 32–38px | Serif 400/500, deliberate line breaks |
| Explorer page title | 36–42px | 32px | 28px | Serif/sans paired |
| Scientific value | 32–44px | 30–36px | 26–32px | Mono or Sans tabular digits |
| Prose lead | 18–21px | 18px | 17px | 1.45–1.55 line height, max 60ch |
| UI body | 15–16px | 15–16px | 15–16px | 1.45, clear keyboard labels |
| Chart label | 13–15px | 13–15px | 13–14px | Minimum 12px special labels only |
| Metadata | 12–13px | 12–13px | 12px | Data font, letter spacing ≤ .07em |

**Metrics:** 8pt macro spacing on a 4pt base (4/8/12/16/24/32/48/64/96/128), max reading width 65ch, buttons 44px min height and 44×44 touch targets, focus ring 3px and 2px offset, 1px separators at 1× dpr with adequate contrast, semantic heading hierarchy. Target outer page widths 1280 editorial / 1640 instrument. Horizontal padding desktop 40–64px, tablet 28–32px, mobile 18–20px.

## 4. Components: clear visual behaviors

- **Wordmark / seam:** wordmark stable width, one active line mark; no NASA meatball imitation.
- **Primary CTA:** solid `--ink` on paper; dark-to-light inverse on instrument, visible focus; arrow with 12px offset; no decorative inactive arrows.
- **Nav:** Discover / Explore / Method. Current tab gets a filled 2px baseline; no redundant 'Home' plus 'Overview' items. On mobile show Explore primary + simple menu sheet.
- **Evidence pill:** persistent small `Geometric · terrain excluded` model statement; clicking opens definition/source record. Never render model status as fashion tag without action.
- **Site selector:** formal site name, lat/lon, observation definition, and confidence/source status in same dropdown; distinguish historical mission coordinate and hypothetical observer.
- **UTC ribbon:** large selected date/time in one place; keyboard stepping, exact sample snapping, no fractional-state arithmetic invented by easing.
- **Calibrated sky stage:** 0° is emphasized, signed elevation range visible even below 0°, azimuth ticks and center/radius markers where relevant, one identical scale for A/B; no animated physical position without supported sample.
- **Horizon Loom:** continuous visual band *only* for computed intervals; with hourly samples it consists of discrete sample blocks, no fabricated transitions. A click jumps to a **real** sample index.
- **Evidence drawer:** readable light porcelain sheet with source/date/schema/assumptions and copied trace ID; modal accessibility required.
- **Unavailable scientific features:** intentional `Research module — data validation required`; no greyed fake buttons that do nothing.

## 5. Layout details

**Hero:** min 760px at 1440×900; 43% editorial left; 57% visual right. Nav 76px. H1 x≈72px y≈260px, max-width 590px, 2–3 lines. Right has a cropped lunar disk/art scene spanning approx 510–630px plus two thin reference lines; art never carries numeric claims. Bottom full-width band preview “01 Choose / 02 Share time / 03 Examine evidence”. CTA stays above fold.

**Explorer desktop:** top white paper nav 70px; dark instrument begins under 40px content intro. Inside stage: command 70px, shared UTC 62px, 50/50 A/B instrument at min 420px, Horizon Loom 126px, evidence rail collapsible 260–300px. At 1440px, visual stage should consume most horizontal space and labels must remain readable; no four-card summary row preceding the main scientific action.

**Mobile:** nav 60px, no hero 3D mandatory. Explorer first row active A/B tabs, second row selected UTC and arrows (44px), chart height 300–340px, always-visible mini A-vs-B difference summary; loom scrolls with labelled samples or vertical tracks; methods in full-screen sheet. Charts respond to width; do not scale desktop 2-up 40% down.

## 6. Motion design

| Motion | Duration | Easing | Purpose | Interruption |
|---|---:|---|---|---|
| Hero reveal | 600–900ms | cubic-bezier(.22,1,.36,1) | Establish scene, then CTA | Skip if reduced motion |
| Seam reveal | 420ms | cubic-bezier(.2,.8,.2,1) | Show two places joined by time | New route cancels |
| Site switch | 240–320ms | ease-out | Communicate changed site selection | Last selection wins |
| Timeline selection | 120–180ms | ease-out for cursor only | Indicate new *discrete* record | Marker **snaps** to actual sample |
| Evidence sheet | 250ms | cubic-bezier(.16,1,.3,1) | Access source without leaving context | Escape/focus restore |
| Story chapter | 350ms | ease-in-out | Guide attention to new evidence | Back/skip works |

Motion never invents observations; it may animate a transition between real sample glyph positions while the readout explicitly snaps to a discrete sample and the intermediate animation is labeled decorative state change. Prefer instant cut for quantitative readouts to avoid implying intermediate ephemeris precision. Respect `prefers-reduced-motion`, battery saver/no-WebGL paths and low-power mode. No autoplay audio or dramatic mandatory intro.

## 7. Asset constraints and attribution

NASA CGI Moon Kit includes a 447KB 2K color map and NASA labels it **optimized for aesthetics, not science**: https://svs.gsfc.nasa.gov/4720/ . 2026 small GLB is ~13.2MB: https://svs.gsfc.nasa.gov/14959/ . Do not load it before the primary science UI. Download only the actual licensed source you need after checking rights/attribution; record URL, author/provider, retrieval and transformations. Show a neutral SVG/canvas lunar silhouette if not loaded. The attached v6 **design prototype** uses locally generated stylized artwork as an explicitly illustrative placeholder and does not represent a NASA observational image.

## 8. Finishing rubric

Every implementation screenshot must be assessed for: deliberate hierarchy, exact alignments, balance of quiet/bright, two-site simultaneous comparability, 12px+ scientific labels, keyboard focus visibility, source affordance, no unnecessary panels, no overflow, no decorative scientific claims. Explicitly reject: ordinary navy SaaS grid, excessive Space Grotesk, scatterplot with unlabeled axes, fixed 4K-wide bitmap pretending to be responsive, blue neon ambient fog, gradient-filled cards, 2m random orbit lines, absent sources.
