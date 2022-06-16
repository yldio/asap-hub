import nock from 'nock';
import { join } from 'path';
import { identity } from '../helpers/squidex';
import { users as importUsers } from '../../src/import';
import { fetchTeamsResponse, fetchUsersResponse } from './users.fixtures';
import { appName, baseUrl } from '../../src/config';

const body = {
  email: {
    iv: 'john@doe.com',
  },
  firstName: {
    iv: 'John',
  },
  lastName: {
    iv: 'Doe',
  },
  jobTitle: {
    iv: 'CEO',
  },
  institution: {
    iv: 'ACME',
  },
  expertiseAndResourceDescription: {
    iv: 'Expertise',
  },
  biography: {
    iv: 'Biography',
  },
  degree: {
    iv: 'PhD',
  },
  expertiseAndResourceTags: {
    iv: ['aggregation', 'alpha-synuclein interactions'],
  },
  questions: {
    iv: [
      {
        question: 'Question 1',
      },
      {
        question: 'Question 2',
      },
      {
        question: 'Question 3',
      },
    ],
  },
  orcid: {
    iv: '0000-0000-0000-0000',
  },
  social: {
    iv: [
      {
        website1: 'https://google.com',
      },
    ],
  },
  onboarded: {
    iv: true,
  },
  labs: {
    iv: [],
  },
  researchInterests: { iv: 'Research Interests' },
  responsibilities: { iv: 'Responsibilities' },
};

describe('Import user', () => {
  beforeAll(() => {
    identity();
  });

  afterEach(() => {
    expect(nock.isDone()).toBe(true);
  });

  test('create user in squidex', async () => {
    nock(baseUrl)
      .post(`/api/content/${appName}/users?publish=true`, {
        ...body,
        avatar: {
          iv: [],
        },
        teams: {
          iv: [],
        },
        connections: {
          iv: [],
        },
        role: {
          iv: 'Staff',
        },
      })
      .reply(200, fetchUsersResponse.items[0]);

    await importUsers(join(__dirname, 'user.fixture.csv'));
  });

  test('upsert user in squidex', async () => {
    nock(baseUrl)
      .post(`/api/content/${appName}/users?publish=true`, {
        ...body,
        avatar: {
          iv: [],
        },
        teams: {
          iv: [],
        },
        connections: {
          iv: [],
        },
        role: {
          iv: 'Staff',
        },
      })
      .reply(400)
      .get(`/api/content/${appName}/users`)
      .query({
        q: JSON.stringify({
          take: 1,
          filter: {
            op: 'eq',
            path: 'data.email.iv',
            value: 'john@doe.com',
          },
        }),
      })
      .reply(200, { items: [fetchUsersResponse.items[0]] })
      .patch(`/api/content/${appName}/users/userId1`, {
        ...body,
        role: {
          iv: 'Staff',
        },
      })
      .reply(200, fetchUsersResponse.items[0]);

    await importUsers(join(__dirname, 'user.fixture.csv'));
  });

  test('create user and team in squidex', async () => {
    nock(baseUrl)
      .post(`/api/content/${appName}/users?publish=true`)
      .reply(200, fetchUsersResponse.items[0])
      .post(`/api/content/${appName}/teams?publish=true`)
      .reply(200, fetchTeamsResponse.items[0])
      .patch(`/api/content/${appName}/users/userId1`, {
        email: {
          iv: fetchUsersResponse.items[0].data.email.iv,
        },
        teams: {
          iv: [
            {
              id: ['team-uuid-1'],
              role: 'Lead PI (Core Leadership)',
            },
          ],
        },
      })
      .reply(200, fetchUsersResponse.items[0]);

    await importUsers(join(__dirname, 'user-membership.fixture.csv'));
  });
});
