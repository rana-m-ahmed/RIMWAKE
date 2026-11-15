import json
from pathlib import Path
from scripts.check_atlas_archive import main
from science.pipeline import parse

def test_complete_atlas_equals_raw_source():
    main()

def test_scientific_notation_observer_height_roundoff_is_parsed():
    root=Path(__file__).resolve().parents[2]
    index=json.loads((root/'public/data/atlas/index.json').read_text())
    site=next(s for s in index['sites'] if s['id']=='ap11')
    raw=json.loads((root/'science/raw/atlas-v1/ap11-10.json').read_text())['result']
    assert 'E-13' in raw.split('$$SOE')[0]
    assert len(parse(raw,site,10))==2161
