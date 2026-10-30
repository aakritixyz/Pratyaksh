# PRATYAKSH
Multimedia forensic investigation frontend. React 18, TypeScript and Vite.

## Run
Install dependencies with your Node package manager, then `npm run dev`. `npm run build` type-checks and builds dist/. `npm test` validates forensic fixture contracts and status semantics. `make web`, `make build` and `make test` are also available. The app has no Python API or worker yet.

## Screens
Case overview, searchable evidence inventory, three-pane evidence workbench, metadata, typed provenance relationships, reference comparison, analyst notes, report configuration and printable preview, JSON export and revisions, evaluation empty state, methods and limits, session audit log, settings, upload and case creation.

## Data
VITE_DEV_FIXTURE=true explicitly enables illustrative precomputed findings. Disable at build time for an empty workspace. Cases and review notes persist in this browser. Uploaded files remain in memory for the browser session; Web Crypto calculates actual SHA-256 values. Uploaded files do not receive synthetic-media classifications. Analysis requests surface an explicit unavailable state. There is no backend connection and no protected evidence storage.

## Capability status
| Feature | Status |
| --- | --- |
| Case and evidence frontend | Implemented |
| Three-pane review and four independent channels | Implemented with fixtures |
| Local analyst notes | Implemented |
| JSON report export and print/PDF view | Prototype |
| Actual inference and C2PA validation | Not connected |
| Server preservation and audit protection | Not connected |
| Measured evaluation | Not yet evaluated |

See docs/ASSUMPTIONS.md for scope, semantics and production integration decisions.
