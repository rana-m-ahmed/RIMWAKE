"""Fail-closed integrity check for the versioned release and its raw evidence."""
import hashlib
import json
import math
import sys
import zipfile
from datetime import datetime
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from science.pipeline import ROOT, MODEL, parse, intervals, sampled_intervals, state

def validate(r, verify_raw=True):
    assert r['schema_version']=='1.0.0' and r['model']==MODEL
    assert r['release_id'] and r['epsilon_deg']==0.000001
    assert r['validation']['status']=='provisional'
    assert r['validation']['independent_ephemeris_check']=='NOT_RUN'
    sites={site['id']:site for site in r['sites']}
    assert len(sites)==len(r['sites'])>=2
    sources={s['id']:s for s in r['sources']}
    assert len(sources)==len(r['sources'])>=3
    for source in sources.values():
        for key in ['url','publisher','title','retrieved_at_utc','rights_review','sha256']: assert source[key]
        assert source['url'].startswith('https://')
        if verify_raw: assert hashlib.sha256((ROOT/source['raw_path']).read_bytes()).hexdigest()==source['sha256']
    for site in sites.values():
        assert -90<=site['latitude_deg']<=90 and 0<=site['longitude_deg_east']<360
        assert site['source_ids'] and all(s in sources for s in site['source_ids'])
        assert site['location_type']=='reported_landing_position'
        assert site['observer_model']['height_km']==0 and site['observer_model']['is_hypothetical'] is True
    runs={run['run_id']:run for run in r['runs']}
    assert len(runs)==len(r['runs'])
    parsed={}
    for run in runs.values():
        assert run['release_id']==r['release_id'] and run['site_id'] in sites
        assert run['model']==MODEL and run['validation_report_id']==r['validation']['id']
        assert run['body_id'] in (10,399)
        query=run['horizons_query_parameters']
        for key,val in [('CENTER',"'coord@301'"),('APPARENT',"'AIRLESS'"),('TIME_TYPE',"'UT'"),('COORD_TYPE',"'GEODETIC'"),('QUANTITIES',"'4'")]: assert query[key]==val
        assert query['COMMAND']==f"'{run['body_id']}'"
        if verify_raw:
            raw=(ROOT/run['raw_path']).read_bytes()
            assert hashlib.sha256(raw).hexdigest()==run['raw_sha256']
            parsed[run['run_id']]={s['timestamp_utc']:s for s in parse(json.loads(raw)['result'],sites[run['site_id']],run['body_id'])}
            rows=list(parsed[run['run_id']].values())
            assert rows[0]['timestamp_utc']==run['start_utc'] and rows[-1]['timestamp_utc']==run['end_utc']
            for a,b in zip(rows,rows[1:]): assert (datetime.fromisoformat(b['timestamp_utc'])-datetime.fromisoformat(a['timestamp_utc'])).total_seconds()==run['step_seconds']
    assert len(r['timestamps'])==841
    assert r['timestamps'][0]=='2026-11-14T00:00:00Z' and r['timestamps'][-1]=='2026-12-19T00:00:00Z'
    assert all((datetime.fromisoformat(b)-datetime.fromisoformat(a)).total_seconds()==3600 for a,b in zip(r['timestamps'],r['timestamps'][1:]))
    for dataset in ('samples','refined_samples'):
        rows=r[dataset]; seen=set(); previous={}
        for sample in rows:
            assert sample['release_id']==r['release_id']
            run=runs[sample['run_id']]
            assert sample['site_id']==run['site_id'] and sample['body_id']==run['body_id']
            identity=(sample['site_id'],sample['body_id'],sample['timestamp_utc'])
            assert identity not in seen;seen.add(identity)
            key=identity[:2]
            assert key not in previous or previous[key]<sample['timestamp_utc'];previous[key]=sample['timestamp_utc']
            for field,low,high in [('azimuth_deg',0,360),('elevation_deg',-90,90)]:
                value=sample[field]
                if value is None: assert sample['quality_state']=='unknown'
                else:
                    assert math.isfinite(value) and low<=value<=high
                    if field=='azimuth_deg': assert value<360
            if verify_raw:
                original=parsed[sample['run_id']][sample['timestamp_utc']]
                for field in ['azimuth_deg','elevation_deg','quality_state']: assert sample[field]==original[field]
        clock=r['timestamps'] if dataset=='samples' else sorted({s['timestamp_utc'] for s in rows})
        assert len(rows)==len(clock)*len(sites)*2
        for t in clock:
            for site in sites:
                for body in (10,399): assert (site,body,t) in seen
    assert r['crossings']==intervals(r['samples'])
    assert r['refined_crossings']==intervals(r['refined_samples'])
    for crossing in r['crossings']+r['refined_crossings']:
        assert crossing['release_id']==r['release_id'] and crossing['start_utc']<crossing['end_utc']
    return True

def main():
    path=ROOT/'public/data/release.json'
    release=json.loads(path.read_text(encoding='utf8'))
    validate(release)
    interval_path=ROOT/'public/data/intervals.json'
    interval_path.write_text(json.dumps(dict(release_id=release['release_id'],coarse=sampled_intervals(release['samples']),refined=sampled_intervals(release['refined_samples'])),indent=2),encoding='utf8')
    manifest=dict(release_id=release['release_id'],schema_version=release['schema_version'],release_sha256=hashlib.sha256(path.read_bytes()).hexdigest(),intervals_sha256=hashlib.sha256(interval_path.read_bytes()).hexdigest(),validation='integrity_passed_science_provisional')
    (ROOT/'public/data/manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf8')
    with zipfile.ZipFile(ROOT/'public/data/evidence.zip','w',zipfile.ZIP_DEFLATED) as archive:
        for raw in sorted((ROOT/'science/raw').iterdir()): archive.write(raw,raw.relative_to(ROOT))
        archive.write(path,'release.json')
        archive.write(interval_path,'intervals.json')
        archive.write(ROOT/'public/data/manifest.json','manifest.json')
        archive.write(ROOT/'science/pipeline.py','science/pipeline.py')
        archive.write(ROOT/'scripts/check_release.py','scripts/check_release.py')
    print('PASS: source hashes, query identities, raw sample equality, UTC cadence, shared sample matrix and crossing brackets. Science status: provisional; independent ephemeris NOT_RUN.')

if __name__=='__main__':main()
