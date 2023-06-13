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

export const eventEntry = getEntry({
  title: {
    'en-US': 'Amazing event!!!',
  },
  startDate: {
    'en-US': '2023-05-19T16:00:00.000Z',
  },
  status: {
    'en-US': 'Confirmed',
  },
  calendar: {
    'en-US': {
      sys: {
        type: 'Link',
        linkType: 'Entry',
        id: '5Lf3bplTANrkNERCosjwvO',
      },
    },
  },
  hidden: {
    'en-US': false,
  },
  hideMeetingLink: {
    'en-US': false,
  },
  notesPermanentlyUnavailable: {
    'en-US': false,
  },
  videoRecordingPermanentlyUnavailable: {
    'en-US': false,
  },
  presentationPermanentlyUnavailable: {
    'en-US': false,
  },
  meetingMaterialsPermanentlyUnavailable: {
    'en-US': false,
  },
  startDateTimeZone: {
    'en-US': 'America/Sao_Paulo',
  },
  endDate: {
    'en-US': '2023-05-19T17:00:00.000Z',
  },
  endDateTimeZone: {
    'en-US': 'America/Sao_Paulo',
  },
  googleId: {
    'en-US': '1jhm4181bs6ck0esegje4nf6ur',
  },
});

export const interestGroupEntry = getEntry({
  name: { 'en-US': 'Test Group' },
  description: { 'en-US': 'Group description' },
  active: { 'en-US': true },
});

export const interestGroupLeaderEntry = getEntry({
  role: { 'en-US': 'Project Manager' },
  inactiveSinceDate: null,
  user: userEntry,
});

export const tutorialEntry = getEntry({
  title: { 'en-US': 'Tutorial' },
  shortText: { 'en-US': 'Short Text' },
  link: { 'en-US': 'https://example.com' },
  linkText: { 'en-US': 'Example Dot Com' },
  text: { 'en-US': { data: {}, content: [], nodeType: 'document' } },
  thumbnail: { 'en-US': null },
});

export const discoverEntry = getEntry({
  members: { 'en-US': [] },
  training: { 'en-US': [] },
  scientificAdvisoryBoard: { 'en-US': [] },
  pages: { 'en-US': [] },
  membersTeam: { 'en-US': null },
  aboutUs: { 'en-US': null },
});
