import s from '../pages/Observatory.module.css';
import d from './Discovery.module.css';
export default function ObservatoryLoading() {
  return (
    <main
      id="main"
      tabIndex={-1}
      className={`${s.observatory} dark`}
      aria-busy="true"
      aria-label="Loading verified observations"
    >
      <header className={s.heading}>
        <div>
          <p className="eyebrow">TWO PLACES / ONE SHARED TIME</p>
          <h1>COMPARE THE SKIES.</h1>
        </div>
        <div className={s.tools}>
          <button disabled>Choose places</button>
          <button disabled className={s.desktopSwap}>
            Swap A and B
          </button>
          <button disabled>Evidence &amp; method</button>
        </div>
      </header>
      <div className={s.contextLine}>
        <span>
          Geometric model &middot; terrain excluded{' '}
          <span className={s.mobileModelStatus}>&middot; science provisional</span>
        </span>
        <span className={s.modelStatus}>Checking the source release</span>
      </div>
      <div className={d.bar}>
        <button disabled>Guided discovery</button>
        <button className={d.secondaryCase} disabled>
          Follow a crossing
        </button>
        <button disabled>Find a moment</button>
        <button disabled>Share &amp; export</button>
      </div>
      <section className={`${s.transport} ${s.loadingTransport}`}>
        <p>Opening the verified observation archive&hellip;</p>
      </section>
      <div className={s.mobileSwitch}>
        <button disabled>A / Observer</button>
        <button disabled>B / Observer</button>
        <button disabled className={s.mobileSwap} aria-label="Swap A and B">
          &#8644;
        </button>
      </div>
      <div className={s.mobileTime}>SHARED UTC / CHECKING</div>
      <div className={s.workspace}>
        {[0, 1].map((i) => (
          <section key={i} className={`${s.view} ${i === 0 ? s.active : ''}`}>
            <div className={s.loadingHead} />
            <div className={s.scene}>
              <div className={s.loadingRing} />
            </div>
            <div className={s.loadingTable}>
              <span>Checking source integrity before displaying readings.</span>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
