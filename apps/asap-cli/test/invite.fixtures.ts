export const fetchUsersResponse: { total: number; items: object[] } = {
  total: 200,
  items: [
    {
      id: 'userId1',
      lastModified: '2020-09-25T11:06:27.164Z',
      created: '2020-09-24T11:06:27.164Z',
      data: {
        lastModifiedDate: { iv: '2020-09-25T11:06:27.164Z' },
        displayName: { iv: 'TestUser' },
        email: { iv: 'testUser@asap.science' },
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
      id: 'userId2',
      lastModified: '2020-09-25T11:06:27.164Z',
      created: '2020-09-24T11:06:27.164Z',
      data: {
        lastModifiedDate: { iv: '2020-09-25T11:06:27.164Z' },
        displayName: { iv: 'TestUser' },
        email: { iv: 'testUser@asap.science' },
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
    {
      id: 'userId3',
      lastModified: '2020-09-25T11:06:27.164Z',
      created: '2020-09-24T11:06:27.164Z',
      data: {
        lastModifiedDate: { iv: '2020-09-25T11:06:27.164Z' },
        displayName: { iv: 'TestUser' },
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
      },
    },
  ],
};
