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

## F-006 (P1) `.env` forces `NODE_ENV=development`, which breaks `test/storage.test.ts`

**Observed.** `apps/demo-server/test/storage.test.ts` fails before a single test runs, with
`SyntaxError: Delete of an unqualified identifier in strict mode` on `delete undefined`. It fails
identically with all of my changes stashed, so it predates this work. The chain is:

1. `.yarnrc.yml` installs `yarn-plugin-dotenv`, which injects the local `.env` into every process
   started through `yarn`, and it overrides variables already exported
   (`NODE_ENV=test yarn node -e '…'` still prints `development`).
2. `.env:128` sets `NODE_ENV=development`.
3. `babel-base.config.js` enables `babel-plugin-transform-inline-environment-variables` whenever
   `NODE_ENV !== 'test'`, so during tests every `process.env.X` read is replaced with its value at
   transform time.
4. That turns the file's first statement, `delete process.env.BUCKET_NAME`, into `delete undefined`,
   which is a syntax error under strict mode.

In CI there is no `.env`, so jest sets `NODE_ENV=test` itself, the plugin stays off and the file
parses. This is a local-only failure.

**Why it matters.** The blast radius is narrower than it first looks: `storage.test.ts` is the only
file that uses `delete process.env`, and `uploads.test.ts`, `app.test.ts` and `id-guards.test.ts` all
pass. But no test on this machine can meaningfully change an environment variable at runtime, because
reads were already baked in at transform time, and the one file that tries cannot run at all.

**Decided.** The pure key-builder tests moved to a new `test/storage-keys.test.ts`, so the guard that
keeps studio keys out of `raw/` actually runs. `storage.test.ts` is left as it is, still unrunnable
locally. The one-line fix belongs to the product owner because `.env` is his untracked local file:
remove or comment `NODE_ENV=development` there, after checking nothing in his local CRN or GP2
workflow depends on it.

## F-005 (P1) Workspace package builds fail on this machine: `babel: command not found`

**Observed.** `yarn workspace @asap-hub/demo-timeline run build:babel` fails with
`../../scripts/build-babel.sh: line 10: babel: command not found`, and so does
`yarn workspace @asap-hub/validation run build:babel`, an untouched existing package. The repo uses
Yarn PnP (`nodeLinker: pnp`, no `node_modules/.bin`), and `@babel/cli` is declared only in the root
`package.json`, so a workspace script never sees the binary. `yarn babel --version` works from the
root, which is why this is invisible until a package actually needs rebuilding.

**Why it matters.** The server consumes shared packages through their `build-cjs` output, so
`yarn watch` is the mechanism that makes package changes take effect. On this machine it cannot
rebuild any package, and the committed `build/` directories are stale artefacts from the previous
machine. Any edit to a shared package would silently fail to reach the server.

**Decided.** `packages/demo-timeline` declares `@babel/cli` in its own `devDependencies`, which is
the correct declaration for a package whose build script runs it, and its build now succeeds. The
same one-line fix applies to every other package, but that is a repo-wide change outside this work,
so it is flagged for the product owner rather than done unilaterally.

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

## F-002 (P1, resolved) MinIO had no published ports, which broke every upload

**Observed.** `rec-rustfs` from an unrelated project owns host ports 9000 and 9001, so the hub's
`minio` container started with none published (`docker inspect minio` showed `ports=map[]`). Every S3
call therefore reached rustfs, which rejects the `minioadmin` credentials. That surfaced as
`yarn demo:local:setup` failing its bucket step with `InvalidAccessKeyId`, a 500 from
`POST /api/uploads` in the app, and 403s on `/media/.../thumb.jpg`.

**Why it matters.** It looked like a missing environment variable but was a port collision, and it
blocked media upload, playback, ingest and render, which is every acceptance check in the plan.

**Resolved.** The hub's MinIO is published on **9010** (API) and **9011** (console) instead, so both
projects run at once: `docker-compose.yml`, the `LOCAL_S3_ENDPOINT` default in
`apps/demo-server/src/config.ts` and `scripts/local-setup.ts`, the Vite `/media` proxy target and the
README all moved together. `LOCAL_S3_ENDPOINT` still overrides it. Verified by running
`yarn demo:local:setup` clean and by a presigned multipart round trip (create, presigned part PUT,
complete, head, delete) against the bucket. Anyone with a running dev server has to restart it to
pick up the new endpoint.

## F-001 (P1) `PATCH /videos/:id` uses a hand-written update expression

**Observed.** `apps/demo-server/src/routes/videos.ts:307` names every attribute explicitly in a
hand-written `UpdateExpression` rather than going through ElectroDB. It uses `SET`, so attributes it
does not name are preserved rather than clobbered, but they can never be _written_ through this
route: adding an attribute to the entity alone silently fails to persist on save. `/publish` and
`/unpublish` repeat the same hand-rolled pattern, so the shape exists in triplicate.

**Why it matters.** Every new studio attribute risks being dropped on save with no error, and three
copies of the same lease-and-version conditional update is three places to get it wrong.

**Decided.** The timeline gets its own endpoint rather than riding on this route. The three copies
collapse into one tested `guardedUpdate({ set, remove, expectedVersion })` helper, and any attribute
that must go through `PATCH` is covered by a route test asserting it round-trips.
