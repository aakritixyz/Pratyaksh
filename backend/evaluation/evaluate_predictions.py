"""Validate a held-out manifest and score saved D1 image predictions.

This intentionally evaluates saved outputs rather than running inference. It keeps
model execution, threshold selection, and final test-set measurement as separate,
auditable steps.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from collections import Counter, defaultdict
from pathlib import Path

LABELS = {"genuine", "synthetic"}
SPLITS = {"development", "test"}


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def validate_manifest(manifest: dict) -> list[dict]:
    if manifest.get("schema_version") != "1.0":
        raise ValueError("manifest schema_version must be 1.0")
    samples = manifest.get("samples")
    if not isinstance(samples, list) or not samples:
        raise ValueError("manifest must contain a non-empty samples list")

    ids: set[str] = set()
    groups: dict[str, set[str]] = defaultdict(set)
    for sample in samples:
        required = {"sample_id", "path", "sha256", "label", "split", "group_id", "source", "terms"}
        missing = required - sample.keys()
        if missing:
            raise ValueError(f"sample is missing fields: {sorted(missing)}")
        sample_id = sample["sample_id"]
        if sample_id in ids:
            raise ValueError(f"duplicate sample_id: {sample_id}")
        ids.add(sample_id)
        if sample["label"] not in LABELS:
            raise ValueError(f"unsupported label for {sample_id}: {sample['label']}")
        if sample["split"] not in SPLITS:
            raise ValueError(f"unsupported split for {sample_id}: {sample['split']}")
        if len(sample["sha256"]) != 64:
            raise ValueError(f"sha256 must contain 64 hexadecimal characters for {sample_id}")
        try:
            int(sample["sha256"], 16)
        except ValueError as exc:
            raise ValueError(f"invalid sha256 for {sample_id}") from exc
        groups[sample["group_id"]].add(sample["split"])

    leaked = sorted(group for group, splits in groups.items() if len(splits) > 1)
    if leaked:
        raise ValueError(f"group leakage across development and test splits: {leaked}")
    return samples


def verify_files(samples: list[dict], base_dir: Path) -> None:
    for sample in samples:
        path = (base_dir / sample["path"]).resolve()
        if not path.is_file():
            raise ValueError(f"sample file is missing: {sample['sample_id']}")
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        if digest != sample["sha256"]:
            raise ValueError(f"sample hash mismatch: {sample['sample_id']}")


def score_predictions(samples: list[dict], predictions: list[dict], threshold: float, split: str) -> dict:
    if not 0 <= threshold <= 1:
        raise ValueError("threshold must be between 0 and 1")
    truth = {s["sample_id"]: s for s in samples if s["split"] == split}
    by_id: dict[str, dict] = {}
    for prediction in predictions:
        sample_id = prediction.get("sample_id")
        if sample_id in by_id:
            raise ValueError(f"duplicate prediction: {sample_id}")
        by_id[sample_id] = prediction

    counts = Counter(tp=0, tn=0, fp=0, fn=0)
    unavailable: list[dict] = []
    for sample_id, sample in truth.items():
        prediction = by_id.get(sample_id)
        if not prediction or prediction.get("execution_status") != "completed":
            unavailable.append({
                "sample_id": sample_id,
                "status": prediction.get("execution_status", "missing") if prediction else "missing",
                "error": prediction.get("error") if prediction else "No prediction record",
            })
            continue
        score = prediction.get("deepfake_score")
        if not isinstance(score, (int, float)) or isinstance(score, bool) or not 0 <= score <= 1:
            raise ValueError(f"invalid deepfake_score for {sample_id}")
        predicted = "synthetic" if score >= threshold else "genuine"
        actual = sample["label"]
        counts[{("synthetic", "synthetic"): "tp", ("genuine", "genuine"): "tn",
                ("synthetic", "genuine"): "fp", ("genuine", "synthetic"): "fn"}[(predicted, actual)]] += 1

    examined = sum(counts.values())
    total = len(truth)

    def divide(a: int, b: int):
        return round(a / b, 6) if b else None

    precision = divide(counts["tp"], counts["tp"] + counts["fp"])
    recall = divide(counts["tp"], counts["tp"] + counts["fn"])
    specificity = divide(counts["tn"], counts["tn"] + counts["fp"])
    f1 = None if precision is None or recall is None or precision + recall == 0 else round(2 * precision * recall / (precision + recall), 6)
    balanced = None if recall is None or specificity is None else round((recall + specificity) / 2, 6)
    class_counts = Counter(s["label"] for s in truth.values())
    return {
        "schema_version": "1.0",
        "split": split,
        "threshold": threshold,
        "sample_count": total,
        "examined_count": examined,
        "coverage": divide(examined, total),
        "class_counts": dict(sorted(class_counts.items())),
        "confusion_matrix": dict(counts),
        "metrics": {
            "accuracy": divide(counts["tp"] + counts["tn"], examined),
            "precision_synthetic": precision,
            "recall_synthetic": recall,
            "specificity_genuine": specificity,
            "f1_synthetic": f1,
            "balanced_accuracy": balanced,
        },
        "unavailable": unavailable,
        "notes": [
            "Metrics exclude unavailable or failed samples; coverage reports their effect separately.",
            "Select the threshold on development data before measuring the held-out test split.",
        ],
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--manifest", type=Path, required=True)
    parser.add_argument("--predictions", type=Path, required=True)
    parser.add_argument("--threshold", type=float, required=True)
    parser.add_argument("--split", choices=sorted(SPLITS), default="test")
    parser.add_argument("--verify-files", action="store_true")
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    manifest = load_json(args.manifest)
    samples = validate_manifest(manifest)
    if args.verify_files:
        verify_files(samples, args.manifest.parent)
    predictions = load_json(args.predictions)
    if not isinstance(predictions, list):
        raise ValueError("predictions must be a JSON list")
    result = score_predictions(samples, predictions, args.threshold, args.split)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
