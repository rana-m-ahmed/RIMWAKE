import { lazy, Suspense, useState } from 'react';
import { Link } from '../lib/router';
import { useData } from '../lib/data';
import { signed, time, date } from '../lib/format';
import { verifiedCase, CASES } from '../story/cases';
import { Dialog } from '../components/Shell';
import s from './Discover.module.css';
const LunarContext = lazy(() => import('../visuals/LunarContext'));

export default function Discover() {
  const { release, status } = useData();
  const [context, setContext] = useState(false);
  const item = release ? verifiedCase(release, CASES[0].id) : null;
  const proof =
    release && item
      ? [item.a, item.b].map((site) =>
          release.samples.find(
            (row) =>
              row.site_id === site && row.body_id === 10 && row.timestamp_utc === item.timestamp,
          )!,
        )
      : null;
  return (
    <main id="main" tabIndex={-1}>
      <section className={s.hero} aria-label="One moment, two lunar skies">
        <div className={s.heroCopy}>
          <p className={`${s.index} eyebrow`}>
            <span />
            THE LUNAR HORIZON / FIELD STUDY 01
          </p>
          <div className={s.heroWords}>
            <p className={s.preheadline}>Same moment.</p>
            <h1>
              Different
              <br />
              <em>sky.</em>
            </h1>
            <p className={s.intro}>
              On the Moon, where you stand changes what you can see. Compare two places against one
              clock—and look closer at the evidence.
            </p>
            <div className={s.heroActions}>
              <Link className="primaryButton" href="/explore">
                Enter the Explorer <span aria-hidden="true">↗</span>
              </Link>
              <Link
                className={s.secondaryAction}
                href="/explore?case=two-skies-one-instant&guide=1"
              >
                See a real contrast <span aria-hidden="true">↘</span>
              </Link>
            </div>
          </div>
          <p className={s.heroFoot}>
            ONE WORLD / TWO LOCAL PERSPECTIVES
            <br />
            Independent NASA Space Apps project
          </p>
        </div>
        <div className={s.heroScene}>
          <div className={s.sceneGrid} />
          <img
            className={s.moon}
            src="/assets/moon-context.webp"
            width="1100"
            height="1100"
            alt="NASA LRO lunar color map rendered on an ideal sphere with illustrative lighting; not a terrain or visibility calculation"
            fetchPriority="high"
          />
          <div className={s.orbitOuter} />
          <div className={s.orbitInner} />
          <div className={s.sceneTop}>
            <span>SELENOGRAPHIC CONTEXT / 01</span>
            <span>NASA / LRO</span>
          </div>
          <div className={s.viewA}>
            <b>A</b>
            <span />
            <small>A LOCAL HORIZON</small>
          </div>
          <div className={s.viewB}>
            <b>B</b>
            <span />
            <small>ANOTHER POINT OF VIEW</small>
          </div>
          <div className={s.meridianCut}>
            <i />
            <span>ONE INSTANT</span>
            <i />
          </div>
          <div className={s.sceneBottom}>
            <p>
              Color imagery for visual context.
              <br />
              Lighting & viewpoint lines are illustrative.
            </p>
            <button onClick={() => setContext(true)}>
              Explore lunar context in 3D <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>
      </section>
      <section className={s.process} aria-label="How RIMWAKE works">
        {[
          ['01', 'Choose two places', 'Documented lunar coordinates'],
          ['02', 'Share one UTC', 'Four readings. One instant.'],
          ['03', 'Inspect the evidence', 'The source is part of the view.'],
        ].map(([n, title, body]) => (
          <div key={n}>
            <span>{n}</span>
            <div>
              <h2>{title}</h2>
              <p>{body}</p>
            </div>
          </div>
        ))}
      </section>
      <section className={s.question}>
        <p className="eyebrow">THE QUESTION / WHAT CHANGES?</p>
        <div className={s.questionBody}>
          <h2>
            The Moon is one world.
            <br />
            The horizon
            <br />
            <em>is local.</em>
          </h2>
          <div>
            <p>
              Move across the lunar surface and the view of the Sun and Earth changes. RIMWAKE puts
              two local skies side by side, making that geometry readable at a shared moment.
            </p>
            <p className={s.quiet}>
              Begin with a geometric tangent plane. Then ask what the numbers establish—and what
              local terrain still leaves unresolved.
            </p>
            <Link className="sectionLink" href="/explore?case=two-skies-one-instant&guide=1">
              Follow one source-backed comparison <span>↗</span>
            </Link>
          </div>
        </div>
      </section>
      <section className={`${s.proof} dark`}>
        <div className={s.proofIntro}>
          <p className="eyebrow">FROM THE RELEASE / A REAL COMPARISON</p>
          <h2>
            One clock.
            <br />
            <em>Two sides of zero.</em>
          </h2>
          <p>
            {item
              ? `${date(item.timestamp)} / ${time(item.timestamp)} UTC`
              : 'A source-checked sample will appear when the archive is available.'}
          </p>
          <p className={s.proofCaveat}>
            Sun-centre elevation relative to the geometric tangent plane. These are hypothetical
            reference-ellipsoid observers; lunar terrain is excluded.
          </p>
        </div>
        <div className={s.proofReading}>
          {proof && item ? (
            <>
              {proof.map((row, i) => (
                <div key={row.site_id}>
                  <div className={s.proofLabel}>
                    <span>{i === 0 ? 'A' : 'B'}</span>
                    <span>{release!.sites.find((site) => site.id === row.site_id)!.name}</span>
                  </div>
                  <strong>{signed(row.elevation_deg)}</strong>
                  <p>{row.elevation_deg! < 0 ? 'Below tangent plane' : 'Above tangent plane'}</p>
                </div>
              ))}
              <Link href="/explore?case=two-skies-one-instant" className={s.proofLink}>
                Open this exact sample <span>↗</span>
              </Link>
            </>
          ) : (
            <div className={s.proofPending}>
              <p>
                {status === 'error'
                  ? 'Scientific archive unavailable. No unsupported values are shown.'
                  : 'Checking the scientific archive…'}
              </p>
              <Link href="/explore" className="sectionLink">
                Open archive status ↗
              </Link>
            </div>
          )}
        </div>
      </section>
      <section className={s.limitSection}>
        <p className="eyebrow">KNOW THE LIMIT / BEFORE THE CONCLUSION</p>
        <div>
          <h2>
            A clear geometric view
            <br />
            <em>is only a beginning.</em>
          </h2>
          <p>
            Crater rims and local relief can change what reaches a real spacecraft. This release
            compares an ideal tangent plane. It does not establish usable solar power, an RF link or
            an optimal landing site.
          </p>
          <Link href="/method" className="sectionLink">
            Read the method & sources <span>↗</span>
          </Link>
        </div>
      </section>
      {context && (
        <Dialog title="Lunar context" wide onClose={() => setContext(false)}>
          <Suspense fallback={<p>Opening optional lunar context…</p>}>
            <LunarContext sites={release?.sites ?? []} />
          </Suspense>
        </Dialog>
      )}
    </main>
  );
}
