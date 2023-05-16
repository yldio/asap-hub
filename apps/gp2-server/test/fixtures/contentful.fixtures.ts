import {
  BulkAction,
  BulkActionStatus,
  Collection,
  Entry,
  EntryProps,
  KeyValueMap,
  Link,
} from '@asap-hub/contentful';

export const contenfulSpaceLink: Link<'Space'> = {
  sys: { type: 'Link', linkType: 'Space', id: 'space-id' },
};

export const contentfulEnvironmentLink: Link<'Environment'> = {
  sys: { id: 'env-id', type: 'Link', linkType: 'Environment' },
};

export const contenfulUserLink: Link<'User'> = {
  sys: { type: 'Link', linkType: 'User', id: 'user-id' },
};

export const getEntry = (
  overrides: Partial<Entry>,
  id = 'entry-id',
): Entry => ({
  update: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
  archive: jest.fn(),
  unarchive: jest.fn(),
  publish: jest.fn(),
  unpublish: jest.fn(),
  toPlainObject: jest.fn(),
  getComment: jest.fn(),
  getComments: jest.fn(),
  getSnapshot: jest.fn(),
  getSnapshots: jest.fn(),
  createTask: jest.fn(),
  createComment: jest.fn(),
  getTask: jest.fn(),
  getTasks: jest.fn(),
  isPublished: jest.fn(),
  isDraft: jest.fn(),
  isUpdated: jest.fn(),
  isArchived: jest.fn(),
  references: jest.fn(),
  metadata: { tags: [] },
  sys: {
    automationTags: [],
    space: contenfulSpaceLink,
    id,
    type: 'Entry',
    createdAt: '2022-11-22T09:06:28.060Z',
    updatedAt: '2022-11-22T09:06:28.060Z',
    environment: contentfulEnvironmentLink,
    createdBy: contenfulUserLink,
    updatedBy: contenfulUserLink,
    publishedCounter: 0,
    version: 1,
    contentType: { sys: { type: 'Link', linkType: 'ContentType', id: 'news' } },
  },
  fields: {},
  ...overrides,
});

export const getEntryCollection = (
  items: Entry[],
): Collection<Entry, EntryProps<KeyValueMap>> => ({
  total: items.length,
  skip: 0,
  limit: 10,
  toPlainObject: jest.fn(),
  sys: {
    type: 'Array',
  },
  items,
});
export const getBulkAction = (overrides: Partial<BulkAction>): BulkAction => ({
  sys: {
    id: 'bulk-id',
    type: 'BulkAction',
    space: contenfulSpaceLink,
    environment: contentfulEnvironmentLink,
    createdBy: contenfulUserLink,
    createdAt: '2022-11-22T09:06:28.060Z',
    updatedAt: '2022-11-22T09:06:28.060Z',
    status: 'succeeded' as BulkActionStatus.succeeded,
  },
  action: 'publish',
  payload: {},
  get: jest.fn(),
  waitProcessing: jest.fn(),
  toPlainObject: jest.fn(),
  ...overrides,
});
