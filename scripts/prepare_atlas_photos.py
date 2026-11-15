"""Archive primary LROC context images and prepare small display derivatives."""
from pathlib import Path
from datetime import datetime,timezone
from urllib.parse import urljoin
import hashlib,io,json,requests
from PIL import Image,ImageOps
ROOT=Path(__file__).resolve().parents[1]
ORIGINAL=ROOT/'science/raw/atlas-visual';OUT=ROOT/'public/assets/atlas-sites'
ITEMS=[
 ('im1','https://www.lroc.im-ldi.com/images/1360','/ckeditor_assets/pictures/1426/content_Nova_C_no_arrow_1100x1100_crop.png'),
 ('im2','https://www.lroc.im-ldi.com/images/1408','/ckeditor_assets/pictures/1494/content_M1495922531_LRmos.warp.str01_str02.3xdecimated.1300p.png'),
 ('ch3','https://www.lroc.im-ldi.com/images/1314','/ckeditor_assets/pictures/1348/content_M1447750764_LRmos.warp.1100px1100p.clean.png'),
 ('ce4','https://www.lroc.im-ldi.com/images/1090','/ckeditor_assets/pictures/724/content_M1303521387_LRmos.1100p_v2w.png'),
 ('ap11','https://www.lroc.im-ldi.com/featured_sites/apollo-11/site_images/m102000149r','/data/support/featured_sites/Apollo/11/M102000149R_thumb.jpg'),
 ('ap17','https://www.lroc.im-ldi.com/featured_sites/apollo-17/site_images/m101949648r','/data/support/featured_sites/Apollo/17/M101949648R_thumb.jpg'),
]
def sha(data):return hashlib.sha256(data).hexdigest()
def main():
 ORIGINAL.mkdir(parents=True,exist_ok=True);OUT.mkdir(parents=True,exist_ok=True);records=[]
 previous={p['site_id']:p for p in json.loads((OUT/'provenance.json').read_bytes())} if (OUT/'provenance.json').exists() else {}
 for id_,page,image in ITEMS:
  url=urljoin(page,image);path=ORIGINAL/(id_+Path(image).suffix)
  fetched_at=None
  if not path.exists():
   r=requests.get(url,timeout=60);r.raise_for_status();assert len(r.content)<20_000_000;fetched_at=datetime.now(timezone.utc).isoformat();path.write_bytes(r.content)
  raw=path.read_bytes();picture=Image.open(io.BytesIO(raw))
  if picture.mode not in ['RGB','RGBA','L']:picture=ImageOps.autocontrast(picture.convert('L'))
  picture=picture.convert('RGB');picture.thumbnail((1200,1200));target=OUT/(id_+'.webp')
  for quality in [83,75,67,59,51]:
   picture.save(target,'WEBP',quality=quality,method=6)
   if target.stat().st_size<200_000:break
  assert target.stat().st_size<200_000
  prior=previous.get(id_,{});retrieved=prior['retrieved_at_utc'] if prior.get('original_sha256')==sha(raw) else fetched_at
  if not retrieved:raise ValueError(f'{id_}: original retrieval time is unknown; restore matching provenance before rebuilding.')
  records.append(dict(site_id=id_,source_page=page,source_image_url=url,original_path=path.relative_to(ROOT).as_posix(),original_sha256=sha(raw),file='/assets/atlas-sites/'+target.name,sha256=sha(target.read_bytes()),bytes=target.stat().st_size,credit='NASA/GSFC/Arizona State University',retrieved_at_utc=retrieved,transformation=f'Display derivative: RGB conversion, maximum 1200px, WebP quality {quality}. Historical LROC imagery; not selected-date lighting or a terrain calculation.',rights_review='Primary LROC source page retained; credited educational context, no logos, endorsement or proprietary inference.'))
  print(id_,picture.size,target.stat().st_size,flush=True)
 (OUT/'provenance.json').write_text(json.dumps(records,indent=2),encoding='utf-8')
if __name__=='__main__':main()
