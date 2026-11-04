"""One-time explicit model download; creates a version/checksum manifest."""
import hashlib
import json
import shutil
from datetime import datetime, timezone
from huggingface_hub import hf_hub_download
from day1_probe_detector import MODEL_ID, REVISION, MODEL_DIR, FILES

if __name__ == '__main__':
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    checksums = {}
    for name in (*FILES, 'README.md'):
        cached = hf_hub_download(repo_id=MODEL_ID, filename=name, revision=REVISION)
        target = MODEL_DIR / name
        shutil.copyfile(cached, target)
        checksums[name] = hashlib.sha256(target.read_bytes()).hexdigest()
        print('Downloaded and hashed:', name, flush=True)
    manifest = {'model_id': MODEL_ID, 'revision': REVISION, 'sha256': checksums,
                'downloaded_at': datetime.now(timezone.utc).isoformat(),
                'license_declared_by_publisher': 'Apache-2.0'}
    (MODEL_DIR / 'manifest.json').write_text(json.dumps(manifest, indent=2))
    print('Model ready. Restart the backend if needed.')
