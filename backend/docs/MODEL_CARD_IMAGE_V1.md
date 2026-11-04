# Model card: D1 experimental whole-image detector

## Status

Experimental baseline. It has executed successfully, but it has not yet been
evaluated on the Pratyaksh held-out collection. Its output must remain
`inconclusive` until an operating threshold is selected and frozen.

## Method

- Model ID: `prithivMLmods/Deep-Fake-Detector-v2-Model`
- Revision: `3a99ae26f52c7ac7c3a53103b6cf3a8b617f7093`
- Expected weights SHA-256: `88ac0939285009e3700cfc9b9a0912b14b092d200ef0df86efe4f2cf190ea4de`
- Publisher-declared licence: Apache-2.0
- Output labels asserted by the adapter: index 0 `Realism`, index 1 `Deepfake`
- Positive score: softmax output at index 1
- Preprocessing version: `rgb-exif-pinned-processor-v1`

The publisher's reported performance is not Pratyaksh's measured performance.
Training-data provenance is not sufficiently documented to claim broad coverage
or unrestricted deployment suitability.

## Inputs and preprocessing

The API accepts one static JPEG, PNG, or WEBP file up to 15 MiB and 20 million
decoded pixels. It applies EXIF orientation, converts to RGB, and delegates resize,
normalization, and tensor creation to the pinned model processor.

## Intended use

Investigator triage and method evaluation on supported still images. The result is
an observation for human review, not proof of authenticity, factual truth, source,
identity, creator, or guilt.

## Known limitations

- No project accuracy, calibration, threshold, or confidence interval exists yet.
- The method produces a whole-image score and no localization mask.
- It may be sensitive to compression, resizing, crops, screenshots, and generators
  absent from its training data.
- Label order is asserted from configuration but still needs empirical checks with
  permitted known genuine and synthetic samples.
- Target Apple Silicon compatibility and latency have not been recorded.

## Required evaluation before a verdict is enabled

- Group-separated development and held-out test collections.
- Known genuine and synthetic controls from permitted sources.
- Threshold selected only on development data.
- Confusion matrix, precision, recall, specificity, F1, balanced accuracy, coverage,
  abstentions, and failure counts on held-out data.
- Robustness checks for recompression and resizing.
- Recorded hardware, dependency versions, model revision, preprocessing version,
  class counts, and limitations.
