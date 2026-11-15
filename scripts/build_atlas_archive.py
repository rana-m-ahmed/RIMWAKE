"""Explicit, resumable preparation of a NEW archive. Never writes the frozen P0 release."""
import hashlib, json, sys, time
from datetime import datetime, timezone, timedelta
from pathlib import Path
import requests

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT/'science'))
from pipeline import query, parse, MODEL

RELEASE='rimwake-p0-atlas-20261115-v1'
OUT=ROOT/'public/data/atlas'
RAW=ROOT/'science/raw/atlas-v1'
CATALOG='https://nssdc.gsfc.nasa.gov/planetary/lunar/lunar_artifact_impacts.html'
SITES=[
 dict(id='im1',name='Odysseus',mission='IM-1',region='Southern highlands',latitude_deg=-80.13,longitude_deg_east=1.44),
 dict(id='im2',name='Athena',mission='IM-2',region='Mons Mouton',latitude_deg=-84.7906,longitude_deg_east=29.1957),
 dict(id='ch3',name='Vikram',mission='Chandrayaan-3',region='Southern high latitudes',latitude_deg=-69.3741,longitude_deg_east=32.32),
 dict(id='ap11',name='Tranquility Base',mission='Apollo 11',region='Mare Tranquillitatis',latitude_deg=0.67416,longitude_deg_east=23.47314),
 dict(id='ap17',name='Taurus-Littrow',mission='Apollo 17',region='Taurus-Littrow valley',latitude_deg=20.1911,longitude_deg_east=30.7723),
 dict(id='ce4',name='Von Karman',mission="Chang'e 4",region='Lunar far side',latitude_deg=-45.4561,longitude_deg_east=177.5885),
]
def sha(data): return hashlib.sha256(data).hexdigest()
def write(path,value):
 data=json.dumps(value,separators=(',',':'),ensure_ascii=True).encode();path.write_bytes(data);return sha(data)
def now():return datetime.now(timezone.utc).isoformat().replace('+00:00','Z')
def main():
 OUT.mkdir(parents=True,exist_ok=True);RAW.mkdir(parents=True,exist_ok=True)
 catalog=RAW/'nssdca.html'
 if not catalog.exists():
  response=requests.get(CATALOG,timeout=60);response.raise_for_status();catalog.write_bytes(response.content)
 clock=[(datetime(2026,11,14,tzinfo=timezone.utc)+timedelta(hours=i)).isoformat().replace('+00:00','Z') for i in range(2161)]
 entries=[]
 for site in SITES:
  prior=json.loads((OUT/f"{site['id']}.json").read_bytes()) if (OUT/f"{site['id']}.json").exists() else None
  records=[];runs=[]
  for body in [10,399]:
   path=RAW/f"{site['id']}-{body}.json";params=query(site,body,'2026-11-14','2027-02-12')
   if not path.exists():
    print('Fetching',site['id'],body,flush=True)
    for attempt in range(3):
     try:
      response=requests.get('https://ssd.jpl.nasa.gov/api/horizons.api',params=params,timeout=90);response.raise_for_status();payload=response.json()
      if payload.get('error'):raise ValueError(payload['error'])
      if payload.get('signature',{}).get('version')!='1.2':raise ValueError('Unreviewed API signature')
      parse(payload['result'],site,body);path.write_bytes(response.content);break
     except Exception:
      if attempt==2:raise
      time.sleep(2*(attempt+1))
   payload=json.loads(path.read_bytes());assert payload['signature']['version']=='1.2'
   rows=parse(payload['result'],site,body)
   assert [r['timestamp_utc'] for r in rows]==clock,'Incomplete shared UTC grid'
   receipt_path=RAW/f"{site['id']}-{body}.receipt.json"
   if receipt_path.exists():
    receipt=json.loads(receipt_path.read_bytes());assert receipt['raw_sha256']==sha(path.read_bytes()),'Receipt/source mismatch'
   else:
    previous=next((r for r in (prior or {}).get('runs',[]) if r['body_id']==body and r['raw_sha256']==sha(path.read_bytes())),None)
    receipt=dict(raw_sha256=sha(path.read_bytes()),retrieved_at_utc=previous['retrieved_at_utc'] if previous else datetime.fromtimestamp(path.stat().st_mtime,timezone.utc).isoformat(),api_response_signature=payload['signature'])
    write(receipt_path,receipt)
   run_id=f"atlas-{site['id']}-{body}"
   records.extend(dict(**row,body_id=body,site_id=site['id'],run_id=run_id,release_id=RELEASE) for row in rows)
   runs.append(dict(run_id=run_id,body_id=body,site_id=site['id'],raw_path=str(path.relative_to(ROOT)).replace('\\','/'),raw_url='/data/atlas/raw/'+path.name,raw_sha256=sha(path.read_bytes()),request_url=requests.Request('GET','https://ssd.jpl.nasa.gov/api/horizons.api',params=params).prepare().url,query=params,api_version=payload['signature']['version'],retrieved_at_utc=receipt['retrieved_at_utc']))
   (OUT/'raw').mkdir(exist_ok=True);(OUT/'raw'/path.name).write_bytes(path.read_bytes())
  bundle=dict(schema_version='2.0.0',release_id=RELEASE,site_id=site['id'],model=MODEL,epsilon_deg=1e-6,records=records,runs=runs)
  digest=write(OUT/f"{site['id']}.json",bundle)
  entries.append(dict(**site,url=f"/data/atlas/{site['id']}.json",sha256=digest,source_url=CATALOG,observer_height_km=0,observer_is_hypothetical=True))
  print('Archived',site['id'],len(records),'records',flush=True)
 generated=json.loads((OUT/'index.json').read_bytes())['generated_at_utc'] if (OUT/'index.json').exists() else now()
 index=dict(schema_version='2.0.0',release_id=RELEASE,generated_at_utc=generated,model=MODEL,epsilon_deg=1e-6,start_utc=clock[0],end_utc=clock[-1],cadence_seconds=3600,timestamps=clock,sites=entries,source=dict(url=CATALOG,raw_sha256=sha(catalog.read_bytes()),raw_url='/data/atlas/raw/nssdca.html',frame='Published DE421 mean Earth/polar coordinates supplied as Horizons geodetic inputs; exact frame equivalence not independently validated.'),validation=dict(status='provisional',independent_ephemeris_check='NOT_RUN',frame_reconciliation='OPEN',api_documentation_version='1.3',accepted_response_version='1.2',api_review='Live response signature 1.2 accepted after explicit observer, target, frame, airless, column and complete UTC-grid checks. Documentation currently labels version 1.3.'),limitations=['Geometric reference horizon only; terrain excluded.','Hypothetical reference-ellipsoid observers, not lander instruments.','Airless apparent body centres; finite discs, eclipses, usable power and RF performance excluded.','Hourly samples; endpoint spans do not prove continuous availability.','Source/query consistency is not independent astronomical validation.'])
 (OUT/'raw/nssdca.html').write_bytes(catalog.read_bytes())
 digest=write(OUT/'index.json',index);write(OUT/'manifest.json',dict(release_id=RELEASE,index_sha256=digest,schema_version='2.0.0'))
 print('Published separate atlas archive:',RELEASE,'25932 coarse readings',flush=True)
if __name__=='__main__':main()
