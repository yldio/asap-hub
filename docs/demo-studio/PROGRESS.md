# Demo studio progress

Tracks what is built, what is verified, and what is left. Checked items are done _and_ verified;
a task is not checked because the code exists, only because it was exercised.

See [PLAN.md](./PLAN.md) for the design and [FINDINGS.md](./FINDINGS.md) for issues that change it.

## Status

| Milestone                   | State                             |
| --------------------------- | --------------------------------- |
| M0 Foundations              | done                              |
| M1 Timeline and render      | editor done, render job in flight |
| M2 Text and transitions     | editor and renderer done          |
| M3 Recording and voice-over | done                              |
| M4a Zoom and manual effects | done                              |
| M4b Cursor capture          | in flight                         |

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

- [x] Import several clips, trim, split, duplicate, reorder, mute, undo and redo
- [x] Drag clips to reorder and drag their edges to trim, on a dark studio timeline
- [x] Preview with a clock-driven playhead that crosses clip boundaries
- [x] Autosave through the existing lease and version guard
- [x] Output follows the footage: 1080p minimum, source height above that, 60fps when the sources are
- [x] Render controls in the editor: start, progress, cancel, failure message, link to the result
- [x] The access route serves the versioned render output, so a re-render is not hidden by the CDN
- [ ] The render job itself, running the plan in the container (in flight)

## M2 Text and transitions

- [x] Title cards between clips, with heading, subtitle and length
- [x] Banners over the video, draggable and trimmable on their own lane, fade or slide
- [x] Transitions between clips: cut, crossfade, slide
- [x] Renderer support for all three, including the ffmpeg filtergraph and the SVG presets shared
      with the preview

## M3 Recording and voice-over

- [x] Screen recording with a codec chosen per browser and a clear message where it is unsupported
- [x] Pause and resume, and the picker's own stop ending the take
- [x] Microphone recorded as a separate narration asset so it can be retimed on its own
- [x] A finished take lands as a clip plus its voice over on the audio lane
- [ ] Streaming the upload while recording rather than at stop (backlog, see FINDINGS)

## M4a Zoom and manual effects

- [x] Zoom keyframes with ramp in, hold, ramp out, easing and a focus point
- [x] Preview applies the zoom transform, and the strongest of two overlapping zooms wins
- [x] Click highlights and spotlight, hand placed, on their own lane
- [x] Editing a derived effect marks it so a later re-derive keeps the change

## M4b Cursor capture

In flight: the companion snippet, its session endpoints, and the pure derivation from captured
events into editable effects.

## Session log

Newest first. One entry per working session: what landed, what was verified, what moved.

### 2026-08-28

- Finished M2, M3 and M4a, and brought M1's editor half to done. The studio now records, imports,
  edits on a multi track timeline, and previews title cards, banners, zoom and cursor effects.
- The shared package grew the render layer: `buildRenderPlan` turns a timeline into an ffmpeg plan
  (168 tests, full coverage), and the SVG presets are the single source of truth for how text looks
  in both the preview and the output.
- The container grew a job runner with matching Docker and ECS implementations, an asset ingest job,
  and a shared finishing stage so an upload and a render produce identical artefacts.

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
