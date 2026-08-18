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
      processingState: {
        type: ['uploading', 'processing', 'ready', 'failed'] as const,
        required: true,
      },
      processingError: { type: 'string' },
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

export const folderEntity = new Entity(
  {
    model: { entity: 'folder', version: '1', service: 'demo' },
    attributes: {
      id: { type: 'string', required: true },
      name: { type: 'string', required: true },
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
      role: { type: ['creator', 'member'] as const, required: true },
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
      role: { type: ['creator', 'member'] as const, required: true },
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
      folder: folderEntity,
      user: userEntity,
      invite: inviteEntity,
    },
    entityConfiguration(),
  );
