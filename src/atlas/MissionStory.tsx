import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Link } from '../lib/router';
import { useAtlas } from './useAtlas';
import { comparisonURL, DEFAULT, pct, type Request } from './model';
import { useMedia, useWebGLCapability } from '../cinema/preferences';
import SceneGuard from '../cinema/SceneGuard';
import type { StoryMotion } from '../cinema/StoryScene';
import s from './Story.module.css';
gsap.registerPlugin(ScrollTrigger, useGSAP);
const Moon = lazy(() => import('../cinema/StoryScene'));
const titles = [
  'The question',
  'The places',
  'The horizon',
  'The first window',
  'The delay',
  'Your comparison',
];
export default function MissionStory() {
  const host = useRef<HTMLElement>(null),
    motion = useRef<StoryMotion>({ progress: 0, invalidate: () => {} }),
    [act, setAct] = useState(0),
    [ready, setReady] = useState(false),
    [failed, setFailed] = useState(false),
    [enhance, setEnhance] = useState(false),
    [slipped, setSlipped] = useState(false);
  const compact = useMedia('(max-width:700px)'),
    reduced = useMedia('(prefers-reduced-motion:reduce)'),
    capable = useWebGLCapability(!reduced),
    o = useAtlas(true, act >= 2);
  useEffect(() => {
    let live = true;
    const image = host.current?.querySelector('img');
    Promise.allSettled([image?.decode(), document.fonts.ready]).then(() =>
      requestAnimationFrame(() => {
        if (live) setEnhance(true);
      }),
    );
    return () => {
      live = false;
    };
  }, []);
  useGSAP(
    () => {
      const triggers = titles.map((_, i) =>
        ScrollTrigger.create({
          trigger: `#story-${i}`,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => setAct(i),
          onEnterBack: () => setAct(i),
        }),
      );
      return () => triggers.forEach((t) => t.kill());
    },
    { scope: host },
  );
  const open = (delayed = false) =>
    comparisonURL({ ...DEFAULT, scenario: delayed ? 'delayed' : 'baseline' });
  const results = o.result?.analysis.summaries;
  const headline = (slot: number, delayed: boolean) => {
    const row = results?.[slot + (delayed ? 2 : 0)];
    return row ? pct(row.joint) + '%' : 'Verifying';
  };
  const jump = (i: number) =>
    document
      .getElementById(`story-${i}`)
      ?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth' });
  return (
    <main id="main" tabIndex={-1} ref={host} className={s.story} data-hydrated={enhance}>
      <section id="story-0" className={`${s.act} ${s.arrival}`}>
        <div className={s.moonStage} aria-hidden="true">
          <div className={`${s.poster} ${ready && !failed && !reduced ? s.posterGone : ''}`}>
            <picture>
              <source media="(max-width:700px)" srcSet="/assets/moon-opening-mobile.webp" />
              <img
                src="/assets/moon-opening-desktop.webp"
                width="1440"
                height="900"
                alt=""
                fetchPriority="high"
                decoding="async"
              />
            </picture>
          </div>
          {enhance && capable && !failed && !reduced && (
            <SceneGuard onFailure={() => setFailed(true)}>
              <Suspense fallback={null}>
                <Moon
                  motion={motion}
                  records={[[], []]}
                  compact={compact}
                  localActive={false}
                  onReady={() => setReady(true)}
                  onFailure={() => setFailed(true)}
                />
              </Suspense>
            </SceneGuard>
          )}
          <div className={s.vignette} />
        </div>
        <div className={s.heroCopy}>
          <p className={s.kicker}>A SMALL DELAY. A DIFFERENT MOON.</p>
          <h1>
            THE PLACE.
            <br />
            THE DATE.
            <br />
            <span>THE DIFFERENCE.</span>
          </h1>
          <p className={s.heroLead}>
            On the Moon, a changed schedule changes the sky.
            <br className={s.desktopBreak} /> Compare two places. Then move the mission.
          </p>
          <div className={s.heroActions}>
            <Link className={s.primary} href={open()}>
              Open the mission atlas <span aria-hidden="true">{String.fromCharCode(8599)}</span>
            </Link>
            <button onClick={() => jump(1)}>
              See what a delay changes <span aria-hidden="true">{String.fromCharCode(8595)}</span>
            </button>
          </div>
        </div>
        <div className={s.heroFoot}>
          <span>06 DOCUMENTED PLACES / 90 DAYS TO EXPLORE</span>
          <span>NASA LRO imagery / illustrative lighting</span>
        </div>
      </section>
      <nav className={s.actNav} aria-label="Story chapters">
        {titles.map((title, i) => (
          <button
            key={title}
            aria-label={`Chapter ${String(i + 1).padStart(2, '0')}: ${title}`}
            aria-current={act === i ? 'step' : undefined}
            onClick={() => jump(i)}
          >
            <span>{String(i + 1).padStart(2, '0')}</span>
            <i />
            <b>{title}</b>
          </button>
        ))}
      </nav>
      <section id="story-1" className={`${s.act} ${s.places}`}>
        <div className={s.copy}>
          <p className={s.kicker}>01 / CHOOSE THE PLACE</p>
          <h2>
            ONE MOON.
            <br />
            <span>NO SINGLE SKY.</span>
          </h2>
          <p>
            Near the south pole, the Sun stays low. Earth can slip below the reference horizon.
            Change your viewpoint, and the geometry changes with it.
          </p>
          <p>
            Begin at two published landing coordinates. These are hypothetical observers, not
            readings from the landers.
          </p>
          <Link className={s.textLink} href={open()}>
            Find them on the atlas {String.fromCharCode(8599)}
          </Link>
        </div>
        <div className={s.placeGraphic}>
          <div className={s.polarArt}>
            <svg
              viewBox="0 0 500 420"
              aria-label="Conceptual south-polar location diagram, not terrain"
              role="img"
            >
              <defs>
                <radialGradient id="story-polar">
                  <stop stopColor="#304553" />
                  <stop offset="1" stopColor="#0d1720" />
                </radialGradient>
              </defs>
              <circle cx="250" cy="205" r="180" fill="url(#story-polar)" stroke="#596e7a" />
              {[60, 120].map((r) => (
                <circle
                  key={r}
                  cx="250"
                  cy="205"
                  r={r}
                  fill="none"
                  stroke="#647986"
                  strokeDasharray="2 8"
                />
              ))}
              {Array.from({ length: 12 }, (_, i) => (
                <line
                  key={i}
                  x1="250"
                  y1="205"
                  x2={250 + 180 * Math.sin((i * Math.PI) / 6)}
                  y2={205 + 180 * Math.cos((i * Math.PI) / 6)}
                  stroke="#596b76"
                  strokeOpacity=".45"
                />
              ))}
              <circle cx="252" cy="85" r="6" fill="#eee3cc" />
              <circle cx="286" cy="150" r="6" fill="#adcedf" />
              <text x="268" y="76" fill="#eee3cc" fontSize="17">
                A / ODYSSEUS
              </text>
              <text x="301" y="145" fill="#adcedf" fontSize="17">
                B / ATHENA
              </text>
              <text x="250" y="226" textAnchor="middle" fill="#b9c9d1" fontSize="13">
                SOUTH POLE
              </text>
            </svg>
          </div>
          <div className={s.placeCoordinates}>
            <span>A / 80.13&deg; S, 1.44&deg; E</span>
            <span>B / 84.7906&deg; S, 29.1957&deg; E</span>
          </div>
          <small>Location diagram / geometry only</small>
        </div>
      </section>
      <section id="story-2" className={`${s.act} ${s.horizonAct}`}>
        <div className={s.copy}>
          <p className={s.kicker}>02 / UNDERSTAND THE QUESTION</p>
          <h2>
            ABOVE.
            <br />
            BELOW.
            <br />
            <span>AND FOR HOW LONG?</span>
          </h2>
          <p>
            Start with a flat reference horizon. Positive elevation means a body’s centre is above
            that plane. Negative means below it.
          </p>
          <p>
            Now ask the useful question: how often do the Sun and Earth both stay above it during
            our chosen window?
          </p>
        </div>
        <div className={s.horizonArt}>
          <svg
            viewBox="0 0 620 370"
            role="img"
            aria-label="Concept diagram: positive elevation above a geometric horizon and negative elevation below. Not an observation."
          >
            <path d="M30 198H590" stroke="#9fb4c1" />
            <path d="M160 198L480 75M160 198L480 300" stroke="#9db5c5" strokeDasharray="4 5" />
            <circle cx="160" cy="198" r="5" fill="#eee7d5" />
            <circle cx="480" cy="75" r="15" fill="#e7b874" />
            <circle cx="480" cy="300" r="12" fill="#99cde9" />
            <text x="33" y="178" fill="#c7d3d9" fontSize="15">
              0 / GEOMETRIC HORIZON
            </text>
            <text x="505" y="81" fill="#e7b874" fontSize="22">
              +
            </text>
            <text x="505" y="307" fill="#99cde9" fontSize="22">
              -
            </text>
            <text x="160" y="228" fill="#c7d3d9" fontSize="13" textAnchor="middle">
              YOU
            </text>
          </svg>
          <p>
            Terrain, usable power and radio-link performance need additional models. This is a first
            geometric comparison.
          </p>
        </div>
      </section>
      <section id="story-3" className={`${s.act} ${s.windowAct}`}>
        <div className={s.copy}>
          <p className={s.kicker}>03 / THE ORIGINAL WINDOW</p>
          <h2>
            SAME WEEK.
            <br />
            <span>
              DIFFERENT
              <br />
              OPPORTUNITIES.
            </span>
          </h2>
          <p>
            14&ndash;21 November 2026. Seven Earth days. One hourly clock. At how many sampled times
            are both bodies above the geometric horizon?
          </p>
          <Link className={s.textLink} href={open()}>
            Inspect the original window {String.fromCharCode(8599)}
          </Link>
        </div>
        <div className={s.windowGraphic}>
          <div className={s.resultTop}>
            <span>BOTH ABOVE / SHARE OF HOURLY SAMPLES</span>
            <span>ORIGINAL</span>
          </div>
          {['Odysseus', 'Athena'].map((name, i) => (
            <div className={s.bigResult} key={name}>
              <span>
                {i ? 'B' : 'A'} / {name}
              </span>
              <strong>{headline(i, false)}</strong>
              <div className={s.resultBar}>
                <i
                  style={{
                    width: results
                      ? `${(100 * results[i].joint.above) / results[i].joint.expected}%`
                      : '0%',
                  }}
                />
              </div>
              <small>
                {results
                  ? `${results[i].joint.above} of ${results[i].joint.expected} samples`
                  : 'Checking source integrity'}
              </small>
            </div>
          ))}
          <p className={s.scienceNote}>
            Sample proportions, not continuous availability or an operational guarantee.
          </p>
          {o.error && <p role="alert">Source unavailable. No results are estimated.</p>}
        </div>
      </section>
      <section id="story-4" className={`${s.act} ${s.delayAct}`}>
        <div className={s.copy}>
          <p className={s.kicker}>04 / CHANGE THE SCHEDULE</p>
          <h2>
            THREE DAYS.
            <br />
            <span>
              A NEW
              <br />
              COMPARISON.
            </span>
          </h2>
          <p>
            The places stay the same. Move the seven-day window 72 hours later, to 17&ndash;24
            November. See what the source-backed sample counts reveal.
          </p>
          <button className={s.primary} aria-pressed={slipped} onClick={() => setSlipped(!slipped)}>
            {slipped ? 'Return to original window' : 'Apply the 72-hour delay'}{' '}
            <span aria-hidden="true">{String.fromCharCode(8594)}</span>
          </button>
        </div>
        <div className={s.delayGraphic}>
          <div className={s.delayStamp}>
            {slipped ? '17 NOV / DELAYED +72 H' : '14 NOV / ORIGINAL'}
          </div>
          {['Odysseus', 'Athena'].map((name, i) => (
            <div className={s.delayResult} key={name}>
              <span>
                {i ? 'B' : 'A'} / {name}
              </span>
              <strong>{headline(i, slipped)}</strong>
              <small>Both above / sampled times</small>
              <div className={s.delayTrack}>
                <i
                  style={{
                    width: results
                      ? `${(100 * results[i + (slipped ? 2 : 0)].joint.above) / results[i].joint.expected}%`
                      : '0%',
                  }}
                />
              </div>
              <p>{slipped ? o.result?.analysis.changes[i] : 'One window. One source release.'}</p>
            </div>
          ))}
          <Link className={s.textLink} href={open(slipped)}>
            Explore this comparison {String.fromCharCode(8599)}
          </Link>
        </div>
      </section>
      <section id="story-5" className={`${s.act} ${s.finalAct}`}>
        <p className={s.kicker}>05 / THE NEXT COMPARISON IS YOURS</p>
        <h2>
          MOVE THE DATE.
          <br />
          CHANGE THE PLACE.
          <br />
          <span>FOLLOW THE EVIDENCE.</span>
        </h2>
        <p>
          Six documented viewpoints. Ninety days of archived NASA/JPL observations.
          <br />A clearer way to investigate what changes.
        </p>
        <Link className={s.primary} href={open()}>
          Open the mission atlas <span aria-hidden="true">{String.fromCharCode(8599)}</span>
        </Link>
        <div className={s.finalLinks}>
          <Link href="/field-guide">Understand the geometry {String.fromCharCode(8599)}</Link>
          <Link href="/sources">Inspect sources &amp; limits {String.fromCharCode(8599)}</Link>
        </div>
        <p className={s.finalLimit}>
          Independent educational project. Geometric horizon only. Science provisional.
        </p>
      </section>
    </main>
  );
}
