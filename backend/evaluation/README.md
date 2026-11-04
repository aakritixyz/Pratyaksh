# D1 image evaluation

This folder separates three stages that must not be conflated:

1. Select an operating threshold using only the `development` split.
2. Freeze the model revision, preprocessing version, and threshold.
3. Measure the frozen configuration once on the held-out `test` split.

Copy `manifest.example.json` to a local manifest and replace every placeholder.
Do not add restricted media to Git. Every sample needs a stable ID, SHA-256 hash,
ground-truth label, source group, terms, and split. Variants from the same source
must share a `group_id`; the evaluator rejects groups spanning development and
test because that would leak related media into the held-out measurement.

Save predictions as a JSON list:

```json
[
  {
    "sample_id": "IMG-TEST-001",
    "execution_status": "completed",
    "deepfake_score": 0.83
  },
  {
    "sample_id": "IMG-TEST-002",
    "execution_status": "failed",
    "error": "Decoder rejected the file"
  }
]
```

Then produce metrics with the already-frozen threshold:

```bash
python -m evaluation.evaluate_predictions \
  --manifest evaluation/manifest.local.json \
  --predictions evaluation/predictions-test.json \
  --threshold 0.72 \
  --split test \
  --verify-files \
  --output evaluation/results/image-v1-test.json
```

The output reports failures and coverage separately from classification metrics.
Never choose a threshold after looking at the held-out test labels.
