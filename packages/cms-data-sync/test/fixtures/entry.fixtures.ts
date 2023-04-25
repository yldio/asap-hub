import { Entry } from 'contentful-management';
import {
  contenfulSpaceLink,
  contentfulEnvironmentLink,
  contenfulUserLink,
} from './';

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

export const teamEntry = getEntry({
  displayName: { 'en-US': 'Team ASAP' },
  applicationNumber: { 'en-US': 2023 },
  expertiseAndResourceTags: { 'en-US': undefined },
  inactiveSince: { 'en-US': undefined },
  projectSummary: { 'en-US': undefined },
  projectTitle: { 'en-US': 'Beautiful Title' },
  tools: { 'en-US': [] },
});

export const externalAuthorEntry = getEntry({
  name: { 'en-US': 'External Person' },
  orcid: { 'en-US': '0000-0000-0000-0000' },
});

export const calendarEntry = getEntry({
  googleCalendarId: { 'en-US': '3@group.calendar.google.com' },
  color: { 'en-US': '#2952A3' },
  name: { 'en-US': 'Tech 4a - iPSCs - 3D & Co-cultures' },
});

export const userEntry = getEntry({
  firstName: { 'en-US': 'Test' },
  lastName: { 'en-US': 'User' },
  email: { 'en-US': 'test@example.com' },
});

export const teamMembershipEntry = getEntry({
  role: 'Project Manager',
  inactiveSinceDate: '2021-12-23T12:00:00.000Z',
});

export const labEntry = getEntry({
  name: { 'en-US': 'Test' },
});
