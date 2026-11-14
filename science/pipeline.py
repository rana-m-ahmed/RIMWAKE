"""Reproducible Horizons ingestion. Network use is confined to release preparation."""
import csv
import hashlib
import io
import json
import math
import re
from datetime import datetime, timezone
from pathlib import Path
import requests

ROOT = Path(__file__).resolve().parents[1]
RELEASE = 'rimwake-p0-20261114-v1'
MODEL = 'tangent_plane_center_airless'
SITES = [
    dict(id='im1', name='Odysseus · IM-1', latitude_deg=-80.13, longitude_deg_east=1.44),
    dict(id='im2', name='Athena · IM-2', latitude_deg=-84.7906, longitude_deg_east=29.1957),
]
CATALOG = 'https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_artifact_impacts.html'

def now():
    return datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z')

def sha(data):
    return hashlib.sha256(data).hexdigest()

def state(elevation, epsilon=0.000001):
    if elevation is None or not math.isfinite(elevation):
        return 'unknown'
    return 'visible' if elevation > epsilon else 'blocked' if elevation < -epsilon else 'boundary'

def combined(a, b):
    if 'blocked' in (a, b): return 'blocked'
    if 'unknown' in (a, b): return 'unknown'
    if 'boundary' in (a, b): return 'boundary'
    return 'visible'

def query(site, body, start, stop, step='60 m'):
    return {k: f"'{v}'" for k, v in dict(COMMAND=str(body), OBJ_DATA='YES', MAKE_EPHEM='YES', EPHEM_TYPE='OBSERVER', CENTER='coord@301', COORD_TYPE='GEODETIC', SITE_COORD=f"{site['longitude_deg_east']},{site['latitude_deg']},0", START_TIME=start, STOP_TIME=stop, STEP_SIZE=step, QUANTITIES='4', APPARENT='AIRLESS', TIME_TYPE='UT', CSV_FORMAT='YES', ANG_FORMAT='DEG', EXTRA_PREC='YES', ELEV_CUT='-90').items()} | {'format': 'json'}

def parse(text, site, body):
    if '$$SOE' not in text or '$$EOE' not in text:
        raise ValueError('Missing ephemeris delimiters: ' + text[:300])
    header = text.split('$$SOE')[0]
    target = 'Sun' if body == 10 else 'Earth'
    if not re.search(rf'Target body name:\s*{target}\s*\({body}\)', header):
        raise ValueError('Target identity mismatch')
    if not re.search(r'Center body name:\s*Moon\s*\(301\)', header):
        raise ValueError('Observer center mismatch')
    if 'Center pole/equ : MEAN_ME (high precision)' not in header or 'Atmos refraction: NO (AIRLESS)' not in header or '{E-lon(deg),Lat(deg),Alt(km)}' not in header:
        raise ValueError('Unexpected observer frame, units or refraction')
    coord = re.search(r'Center geodetic\s*:\s*([-\d.]+),\s*([-\d.]+),\s*([-\d.]+)', header)
    if not coord or any(abs(float(v)-expected) > 0.00001 for v, expected in zip(coord.groups(), [site['longitude_deg_east'], site['latitude_deg'], 0])):
        raise ValueError('Observer coordinate mismatch')
    if 'Date__(UT)__HR:MN' not in header or 'Azi' not in header or 'Elev' not in header:
        raise ValueError('Unexpected time/angle columns')
    rows = []
    for row in csv.reader(io.StringIO(text.split('$$SOE')[1].split('$$EOE')[0].strip())):
        if not row: continue
        stamp = datetime.strptime(row[0].strip(), '%Y-%b-%d %H:%M').replace(tzinfo=timezone.utc).isoformat().replace('+00:00', 'Z')
        az, el = float(row[3]), float(row[4])
        if not math.isfinite(az) or not math.isfinite(el) or not 0 <= az < 360 or not -90 <= el <= 90:
            raise ValueError('Invalid angle')
        if rows and stamp <= rows[-1]['timestamp_utc']: raise ValueError('Unordered UTC')
        rows.append(dict(timestamp_utc=stamp, azimuth_deg=az, elevation_deg=el, quality_state='available'))
    if not rows: raise ValueError('Empty ephemeris')
    return rows

def fetch(site, body, start, stop, step, suffix):
    params = query(site, body, start, stop, step)
    response = requests.get('https://ssd.jpl.nasa.gov/api/horizons.api', params=params, timeout=90)
    response.raise_for_status()
    payload = response.json()
    if payload.get('error'): raise ValueError(payload['error'])
    text = payload['result']
    rows = parse(text, site, body)
    run_id = f"{site['id']}-{body}-{suffix}"
    raw_path = f'science/raw/{run_id}.json'
    (ROOT/raw_path).write_bytes(response.content)
    run = dict(run_id=run_id, release_id=RELEASE, site_id=site['id'], body_id=body, start_utc=rows[0]['timestamp_utc'], end_utc=rows[-1]['timestamp_utc'], step_seconds=int(step.split()[0])*60, horizons_query_parameters=params, request_url=response.url, raw_path=raw_path, raw_sha256=sha(response.content), retrieved_at_utc=now(), model=MODEL, validation_status='parser_checked', validation_report_id='validation-v1')
    return run, rows

def intervals(samples):
    result = []
    for site in SITES:
        for body in (10, 399):
            rows = [s for s in samples if s['site_id']==site['id'] and s['body_id']==body]
            for a, b in zip(rows, rows[1:]):
                if state(a['elevation_deg']) != state(b['elevation_deg']):
                    result.append(dict(site_id=site['id'], body_id=body, start_utc=a['timestamp_utc'], end_utc=b['timestamp_utc'], before=state(a['elevation_deg']), after=state(b['elevation_deg']), model=MODEL, release_id=RELEASE))
    return result

def sampled_intervals(samples):
    """Contiguous sampled classifications, with inclusive sampled endpoints only."""
    result=[]
    for site in SITES:
        by_body={body:{row['timestamp_utc']:row for row in samples if row['site_id']==site['id'] and row['body_id']==body} for body in (10,399)}
        clock=sorted(by_body[10])
        for body in (10,399,'both'):
            current=None
            for timestamp in clock:
                value=combined(state(by_body[10][timestamp]['elevation_deg']),state(by_body[399][timestamp]['elevation_deg'])) if body=='both' else state(by_body[body][timestamp]['elevation_deg'])
                if current is not None and current['state']==value:
                    current['end_utc']=timestamp
                    current['sample_count']+=1
                else:
                    current=dict(release_id=RELEASE,site_id=site['id'],body_id_or_both=body,start_utc=timestamp,end_utc=timestamp,state=value,sample_count=1,model=MODEL,derivation_version='1.0.0',endpoint_semantics='inclusive sampled endpoints; not continuous visibility bounds')
                    result.append(current)
    return result

def main():
    sources=[]
    for id_, title, url in [('nssdca','Lunar artifact catalog',CATALOG), ('horizons-api','Horizons API documentation','https://ssd-api.jpl.nasa.gov/doc/horizons.html'), ('horizons-manual','Horizons system manual','https://ssd.jpl.nasa.gov/horizons/manual.html')]:
        r=requests.get(url,timeout=60); r.raise_for_status()
        (ROOT/f'science/raw/{id_}.html').write_bytes(r.content)
        sources.append(dict(id=id_, title=title, publisher='NASA / JPL' if id_!='nssdca' else 'NASA NSSDCA', url=url, retrieved_at_utc=now(), sha256=sha(r.content), raw_path=f'science/raw/{id_}.html', rights_review='Scientific numerical data and cited factual coordinates; no NASA logo or third-party imagery reused.', challenge_resource_eligible='unknown'))
    samples=[]; runs=[]
    for site in SITES:
        for body in (10,399):
            run, rows=fetch(site,body,'2026-11-14','2026-12-19','60 m','coarse')
            runs.append(run)
            samples.extend(dict(**s,release_id=RELEASE,site_id=site['id'],body_id=body,run_id=run['run_id']) for s in rows)
    timestamps=sorted({s['timestamp_utc'] for s in samples})
    crossings=intervals(samples)
    refined=[]
    # Refine the first discovered crossing, disclosed as an illustrative selection.
    if crossings:
        event=crossings[0]
        start=event['start_utc'][:16].replace('T',' '); stop=event['end_utc'][:16].replace('T',' ')
        for site in SITES:
            for body in (10,399):
                run, rows=fetch(site,body,start,stop,'10 m','refined')
                runs.append(run)
                refined.extend(dict(**s,release_id=RELEASE,site_id=site['id'],body_id=body,run_id=run['run_id']) for s in rows)
    # Separately request an existing sample to test request/parse consistency.
    checks=[]
    for site in SITES:
        run, rows=fetch(site,10,'2026-11-14','2026-11-14 01:00','60 m','check')
        runs.append(run)
        existing=next(s for s in samples if s['site_id']==site['id'] and s['body_id']==10)
        checks.append(dict(site_id=site['id'], kind='separate Horizons request; not independent ephemeris', max_angle_difference_deg=max(abs(existing[k]-rows[0][k]) for k in ('azimuth_deg','elevation_deg')), run_id=run['run_id']))
    sites=[dict(**s, location_type='reported_landing_position', horizontal_frame='Approximate published DE421 mean-Earth/polar coordinates used as Horizons geodetic input; frame equivalence is not independently validated.', source_ids=['nssdca'], observer_model=dict(height_km=0, height_reference='Horizons lunar reference ellipsoid', is_hypothetical=True)) for s in SITES]
    release=dict(release_id=RELEASE,schema_version='1.0.0',generated_at_utc=now(),model=MODEL,epsilon_deg=0.000001,sites=sites,sources=sources,runs=runs,timestamps=timestamps,samples=samples,refined_samples=refined,crossings=crossings,refined_crossings=intervals(refined),validation=dict(id='validation-v1', status='provisional', reference_checks=checks, independent_ephemeris_check='NOT_RUN',limitations=['Lunar terrain excluded','Hypothetical reference-ellipsoid observer, not lander height','Centre-of-disc only; not power or RF performance','Hourly samples and ten-minute illustrative refinement; no interpolation','Published horizontal frame versus Horizons lunar frame not independently reconciled','Numerical epsilon 1e-6 degrees is a classification tolerance, not an accuracy estimate']))
    (ROOT/'public/data/release.json').write_text(json.dumps(release,separators=(',',':')),encoding='utf8')
    print(f"Released {len(samples)} coarse + {len(refined)} refined samples; {len(crossings)} coarse crossings")

if __name__=='__main__': main()
