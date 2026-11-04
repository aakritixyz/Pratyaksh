import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class ContractTests(unittest.TestCase):
    def test_contract_files_are_valid_json(self):
        for name in ("d1-finding.schema.json", "d1-run.schema.json"):
            with self.subTest(name=name):
                document = json.loads((ROOT / "contracts" / name).read_text())
                self.assertEqual(document["$schema"], "https://json-schema.org/draft/2020-12/schema")
                self.assertEqual(document["type"], "object")

    def test_run_contract_has_agreed_day_one_states(self):
        document = json.loads((ROOT / "contracts" / "d1-run.schema.json").read_text())
        states = set(document["properties"]["execution_status"]["enum"])
        self.assertEqual(
            states,
            {"queued", "running", "completed", "partial", "failed", "cancelled", "unavailable"},
        )


if __name__ == "__main__":
    unittest.main()
