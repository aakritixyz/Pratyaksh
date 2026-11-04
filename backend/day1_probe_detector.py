"""Frozen Day 1 execution probe retained for reproducibility; not the active detector."""
import hashlib
import json
from pathlib import Path
from threading import Lock


MODEL_ID = 'prithivMLmods/Deep-Fake-Detector-v2-Model'
REVISION = '3a99ae26f52c7ac7c3a53103b6cf3a8b617f7093'
MODEL_DIR = Path(__file__).parent / 'models' / 'image-v1'
FILES = ('config.json', 'preprocessor_config.json', 'model.safetensors')
WEIGHTS_SHA256 = '88ac0939285009e3700cfc9b9a0912b14b092d200ef0df86efe4f2cf190ea4de'


def verify_model():
    manifest = json.loads((MODEL_DIR / 'manifest.json').read_text())
    if manifest['model_id'] != MODEL_ID or manifest['revision'] != REVISION:
        raise ValueError('Unexpected Day 1 model manifest')
    for name in FILES:
        path = MODEL_DIR / name
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        if manifest['sha256'].get(name) != digest:
            raise ValueError('Day 1 model checksum mismatch: ' + name)
    if manifest['sha256']['model.safetensors'] != WEIGHTS_SHA256:
        raise ValueError('Day 1 weights differ from verified checkpoint')
    return manifest


class Day1ImageProbe:
    def __init__(self):
        self.lock = Lock()
        self.model = None
        self.processor = None
        self.manifest = None

    def predict(self, image):
        import torch
        with self.lock:
            if self.model is None:
                from transformers import AutoImageProcessor, AutoModelForImageClassification
                self.manifest = verify_model()
                self.processor = AutoImageProcessor.from_pretrained(
                    MODEL_DIR, local_files_only=True, use_fast=False
                )
                self.model = AutoModelForImageClassification.from_pretrained(
                    MODEL_DIR, local_files_only=True, use_safetensors=True
                ).to('cpu').eval()
            inputs = self.processor(images=image, return_tensors='pt')
            with torch.inference_mode():
                values = torch.softmax(self.model(**inputs).logits, dim=-1)[0].tolist()
            return {'deepfake_score': values[1], 'device': 'cpu'}
