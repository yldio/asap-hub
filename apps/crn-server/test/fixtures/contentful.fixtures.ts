import { Entry, Link, SysLink } from '@asap-hub/contentful';

export const contenfulSpaceLink: SysLink = {
  sys: { type: 'Link', linkType: 'Space', id: 'space-id' },
};

export const contentfulEnvironmentLink: SysLink = {
  sys: { id: 'env-id', type: 'Link', linkType: 'Environment' },
};

export const contenfulUserLink: Link<'User'> = {
  sys: { type: 'Link', linkType: 'User', id: 'user-id' },
};

type Field = Record<string, any>;

export const getEntry = (fields: Field): Entry => ({
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
    space: contenfulSpaceLink,
    id: 'entry-id',
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
  fields,
});

export const newsEntry = getEntry({
  title: { 'en-US': 'Amazing News' },
  shortText: { 'en-US': null },
  thumbnail: { 'en-US': null },
  frequency: { 'en-US': 'News Articles' },
  link: { 'en-US': null },
  linkText: { 'en-US': null },
  text: { 'en-US': { data: {}, content: [], nodeType: 'document' } },
});
