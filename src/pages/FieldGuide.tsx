import { useState } from 'react';
import { Link } from '../lib/router';
import s from './Guide.module.css';
export default function FieldGuide() {
  const [above, setAbove] = useState(true);
  return (
    <main id="main" tabIndex={-1} className={s.page}>
      <header className={s.intro}>
        <p className="eyebrow">THE FIELD GUIDE</p>
        <h1>
          A LITTLE CONTEXT.
          <br />
          <span>A DIFFERENT VIEW.</span>
        </h1>
        <p>Three ideas to take with you before you read a lunar sky.</p>
      </header>
      <section className={s.sourceSection}>
        <h2>START WITH A MISSION WINDOW.</h2>
        <p>
          Choose two viewpoints, a UTC start and a duration. Compare the original window with the
          same duration after a schedule slip. Both places share one active inspection time;
          switching Original / Delayed moves that clock together.
        </p>
        <p>
          A seven-day hourly window includes 169 samples because both endpoints are included. A
          value of 100% means the condition held at every sampled time. It does not prove
          uninterrupted visibility between samples, solar-array output or a working radio link.
        </p>
        <p>
          The atlas helps you locate the places. The signed horizon chart explains the selected
          sample. The timeline connects the moment to the window. Sources and exports expose the
          evidence and limitations.
        </p>
        <Link className="quietLink" href="/explore">
          Try the 72-hour delay comparison {String.fromCharCode(8599)}
        </Link>
      </section>
      <section className={s.explainer}>
        <div>
          <p className="eyebrow">01 / YOUR HORIZON</p>
          <h2>
            THE PLANE
            <br />
            BENEATH YOUR FEET.
          </h2>
          <p>
            A geometric horizon is a local reference plane. The Sun and Earth can sit above or below
            it. Their elevation tells you which.
          </p>
          <div className={s.toggle}>
            <button aria-pressed={above} onClick={() => setAbove(true)}>
              Above the plane
            </button>
            <button aria-pressed={!above} onClick={() => setAbove(false)}>
              Below the plane
            </button>
          </div>
          <small>This diagram explains a concept. It does not display an observation.</small>
        </div>
        <svg
          viewBox="0 0 600 360"
          role="img"
          aria-label={`Conceptual ${above ? 'above' : 'below'} horizon sightline, no measured angles.`}
        >
          <defs>
            <linearGradient id="plane" x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#283847" />
              <stop offset="1" stopColor="#0c121a" />
            </linearGradient>
          </defs>
          <path d="M40 235L260 125L560 190L330 320Z" fill="url(#plane)" stroke="#5b7085" />
          <path d="M300 70V320" stroke="#708397" strokeDasharray="4 7" />
          <path d={`M300 215L485 ${above ? 75 : 295}`} stroke="#eeb66b" strokeWidth="2" />
          <circle cx="300" cy="215" r="6" fill="#f2f1ec" />
          <circle cx="485" cy={above ? 75 : 295} r="15" fill="#eeb66b" />
          <text x="325" y="230" fill="#c3cdd9" fontSize="14">
            OBSERVER
          </text>
          <text x="45" y="220" fill="#b2c0cf" fontSize="14">
            REFERENCE PLANE
          </text>
        </svg>
      </section>
      <section id="places" className={s.places}>
        <div>
          <p className="eyebrow">02 / TWO SOUTHERN PLACES</p>
          <h2>
            ODYSSEUS.
            <br />
            ATHENA.
          </h2>
          <p>
            Two historical landing locations ground the comparison. RIMWAKE uses their approximate
            published coordinates to define hypothetical observers.
          </p>
        </div>
        <div className={s.place}>
          <span>A</span>
          <h3>Odysseus / IM-1</h3>
          <strong>
            80.13° S<br />
            1.44° E
          </strong>
          <p>
            Approximate landing coordinates from NASA NSSDCA. The reference observer is not the
            actual spacecraft instrument.
          </p>
          <Link href="/explore?case=two-skies-one-instant">Look from this place ↗</Link>
        </div>
        <div className={s.place}>
          <span>B</span>
          <h3>Athena / IM-2</h3>
          <strong>
            84.7906° S<br />
            29.1957° E
          </strong>
          <p>
            Another local perspective, using the same model and shared UTC. Observer height is zero
            above the reference ellipsoid.
          </p>
          <Link href="/explore?case=two-skies-one-instant">Compare the two views ↗</Link>
        </div>
      </section>
      <section className={s.bearings}>
        <div
          className={s.compass}
          aria-label="Azimuth: north zero degrees, east ninety, south one hundred eighty, west two hundred seventy"
        >
          <span>N / 0°</span>
          <span>E / 90°</span>
          <span>S / 180°</span>
          <span>W / 270°</span>
          <i />
        </div>
        <div>
          <p className="eyebrow">03 / FINDING YOUR DIRECTION</p>
          <h2>
            AROUND THE SKY.
            <br />
            ABOVE THE PLANE.
          </h2>
          <p>
            Azimuth tells you the direction: north is 0°, east is 90°, and bearings increase
            clockwise. Elevation tells you how far above or below the local plane the body’s centre
            appears.
          </p>
          <p>
            One UTC sample drives both viewpoints. The figures are apparent airless angles from JPL
            Horizons; they are not interpolated positions.
          </p>
        </div>
      </section>
      <section id="limits" className={s.limits}>
        <p className="eyebrow">THE LIMIT OF THIS VIEW</p>
        <h2>
          VISIBILITY
          <br />
          <span>IS NOT VIABILITY.</span>
        </h2>
        <p>
          A body above the geometric plane is not a guarantee of sunlight reaching a solar panel or
          a working radio connection. Terrain, finite discs, eclipses, power and RF-link performance
          are outside this release.
        </p>
        <div>
          <h3>What would a terrain result need?</h3>
          <p>
            A source-backed terrain model, aligned lunar coordinates, a surface observer height,
            complete near/far horizon coverage and checked sightlines. That research gate is still
            closed.
          </p>
        </div>
        <Link href="/sources" className="quietLink">
          Understand the evidence and open checks ↗
        </Link>
      </section>
      <div className={s.end}>
        <h2>NOW CHANGE YOUR VIEW.</h2>
        <Link className="primaryButton" href="/explore">
          Open the Explorer ↗
        </Link>
      </div>
    </main>
  );
}
