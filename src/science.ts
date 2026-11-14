import { z } from 'zod';

export type State = 'visible' | 'blocked' | 'boundary' | 'unknown';
export function classify(e: number | null, epsilon = 1e-6): State {
  if (e === null || !Number.isFinite(e)) return 'unknown';
  return e > epsilon ? 'visible' : e < -epsilon ? 'blocked' : 'boundary';
}
export function both(a: State, b: State): State {
  if (a === 'blocked' || b === 'blocked') return 'blocked';
  if (a === 'unknown' || b === 'unknown') return 'unknown';
  if (a === 'boundary' || b === 'boundary') return 'boundary';
  return 'visible';
}
export const stateLabel = (s: State) =>
  ({
    visible: 'Above geometric horizon',
    blocked: 'Below geometric horizon',
    boundary: 'At numerical boundary',
    unknown: 'Data unknown',
  })[s];
const finite = z.number().finite();
const utc = z.string().datetime();
const sampleSchema = z.object({
  release_id: z.string(),
  run_id: z.string(),
  site_id: z.string(),
  body_id: z.union([z.literal(10), z.literal(399)]),
  timestamp_utc: utc,
  azimuth_deg: finite.min(0).lt(360).nullable(),
  elevation_deg: finite.min(-90).max(90).nullable(),
  quality_state: z.enum(['available', 'unknown']),
});
const crossingSchema = z.object({
  site_id: z.string(),
  body_id: z.number(),
  start_utc: utc,
  end_utc: utc,
  before: z.string(),
  after: z.string(),
  model: z.literal('tangent_plane_center_airless'),
  release_id: z.string(),
});
const sourceSchema = z.object({
  id: z.string(),
  title: z.string(),
  publisher: z.string(),
  url: z.url(),
  retrieved_at_utc: utc,
  sha256: z.string().regex(/^[a-f0-9]{64}$/),
  raw_path: z.string(),
  rights_review: z.string(),
  challenge_resource_eligible: z.union([z.boolean(), z.literal('unknown')]),
});
const runSchema = z.object({
  run_id: z.string(),
  release_id: z.string(),
  site_id: z.string(),
  body_id: z.number(),
  start_utc: utc,
  end_utc: utc,
  step_seconds: z.number().positive(),
  horizons_query_parameters: z.record(z.string(), z.string()),
  request_url: z.url(),
  raw_path: z.string(),
  raw_sha256: z.string().regex(/^[a-f0-9]{64}$/),
  retrieved_at_utc: utc,
  model: z.literal('tangent_plane_center_airless'),
  validation_status: z.literal('parser_checked'),
  validation_report_id: z.string(),
});
export const releaseSchema = z
  .object({
    release_id: z.string(),
    schema_version: z.literal('1.0.0'),
    generated_at_utc: utc,
    model: z.literal('tangent_plane_center_airless'),
    epsilon_deg: finite.positive(),
    sites: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
          latitude_deg: finite.min(-90).max(90),
          longitude_deg_east: finite.min(0).lt(360),
          location_type: z.literal('reported_landing_position'),
          horizontal_frame: z.string(),
          source_ids: z.array(z.string()).min(1),
          observer_model: z.object({
            height_km: z.literal(0),
            height_reference: z.string(),
            is_hypothetical: z.literal(true),
          }),
        }),
      )
      .min(2),
    sources: z.array(sourceSchema).min(1),
    runs: z.array(runSchema).min(4),
    timestamps: z.array(utc).min(2),
    samples: z.array(sampleSchema).min(8),
    refined_samples: z.array(sampleSchema),
    crossings: z.array(crossingSchema),
    refined_crossings: z.array(crossingSchema),
    validation: z.object({
      id: z.string(),
      status: z.literal('provisional'),
      reference_checks: z.array(
        z.object({
          site_id: z.string(),
          kind: z.string(),
          max_angle_difference_deg: finite,
          run_id: z.string(),
        }),
      ),
      independent_ephemeris_check: z.literal('NOT_RUN'),
      limitations: z.array(z.string()),
    }),
  })
  .superRefine((r, ctx) => {
    const fail = (message: string) => ctx.addIssue({ code: 'custom', message });
    const sourceIds = new Set(r.sources.map((s) => s.id)),
      siteIds = new Set(r.sites.map((s) => s.id));
    if (siteIds.size !== r.sites.length) fail('Duplicate sites');
    r.sites.forEach((s) =>
      s.source_ids.forEach((id) => {
        if (!sourceIds.has(id)) fail('Source mismatch');
      }),
    );
    const runs = new Map(r.runs.map((run) => [run.run_id, run]));
    r.runs.forEach((run) => {
      if (
        run.release_id !== r.release_id ||
        !siteIds.has(run.site_id) ||
        run.validation_report_id !== r.validation.id
      )
        fail('Run identity mismatch');
    });
    r.runs.forEach((run) => {
      const q = run.horizons_query_parameters,
        site = r.sites.find((s) => s.id === run.site_id);
      if (
        q.CENTER !== "'coord@301'" ||
        q.COMMAND !== `'${run.body_id}'` ||
        q.APPARENT !== "'AIRLESS'" ||
        q.TIME_TYPE !== "'UT'" ||
        q.QUANTITIES !== "'4'" ||
        q.COORD_TYPE !== "'GEODETIC'" ||
        q.SITE_COORD !== `'${site?.longitude_deg_east},${site?.latitude_deg},0'`
      )
        fail('Observer query mismatch');
      if (run.model !== r.model || ![10, 399].includes(run.body_id)) fail('Model or body mismatch');
    });
    for (let i = 1; i < r.timestamps.length; i++)
      if (
        r.timestamps[i] <= r.timestamps[i - 1] ||
        Date.parse(r.timestamps[i]) - Date.parse(r.timestamps[i - 1]) !== 3600000
      )
        fail('Invalid coarse clock');
    for (const dataset of [r.samples, r.refined_samples]) {
      const seen = new Set<string>();
      const times = new Map<string, string>();
      dataset.forEach((s) => {
        const run = runs.get(s.run_id),
          key = s.site_id + ':' + s.body_id,
          identity = key + ':' + s.timestamp_utc;
        if (
          s.release_id !== r.release_id ||
          !run ||
          run.site_id !== s.site_id ||
          run.body_id !== s.body_id
        )
          fail('Sample identity mismatch');
        if (seen.has(identity)) fail('Duplicate sample');
        seen.add(identity);
        if (times.has(key) && s.timestamp_utc <= times.get(key)!) fail('Unordered samples');
        times.set(key, s.timestamp_utc);
        if (s.quality_state === 'available' && (s.azimuth_deg === null || s.elevation_deg === null))
          fail('Missing available angle');
      });
      const clock =
        dataset === r.samples ? r.timestamps : [...new Set(dataset.map((s) => s.timestamp_utc))];
      if (dataset.length !== clock.length * r.sites.length * 2) fail('Incomplete sample matrix');
      for (const t of clock)
        for (const site of r.sites)
          for (const body of [10, 399])
            if (!seen.has(site.id + ':' + body + ':' + t)) fail('Missing shared sample');
    }
    [...r.crossings, ...r.refined_crossings].forEach((c) => {
      if (c.release_id !== r.release_id || !siteIds.has(c.site_id) || c.start_utc >= c.end_utc)
        fail('Invalid crossing');
    });
  });
export type Release = z.infer<typeof releaseSchema>;
export type Sample = z.infer<typeof sampleSchema>;
export type Site = Release['sites'][number];
export function skyPoint(az: number, el: number, r = 135) {
  const radius = (r * (90 - el)) / 90;
  return {
    x: 200 + radius * Math.sin((az * Math.PI) / 180),
    y: 200 - radius * Math.cos((az * Math.PI) / 180),
  };
}
