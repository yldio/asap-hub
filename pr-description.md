## Summary

This PR implements event-based synchronisation of Aims and Milestones data to OpenSearch. Previously, these indices were only updated by a scheduled full reindex. Now, any change to an Aim, Milestone, Project, or Supplement Grant in Contentful is immediately reflected in OpenSearch.

## What changed

### Event pipeline

Two new Lambda handlers listen to EventBridge events:

**`opensearchIndexAims`** handles:
- `AimsPublished` — rebuilds the aim document and its linked milestone documents
- `AimsUnpublished` — deletes the aim document and its linked milestone documents
- `ProjectsPublished` — rebuilds all aims and milestones for the project
- `ProjectsUnpublished` — deletes all aims and milestones for the project
- `SupplementGrantPublished` / `SupplementGrantUnpublished` — finds the parent project, then rebuilds all its aims and milestones

**`opensearchIndexMilestones`** handles:
- `MilestonesPublished` — rebuilds the milestone document and all aims linked to it (because aim status and article counts derive from milestones)
- `MilestonesUnpublished` — rebuilds linked aims, then deletes the milestone document

### New files

| File | Purpose |
|------|---------|
| `src/handlers/aim/opensearch-index-aim-handler.ts` | Lambda handler for aim/project/supplement grant events |
| `src/handlers/milestone/opensearch-index-milestone-handler.ts` | Lambda handler for milestone events |
| `src/handlers/opensearch/aims-milestones-reindex.ts` | Core reindex logic — builds documents and calls OpenSearch |
| `src/data-providers/contentful/aims-milestones.data-provider.ts` | Contentful queries for targeted lookups (by ID, reverse lookups via `linkedFrom`) |
| `src/data-providers/types/aims-milestones.data-provider.types.ts` | TypeScript interface for the data provider |
| `packages/contentful/src/crn/queries/aims-milestones.queries.ts` | GraphQL query definitions |

### How the reindex works

Each reindex function follows a **delete-then-reinsert** pattern:

1. Fetch the current state from Contentful
2. Delete existing documents from OpenSearch that match the affected IDs
3. Build fresh documents from the Contentful data
4. Upsert the new documents into OpenSearch

This pattern avoids duplicates and stale data. The delete step uses `deleteByQuery` matching on the document's `id` field (not the OpenSearch `_id`), which is critical because the full reindex script uses auto-generated `_id` values while event-based sync uses `_id: doc.id`. Deleting by document `id` works regardless of which indexing strategy created the original document.

### Aim ordering

Added an `aimOrder` field to aim documents. This is a 1-based integer representing the aim's position within its collection in Contentful (original grant aims and supplement grant aims are ordered independently). The OpenSearch query now sorts by `aimOrder` instead of `createdDate`, so the frontend displays aims in the same order as Contentful.

The sort includes `missing: '_last'` to handle the transition period before the first full reindex populates the field on all existing documents.

### Webhook configuration

Added `aims`, `milestones`, and `supplementGrant` to `ContentfulWebhookPayloadType` so that Contentful publishes webhook events for these content types. The event flow is:

```
Contentful publish → Webhook → SQS → Poller → EventBridge → Lambda handler
```

### OpenSearch utilities

Added two new functions to `@asap-hub/server-common`:

- `upsertOpensearchDocuments(client, index, docs)` — bulk upsert using `_id: doc.id`
- `deleteByDocumentIds(client, index, ids)` — delete by querying the `id` field in the document body, works regardless of `_id` strategy

### What each event triggers

| Event | Aims index | Milestones index |
|-------|-----------|-----------------|
| Aim published | Rebuild this aim | Delete + reinsert milestones linked to this aim |
| Aim unpublished | Delete this aim | Delete milestones linked to this aim |
| Milestone published | Rebuild aims linked to this milestone | Rebuild this milestone |
| Milestone unpublished | Rebuild aims linked to this milestone | Delete this milestone |
| Project published | Delete + reinsert all aims for this project | Delete + reinsert all milestones for this project |
| Project unpublished | Delete all aims for this project | Delete all milestones for this project |
| Supplement grant published/unpublished | Delete + reinsert all aims for the parent project | Delete + reinsert all milestones for the parent project |

### Changes to full reindex script

- Added `aimOrder` field to `ProjectAimsDataObject` type and OpenSearch mapping
- `exportAimsData` now populates `aimOrder` based on the aim's position in the Contentful collection

## Test plan

- [ ] Verify creating a new aim in Contentful adds it to OpenSearch
- [ ] Verify editing an aim description updates the document in OpenSearch
- [ ] Verify unpublishing an aim removes it and its milestones from OpenSearch
- [ ] Verify creating/editing/unpublishing a milestone updates both milestone and linked aim documents
- [ ] Verify editing a project (e.g. title change) updates all its aims and milestones
- [ ] Verify reordering aims in Contentful updates `aimOrder` and the frontend reflects the new order
- [ ] Verify no duplicates appear after a full reindex followed by an event-based update
- [ ] Verify the project detail page loads correctly (no 500 from `aimOrder` sort on old indices)
- [ ] Run the full reindex script and confirm `aimOrder` is populated on all documents
