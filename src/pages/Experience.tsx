import { useEffect, lazy, Suspense, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Link } from '../lib/router';
import { useData } from '../lib/data';
import { useSelection } from '../lib/selection';
import { signed } from '../lib/format';
import { useWebGLCapability, useMedia } from '../cinema/preferences';
import type { StoryMotion } from '../cinema/StoryScene';
import SceneGuard from '../cinema/SceneGuard';
import s from './Experience.module.css';
gsap.registerPlugin(ScrollTrigger, useGSAP);
const Scene = lazy(() => import('../cinema/StoryScene'));
const CHAPTERS = ['Arrival', 'Approach', 'Stand here', 'Compare', 'Move time', 'Take control'];
export default function Experience() {
  const root = useRef<HTMLElement>(null),
    motion = useRef<StoryMotion>({ progress: 0, invalidate: () => {} });
  const { release } = useData(),
    { setSelection } = useSelection();
  const compact = useMedia('(max-width:700px)'),
    reduced = useMedia('(prefers-reduced-motion:reduce)');
  const capable = useWebGLCapability(!reduced);
  const [failed, setFailed] = useState(false),
    [ready, setReady] = useState(false),
    [chapter, setChapter] = useState(0),
    [refined, setRefined] = useState(3);
  const [enhance, setEnhance] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const poster = root.current?.querySelector('img');
    Promise.allSettled([document.fonts.ready, poster?.decode()]).then(() =>
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (!cancelled) setEnhance(true);
        }),
      ),
    );
    return () => {
      cancelled = true;
    };
  }, []);
  const records = useMemo(() => {
    if (!release) return [[], []];
    const rows = chapter >= 4 ? release.refined_samples : release.samples;
    const stamp =
      chapter >= 4
        ? [...new Set(rows.map((row) => row.timestamp_utc))].sort()[refined]
        : release.timestamps[0];
    return ['im1', 'im2'].map((id) =>
      [10, 399].map((body) =>
        rows.find(
          (row) => row.site_id === id && row.body_id === body && row.timestamp_utc === stamp,
        )!,
      ),
    );
  }, [release, chapter, refined]);
  useGSAP(
    () => {
      const trigger = ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          motion.current.progress = self.progress * 5;
          motion.current.invalidate();
          setChapter(Math.min(5, Math.floor(self.progress * 5 + 0.32)));
        },
      });
      if (!reduced) {
        gsap.utils.toArray<HTMLElement>(`.${s.chapterCopy}`).forEach((copy) => {
          gsap.fromTo(
            copy,
            { y: 28 },
            {
              y: 0,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: copy,
                start: 'top 90%',
                toggleActions: 'play none none reverse',
              },
            },
          );
        });
      }
      return () => trigger.kill();
    },
    { scope: root, dependencies: [reduced] },
  );
  const jump = (i: number) =>
    document
      .getElementById(`chapter-${i}`)
      ?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth' });
  const takeControl = () =>
    setSelection((previous) => ({
      ...previous,
      a: 'im1',
      b: 'im2',
      mode: 'refined',
      index: refined,
    }));
  return (
    <main id="main" tabIndex={-1} ref={root} className={s.experience}>
      <div className={s.stage} aria-hidden="true" data-local={chapter >= 2} data-chapter={chapter}>
        <div className={`${s.poster} ${ready && !failed && !reduced ? ' ' + s.posterHidden : ''}`}>
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
              <Scene
                localActive={chapter >= 2}
                motion={motion}
                records={records}
                compact={compact}
                onFailure={() => setFailed(true)}
                onReady={() => setReady(true)}
              />
            </Suspense>
          </SceneGuard>
        )}
        {(reduced || failed || !capable) && chapter >= 2 && (
          <div className={s.staticPlanes}>
            {records.map((rows, i) => (
              <svg key={i} viewBox="0 0 500 240">
                <line x1="20" y1="120" x2="480" y2="120" stroke="#b7c5d8" />
                <text x="20" y="30" fill="#c6cfdb" fontSize="17">
                  {i === 0 ? 'A / ODYSSEUS' : 'B / ATHENA'}
                </text>
                {rows.map((row) =>
                  row &&
                  row.quality_state === 'available' &&
                  row.azimuth_deg !== null &&
                  row.elevation_deg !== null ? (
                    <g key={row.body_id}>
                      <line
                        x1={20 + (row.azimuth_deg / 360) * 460}
                        y1="120"
                        x2={20 + (row.azimuth_deg / 360) * 460}
                        y2={120 - row.elevation_deg * 5}
                        stroke={row.body_id === 10 ? '#eeb66b' : '#86c7eb'}
                      />
                      <circle
                        cx={20 + (row.azimuth_deg / 360) * 460}
                        cy={120 - row.elevation_deg * 5}
                        r="7"
                        fill={row.body_id === 10 ? '#eeb66b' : '#86c7eb'}
                      />
                    </g>
                  ) : null,
                )}
              </svg>
            ))}
          </div>
        )}
        {chapter >= 2 && capable && !failed && !reduced && (
          <div className={s.sceneNames}>
            <span>A / ODYSSEUS</span>
            <span>B / ATHENA</span>
          </div>
        )}
        <div className={s.vignette} />
        <span className={s.artCredit}>
          {chapter < 2
            ? 'NASA lunar imagery · illustrative lighting'
            : 'Geometric reference planes · terrain excluded'}
        </span>
      </div>
      <nav className={s.chapters} aria-label="Story chapters">
        {CHAPTERS.map((name, i) => (
          <button
            key={name}
            aria-label={`Chapter ${String(i + 1).padStart(2, '0')}: ${name}`}
            aria-current={chapter === i ? 'step' : undefined}
            onClick={() => jump(i)}
          >
            <span>{String(i + 1).padStart(2, '0')}</span>
            <i />
            {chapter === i && <b>{name}</b>}
          </button>
        ))}
      </nav>
      <section id="chapter-0" className={`${s.chapter} ${s.arrival}`}>
        <div className={s.heroCopy}>
          <p className={s.kicker}>THE MOON. A DIFFERENT PERSPECTIVE.</p>
          <h1>
            WHERE
            <br />
            YOU <span>STAND.</span>
          </h1>
          <p className={s.heroLead}>
            One world. A different view of the Sun
            <br className={s.desktop} /> and Earth from every place.
          </p>
          <div className={s.actions}>
            <button className="primaryButton" onClick={() => jump(1)}>
              Begin the journey <span>↓</span>
            </button>
            <Link className="quietLink" href="/explore">
              Go straight to Explorer ↗
            </Link>
          </div>
        </div>
        <div className={s.heroBottom}>
          <span>Scroll to change your perspective</span>
          <span>01 — 06</span>
        </div>
      </section>
      <section id="chapter-1" className={`${s.chapter} ${s.approach}`}>
        <div className={s.chapterCopy}>
          <p className={s.kicker}>A CHANGE OF PLACE</p>
          <h2>
            ONE MOON.
            <br />
            <span>TWO PERSPECTIVES.</span>
          </h2>
          <p>
            Odysseus and Athena reached different parts of the southern Moon. What would a
            hypothetical observer see from each location?
          </p>
          <Link href="/field-guide#places" className="quietLink">
            Meet the two places ↗
          </Link>
        </div>
        <div className={s.locationLabels}>
          <span>
            <b>A</b> Odysseus<small>80.13° S</small>
          </span>
          <span>
            <b>B</b> Athena<small>84.7906° S</small>
          </span>
        </div>
      </section>
      <section id="chapter-2" className={`${s.chapter} ${s.stand}`}>
        <div className={s.chapterCopy}>
          <p className={s.kicker}>YOUR LOCAL SKY</p>
          <h2>
            THE HORIZON
            <br />
            <span>STARTS HERE.</span>
          </h2>
          <p>
            Imagine a flat reference plane beneath your feet. A positive elevation is above it. A
            negative elevation is below.
          </p>
        </div>
        <div className={s.planeKey}>
          <span>↑ Above the plane</span>
          <i />
          <span>↓ Below the plane</span>
        </div>
      </section>
      <section id="chapter-3" className={`${s.chapter} ${s.compare}`}>
        <div className={s.chapterCopy}>
          <p className={s.kicker}>14 NOVEMBER 2026 · 00:00 UTC</p>
          <h2>
            SAME MOMENT.
            <br />
            <span>DIFFERENT SKY.</span>
          </h2>
          <p>
            At A, the Sun is below the geometric horizon. At B, it is above. Earth has the opposite
            classification.
          </p>
        </div>
        {release ? (
          <div className={s.observations}>
            {['im1', 'im2'].map((id, i) => {
              const row = release.samples.find(
                (row) =>
                  row.site_id === id &&
                  row.body_id === 10 &&
                  row.timestamp_utc === release.timestamps[0],
              );
              return (
                <div key={i}>
                  <span>{i === 0 ? 'A · ODYSSEUS' : 'B · ATHENA'}</span>
                  <strong className="sun">{signed(row?.elevation_deg ?? null)}</strong>
                  <p>Sun {i === 0 ? 'below' : 'above'} the plane</p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className={s.archiveNote}>Source archive loading. No readings are estimated.</p>
        )}
        <Link href="/explore?case=two-skies-one-instant" className={s.exactCase}>
          Inspect this exact moment ↗
        </Link>
      </section>
      <section id="chapter-4" className={`${s.chapter} ${s.moveTime}`}>
        <div className={s.chapterCopy}>
          <p className={s.kicker}>NOW FOLLOW ONE CROSSING · 16 NOVEMBER</p>
          <h2>
            TEN MINUTES.
            <br />
            <span>A THRESHOLD.</span>
          </h2>
          <p>
            Follow the Sun at the Odysseus coordinate observer. These are two actual samples, ten
            minutes apart. The exact crossing time lies between them.
          </p>
          <div className={s.timeChoice}>
            <button aria-pressed={refined === 3} onClick={() => setRefined(3)}>
              03:30 UTC
            </button>
            <button aria-pressed={refined === 4} onClick={() => setRefined(4)}>
              03:40 UTC
            </button>
          </div>
          {release && (
            <div className={s.crossingReading}>
              <strong className="sun">
                {signed(
                  release.refined_samples.find(
                    (row) =>
                      row.site_id === 'im1' &&
                      row.body_id === 10 &&
                      row.timestamp_utc ===
                        [
                          ...new Set(release.refined_samples.map((row) => row.timestamp_utc)),
                        ].sort()[refined],
                  )?.elevation_deg ?? null,
                )}
              </strong>
              <span>Sun-centre elevation</span>
            </div>
          )}
        </div>
      </section>
      <section id="chapter-5" className={`${s.chapter} ${s.takeControl}`}>
        <div className={s.finalCopy}>
          <p className={s.kicker}>THE NEXT PERSPECTIVE IS YOURS</p>
          <h2>
            CHANGE
            <br />
            <span>YOUR VIEW.</span>
          </h2>
          <p>
            Two locations. One shared clock.
            <br />
            Follow the Sun and Earth—and the evidence.
          </p>
          <Link className="primaryButton" href="/explore" onClick={takeControl}>
            Enter the Explorer <span>↗</span>
          </Link>
          <p className={s.finalCaveat}>
            Geometric horizon only. Terrain, power and radio-link performance are not assessed.
          </p>
        </div>
      </section>
    </main>
  );
}
