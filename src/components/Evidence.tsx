import { useState } from 'react';
import type { Release, Sample } from '../science';
import { date, time } from '../lib/format';
import { Dialog } from './Shell';
import s from './Evidence.module.css';
export default function Evidence({
  release: r,
  records,
  onClose,
}: {
  release: Release;
  records: Sample[];
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false),
    [copyError, setCopyError] = useState(false);
  const runs = r.runs.filter((run) => records.some((row) => row.run_id === run.run_id));
  const trace = [
    `RIMWAKE ${r.release_id}`,
    `Model: ${r.model}`,
    `UTC: ${records[0]?.timestamp_utc ?? 'release overview'}`,
    ...runs.map((run) => `${run.run_id} | ${run.raw_sha256} | ${run.request_url}`),
    'Hypothetical reference-ellipsoid observers; terrain excluded; science provisional.',
  ].join('\n');
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(trace);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  };
  return (
    <Dialog title="Evidence register" onClose={onClose}>
      <p className="eyebrow">THE SOURCE / THE SAMPLE / THE LIMIT</p>
      <h2 className={s.title}>
        See the measurement.
        <br />
        <em>Not just the picture.</em>
      </h2>
      <p className={s.lead}>
        Every reading belongs to a released NASA/JPL record. The geometry is provisional;
        independent astronomical-model validation has not been run.
      </p>
      <div className={s.record}>
        <span className="eyebrow">SELECTED RECORD</span>
        <strong>
          {records[0]
            ? `${date(records[0].timestamp_utc)} / ${time(records[0].timestamp_utc)} UTC`
            : 'Scientific release overview'}
        </strong>
        <code>{r.release_id}</code>
        <p>
          Hypothetical observers at 0 km above the Horizons lunar reference ellipsoid. Approximate
          reported landing coordinates; these are not actual lander antenna heights.
        </p>
      </div>
      <button className="primaryButton" onClick={copy}>
        {copied ? 'Trace copied' : 'Copy reproducibility trace'}
        <span aria-hidden="true">↗</span>
      </button>
      {copyError && (
        <label className={s.copyFallback}>
          Copy this trace manually
          <textarea readOnly value={trace} onFocus={(event) => event.target.select()} />
        </label>
      )}
      <h3 className={s.section}>01 / Model & coordinates</h3>
      <p>
        Geometric tangent plane; lunar terrain excluded. Apparent airless centre-of-disc
        azimuth/elevation. North 0°, east 90°, clockwise. Negative elevation means below the tangent
        plane, without identifying an obstructing ridge.
      </p>
      {r.sites.map((site) => (
        <div className={s.source} key={site.id}>
          <strong>{site.name}</strong>
          <p>
            {site.latitude_deg}° latitude / {site.longitude_deg_east}° east /{' '}
            {site.observer_model.height_km} km reference-ellipsoid height
          </p>
          <p>{site.horizontal_frame}</p>
        </div>
      ))}
      <h3 className={s.section}>02 / Selected run lineage</h3>
      {runs.map((run) => (
        <details key={run.run_id} className={s.source}>
          <summary>{run.run_id}</summary>
          <a href={run.request_url} target="_blank" rel="noreferrer">
            Repeat exact Horizons query ↗
          </a>
          <p>
            Retrieved {run.retrieved_at_utc}. {run.step_seconds / 60}-minute cadence. Status:{' '}
            {run.validation_status}.
          </p>
          <code>SHA-256 {run.raw_sha256}</code>
          <pre>{JSON.stringify(run.horizons_query_parameters, null, 2)}</pre>
        </details>
      ))}
      <h3 className={s.section}>03 / NASA/JPL source ledger</h3>
      {r.sources.map((source) => (
        <article className={s.source} key={source.id}>
          <a href={source.url} target="_blank" rel="noreferrer">
            {source.title} ↗
          </a>
          <p>
            {source.publisher} · retrieved {date(source.retrieved_at_utc)}{' '}
            {time(source.retrieved_at_utc)} UTC
          </p>
          <code>SHA-256 {source.sha256}</code>
          <p>Challenge Resources eligibility: {String(source.challenge_resource_eligible)}</p>
        </article>
      ))}
      <h3 className={s.section}>04 / Sampling & validation</h3>
      <p>
        35 days, hourly: 14 November–19 December 2026, including both endpoints. The first crossing
        in processing order was selected for ten-minute refinement across both sites and bodies.
        This is an illustrative case selection, not a typicality claim. Crossings remain brackets
        between samples; no positions are interpolated.
      </p>
      <p>
        Numerical classification tolerance: ±{r.epsilon_deg}°. This is not a physical accuracy or
        uncertainty estimate.
      </p>
      {r.validation.reference_checks.map((check) => (
        <p key={check.run_id}>
          {check.site_id}: {check.kind}. Maximum checked angle difference:{' '}
          {check.max_angle_difference_deg}°.
        </p>
      ))}
      <h3 className={s.section}>05 / Take the evidence</h3>
      <p>
        Schema {r.schema_version} · generated {r.generated_at_utc}
      </p>
      <a className={s.download} href="/data/release.json" download>
        Scientific release JSON ↓
      </a>
      <a className={s.download} href="/data/intervals.json" download>
        Sampled interval register ↓
      </a>
      <a className={s.download} href="/data/evidence.zip" download>
        Complete raw evidence archive ↓
      </a>
      <h3 className={s.section}>06 / Unresolved & excluded</h3>
      <ul>
        {r.validation.limitations.map((limit) => (
          <li key={limit}>{limit}</li>
        ))}
      </ul>
      <p>
        Finite discs, eclipses, solar power and RF-link performance are excluded. NASA/JPL provide
        cited data; they do not endorse this independent educational interface. Codex assisted
        implementation and QA. Visual lunar context uses NASA SVS’s aesthetics-only color map, not
        scientific terrain.
      </p>
    </Dialog>
  );
}
