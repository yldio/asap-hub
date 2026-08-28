# Demo studio progress

Tracks what is built, what is verified, and what is left. Checked items are done _and_ verified;
a task is not checked because the code exists, only because it was exercised.

See [PLAN.md](./PLAN.md) for the design and [FINDINGS.md](./FINDINGS.md) for issues that change it.

## Status

| Milestone                   | State       |
| --------------------------- | ----------- |
| M0 Foundations              | in progress |
| M1 Timeline and render      | not started |
| M2 Text and transitions     | not started |
| M3 Recording and voice-over | not started |
| M4 Cursor and zoom          | not started |

## M0 Foundations

Goal: the plumbing every later milestone needs, with today's upload flow behaving exactly as before.

- [x] `packages/demo-timeline` package: types, zod schemas, pure timeline math, wired into the
      frontend (source alias), the server (babel build) and jest. 50 tests.
- [x] Asset entity (`VIDEO#{id}` / `ASSET#{assetId}`) and the studio attributes on the video item
      (`kind`, `timeline` pointer, `mediaPath`, `render`, and the `empty` processing state)
- [x] Storage key layout under `projects/`, outside the `raw/` encoder trigger, with a test that
      fails if any studio key ever lands under `raw/`
- [x] Upload decoupled: the multipart helpers take a key, and `createVideoRow` is shared by the
      legacy upload and by a studio project
- [x] Shared video helpers extracted, including one `guardedUpdate` for the lease-and-version write
- [x] Project endpoints: create a project, read and write the timeline document (13 route tests)
- [x] Asset endpoints: open, sign, complete and delete a source asset, with the
      delete refusing while a clip or narration take still references it (16 tests)
- [x] Studio editor (brought forward from M1 so there is something to use): dark
      editor chrome, media panel, preview, timeline with drag to reorder and drag
      edges to trim, split, duplicate, mute, undo and redo, autosave under the lease
- [x] Output follows the footage: 60fps sources render at 60, sources above 1080p
      keep their height, everything smaller is lifted to 1080p
- [ ] Job runner abstraction with the ECS and Docker implementations
- [ ] Ingest job producing a seekable `proxy.mp4` plus probed metadata
- [ ] `serverless.ts` infrastructure changes written (product owner deploys)
- [ ] Studio route skeleton behind the existing creator guard

Acceptance criteria:

- Importing a file, titling it, marking chapters, publishing and watching behaves exactly as before.
- A source asset can be uploaded to a project, is ingested to a proxy, and its duration and
  dimensions land on the asset item.
- The ingest runs through the same container image locally and deployed.
- Scoped tests pass for every touched file; format, typecheck and lint are clean.

## M1 Timeline and render

Not started. Goal: import several clips, trim, split, reorder, preview, autosave, render at 1080p,
publish.

## M2 Text and transitions

Not started.

## M3 Recording and voice-over

Not started.

## M4 Cursor and zoom

Not started.

## Session log

Newest first. One entry per working session: what landed, what was verified, what moved.

### 2026-08-28

- Built the editor itself: `packages/demo-timeline` grew `chooseCanvas`, the frontend
  grew a timeline reducer with undo, and the studio page now edits a real timeline.
- Restyled the editor to the dark studio chrome the product owner asked for, with
  drag to reorder, drag edges to trim, and S/D/M/Delete shortcuts.
- Added 60fps support end to end: assets carry their frame rate, the canvas adopts
  it, and the transport bar exposes it.

- Unblocked local media: the hub's MinIO had no published ports because another project owns
  9000/9001, which is what made uploads fail with a 500. Remapped to 9010/9011 and verified a
  presigned multipart round trip end to end (F-002 resolved).
- Landed the shared timeline package, the studio data model, the `projects/` key layout, the shared
  video write helpers and the project timeline endpoints. Nine commits, all scoped tests green,
  format, typecheck and full lint clean.
- Found and logged two pre-existing local environment problems that limit verification: package
  builds cannot run (F-005) and `test/storage.test.ts` cannot parse (F-006). Both need a decision
  from the product owner.

### Planning, earlier that day

- Explored the existing demo hub end to end and wrote the plan; the product owner approved it.
- Decisions taken: companion snippet for cursor capture with the events editable afterwards; sources
  hot for 90 days then Glacier IR; timeline foundation before recording; preset based text styling.
- Seeded `docs/demo-studio/` with the plan, this log and the findings list.
- Started M0.
