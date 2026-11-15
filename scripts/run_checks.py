"""Run a finite, auditable QA group and retain true native-process exit codes."""
import json
import os
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
root=Path(__file__).resolve().parents[1]
group=sys.argv[1] if len(sys.argv)>1 else 'final'
if group=='atlas':os.environ.setdefault('RIMWAKE_BASE_URL','http://127.0.0.1:4175')
folder=root/(f'docs/qa/atlas/final' if group=='atlas' else f'docs/qa/cinema/product-final' if group=='product' else f'docs/qa/cinema/final' if group=='cinema' else f'docs/qa/v6/{group}')
folder.mkdir(parents=True,exist_ok=True)
commands=[('typecheck',['npm.cmd','run','typecheck']),('unit',['npm.cmd','run','test']),('science',[sys.executable,'-m','pytest','science/tests','-q']),('build',['npm.cmd','run','build']),('browser',['npx.cmd','playwright','test'])]
if group in ('cinema','product','atlas'): commands[3:3]=[('release',[sys.executable,'scripts/check_release.py']),('integrity',[sys.executable,'scripts/check_cinema_integrity.py'])]
if group=='atlas':commands.insert(5,('atlas-integrity',[sys.executable,'scripts/check_atlas_archive.py']))
results=[]
for name,command in commands:
    process=subprocess.run(command,cwd=root,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
    (folder/f'{name}.log').write_bytes(process.stdout)
    result=dict(name=name,command=' '.join(command),exit_code=process.returncode,status='PASS' if process.returncode==0 else 'FAIL')
    if name=='browser':result['base_url']=os.environ.get('RIMWAKE_BASE_URL','http://127.0.0.1:5173')
    results.append(result)
    print(json.dumps(result),flush=True)
(folder/'results.json').write_text(json.dumps(dict(executed_at_utc=datetime.now(timezone.utc).isoformat(),results=results),indent=2),encoding='utf8')
sys.exit(any(r['exit_code'] for r in results))
