# Day 1 - D1 feasibility and contracts

Owner: Aabhanshi  
Status: complete with recorded blockers  
Date: 3 November 2026

## Day 1 decision

D1 is feasible on the available Apple M2 laptop as a bounded, local prototype.
The engine will support image, sampled-video and speech-audio analysis through one
versioned result contract. No method will produce an authenticity verdict until it
passes a held-out project evaluation.

The currently integrated image model is retained only as an execution probe. It is
not selected as the final image detector because it produced a confirmed false
positive and its training collection is described too vaguely for forensic claims.

## Available environment

| Item | Recorded state | Day 1 conclusion |
| --- | --- | --- |
| Computer | Apple M2, 8 cores, 16 GB RAM, arm64 | Suitable for bounded CPU inference |
| Operating system | macOS 26.6.2 | Supported development target |
| Python | 3.12.14 | Working in isolated `.venv` |
| PyTorch | 2.15.0 | CPU inference verified |
| MPS | Built but unavailable in this environment | CPU is the reproducible baseline |
| Image runtime | 4.799 seconds for first API smoke request | Acceptable prototype baseline; measure warm runs later |
| FFmpeg / FFprobe | 8.1.2 installed | Video probing, frame sampling and audio extraction are feasible |
| Model storage | `backend/models/`, ignored by Git | Store retrieval manifest and hashes, not weights, in Git |
| Licensed evaluation media | Not yet acquired | Blocker before accuracy claims |
| Deadline, daily hours, budget | Not specified | Team must confirm before depth commitments |

Run `python feasibility_probe.py --smoke` to reproduce the software, media-tool,
checksum and execution checks without exposing device identifiers.

## Baseline task scope

| Modality | Day 1 baseline decision | Explicit non-claim |
| --- | --- | --- |
| Image | Whole-image synthetic-media screening with a selected and evaluated detector | No authentication, creator identification or manipulated-region claim |
| Video | Probe streams, sample frames by presentation timestamp, run the validated image path, and report per-frame coverage plus bounded aggregation | No lip-sync or complete-frame coverage claim |
| Audio | Decode speech to mono 16 kHz, apply duration/speech gates and run an evaluated anti-spoofing model | No speaker identification or universal voice-clone claim |

## Candidate-method decisions

### Image

1. **Current ViT adapter - execution probe only.** It runs locally, has a pinned
   revision and checksum, and its label mapping is `Realism=0`, `Deepfake=1`.
   It is rejected as the default detector pending comparison because its publisher
   gives no auditable dataset inventory and the project observed a false positive.
2. **UniversalFakeDetect - primary Day 2 probe.** The official repository is MIT
   licensed, supplies a CLIP ViT-L/14 evaluation path and pretrained classifier
   weights, and evaluates across multiple GAN and diffusion domains. Code, CLIP
   dependency, checkpoint and dataset terms must each be recorded separately.
3. **DeepfakeBench - evaluation reference only.** It provides standardized
   face-forgery methods and metrics, but the repository is CC BY-NC 4.0. It is not
   the deployable default and cannot silently become a production dependency.

Selection gate: run known genuine and synthetic controls on the M2, verify output
orientation, record latency and false positives, then choose the image adapter.

### Video

The first feasible path reuses the selected whole-image detector on bounded frames
sampled with FFprobe presentation timestamps. Video results will retain per-frame
scores, rejected frames, examined timestamps and coverage. A separate face-forgery
method is an extension only after licence and Mac-runtime checks.

### Audio

**AASIST is the primary Day 2 probe.** Its official code is MIT licensed, provides
pretrained checkpoints and reports reproducible ASVspoof 2019 LA evaluation. The
project will evaluate on the official ASVspoof deepfake material and local permitted
speech controls because out-of-domain performance can degrade substantially.

Selection gate: verify checkpoint hash, label direction, 16 kHz mono preprocessing,
CPU runtime, short/silent input handling and held-out genuine/spoof behaviour.

## Contract decisions

- Finding contract: `contracts/d1-finding.schema.json` version `1.0`.
- Run contract: `contracts/d1-run.schema.json` version `1.0`.
- Evidence identity: D1 consumes a D2 `evidence_id`; temporary uploads use an
  explicit `LOCAL-` identifier and make no preservation claim.
- Execution states: `queued`, `running`, `completed`, `partial`, `failed`,
  `cancelled`, `unavailable`.
- Result states: `inconclusive` is the default. A classifier score is not an
  authenticity probability. Unsupported quality or scope becomes `not_applicable`.
- Time locations: integer milliseconds on the original evidence timeline using
  half-open intervals `[start_ms, end_ms)`.
- Image regions: original-image pixel coordinates plus original width and height.
- Scores: retain raw class outputs, positive-class meaning, threshold version,
  calibration state and aggregation method.
- Failures: missing models and failed inference never become genuine results.
- Derivatives: frames, audio and crops retain hashes and derivation records and are
  registered through D2 when its interface becomes available.

## First vertical-slice boundary

1. D2 preserves an upload and returns `evidence_id` plus source hash.
2. D1 requests an approved working copy, creates a versioned run and saves a real
   finding without modifying the original.
3. D4 displays the saved finding and its limitations.
4. D5 reports the same persisted identifiers, method version and limitations.

D1 owns inference, preprocessing, raw outputs and metrics. D2 owns preservation.
D4 owns dashboard integration. D5 owns reports.

## Day 1 acceptance evidence

- [x] Real image inference executes on target Mac CPU.
- [x] Model revision, weights checksum and label mapping are recorded.
- [x] Failure and unsupported states are explicit.
- [x] Finding and run contracts are versioned.
- [x] Image, video and audio baseline boundaries are written.
- [x] Candidate licences and dependency risks are recorded.
- [x] FFmpeg/FFprobe feasibility is confirmed.
- [x] Current image-model false positive is recorded as a blocker.
- [ ] Team confirms deadline, hours, budget and permitted dataset access.
- [ ] Aakriti confirms the D2 evidence and derivative registration interface.
- [ ] Aadya and Bhumi confirm consumption of contract version `1.0`.

The unchecked items are shared-team confirmations, not hidden D1 implementation.
Day 2 should begin with the UniversalFakeDetect image probe and AASIST audio probe;
the existing ViT remains visible only as an experimental comparison baseline.

## Primary references checked on Day 1

- UniversalFakeDetect official repository: https://github.com/WisconsinAIVision/UniversalFakeDetect
- DeepfakeBench official repository: https://github.com/SCLBD/DeepfakeBench
- AASIST official repository: https://github.com/clovaai/aasist
- ASVspoof 2021 official baselines: https://github.com/asvspoof-challenge/2021
- ASVspoof 2021 data and terms: https://www.asvspoof.org/index2021.html
