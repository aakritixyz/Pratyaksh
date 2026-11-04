"""Reproducible Day 1 D1 environment and model feasibility probe."""
from __future__ import annotations

import argparse
import json
import platform
import shutil
import subprocess
import time
from datetime import datetime, timezone
from pathlib import Path

import torch
from PIL import Image

from day1_probe_detector import Day1ImageProbe, MODEL_ID, REVISION, verify_model


def first_version_line(command: str) -> str | None:
    path = shutil.which(command)
    if not path:
        return None
    completed = subprocess.run(
        [path, "-version"], capture_output=True, text=True, check=False, timeout=10
    )
    return completed.stdout.splitlines()[0] if completed.stdout else None


def collect(run_smoke: bool = False) -> dict:
    result = {
        "schema_version": "1.0",
        "checked_at": datetime.now(timezone.utc).isoformat(),
        "platform": {
            "system": platform.system(),
            "release": platform.release(),
            "machine": platform.machine(),
            "python": platform.python_version(),
            "torch": torch.__version__,
            "mps_built": torch.backends.mps.is_built(),
            "mps_available": torch.backends.mps.is_available(),
        },
        "media_tools": {
            "ffmpeg": first_version_line("ffmpeg"),
            "ffprobe": first_version_line("ffprobe"),
        },
        "image_model": {
            "model_id": MODEL_ID,
            "revision": REVISION,
            "manifest_verified": False,
            "execution_smoke_test": None,
            "selection_state": "probe_only_not_final_detector",
        },
    }
    try:
        manifest = verify_model()
        result["image_model"]["manifest_verified"] = True
        result["image_model"]["weights_sha256"] = manifest["sha256"]["model.safetensors"]
    except Exception as exc:
        result["image_model"]["verification_error"] = type(exc).__name__

    if run_smoke and result["image_model"]["manifest_verified"]:
        started = time.perf_counter()
        output = Day1ImageProbe().predict(Image.new("RGB", (256, 256), "#808080"))
        result["image_model"]["execution_smoke_test"] = {
            "passed": True,
            "runtime_ms": round((time.perf_counter() - started) * 1000),
            "device": output["device"],
            "purpose": "Execution only; generated solid colour has no authenticity label",
        }
    return result


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--smoke", action="store_true", help="Run one real image-model execution")
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    result = collect(args.smoke)
    text = json.dumps(result, indent=2) + "\n"
    if args.output:
        args.output.write_text(text, encoding="utf-8")
    print(text, end="")


if __name__ == "__main__":
    main()
