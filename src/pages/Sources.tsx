import { useState } from 'react';
import { useData } from '../lib/data';
import { Link } from '../lib/router';
import Evidence from '../components/Evidence';
import s from './Guide.module.css';
export default function Sources() {
  const { release: r, status, retry } = useData();
  const [evidence, setEvidence] = useState(false);
  return (
    <main id="main" tabIndex={-1} className={s.page}>
      <header className={s.intro}>
        <p className="eyebrow">THE SOURCE REGISTER</p>
        <h1>
          EVERY VIEW.
          <br />
          <span>AN EVIDENCE TRAIL.</span>
        </h1>
        <p>
          The source, the assumption and the limit belong together. Here is what supports the
          instrument—and what remains unresolved.
        </p>
      </header>
      <section className={s.sourceSection}>
        <h2>NASA RESOURCE USE / CONFIRMED</h2>
        <p>
          Verified on 14 November 2026: the official challenge Resources tab lists JPL Horizons
          System, which supplies this release's Sun and Earth positions. The current submission
          guide requires at least one NASA data source or resource. This confirms the source-use
          requirement; team registration and overall award eligibility remain separate checks.
        </p>
        <a
          className="quietLink"
          href="https://www.spaceappschallenge.org/2026/challenges/lunar-landing-site-navigator/?tab=resources"
          target="_blank"
          rel="noreferrer"
        >
          Official challenge Resources {String.fromCharCode(8599)}
        </a>
        <br />
        <a className="quietLink" href="/data/resource-qualification.json" download>
          Download the qualification record &darr;
        </a>
      </section>
      <section className={s.sourceSection}>
        <h2>THE SCIENTIFIC RELEASE</h2>
        {r ? (
          <>
            <div className={s.release}>
              <code>{r.release_id}</code>
              <span>Science provisional · independent ephemeris validation not run</span>
            </div>
            <p>
              {r.samples.length.toLocaleString()} hourly readings and {r.refined_samples.length}{' '}
              refined readings. Same UTC, same model, signed apparent airless Sun/Earth angles. The
              frontend checks release integrity before displaying values.
            </p>
            <button className="primaryButton" onClick={() => setEvidence(true)}>
              Inspect the complete record ↗
            </button>
            {r.sources.map((source) => (
              <article className={s.source} key={source.id}>
                <a href={source.url} target="_blank" rel="noreferrer">
                  {source.title}
                  <span>↗</span>
                </a>
                <p>
                  {source.publisher} · retrieved {source.retrieved_at_utc}
                </p>
                <details>
                  <summary>Hash & qualification status</summary>
                  <code>{source.sha256}</code>
                  <p>
                    Qualification flag recorded when the scientific release was frozen:{' '}
                    {String(source.challenge_resource_eligible)}
                  </p>
                </details>
              </article>
            ))}
          </>
        ) : (
          <>
            <p>
              {status === 'error'
                ? 'The archive is unavailable. No source readings are substituted.'
                : 'Opening the source register…'}
            </p>
            {status === 'error' && (
              <button className="primaryButton" onClick={retry}>
                Retry data loading ↗
              </button>
            )}
          </>
        )}
      </section>
      <section className={s.sourceSection}>
        <h2>THE OBSERVER & MODEL</h2>
        <p>
          Both observers are hypothetical at approximate published historical landing coordinates,
          at zero kilometres above the Horizons lunar reference ellipsoid. They do not reproduce
          lander antenna heights.
        </p>
        <p>
          Returned Horizons frame: MEAN_ME (high precision), with DE441 ephemerides. Exact
          reconciliation with the catalog’s DE421 mean-Earth/polar coordinates has not been
          independently established. Separate initial Sun requests match at both sites; this is
          request/parser consistency, not independent astronomical validation.
        </p>
        <p>
          Hourly samples cover 14 November–19 December 2026, inclusive. The first crossing in
          processing order was selected for ten-minute refinement. This is a disclosed illustrative
          selection, not a claim of typical conditions. The numerical classification tolerance is
          ±0.000001°, not an accuracy estimate.
        </p>
        <a className="quietLink" href="/data/release.json" download>
          Download the scientific release ↓
        </a>
        <br />
        <a className="quietLink" href="/data/evidence.zip" download>
          Download raw responses & reproduction scripts ↓
        </a>
      </section>
      <section id="credits" className={s.sourceSection}>
        <h2>THE IMAGES & PEOPLE</h2>
        <p>
          Lunar model: NASA’s Goddard Space Flight Center, production Dan Gallagher, data Ernie
          Wright / LRO. The model’s color texture is optimized for the web; scene lighting and
          camera travel are illustrative. The color-only globe is not a topographic obstruction
          model.
        </p>
        <a
          className="quietLink"
          href="https://svs.gsfc.nasa.gov/14959/"
          target="_blank"
          rel="noreferrer"
        >
          NASA Moon 3D models & credits ↗
        </a>
        <p>
          Fallback imagery and color map: NASA SVS / Ernie Wright; LRO / LROC / LOLA, CGI Moon Kit.
          Pole regions include lower-resolution albedo fill. This imagery does not calculate
          scientific visibility.
        </p>
        <a
          className="quietLink"
          href="https://svs.gsfc.nasa.gov/4720/"
          target="_blank"
          rel="noreferrer"
        >
          NASA CGI Moon Kit ↗
        </a>
        <p>
          Opening stills are captured from the same NASA visual scenes before interactive
          enhancement, with separate hashes and source identities. Original reference-plane
          geometry, interface graphics and story choreography. Barlow Condensed and IBM Plex fonts
          are self-hosted with their open-font license notices. The experience is silent; no
          third-party soundtrack or generated image is used.
        </p>
        <p>
          RIMWAKE is an independent educational project directed by its human owner. OpenAI Codex
          assisted design, implementation, asset preparation, source ingestion, tests and copy. NASA
          does not endorse this interface.
        </p>
      </section>
      <section className={s.sourceSection}>
        <h2>SOFTWARE & OPEN GATES</h2>
        <p>
          React, TypeScript, Vite, Three.js, React Three Fiber, Drei, GSAP and SVG power the
          experience. Python prepares static data and visual assets; Playwright, axe-core, Vitest
          and pytest verify implementation. Runtime interaction does not query JPL.
        </p>
        <p>
          Model and asset hashes are recorded separately. The visual scene never modifies the
          immutable scientific release. Local source and rollback references remain preserved.
        </p>
        <p>
          Horizons resource use has been confirmed separately. Team/event eligibility and official
          submission still require confirmation. No deployment, certificate, award eligibility or
          completed submission is claimed.
        </p>
        <Link href="/field-guide#limits" className="quietLink">
          Read the model limits ↗
        </Link>
      </section>
      {evidence && r && <Evidence release={r} records={[]} onClose={() => setEvidence(false)} />}
    </main>
  );
}
