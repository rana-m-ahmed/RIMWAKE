"""Losslessly repack NASA mesh buffers and resize its visual-only color image."""
import hashlib,io,json,struct
from datetime import datetime,timezone
from pathlib import Path
from PIL import Image
root=Path(__file__).resolve().parents[1]
source=(root/'deliverables/source-assets/moon-source.glb').read_bytes()
size=struct.unpack_from('<I',source,12)[0]
document=json.loads(source[20:20+size]);start=20+size
binary=source[start+8:]
image_view=document['images'][0]['bufferView']
packed=bytearray()
for index,view in enumerate(document['bufferViews']):
    data=binary[view.get('byteOffset',0):view.get('byteOffset',0)+view['byteLength']]
    if index==image_view:
        image=Image.open(io.BytesIO(data)).convert('RGB');image.thumbnail((2048,1024))
        output=io.BytesIO();image.save(output,'WEBP',quality=88,method=6);data=output.getvalue()
    while len(packed)%4:packed.append(0)
    view['byteOffset']=len(packed);view['byteLength']=len(data);packed.extend(data)
while len(packed)%4:packed.append(0)
document['buffers'][0]['byteLength']=len(packed)
document['images'][0]['mimeType']='image/webp'
for texture in document['textures']:
    image=texture.pop('source',0);texture.setdefault('extensions',{})['EXT_texture_webp']={'source':image}
document.setdefault('extensionsUsed',[]).append('EXT_texture_webp')
document.setdefault('extensionsRequired',[]).append('EXT_texture_webp')
encoded=json.dumps(document,separators=(',',':')).encode()
while len(encoded)%4:encoded+=b' '
output=struct.pack('<III',0x46546c67,2,12+8+len(encoded)+8+len(packed))+struct.pack('<II',len(encoded),0x4e4f534a)+encoded+struct.pack('<II',len(packed),0x004e4942)+packed
target=root/'public/assets/moon-cinema.glb';target.write_bytes(output)
record={'source_url':'https://svs.gsfc.nasa.gov/vis/a010000/a014900/a014959/moon_small.glb','source_page':'https://svs.gsfc.nasa.gov/14959/','credit':"NASA's Goddard Space Flight Center; production Dan Gallagher; data Ernie Wright / LRO",'retrieved_at_utc':datetime.now(timezone.utc).isoformat(),'source_sha256':hashlib.sha256(source).hexdigest(),'source_bytes':len(source),'output_sha256':hashlib.sha256(output).hexdigest(),'output_bytes':len(output),'transformation':'Mesh buffers preserved; color image resized to 2048x1024 and encoded WebP quality 88. No terrain inference. Original source retained outside shipped public assets.','scientific_role':'visual context only; no topography or time-dependent illumination'}
(root/'public/assets/cinema-provenance.json').write_text(json.dumps(record,indent=2),encoding='utf8')
print(json.dumps(record,indent=2))
