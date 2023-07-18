import supertest from 'supertest';
import { Express } from 'express';

import { AppHelper } from '../helpers/app';
import { retryable } from '../helpers/retryable';
import {
  FixtureFactory,
  getUserFixture,
  getTeamFixture,
  getInterestGroupFixture,
  UserFixture,
} from '../fixtures';

jest.setTimeout(120000);

const fixtures = FixtureFactory(process.env.INTEGRATION_TEST_CMS);

describe('team', () => {
  let app: Express;
  let loggedInUser: UserFixture;

  beforeAll(async () => {
    loggedInUser = await fixtures.createUser(getUserFixture());
    app = AppHelper(() => loggedInUser);
  });

  afterAll(async () => {
    await fixtures.teardown();
  });

  test('can fetch a list of teams', async () => {
    await retryable(async () => {
      const response = await supertest(app).get('/teams').expect(200);
      expect(response.body.total).toEqual(expect.any(Number));
      expect(response.body.items).toEqual(expect.any(Array));
    });
  });

  test('can fetch a team with users', async () => {
    const team = await fixtures.createTeam(getTeamFixture());
    const user1 = await fixtures.createUser(
      getUserFixture({
        teams: [
          {
            id: team.id,
            role: 'Project Manager',
          },
        ],
      }),
    );
    const user2 = await fixtures.createUser(
      getUserFixture({
        teams: [
          {
            id: team.id,
            role: 'Key Personnel',
          },
        ],
      }),
    );
    await retryable(async () => {
      const response = await supertest(app)
        .get(`/teams/${team.id}`)
        .expect(200);
      expect(response.body).toMatchObject({
        id: team.id,
        displayName: team.displayName,
        members: [{ id: user1.id }, { id: user2.id }],
      });
    });
  });

  test('can get the interest groups for a team', async () => {
    const team = await fixtures.createTeam(getTeamFixture());
    await fixtures.createInterestGroup(
      getInterestGroupFixture({
        name: 'Not associated',
      }),
    );
    const group = await fixtures.createInterestGroup(
      getInterestGroupFixture({
        name: 'Is associated',
        teams: [
          {
            id: team.id,
          },
        ],
      }),
    );
    await retryable(async () => {
      const response = await supertest(app)
        .get(`/teams/${team.id}/groups`)
        .expect(200);
      expect(response.body.items).toHaveLength(1);
      expect(response.body.items).toMatchObject([
        expect.objectContaining({
          id: group.id,
          name: 'Is associated',
        }),
      ]);
    });
  });
});
