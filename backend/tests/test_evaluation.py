import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from evaluation.evaluate_predictions import score_predictions, validate_manifest


def sample(sample_id, label, split, group_id):
    return {
        "sample_id": sample_id,
        "path": sample_id + ".png",
        "sha256": "0" * 64,
        "label": label,
        "split": split,
        "group_id": group_id,
        "source": "unit test",
        "terms": "unit test",
    }


class EvaluationTests(unittest.TestCase):
    def test_metrics_and_unavailable_are_reported_separately(self):
        samples = [
            sample("a", "synthetic", "test", "g-a"),
            sample("b", "genuine", "test", "g-b"),
            sample("c", "synthetic", "test", "g-c"),
        ]
        predictions = [
            {"sample_id": "a", "execution_status": "completed", "deepfake_score": 0.9},
            {"sample_id": "b", "execution_status": "completed", "deepfake_score": 0.1},
            {"sample_id": "c", "execution_status": "failed", "error": "test failure"},
        ]
        result = score_predictions(samples, predictions, 0.5, "test")
        self.assertEqual(result["examined_count"], 2)
        self.assertEqual(result["coverage"], 0.666667)
        self.assertEqual(result["metrics"]["accuracy"], 1.0)
        self.assertEqual(result["unavailable"][0]["sample_id"], "c")

    def test_group_leakage_is_rejected(self):
        manifest = {
            "schema_version": "1.0",
            "samples": [
                sample("a", "genuine", "development", "same-source"),
                sample("b", "synthetic", "test", "same-source"),
            ],
        }
        with self.assertRaisesRegex(ValueError, "group leakage"):
            validate_manifest(manifest)

    def test_invalid_score_is_rejected(self):
        samples = [sample("a", "genuine", "test", "g-a")]
        with self.assertRaisesRegex(ValueError, "invalid deepfake_score"):
            score_predictions(
                samples,
                [{"sample_id": "a", "execution_status": "completed", "deepfake_score": 1.2}],
                0.5,
                "test",
            )


if __name__ == "__main__":
    unittest.main()
