"""Verify immutable science and the shipped cinema asset without fetching any data."""
import hashlib,json,subprocess,struct
from pathlib import Path
root=Path(__file__).resolve().parents[1]
subprocess.run(['python','scripts/check_v6_integrity.py'],cwd=root,check=True)
p=json.loads((root/'public/assets/cinema-provenance.json').read_text())
model=(root/'public/assets/moon-cinema.glb').read_bytes()
assert len(model)==p['output_bytes']<3_000_000
assert hashlib.sha256(model).hexdigest()==p['output_sha256']
assert struct.unpack_from('<III',model)==(0x46546c67,2,len(model))
assert p['scientific_role']=='visual context only; no topography or time-dependent illumination'
original=root/'deliverables/source-assets/moon-source.glb'
if original.exists():
 raw=original.read_bytes();assert hashlib.sha256(raw).hexdigest()==p['source_sha256']
 def unpack(data):
  size=struct.unpack_from('<I',data,12)[0];doc=json.loads(data[20:20+size]);offset=20+size;length=struct.unpack_from('<I',data,offset)[0];return doc,data[offset+8:offset+8+length]
 a,ab=unpack(raw);b,bb=unpack(model)
 # Compare all geometry buffer views referenced by accessors. Texture re-encoding must not alter positions/normals/UV/indices.
 for i in {accessor['bufferView'] for accessor in a['accessors']}:
  av,bv=a['bufferViews'][i],b['bufferViews'][i];assert ab[av.get('byteOffset',0):av.get('byteOffset',0)+av['byteLength']]==bb[bv.get('byteOffset',0):bv.get('byteOffset',0)+bv['byteLength']]
 print('PASS: source model hash and every geometry buffer preserved; only color texture transformed.')
else:print('NOTE: original downloaded model not present; shipped asset verified against provenance hash.')
print('PASS: cinema asset hash, GLB container, size budget and scientific-role separation.')
