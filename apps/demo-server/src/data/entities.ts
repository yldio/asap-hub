/* eslint-disable no-template-curly-in-string */
import { Entity, Service } from 'electrodb';
import { getTableName } from '../config';
import { getDocumentClient } from './client';

const entityConfiguration = () => ({
  table: getTableName(),
  client: getDocumentClient(),
});

export const videoEntity = new Entity(
  {
    model: { entity: 'video', version: '1', service: 'demo' },
    attributes: {
      id: { type: 'string', required: true },
      title: { type: 'string', required: true },
      status: { type: ['draft', 'published'] as const, required: true },
      // mirrors status uppercased so the GSI1 sort key supports begins_with('PUBLISHED#')
      statusKey: {
        type: 'string',
        default: 'DRAFT',
        watch: ['status'] as const,
        set: (_value: string | undefined, { status }: { status?: string }) =>
          (status || 'draft').toUpperCase(),
      },
      folderId: { type: 'string', required: true, default: 'ROOT' },
      recordedAt: { type: 'string', required: true },
      durationMs: { type: 'number', default: 0 },
      chapters: {
        type: 'list',
        items: {
          type: 'map',
          properties: {
            startMs: { type: 'number', required: true },
            title: { type: 'string', required: true },
          },
        },
        default: [],
      },
      s3Prefix: { type: 'string', required: true },
      createdBy: {
        type: 'map',
        required: true,
        properties: {
          sub: { type: 'string', required: true },
          name: { type: 'string', required: true },
        },
      },
      lockedBy: { type: 'string' },
      lockedByName: { type: 'string' },
      lockExpiresAt: { type: 'number' },
      version: { type: 'number', required: true, default: 1 },
      // 'empty' is a studio project that has never been rendered; uploads never sit in it
      processingState: {
        type: ['empty', 'uploading', 'processing', 'ready', 'failed'] as const,
        required: true,
      },
      processingError: { type: 'string' },
      kind: {
        type: ['upload', 'studio'] as const,
        required: true,
        default: 'upload',
      },
      // pointer to the timeline document in S3; the document itself is far too
      // big for a 400KB item, and every version is kept under its own key
      timeline: {
        type: 'map',
        properties: {
          key: { type: 'string', required: true },
          timelineVersion: { type: 'number', required: true },
          schemaVersion: { type: 'number', required: true },
          updatedAt: { type: 'string', required: true },
        },
      },
      // renders write to media/{id}/{mediaPath}/ so a re-render cannot be hidden
      // behind the day-long CloudFront TTL on the previous output
      mediaPath: { type: 'string' },
      render: {
        type: 'map',
        properties: {
          renderId: { type: 'string', required: true },
          state: {
            type: [
              'queued',
              'rendering',
              'done',
              'failed',
              'cancelled',
            ] as const,
            required: true,
          },
          timelineVersion: { type: 'number', required: true },
          stage: { type: 'string' },
          progress: { type: 'number' },
          taskArn: { type: 'string' },
          requestedAt: { type: 'string' },
          finishedAt: { type: 'string' },
          error: { type: 'string' },
        },
      },
      createdAt: { type: 'string', required: true },
      updatedAt: { type: 'string', required: true },
    },
    indexes: {
      byId: {
        pk: {
          casing: 'none' as const,
          field: 'PK',
          composite: ['id'],
          template: 'VIDEO#${id}',
        },
        sk: {
          casing: 'none' as const,
          field: 'SK',
          composite: [],
          template: 'META',
        },
      },
      byFolder: {
        index: 'GSI1',
        pk: {
          casing: 'none' as const,
          field: 'GSI1PK',
          composite: ['folderId'],
          template: 'FOLDER#${folderId}',
        },
        sk: {
          casing: 'none' as const,
          field: 'GSI1SK',
          // status is uppercased into the key by statusKey so begins_with can isolate published items
          composite: ['statusKey', 'recordedAt', 'id'],
          template: '${statusKey}#${recordedAt}#${id}',
        },
      },
    },
  },
  entityConfiguration(),
);

// one row per source file of a studio project: recorded segments, imported
// videos and narration takes. Kept out of the video item so each stays small
// and can be added or deleted on its own.
export const assetEntity = new Entity(
  {
    model: { entity: 'asset', version: '1', service: 'demo' },
    attributes: {
      videoId: { type: 'string', required: true },
      assetId: { type: 'string', required: true },
      kind: { type: ['video', 'audio'] as const, required: true },
      state: {
        type: ['uploading', 'preparing', 'ready', 'failed'] as const,
        required: true,
      },
      key: { type: 'string', required: true },
      proxyKey: { type: 'string' },
      mimeType: { type: 'string', required: true },
      label: { type: 'string', required: true },
      bytes: { type: 'number' },
      // written by the ingest job once the source has actually been probed
      durationMs: { type: 'number' },
      width: { type: 'number' },
      height: { type: 'number' },
      fps: { type: 'number' },
      error: { type: 'string' },
      createdAt: { type: 'string', required: true },
      updatedAt: { type: 'string', required: true },
    },
    indexes: {
      byVideo: {
        pk: {
          casing: 'none' as const,
          field: 'PK',
          composite: ['videoId'],
          template: 'VIDEO#${videoId}',
        },
        sk: {
          casing: 'none' as const,
          field: 'SK',
          composite: ['assetId'],
          template: 'ASSET#${assetId}',
        },
      },
    },
  },
  entityConfiguration(),
);

export const folderEntity = new Entity(
  {
    model: { entity: 'folder', version: '1', service: 'demo' },
    attributes: {
      id: { type: 'string', required: true },
      name: { type: 'string', required: true },
      // plain attribute, not part of any key: the tree is assembled from the flat list
      parentId: { type: 'string' },
      createdAt: { type: 'string', required: true },
    },
    indexes: {
      byId: {
        pk: {
          casing: 'none' as const,
          field: 'PK',
          composite: ['id'],
          template: 'FOLDER#${id}',
        },
        sk: {
          casing: 'none' as const,
          field: 'SK',
          composite: [],
          template: 'META',
        },
      },
      all: {
        index: 'GSI1',
        pk: {
          casing: 'none' as const,
          field: 'GSI1PK',
          composite: [],
          template: 'FOLDERS',
        },
        sk: {
          casing: 'none' as const,
          field: 'GSI1SK',
          composite: ['name'],
          template: '${name}',
        },
      },
    },
  },
  entityConfiguration(),
);

export const userEntity = new Entity(
  {
    model: { entity: 'user', version: '1', service: 'demo' },
    attributes: {
      sub: { type: 'string', required: true },
      email: { type: 'string', required: true },
      name: { type: 'string', required: true },
      role: { type: ['creator', 'member', 'admin'] as const, required: true },
      status: {
        type: ['active', 'revoked'] as const,
        required: true,
        default: 'active',
      },
      createdAt: { type: 'string', required: true },
    },
    indexes: {
      bySub: {
        pk: {
          casing: 'none' as const,
          field: 'PK',
          composite: ['sub'],
          template: 'USER#${sub}',
        },
        sk: {
          casing: 'none' as const,
          field: 'SK',
          composite: [],
          template: 'PROFILE',
        },
      },
      all: {
        index: 'GSI1',
        pk: {
          casing: 'none' as const,
          field: 'GSI1PK',
          composite: [],
          template: 'USERS',
        },
        sk: {
          casing: 'none' as const,
          field: 'GSI1SK',
          composite: ['name'],
          template: '${name}',
        },
      },
    },
  },
  entityConfiguration(),
);

export const inviteEntity = new Entity(
  {
    model: { entity: 'invite', version: '1', service: 'demo' },
    attributes: {
      email: { type: 'string', required: true },
      role: { type: ['creator', 'member', 'admin'] as const, required: true },
      invitedBy: {
        type: 'map',
        required: true,
        properties: {
          sub: { type: 'string', required: true },
          name: { type: 'string', required: true },
        },
      },
      createdAt: { type: 'string', required: true },
      claimedBy: {
        type: 'map',
        properties: {
          sub: { type: 'string', required: true },
          name: { type: 'string', required: true },
        },
      },
      claimedAt: { type: 'string' },
    },
    indexes: {
      byEmail: {
        pk: {
          casing: 'none' as const,
          field: 'PK',
          composite: ['email'],
          template: 'INVITE#${email}',
        },
        sk: {
          casing: 'none' as const,
          field: 'SK',
          composite: [],
          template: 'META',
        },
      },
      all: {
        index: 'GSI1',
        pk: {
          casing: 'none' as const,
          field: 'GSI1PK',
          composite: [],
          template: 'INVITES',
        },
        sk: {
          casing: 'none' as const,
          field: 'GSI1SK',
          composite: ['email'],
          template: '${email}',
        },
      },
    },
  },
  entityConfiguration(),
);

export const createService = () =>
  new Service(
    {
      video: videoEntity,
      asset: assetEntity,
      folder: folderEntity,
      user: userEntity,
      invite: inviteEntity,
    },
    entityConfiguration(),
  );
