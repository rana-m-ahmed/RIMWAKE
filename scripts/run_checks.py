"""Run a finite, auditable QA group and retain true native-process exit codes."""
import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
root=Path(__file__).resolve().parents[1]
group=sys.argv[1] if len(sys.argv)>1 else 'final'
folder=root/f'docs/qa/v6/{group}'
folder.mkdir(parents=True,exist_ok=True)
commands=[('typecheck',['npm.cmd','run','typecheck']),('unit',['npm.cmd','run','test']),('science',[sys.executable,'-m','pytest','science/tests','-q']),('build',['npm.cmd','run','build']),('browser',['npx.cmd','playwright','test'])]
results=[]
for name,command in commands:
    process=subprocess.run(command,cwd=root,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
    (folder/f'{name}.log').write_bytes(process.stdout)
    result=dict(name=name,command=' '.join(command),exit_code=process.returncode,status='PASS' if process.returncode==0 else 'FAIL')
    results.append(result)
    print(json.dumps(result),flush=True)
(folder/'results.json').write_text(json.dumps(dict(executed_at_utc=datetime.now(timezone.utc).isoformat(),results=results),indent=2),encoding='utf8')
sys.exit(any(r['exit_code'] for r in results))
