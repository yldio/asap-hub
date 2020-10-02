import { CMSUser } from '../../../src/entities';
import { ListUserResponse } from '@asap-hub/model';

export const response: { total: number; items: CMSUser[] } = {
  total: 2,
  items: [
    {
      id: 'uuid-1',
      lastModified: '2020-09-25T11:06:27.164Z',
      created: '2020-09-24T11:06:27.164Z',
      data: {
        lastModifiedDate: { iv: '2020-09-25T11:06:27.164Z' },
        displayName: { iv: 'Name' },
        email: { iv: 'me@example.com' },
        firstName: { iv: 'First' },
        lastName: { iv: 'Last' },
        jobTitle: { iv: 'Title' },
        institution: { iv: 'Institution' },
        connections: { iv: [] },
        biography: { iv: 'Biography' },
        location: { iv: 'Lisbon, Portugal' },
      },
    },
    {
      id: 'uuid-2',
      lastModified: '2020-09-25T11:06:27.164Z',
      created: '2020-09-24T11:06:27.164Z',
      data: {
        lastModifiedDate: { iv: '2020-09-25T11:06:27.164Z' },
        displayName: { iv: 'Name' },
        email: { iv: 'me@example.com' },
        firstName: { iv: 'First' },
        lastName: { iv: 'Last' },
        jobTitle: { iv: 'Title' },
        institution: { iv: 'Institution' },
        connections: { iv: [] },
        biography: { iv: 'Biography' },
        questions: { iv: [{ question: 'Question?' }] },
        location: { iv: 'OPorto, Portugal' },
      },
    },
  ],
};

export const expectation: ListUserResponse = {
  total: 2,
  items: [
    {
      id: 'uuid-1',
      createdDate: '2020-09-24T11:06:27.164Z',
      lastModifiedDate: '2020-09-25T11:06:27.164Z',
      displayName: 'Name',
      email: 'me@example.com',
      firstName: 'First',
      lastName: 'Last',
      jobTitle: 'Title',
      institution: 'Institution',
      biography: 'Biography',
      location: 'Lisbon, Portugal',
      teams: [],
      skills: [],
      questions: [],
    },
    {
      id: 'uuid-2',
      createdDate: '2020-09-24T11:06:27.164Z',
      lastModifiedDate: '2020-09-25T11:06:27.164Z',
      displayName: 'Name',
      email: 'me@example.com',
      firstName: 'First',
      lastName: 'Last',
      jobTitle: 'Title',
      institution: 'Institution',
      biography: 'Biography',
      location: 'OPorto, Portugal',
      teams: [],
      skills: [],
      questions: ['Question?'],
    },
  ],
};
