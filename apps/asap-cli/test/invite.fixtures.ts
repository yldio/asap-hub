import { RestTeam, RestUser } from '@asap-hub/squidex';

export const fetchUsersResponse: { total: number; items: RestUser[] } = {
  total: 200,
  items: [
    {
      id: 'userId1',
      lastModified: '2020-09-25T11:06:27.164Z',
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
        location: { iv: 'Lisbon, Portugal' },
        teams: { iv: [] },
        questions: { iv: [] },
        skills: { iv: [] },
        role: { iv: 'Grantee' },
        onboarded: {
          iv: true,
        },
      },
    },
    {
      id: 'userId2',
      lastModified: '2020-09-25T11:06:27.164Z',
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
        location: { iv: 'OPorto, Portugal' },
        teams: { iv: [] },
        skills: { iv: [] },
        role: { iv: 'Grantee' },
        onboarded: {
          iv: true,
        },
      },
    },
    {
      id: 'userId3',
      lastModified: '2020-09-25T11:06:27.164Z',
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
        location: { iv: 'OPorto, Portugal' },
        teams: { iv: [] },
        skills: { iv: [] },
        role: { iv: 'Grantee' },
        onboarded: {
          iv: true,
        },
      },
    },
  ],
};

export const getFetchUsersWithTeamsResponse: () => {
  total: number;
  items: RestUser[];
} = () => ({
  total: 3,
  items: [
    {
      ...fetchUsersResponse.items[0],
      data: {
        ...fetchUsersResponse.items[0].data,
        teams: {
          iv: [
            {
              id: ['team-id-1'],
              role: 'Project Manager',
            },
          ],
        },
      },
    },
    {
      ...fetchUsersResponse.items[1],
      data: {
        ...fetchUsersResponse.items[1].data,
        teams: {
          iv: [
            {
              id: ['team-id-2'],
              role: 'Collaborating PI',
            },
          ],
        },
      },
    },
  ],
});

export const getListTeamResponse: () => {
  total: number;
  items: RestTeam[];
} = () => ({
  total: 2,
  items: [
    {
      id: 'team-id-1',
      data: {
        displayName: { iv: 'Team 1' },
        applicationNumber: { iv: 'hofded' },
        projectTitle: {
          iv: 'Ce fe kok ob lovkad pim cukiviw lakwujuz vilid camiduci nim ca perkeb mekkaho wuculate re huppoljop.',
        },
        projectSummary: {
          iv: 'Wi dalev fu jusjuh buw nauzi kas ma. Fo ajelo pu vaenusug ezuhsi resdudif ebsofak tav dan mumooz awgabu meki gicub bowec afegeir tozab umefarow.',
        },
        skills: { iv: [] },
        outputs: { iv: [] },
        tools: { iv: [] },
      },
      created: '2020-09-08T16:35:28Z',
      lastModified: '2020-09-08T16:35:28Z',
    },
    {
      id: 'team-id-2',
      data: {
        displayName: { iv: 'Team 2' },
        applicationNumber: { iv: 'hofded' },
        projectTitle: {
          iv: 'Ce fe kok ob lovkad pim cukiviw lakwujuz vilid camiduci nim ca perkeb mekkaho wuculate re huppoljop.',
        },
        projectSummary: {
          iv: 'Wi dalev fu jusjuh buw nauzi kas ma. Fo ajelo pu vaenusug ezuhsi resdudif ebsofak tav dan mumooz awgabu meki gicub bowec afegeir tozab umefarow.',
        },
        skills: { iv: [] },
        outputs: { iv: [] },
        tools: { iv: [] },
      },
      created: '2020-09-08T16:35:28Z',
      lastModified: '2020-09-08T16:35:28Z',
    },
  ],
});
