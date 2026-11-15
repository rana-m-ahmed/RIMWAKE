import s from './Mission.module.css';
export default function MissionLoading() {
  return (
    <main id="main" className={s.mission} aria-busy="true">
      <header className={s.pageHeading}>
        <div>
          <p className="eyebrow">THE RIMWAKE MISSION ATLAS</p>
          <h1>WHAT IF THE DATE CHANGES?</h1>
          <p>
            <span className={s.desktopLead}>
              Compare two places. Move the window. Understand the difference.
            </span>
            <span className={s.mobileLead}>Two places. One window. What changes?</span>
          </p>
        </div>
        <div className={s.headingTools}>
          <button disabled>
            Evidence &amp; limits <span aria-hidden="true">{String.fromCharCode(8599)}</span>
          </button>
          <button disabled>
            Share &amp; export <span aria-hidden="true">{String.fromCharCode(8599)}</span>
          </button>
        </div>
      </header>
      <div className={s.loadingStage}>
        <img src="/assets/moon-context-mobile.webp" alt="" />
        <div>
          <p className="eyebrow">OPENING THE ARCHIVE</p>
          <h2>
            ONE MOON.
            <br />
            MORE POSSIBILITIES.
          </h2>
          <p>Verifying the source before showing any readings.</p>
        </div>
      </div>
    </main>
  );
}
