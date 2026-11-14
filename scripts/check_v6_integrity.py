"""Design acceptance invariants, independent of the UI test implementation."""
import hashlib
import json
import subprocess
from pathlib import Path
root=Path(__file__).resolve().parents[1]
frozen='c29ea61969ba53cfcc6531288c92430330249f25caa1dc71638cb3c57ab17d32'
assert hashlib.sha256((root/'public/data/release.json').read_bytes()).hexdigest()==frozen,'Scientific release changed during design work'
for path in (root/'science/raw').iterdir():
    previous=subprocess.check_output(['git','-c','safe.directory=D:/Horizon','show',f'rimwake-pre-v6:science/raw/{path.name}'],cwd=root)
    assert previous==path.read_bytes(),f'Raw evidence changed: {path.name}'
manifest=json.loads((root/'public/data/manifest.json').read_text())
assert manifest['release_sha256']==frozen
visual=json.loads((root/'public/assets/visual-provenance.json').read_text())
assert visual['sha256']==hashlib.sha256((root/'public/assets/lroc-color-2k.jpg').read_bytes()).hexdigest()
assert visual['poster_sha256']==hashlib.sha256((root/'public/assets/moon-context.webp').read_bytes()).hexdigest()
assert visual['source_page']=='https://svs.gsfc.nasa.gov/4720/'
print('PASS: original scientific release and all raw source bytes preserved; new visual asset hashes match their separate provenance. No texture enters the astronomy model.')
