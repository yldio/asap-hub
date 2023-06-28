import supertest from 'supertest';
import { Express } from 'express';
import { UserResponse } from '@asap-hub/model';

import { appFactory } from '../../../src/app';
import { retryable } from '../../helpers/retryable';
import {
  FixtureFactory,
  getUserFixture,
  UserFixture,
  getTeamFixture,
  getResearchOutputFixture,
} from '../fixtures';

jest.mock('../../../src/config', () => ({
  ...jest.requireActual('../../../src/config'),
  isContentfulEnabledV2:
    process.env.INTEGRATION_TEST_CMS === 'contentful' ? 'true' : undefined,
  logLevel: 'silent',
}));

jest.setTimeout(120000);

const fixtures = FixtureFactory(process.env.INTEGRATION_TEST_CMS);

describe('research outputs', () => {
  let app: Express;
  let loggedInUser: UserFixture;

  beforeAll(async () => {
    app = appFactory({
      authHandler: (req, _res, next) => {
        req.loggedInUser = loggedInUser as UserResponse;
        next();
      },
    });
  });

  afterAll(async () => {
    await fixtures.teardown();
  });

  test('can create a draft research output as a non-PM', async () => {
    const team = await fixtures.createTeam(getTeamFixture());
    loggedInUser = await fixtures.createUser(
      getUserFixture({
        teams: [
          {
            id: team.id,
            role: 'Key Personnel',
          },
        ],
      }),
    );
    const input = getResearchOutputFixture({
      teams: [team.id],
      published: false,
    });

    const response = await supertest(app)
      .post('/research-outputs')
      .send(input)
      .expect(201);

    expect(response.body.title).toEqual(input.title);
    expect(response.body.published).toEqual(false);
  });

  test('can create a published research output as a PM', async () => {
    const team = await fixtures.createTeam(getTeamFixture());
    loggedInUser = await fixtures.createUser(
      getUserFixture({
        teams: [
          {
            id: team.id,
            role: 'Project Manager',
          },
        ],
      }),
    );
    const input = getResearchOutputFixture({
      teams: [team.id],
      published: true,
    });

    const response = await supertest(app)
      .post('/research-outputs')
      .send(input)
      .expect(201);

    expect(response.body.title).toEqual(input.title);
    expect(response.body.published).toEqual(true);
  });

  test('cannot create a published research output as a non-PM', async () => {
    const team = await fixtures.createTeam(getTeamFixture());
    loggedInUser = await fixtures.createUser(
      getUserFixture({
        teams: [
          {
            id: team.id,
            role: 'Key Personnel',
          },
        ],
      }),
    );
    const input = getResearchOutputFixture({
      teams: [team.id],
      published: true,
    });

    await supertest(app).post('/research-outputs').send(input).expect(403);
  });

  test('can list research outputs', async () => {
    loggedInUser = await fixtures.createUser(getUserFixture());
    const response = await supertest(app).get('/research-outputs').expect(200);

    expect(response.body.total).toEqual(expect.any(Number));
    expect(response.body.items).toEqual(expect.any(Array));
  });

  test('can list draft research outputs for a team you are a member of', async () => {
    const team = await fixtures.createTeam(getTeamFixture());
    loggedInUser = await fixtures.createUser(
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
        .get(`/research-outputs?teamId=${team.id}&status=draft`)
        .expect(200);

      expect(response.body.total).toEqual(0);
      expect(response.body.items).toEqual([]);
    });
  });

  test('cannot list draft research outputs for a team you are not a member of', async () => {
    const team = await fixtures.createTeam(getTeamFixture());
    loggedInUser = await fixtures.createUser(getUserFixture());
    await supertest(app)
      .get(`/research-outputs?teamId=${team.id}&status=draft`)
      .expect(403);
  });
});
