# Aabhanshi D1 delivery checklist

Last updated: 3 November 2026

## Day 1 - Feasibility and contracts

- [x] Target hardware and software environment recorded
- [x] Real target-Mac image feasibility test
- [x] FFmpeg and FFprobe video-tool feasibility
- [x] Current image adapter accepted only as an experimental comparison baseline
- [x] Candidate image, video and audio paths selected for Day 2 probes
- [x] Code, checkpoint and dataset licence risks recorded
- [x] Finding and run contracts versioned
- [x] Module ownership and first vertical-slice boundaries recorded
- [ ] Team confirms deadline, hours, budget and dataset access
- [ ] D2, D4 and D5 owners confirm contract version `1.0`

Full record: `docs/DAY1_D1_FEASIBILITY_AND_CONTRACTS.md`.

## Step 1 - Image foundation and evaluation contract

- [x] Pinned image model revision and weight checksum
- [x] Safe bounded image decoding and explicit failure states
- [x] Traceable image finding with score semantics and limitations
- [x] Standalone image diagnostic page
- [x] Versioned D1 finding JSON Schema
- [x] API contract documentation
- [x] Image model card
- [x] Group-aware evaluation manifest format
- [x] Evaluation metric generator with coverage and failure reporting
- [x] Exact Apple Silicon Python dependency lock
- [x] Fourteen API, contract and evaluation tests passing
- [x] Real pinned-model execution through the upload endpoint on Apple Silicon
- [ ] Approved genuine and synthetic image collection
- [ ] Empirical label-mapping check
- [ ] Development-only threshold selection
- [ ] Frozen held-out image evaluation
- [ ] Recompression and resizing robustness measurements

Step 1 is technically operational but not accuracy-validated. The API must continue
to return `inconclusive` until the five unchecked evaluation items are completed.

## Step 2 - Video baseline

- [ ] Safe media probing and explicit format/duration limits
- [ ] Presentation-timestamp-based frame sampling
- [ ] Per-frame visual findings and rejected-sample accounting
- [ ] Documented video-level aggregation
- [ ] No-face, no-audio, corrupt, and variable-frame-rate tests
- [ ] Diagnostic frame-result view

## Step 3 - Audio baseline

- [ ] Decode, channel conversion, and resampling records
- [ ] Speech and minimum-duration quality gates
- [ ] Pinned audio model and checksum
- [ ] File-level audio finding
- [ ] Segment locations only after segment-level evaluation
- [ ] Genuine, spoofed, silent, short, noisy, and corrupt tests

## Step 4 - Preserved-evidence and run integration

- [ ] Accept D2 preserved evidence IDs
- [ ] Retrieve only approved working copies or derivatives
- [ ] Register D1-generated derivatives through D2
- [ ] Asynchronous queued/running/completed/failed states
- [ ] Timeout and cancellation behavior
- [ ] Raw artifact retrieval references

## Step 5 - Final evaluation and demonstration package

- [ ] Image, video, and audio dataset documentation
- [ ] Frozen modality-specific thresholds and configurations
- [ ] Metrics, robustness results, abstentions, and error analysis
- [ ] Final model/method cards
- [ ] Clean-machine installation rehearsal
- [ ] Known genuine, manipulated, unsupported, and failure demonstrations
- [ ] Published D1 outputs and metrics for D4 and D5
