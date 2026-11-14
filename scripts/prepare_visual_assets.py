"""Render illustrative visual context from NASA's aesthetics-only color map.

This renderer never feeds scientific observations or terrain calculations.
"""
import hashlib
import io
import json
from datetime import datetime, timezone
from pathlib import Path
import numpy as np
import requests
from PIL import Image

root=Path(__file__).resolve().parents[1]
assets=root/'public/assets'
assets.mkdir(exist_ok=True)
url='https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/lroc_color_2k.jpg'
response=requests.get(url,timeout=60)
response.raise_for_status()
(assets/'lroc-color-2k.jpg').write_bytes(response.content)
texture=np.array(Image.open(io.BytesIO(response.content)).convert('RGB'))
size=1100
y,x=np.mgrid[0:size,0:size].astype(float)
x=(x-(size-1)/2)/(size*.495)
y=((size-1)/2-y)/(size*.495)
r2=x*x+y*y
z=np.sqrt(np.maximum(0,1-r2))
longitude=np.arctan2(x,z)
latitude=np.arcsin(np.clip(y,-1,1))
tx=((longitude/(2*np.pi)+.5)*texture.shape[1]).astype(int)%texture.shape[1]
ty=np.clip(((.5-latitude/np.pi)*texture.shape[0]).astype(int),0,texture.shape[0]-1)
light=np.array([-.65,.25,.72]);light=light/np.linalg.norm(light)
intensity=.055+.945*np.maximum(0,x*light[0]+y*light[1]+z*light[2])**.62
rgb=np.clip(texture[ty,tx]*intensity[:,:,None]*1.17,0,255).astype('uint8')
alpha=np.clip((1-np.sqrt(r2))*size*.495,0,1)*255
rgba=np.dstack([rgb,alpha.astype('uint8')])
Image.fromarray(rgba).save(assets/'moon-context.webp','WEBP',quality=90,method=6)
record=dict(source_url=url,source_page='https://svs.gsfc.nasa.gov/4720/',title='NASA SVS CGI Moon Kit: LROC color map',credit='NASA’s Scientific Visualization Studio / Ernie Wright; LRO / LROC / LOLA',retrieved_at_utc=datetime.now(timezone.utc).isoformat(),sha256=hashlib.sha256(response.content).hexdigest(),bytes=len(response.content),rights_review='Educational visual context under NASA media usage guidelines; source page credits retained, no logos or identifiable people. Source is optimized for aesthetics, not science.',transform='Color texture projected onto an ideal sphere, synthetic lighting and WebP compression; no DEM, no date-dependent illumination or ephemeris data.',poster_sha256=hashlib.sha256((assets/'moon-context.webp').read_bytes()).hexdigest())
(assets/'visual-provenance.json').write_text(json.dumps(record,indent=2),encoding='utf8')
print('Prepared source-attributed visual context:',(assets/'moon-context.webp').stat().st_size,'bytes')
