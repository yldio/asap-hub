# Demo studio findings

Issues and discoveries that affect the build, newest first. Severity drives what happens next:

| Severity        | Meaning                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------- |
| **P0 blocker**  | Stops the current milestone. Work stops and [PLAN.md](./PLAN.md) is re-ordered immediately. |
| **P1 must-fix** | Ships before the next milestone starts.                                                     |
| **P2 backlog**  | Recorded with enough detail to pick up later. Does not interrupt.                           |

Each entry records what was observed, why it matters, and what was decided, so nothing is silently
dropped.

---

## F-004 (P2) Ingest stays a shell script, only the renderer is Node

**Observed.** The plan calls for Node entrypoints in the encoder container. Ingest is only probe,
remux and upload, which `encode.sh` already does in bash with `S3_ENDPOINT` and `DYNAMODB_ENDPOINT`
overrides.

**Why it matters.** A Node entrypoint would need the workspace package bundled into the image before
it is needed. The renderer genuinely needs it (filtergraph generation from the timeline); ingest does
not.

**Decided.** Ingest is `encoder/ingest.sh`, sharing helpers with `encode.sh`. The renderer becomes a
bundled Node program in M1, when the timeline package actually exists to bundle.

## F-003 (P2) `local-encoder.ts` is a second implementation of the encode

**Observed.** `apps/demo-server/src/local-encoder.ts` reimplements the ffmpeg work of
`encoder/encode.sh` for local dev, so the two can drift.

**Why it matters.** A feature verified locally is only meaningfully verified if it ran the deployed
code path.

**Decided.** The Docker job runner makes the container the primary local path. `local-encoder.ts`
survives only as the fallback when Docker is unavailable, and is not extended with new features.

## F-002 (P1) MinIO has no published ports on this machine

**Observed.** `rec-rustfs` from an unrelated project owns host ports 9000 and 9001, so the hub's
`minio` container starts with none published. `yarn demo:local:setup` fails its bucket step with
`InvalidAccessKeyId`, because `localhost:9000` is the other service answering.

**Why it matters.** No media upload, no playback, no ingest and no render can be verified locally
until this is resolved, which blocks every acceptance check in the plan.

**Decided.** Not changed unilaterally, since the conflicting container belongs to another project.
Either stop `rec-rustfs` while working on the hub, or remap MinIO to free ports and set
`LOCAL_S3_ENDPOINT`. To be settled before the first end to end M0 check.

## F-001 (P1) `PATCH /videos/:id` uses a hand-written update expression

**Observed.** `apps/demo-server/src/routes/videos.ts:307` names every attribute explicitly in a
hand-written `UpdateExpression`, rather than going through ElectroDB. Adding an attribute to the
entity alone silently fails to persist it.

**Why it matters.** Every new studio attribute risks being dropped on save with no error.

**Decided.** The timeline gets its own endpoint rather than riding on this route, and any attribute
that must go through `PATCH` is added to the expression _and_ covered by a route test asserting it
round-trips.
