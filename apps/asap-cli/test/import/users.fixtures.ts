import { RestTeam, RestUser } from '@asap-hub/squidex';

export const fetchTeamsResponse: { total: number; items: RestTeam[] } = {
  total: 1,
  items: [
    {
      id: 'team-uuid-1',
      lastModified: '2020-09-25T11:06:27.164Z',
      version: 42,
      created: '2020-09-24T11:06:27.164Z',
      data: {
        displayName: { iv: 'team' },
        active: { iv: true },
        applicationNumber: { iv: 'app' },
        projectTitle: { iv: 'title' },
        expertiseAndResourceTags: { iv: [] },
      },
    },
  ],
};

export const fetchUsersResponse: { total: number; items: RestUser[] } = {
  total: 200,
  items: [
    {
      id: 'userId1',
      lastModified: '2020-09-25T11:06:27.164Z',
      version: 42,
      created: '2020-09-24T11:06:27.164Z',
      data: {
        avatar: { iv: [] },
        lastModifiedDate: { iv: '2020-09-25T11:06:27.164Z' },
        email: { iv: 'testUser@asap.science' },
        firstName: { iv: 'First' },
        lastName: { iv: 'Last' },
        jobTitle: { iv: 'Title' },
        institution: { iv: 'Institution' },
        connections: { iv: [] },
        biography: { iv: 'Biography' },
        teams: { iv: [] },
        questions: { iv: [] },
        expertiseAndResourceTags: { iv: [] },
        role: { iv: 'Grantee' },
        onboarded: {
          iv: true,
        },
        dismissedGettingStarted: {
          iv: false,
        },
        labs: { iv: [] },
      },
    },
    {
      id: 'userId2',
      lastModified: '2020-09-25T11:06:27.164Z',
      version: 42,
      created: '2020-09-24T11:06:27.164Z',
      data: {
        avatar: { iv: [] },
        lastModifiedDate: { iv: '2020-09-25T11:06:27.164Z' },
        email: { iv: 'testUser@asap.science' },
        firstName: { iv: 'First' },
        lastName: { iv: 'Last' },
        jobTitle: { iv: 'Title' },
        institution: { iv: 'Institution' },
        connections: { iv: [] },
        biography: { iv: 'Biography' },
        questions: { iv: [{ question: 'Question?' }] },
        teams: { iv: [] },
        expertiseAndResourceTags: { iv: [] },
        role: { iv: 'Grantee' },
        onboarded: {
          iv: true,
        },
        dismissedGettingStarted: {
          iv: false,
        },
        labs: { iv: [] },
      },
    },
    {
      id: 'userId3',
      lastModified: '2020-09-25T11:06:27.164Z',
      version: 42,
      created: '2020-09-24T11:06:27.164Z',
      data: {
        avatar: { iv: [] },
        lastModifiedDate: { iv: '2020-09-25T11:06:27.164Z' },
        email: { iv: 'me@example.com' },
        firstName: { iv: 'First' },
        lastName: { iv: 'Last' },
        jobTitle: { iv: 'Title' },
        institution: { iv: 'Institution' },
        connections: {
          iv: [
            {
              code: 'ALREADY_HAS_CODE',
            },
          ],
        },
        biography: { iv: 'Biography' },
        questions: { iv: [{ question: 'Question?' }] },
        teams: { iv: [] },
        expertiseAndResourceTags: { iv: [] },
        role: { iv: 'Grantee' },
        onboarded: {
          iv: true,
        },
        dismissedGettingStarted: {
          iv: false,
        },
        labs: { iv: [] },
      },
    },
  ],
};
