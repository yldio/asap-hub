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

- [ ] `packages/demo-timeline` package: types, zod schemas, pure timeline math, wired into the
      frontend (source alias), the server (babel build) and jest
- [ ] Asset entity (`VIDEO#{id}` / `ASSET#{assetId}`) and the studio attributes on the video item
- [ ] Storage key layout for `sources/` and `projects/`, outside the `raw/` encoder trigger
- [ ] Upload decoupled: `openMultipartUpload` shared by the legacy upload and the new asset endpoint
- [ ] Project and asset endpoints with zod schemas and route tests
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

- Explored the existing demo hub end to end and wrote the plan; the product owner approved it.
- Decisions taken: companion snippet for cursor capture with the events editable afterwards; sources
  hot for 90 days then Glacier IR; timeline foundation before recording; preset based text styling.
- Seeded `docs/demo-studio/` with the plan, this log and the findings list.
- Started M0.
