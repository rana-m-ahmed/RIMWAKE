"""Read-only equality checks for the separate ninety-day archive and its actual JPL responses."""
import hashlib,json,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'science'))
from pipeline import parse
def sha(data):return hashlib.sha256(data).hexdigest()
def main():
 folder=ROOT/'public/data/atlas';manifest=json.loads((folder/'manifest.json').read_bytes());raw=(folder/'index.json').read_bytes();index=json.loads(raw)
 assert sha(raw)==manifest['index_sha256'] and index['release_id']==manifest['release_id']
 assert index['schema_version']=='2.0.0' and index['cadence_seconds']==3600
 assert index['validation']['status']=='provisional' and len(index['sites'])==6
 assert len(index['timestamps'])==2161 and index['timestamps'][0]=='2026-11-14T00:00:00Z' and index['timestamps'][-1]=='2027-02-12T00:00:00Z'
 catalog=(folder/'raw/nssdca.html').read_bytes();assert sha(catalog)==index['source']['raw_sha256']
 count=0
 for site in index['sites']:
  raw=(ROOT/'public'/site['url'].lstrip('/')).read_bytes();assert sha(raw)==site['sha256'];bundle=json.loads(raw)
  assert bundle['release_id']==index['release_id'] and bundle['site_id']==site['id'] and len(bundle['records'])==4322
  assert site['observer_height_km']==0 and site['observer_is_hypothetical'] is True
  for run in bundle['runs']:
   source=(ROOT/run['raw_path']).read_bytes();assert source==(ROOT/'public'/run['raw_url'].lstrip('/')).read_bytes()
   assert sha(source)==run['raw_sha256'];payload=json.loads(source);assert payload['signature']['version']==run['api_version']=='1.2'
   parsed=parse(payload['result'],site,run['body_id']);assert [r['timestamp_utc'] for r in parsed]==index['timestamps']
   released=[r for r in bundle['records'] if r['body_id']==run['body_id']];assert len(released)==len(parsed)
   for row,original in zip(released,parsed):
    assert all(row[key]==value for key,value in original.items()) and row['run_id']==run['run_id'] and row['site_id']==site['id'] and row['release_id']==index['release_id']
   count+=len(parsed)
  print('PASS:',site['id'],'source bytes, observer, targets, UTC, cadence and all 4322 angles')
 assert count==25932
 assert sha((ROOT/'public/data/release.json').read_bytes())=='c29ea61969ba53cfcc6531288c92430330249f25caa1dc71638cb3c57ab17d32'
 for photo in json.loads((ROOT/'public/assets/atlas-sites/provenance.json').read_bytes()):
  assert sha((ROOT/photo['original_path']).read_bytes())==photo['original_sha256']
  data=(ROOT/'public'/photo['file'].lstrip('/')).read_bytes();assert sha(data)==photo['sha256'] and len(data)==photo['bytes']<200_000
 print('PASS: six historical image originals and derivatives equal their provenance hashes.')
 print('PASS: all 25932 new readings equal archived source; original release remains unchanged.')
if __name__=='__main__':main()
