"""Explicit deterministic packaging; normal integrity checks never rewrite artifacts."""
import sys,json,zipfile
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from scripts.check_release import validate
from science.pipeline import ROOT
release_path=ROOT/'public/data/release.json'
validate(json.loads(release_path.read_text(encoding='utf8')))
files=[(p,str(p.relative_to(ROOT)).replace('\\','/')) for p in sorted((ROOT/'science/raw').iterdir())]+[(release_path,'release.json'),(ROOT/'public/data/intervals.json','intervals.json'),(ROOT/'public/data/manifest.json','manifest.json'),(ROOT/'science/pipeline.py','science/pipeline.py'),(ROOT/'scripts/check_release.py','scripts/check_release.py')]
(ROOT/'deliverables').mkdir(exist_ok=True)
with zipfile.ZipFile(ROOT/'deliverables/evidence-regenerated.zip','w',zipfile.ZIP_DEFLATED,compresslevel=9) as archive:
 for path,name in files:
  info=zipfile.ZipInfo(name,date_time=(2000,1,1,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o644<<16;archive.writestr(info,path.read_bytes())
print('Packaged deterministic evidence archive. Scientific source bytes unchanged.')
