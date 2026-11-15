import {
  addHours,
  classify,
  joint,
  requestError,
  type Analysis,
  type Index,
  type Metric,
  type Request,
  type Row,
  type Series,
  type State,
  type Summary,
} from './model';
const key = (body: number, time: string) => `${body}/${time}`;
function metric(states: State[], clock: string[]): Metric {
  let longest: Metric['longest'] = null,
    start = -1;
  for (let i = 0; i <= states.length; i++) {
    if (states[i] === 'visible') {
      if (start < 0) start = i;
    } else if (start >= 0) {
      const count = i - start;
      if (!longest || count > longest.count)
        longest = {
          start: clock[start],
          end: clock[i - 1],
          count,
          hours: (Date.parse(clock[i - 1]) - Date.parse(clock[start])) / 3600000,
        };
      start = -1;
    }
  }
  return {
    above: states.filter((s) => s === 'visible').length,
    unknown: states.filter((s) => s === 'unknown').length,
    boundary: states.filter((s) => s === 'boundary').length,
    expected: states.length,
    longest,
  };
}
export function analyze(index: Index, series: [Series, Series], request: Request): Analysis {
  const error = requestError(index, request);
  if (error) throw Error(error);
  if (
    series[0].site_id !== request.a ||
    series[1].site_id !== request.b ||
    series.some((s) => s.release_id !== index.release_id)
  )
    throw Error('Source/selection mismatch');
  const maps = series.map(
    (s) => new Map(s.records.map((row) => [key(row.body_id, row.timestamp_utc), row])),
  );
  const get = (slot: number, body: number, t: string): Row =>
    maps[slot].get(key(body, t)) ?? {
      timestamp_utc: t,
      body_id: body,
      site_id: slot ? request.b : request.a,
      quality_state: 'unknown',
      elevation_deg: null,
      azimuth_deg: null,
      release_id: index.release_id,
      run_id: '',
    };
  const summaries: Summary[] = [],
    tracks: Analysis['tracks'] = [],
    csvRows: unknown[][] = [];
  for (const scenario of ['baseline', 'delayed'] as const)
    for (const slot of [0, 1]) {
      const start = addHours(request.start, scenario === 'delayed' ? request.delay : 0),
        clock = Array.from({ length: request.hours + 1 }, (_, i) => addHours(start, i));
      const solar = clock.map((t) => get(slot, 10, t)),
        earth = clock.map((t) => get(slot, 399, t));
      const sun = solar.map((r) => classify(r, index.epsilon_deg)),
        home = earth.map((r) => classify(r, index.epsilon_deg)),
        both = sun.map((s, i) => joint(s, home[i]));
      const crossings: Summary['crossings'] = [];
      for (const [body, states] of [
        ['Sun', sun],
        ['Earth', home],
      ] as const)
        for (let i = 1; i < clock.length; i++)
          if (states[i] !== states[i - 1] && states[i] !== 'unknown' && states[i - 1] !== 'unknown')
            crossings.push({
              body,
              start: clock[i - 1],
              end: clock[i],
              before: states[i - 1],
              after: states[i],
            });
      crossings.sort((a, b) => a.end.localeCompare(b.end) || a.body.localeCompare(b.body));
      const minimum = (rows: Row[]) => {
        const v = rows.filter((r) => classify(r) !== 'unknown').map((r) => r.elevation_deg!);
        return v.length ? Math.min(...v) : null;
      };
      summaries.push({
        site: slot ? request.b : request.a,
        scenario,
        start,
        end: clock.at(-1)!,
        sun: metric(sun, clock),
        earth: metric(home, clock),
        joint: metric(both, clock),
        complete: !sun.includes('unknown') && !home.includes('unknown'),
        minimumSun: minimum(solar),
        minimumEarth: minimum(earth),
        crossings,
      });
      tracks.push({
        slot: slot ? 'B' : 'A',
        scenario,
        start,
        states: request.layer === 'sun' ? sun : request.layer === 'earth' ? home : both,
      });
      clock.forEach((t, i) =>
        [solar[i], earth[i]].forEach((row) => {
          const run = series[slot].runs.find((r) => r.run_id === row.run_id);
          csvRows.push([
            index.release_id,
            scenario,
            slot ? 'B' : 'A',
            row.site_id,
            t,
            row.body_id === 10 ? 'Sun' : 'Earth',
            row.azimuth_deg,
            row.elevation_deg,
            classify(row),
            row.run_id,
            run?.raw_sha256 ?? '',
            run?.request_url ?? '',
            index.model,
            'provisional; hourly samples; terrain, power and RF excluded',
          ]);
        }),
      );
    }
  const current = summaries.filter((s) => s.scenario === request.scenario),
    a = current[0],
    b = current[1];
  const names = [request.a, request.b].map((id) => index.sites.find((s) => s.id === id)!.name);
  const delta = (100 * (b.joint.above - a.joint.above)) / a.joint.expected;
  const explanation =
    !a.complete || !b.complete
      ? 'Coverage is incomplete. A comparative verdict is unavailable.'
      : request.a === request.b
        ? 'The same place has the same modeled conditions in this window.'
        : delta === 0
          ? 'Both places have the same share of jointly above-horizon samples. Their angles and timing may still differ.'
          : `${names[delta > 0 ? 1 : 0]} has ${Math.abs(delta).toFixed(1)} percentage points more samples with both Sun and Earth above the geometric horizon.`;
  const changes = [0, 1].map((i) => {
    const before = summaries[i],
      after = summaries[i + 2],
      change = after.joint.above - before.joint.above;
    return !before.complete || !after.complete
      ? 'Incomplete coverage; change unresolved.'
      : change === 0
        ? 'No change in the jointly above-horizon sample count.'
        : `${Math.abs(change)} ${change > 0 ? 'more' : 'fewer'} jointly above-horizon samples (${Math.abs((100 * change) / before.joint.expected).toFixed(1)} percentage points).`;
  }) as [string, string];
  const utc = addHours(
    request.start,
    (request.scenario === 'delayed' ? request.delay : 0) + request.elapsed,
  );
  const cell = (v: unknown) => '"' + String(v ?? '').replaceAll('"', '""') + '"';
  return {
    request,
    utc,
    summaries,
    tracks,
    explanation,
    changes,
    records: [0, 1].map((slot) => [get(slot, 10, utc), get(slot, 399, utc)]) as [Row[], Row[]],
    overview: [0, 1].map((slot) =>
      index.timestamps.map((t) => joint(classify(get(slot, 10, t)), classify(get(slot, 399, t)))),
    ) as [State[], State[]],
    runs: [...new Map(series.flatMap((s) => s.runs).map((r) => [r.run_id, r])).values()],
    csv:
      [
        [
          'release_id',
          'scenario',
          'slot',
          'site_id',
          'utc',
          'body',
          'azimuth_deg',
          'elevation_deg',
          'classification',
          'run_id',
          'raw_sha256',
          'source_url',
          'model',
          'limits',
        ],
        ...csvRows,
      ]
        .map((row) => row.map(cell).join(','))
        .join('\r\n') + '\r\n',
  };
}
