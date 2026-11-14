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
          <p className="eyebrow">YOUR LOCAL SKY</p>
          <h1>CHANGE YOUR VIEW.</h1>
        </div>
        <div className={s.tools}>
          <button disabled>Choose places</button>
          <button disabled>Evidence &amp; method</button>
        </div>
      </header>
      <div className={s.contextLine}>
        <span>Geometric horizon &middot; terrain excluded</span>
        <span>Checking the source release</span>
      </div>
      <div className={d.bar}>
        <button disabled>Explore a real observation</button>
        <button disabled>Follow a crossing</button>
        <button disabled>Find a moment</button>
        <button disabled>Share &amp; export</button>
      </div>
      <section className={`${s.transport} ${s.loadingTransport}`}>
        <p>Opening the verified observation archive&hellip;</p>
      </section>
      <div className={s.mobileSwitch}>
        <button disabled>A / Observer</button>
        <button disabled>B / Observer</button>
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
