import { useState } from 'react';
import { useData } from '../lib/data';
import { Link } from '../lib/router';
import { date } from '../lib/format';
import Evidence from '../components/Evidence';
import s from './Method.module.css';
const CHAPTERS = [
  ['geometry', 'What is a geometric horizon?'],
  ['horizons', 'What does Horizons compute?'],
  ['observers', 'Where do the sites come from?'],
  ['limits', 'What is not modelled?'],
  ['provenance', 'Provenance & reproduction'],
  ['credits', 'Assets, people & AI'],
];
export default function Method() {
  const { release } = useData();
  const [evidence, setEvidence] = useState(false);
  return (
    <main id="main" tabIndex={-1} className={s.page}>
      <header className={s.intro}>
        <p className="eyebrow">03 / THE METHOD</p>
        <h1>
          Know what
          <br />
          the sky <em>can say.</em>
        </h1>
        <p>
          An observation is useful when its assumptions are visible. Here is how to read RIMWAKE,
          follow its sources and understand what remains unresolved.
        </p>
      </header>
      <div className={s.layout}>
        <nav aria-label="Method chapters" className={s.contents}>
          <p className="eyebrow">IN THIS FIELD NOTE</p>
          {CHAPTERS.map(([id, label], i) => (
            <a href={`#${id}`} key={id}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              {label}
            </a>
          ))}
        </nav>
        <article className={s.chapters}>
          <section id="geometry">
            <p className="eyebrow">01 / THE REFERENCE PLANE</p>
            <h2>
              A horizon.
              <br />
              <em>Without the hills.</em>
            </h2>
            <p>
              The geometric horizon is the local plane perpendicular to an observer’s zenith. A
              body’s centre with positive apparent elevation is above that plane. A negative
              elevation is below it. This release excludes lunar terrain.
            </p>
            <svg
              className={s.diagram}
              viewBox="0 0 620 245"
              role="img"
              aria-label="Conceptual geometric tangent plane. A local vertical rises from an observer; one schematic sightline is above the tangent plane and another is below. No measured angles are represented."
            >
              <path d="M40 180q270-85 540 0" fill="none" stroke="#9aa9ae" strokeWidth="1.5" />
              <path d="M30 151H590M310 40V203" fill="none" stroke="#35424b" strokeWidth="1.2" />
              <path
                d="M310 151L490 66M310 151L505 195"
                stroke="#35424b"
                strokeWidth="1.4"
                strokeDasharray="5 5"
                fill="none"
              />
              <circle cx="310" cy="151" r="5" fill="#16212b" />
              <text x="40" y="138">
                TANGENT PLANE / 0°
              </text>
              <text x="322" y="45">
                LOCAL ZENITH
              </text>
              <text x="475" y="53">
                ABOVE
              </text>
              <text x="497" y="219">
                BELOW
              </text>
              <text x="40" y="230">
                SCHEMATIC ONLY / NO TERRAIN MODEL
              </text>
            </svg>
            <p>
              Charts use north at 0°, east at 90°, clockwise. Both viewpoints share the same signed
              elevation scale, so a difference is visible without changing the reference frame of
              the diagram.
            </p>
          </section>
          <section id="horizons">
            <p className="eyebrow">02 / THE EPHEMERIS</p>
            <h2>
              One request.
              <br />
              <em>A traceable reading.</em>
            </h2>
            <p>
              JPL Horizons supplies apparent airless centre-of-disc azimuth and elevation for the
              Sun (10) and Earth (399), using user-defined Moon (301) observers. The source response
              declares MEAN_ME (high precision), DE441 ephemerides and a 1737.4 km lunar reference
              radius.
            </p>
            <p>
              The 35-day discovery window runs from 14 November to 19 December 2026, inclusive, at
              60-minute steps: 841 timestamps and 3,364 site/body readings. The first crossing in
              processing order was refined to ten-minute steps, adding 28 readings. This was an
              explicit illustrative-case selection, not a claim of typical conditions.
            </p>
            <p>
              Crossings are brackets between samples. Quantitative markers snap to supported
              records; they never interpolate. A tolerance of ±0.000001° separates the numerical
              boundary state; it is not a physical error bar.
            </p>
            <a
              href="https://ssd.jpl.nasa.gov/horizons/manual.html"
              target="_blank"
              rel="noreferrer"
              className="sectionLink"
            >
              Read the JPL Horizons manual ↗
            </a>
          </section>
          <section id="observers">
            <p className="eyebrow">03 / COORDINATES & ASSUMPTIONS</p>
            <h2>
              A reported location.
              <br />
              <em>A hypothetical observer.</em>
            </h2>
            <p>
              NASA NSSDCA’s lunar artifact catalog supplies the approximate horizontal coordinates
              of Odysseus / IM-1 and Intuitive Machines 2 / Athena. Historical landing positions do
              not supply an instrument’s height above the reference ellipsoid.
            </p>
            <div className={s.siteTable}>
              <table>
                <caption>Coordinates used in this release</caption>
                <thead>
                  <tr>
                    <th>LOCATION</th>
                    <th>LATITUDE</th>
                    <th>EAST LONGITUDE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>IM-1</th>
                    <td>−80.13°</td>
                    <td>1.44°</td>
                  </tr>
                  <tr>
                    <th>IM-2</th>
                    <td>−84.7906°</td>
                    <td>29.1957°</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              Each observer is hypothetical at 0 km above the Horizons reference ellipsoid, at those
              approximate horizontal coordinates. This is not a reconstruction of a real lander’s
              antenna or ground height. Exact equivalence between the catalog’s DE421
              mean-Earth/polar frame and the returned Horizons frame has not been independently
              reconciled.
            </p>
            <a
              href="https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_artifact_impacts.html"
              target="_blank"
              rel="noreferrer"
              className="sectionLink"
            >
              Open NASA’s coordinate catalog ↗
            </a>
          </section>
          <section id="limits">
            <p className="eyebrow">04 / THE LIMITS</p>
            <h2>
              Visibility
              <br />
              <em>is not viability.</em>
            </h2>
            <p>
              Above-plane geometry alone does not establish solar power or a working Earth radio
              link. The release excludes local lunar terrain, partial-disc visibility, eclipses,
              solar panels, batteries, antenna patterns and RF link budgets.
            </p>
            <dl className={s.gates}>
              <div>
                <dt>Cause study / research-gated</dt>
                <dd>
                  Requires a source-backed terrain model, lunar-frame alignment, height above the
                  actual surface, near and far horizon coverage, numerical convergence and
                  independent sightline checks.
                </dd>
              </div>
              <div>
                <dt>Robustness / research-gated</dt>
                <dd>
                  Requires real recomputed height or terrain-realization runs. Model agreement is
                  not a calibrated probability. No synthetic controls or estimated scenario results
                  are supplied.
                </dd>
              </div>
              <div>
                <dt>Independent validation / not run</dt>
                <dd>
                  Initial Sun samples from separate Horizons requests match at both sites, with 0°
                  reported difference. This checks request/parse consistency, not an independent
                  ephemeris engine.
                </dd>
              </div>
            </dl>
            <p>
              The source release remains <strong>provisional</strong>. Parser, provenance and UI
              integrity checks are separate from scientific model validation or operational
              certification.
            </p>
          </section>
          <section id="provenance">
            <p className="eyebrow">05 / FOLLOW THE RECORD</p>
            <h2>
              The source is
              <br />
              <em>part of the instrument.</em>
            </h2>
            <p>
              Full raw responses are archived with request parameters, UTC retrieval times and
              SHA-256 hashes. The app verifies released bytes against a manifest and checks the Zod
              scientific contract before displaying any measurements. Mismatches fail closed.
            </p>
            {release ? (
              <>
                <div className={s.release}>
                  <span>SCIENTIFIC RELEASE</span>
                  <code>{release.release_id}</code>
                  <p>
                    Schema {release.schema_version} · generated {date(release.generated_at_utc)}
                    <br />
                    {release.samples.length.toLocaleString()} coarse readings +{' '}
                    {release.refined_samples.length} refined readings
                  </p>
                </div>
                <button className="primaryButton" onClick={() => setEvidence(true)}>
                  Open the full evidence register ↗
                </button>
                {release.sources.map((source) => (
                  <a
                    className={s.sourceLink}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    key={source.id}
                  >
                    {source.title}
                    <span>↗</span>
                  </a>
                ))}
              </>
            ) : (
              <p>
                Open Explore to check the archive’s current availability. No source measurements are
                substituted when the archive is unavailable.
              </p>
            )}
            <p>
              Reproduce locally with the pinned package lock and Python requirements. Scientific
              tests compare released values with raw source responses; the release checker validates
              identity, cadence, complete A/B sample matrices and crossing brackets. The raw
              evidence download includes the pipeline and validator.
            </p>
            <a className="sectionLink" href="/data/evidence.zip" download>
              Download the raw evidence & scripts ↓
            </a>
          </section>
          <section id="credits">
            <p className="eyebrow">06 / ASSETS, PEOPLE & AI</p>
            <h2>
              Independent work.
              <br />
              <em>Shared sources.</em>
            </h2>
            <p>
              RIMWAKE is an independent educational NASA Space Apps project directed by its human
              owner, with OpenAI Codex assisting design implementation, data ingestion, testing,
              visual review and copy. NASA/JPL supply cited sources; they do not endorse this
              interface.
            </p>
            <p>
              Lunar visual context: NASA’s Scientific Visualization Studio / Ernie Wright; LRO /
              LROC / LOLA, CGI Moon Kit. The aesthetics-optimized color map is rendered on an ideal
              sphere with illustrative lighting. It is not a DEM, a local terrain model or a
              depiction of the selected sample’s solar illumination. Symbolic A/B lines on Discover
              are not geographic pins.
            </p>
            <a
              href="https://svs.gsfc.nasa.gov/4720/"
              target="_blank"
              rel="noreferrer"
              className="sectionLink"
            >
              NASA SVS CGI Moon Kit & credits ↗
            </a>
            <p>
              The optional 3D view shows coordinate markers for spatial context on the same ideal
              sphere. Marker geometry is checked independently of the sky plots; this visual texture
              is never used to calculate visibility. The scientific instrument works without WebGL.
            </p>
            <p>
              Newsreader by Production Type and IBM Plex Sans / Mono are bundled locally under the
              SIL Open Font License. Interface vectors are original. The design uses the supplied v6
              Meridian Cut handoff; its placeholder Moon illustration and empty scientific prototype
              are not shipped as data.
            </p>
            <p>
              Software: React, Vite, TypeScript, Zod, Three.js (optional visual context), Python
              Requests, NumPy/Pillow for illustrative asset projection, pytest, Vitest, Playwright
              and axe-core. No generative image asset is used.
            </p>
            <p>
              Challenge-specific Resources qualification, event/team eligibility and submission
              status require separate official confirmation. No certificate, award eligibility or
              completed submission is claimed here.
            </p>
          </section>
        </article>
      </div>
      <section className={s.return}>
        <h2>Now, read the two skies.</h2>
        <Link className="primaryButton" href="/explore">
          Enter the Explorer ↗
        </Link>
      </section>
      {evidence && release && (
        <Evidence release={release} records={[]} onClose={() => setEvidence(false)} />
      )}
    </main>
  );
}
