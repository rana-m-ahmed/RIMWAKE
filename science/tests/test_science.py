import copy
import json
import math
import sys
from pathlib import Path
import pytest
sys.path.insert(0,str(Path(__file__).resolve().parents[2]))
from science.pipeline import ROOT, SITES, parse, state, combined, sampled_intervals
from scripts.check_release import validate

@pytest.fixture(scope='module')
def release(): return json.loads((ROOT/'public/data/release.json').read_text())

def test_real_release(release): assert validate(release)

@pytest.mark.parametrize('el,expected',[(None,'unknown'),(math.nan,'unknown'),(-10,'blocked'),(10,'visible'),(0,'boundary'),(0.0000005,'boundary')])
def test_states(el,expected): assert state(el)==expected

@pytest.mark.parametrize('a,b',[(a,b) for a in ['visible','blocked','boundary','unknown'] for b in ['visible','blocked','boundary','unknown']])
def test_combined(a,b):
    expected='blocked' if 'blocked' in (a,b) else 'unknown' if 'unknown' in (a,b) else 'boundary' if 'boundary' in (a,b) else 'visible'
    assert combined(a,b)==expected

@pytest.mark.parametrize('fault',['site','release','source','null','nan','azimuth','order','clock','run','angle','crossing'])
def test_faults_fail_closed(release,fault):
    r=copy.deepcopy(release)
    if fault=='site':r['samples'][0]['site_id']='im2'
    elif fault=='release':r['samples'][0]['release_id']='other'
    elif fault=='source':r['sources']=[]
    elif fault=='null':r['samples'][0]['elevation_deg']=None
    elif fault=='nan':r['samples'][0]['elevation_deg']=math.nan
    elif fault=='azimuth':r['samples'][0]['azimuth_deg']=360
    elif fault=='order':r['samples'][0],r['samples'][1]=r['samples'][1],r['samples'][0]
    elif fault=='clock':r['timestamps'][1]=r['timestamps'][0]
    elif fault=='run':r['runs'][0]['horizons_query_parameters']['CENTER']="'coord@399'"
    elif fault=='angle':r['samples'][0]['elevation_deg']+=0.01
    elif fault=='crossing':r['crossings'][0]['end_utc']=r['crossings'][0]['start_utc']
    with pytest.raises((AssertionError,KeyError,ValueError)):validate(r)

def test_parser_identity_and_delimiters():
    raw=json.loads((ROOT/'science/raw/im1-10-coarse.json').read_text())['result']
    rows=parse(raw,SITES[0],10)
    assert len(rows)==841
    assert any(r['elevation_deg']<0 for r in rows)
    for bad,site,body in [(raw.replace('$$SOE',''),SITES[0],10),(raw,SITES[1],10),(raw,SITES[0],399)]:
        with pytest.raises(ValueError):parse(bad,site,body)

def test_raw_hash_tamper(release,monkeypatch):
    original=Path.read_bytes
    def tampered(path):
        value=original(path)
        return value+b' ' if path.name=='im1-10-coarse.json' else value
    monkeypatch.setattr(Path,'read_bytes',tampered)
    with pytest.raises(AssertionError):validate(release)

def test_intervals_cover_sampled_states(release):
    rows=release['refined_samples']
    output=sampled_intervals(rows)
    for site in SITES:
        for body in (10,399,'both'):
            entries=[i for i in output if i['site_id']==site['id'] and i['body_id_or_both']==body]
            assert sum(i['sample_count'] for i in entries)==7
            for interval in entries:
                for timestamp in sorted({r['timestamp_utc'] for r in rows if interval['start_utc']<=r['timestamp_utc']<=interval['end_utc']}):
                    lookup={r['body_id']:r['elevation_deg'] for r in rows if r['site_id']==site['id'] and r['timestamp_utc']==timestamp}
                    expected=combined(state(lookup[10]),state(lookup[399])) if body=='both' else state(lookup[body])
                    assert interval['state']==expected
