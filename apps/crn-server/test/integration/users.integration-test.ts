import supertest from 'supertest';
import { Express } from 'express';
import { v4 as uuid } from 'uuid';
import { omit } from 'lodash';

import { PAGE_SIZE } from '../../scripts/export-entity';
import { AppHelper } from './helpers/app';
import { retryable } from './helpers/retryable';
import {
  FixtureFactory,
  getUserFixture,
  getTeamFixture,
  getInterestGroupFixture,
  getWorkingGroupFixture,
  UserFixture,
} from './fixtures';

jest.setTimeout(120000);

const fixtures = FixtureFactory();

describe('users', () => {
  let app: Express;
  let loggedInUser: UserFixture;

  beforeAll(async () => {
    loggedInUser = await fixtures.createUser(getUserFixture());
    app = AppHelper(() => loggedInUser);
  });

  test('can fetch a list of users', async () => {
    await retryable(async () => {
      const response = await supertest(app)
        .get('/users')
        .query({ take: PAGE_SIZE })
        .expect(200);
      expect(response.body.total).toEqual(expect.any(Number));
      expect(response.body.items).toEqual(expect.any(Array));
    });
  });

  test('can fetch a user with a team', async () => {
    const team = await fixtures.createTeam(getTeamFixture());
    const user = await fixtures.createUser(
      getUserFixture({
        teams: [
          {
            id: team.id,
            role: 'Project Manager',
          },
        ],
      }),
    );
    await retryable(async () => {
      const response = await supertest(app)
        .get(`/users/${user.id}`)
        .expect(200);
      expect(response.body).toMatchObject(
        omit(user, ['connections', 'lastUpdated']),
      );
    });
  });

  test('can fetch a user with a working group', async () => {
    const user = await fixtures.createUser(getUserFixture({}));
    const workingGroup = await fixtures.createWorkingGroup(
      getWorkingGroupFixture({
        leaders: [
          {
            user: user.id,
            role: 'Project Manager',
            workstreamRole: 'Test',
          },
        ],
      }),
    );
    await retryable(async () => {
      const response = await supertest(app)
        .get(`/users/${user.id}`)
        .expect(200);

      expect(response.body.workingGroups.length).toEqual(1);
      expect(response.body.workingGroups[0].name).toEqual(workingGroup.title);
    });
  });

  test('cannot fetch user if they are not onboarded', async () => {
    const user = await fixtures.createUser(
      getUserFixture({
        onboarded: false,
      }),
    );
    await retryable(async () => {
      await supertest(app).get(`/users/${user.id}`).expect(404);
    });
  });

  test('can fetch a user by connection code', async () => {
    const code = uuid();
    const user = await fixtures.createUser(
      getUserFixture({
        connections: [{ code }],
      }),
    );
    await retryable(async () => {
      const response = await supertest(app)
        .get(`/users/invites/${code}`)
        .expect(200);
      expect(response.body.id).toEqual(user.id);
    });
  });

  test('can fetch the groups for a user who is a group leader', async () => {
    const team = await fixtures.createTeam(getTeamFixture());
    const user = await fixtures.createUser(
      getUserFixture({
        teams: [{ id: team.id, role: 'Project Manager' }],
      }),
    );
    const group = await fixtures.createInterestGroup(
      getInterestGroupFixture({
        name: 'Test interest group (leader)',
        active: true,
        leaders: [
          {
            user: user.id,
            role: 'Chair',
          },
        ],
      }),
    );
    await retryable(async () => {
      const response = await supertest(app)
        .get(`/users/${user.id}/interest-groups`)
        .expect(200);

      expect(response.body.total).toEqual(1);
      expect(response.body.items).toEqual([
        expect.objectContaining({
          id: group.id,
          name: 'Test interest group (leader)',
          active: true,
        }),
      ]);
    });
  });

  test('can fetch the groups for a user who is associated via a team', async () => {
    const team = await fixtures.createTeam(getTeamFixture());
    const user = await fixtures.createUser(
      getUserFixture({
        teams: [{ id: team.id, role: 'Project Manager' }],
      }),
    );
    const group = await fixtures.createInterestGroup(
      getInterestGroupFixture({
        name: 'Test interest group (team)',
        active: true,
        teams: [
          {
            id: team.id,
          },
        ],
      }),
    );
    await retryable(async () => {
      const response = await supertest(app)
        .get(`/users/${user.id}/interest-groups`)
        .expect(200);
      expect(response.body.total).toEqual(1);
      expect(response.body.items).toEqual([
        expect.objectContaining({
          id: group.id,
          name: 'Test interest group (team)',
          active: true,
        }),
      ]);
    });
  });

  test('dedupes groups if a user is associated by team and leadership', async () => {
    const team = await fixtures.createTeam(getTeamFixture());
    const user = await fixtures.createUser(
      getUserFixture({
        teams: [{ id: team.id, role: 'Project Manager' }],
      }),
    );
    const group = await fixtures.createInterestGroup(
      getInterestGroupFixture({
        name: 'Test interest group (team and leader)',
        active: true,
        leaders: [
          {
            user: user.id,
            role: 'Chair',
          },
        ],
        teams: [
          {
            id: team.id,
          },
        ],
      }),
    );
    await retryable(async () => {
      const response = await supertest(app)
        .get(`/users/${user.id}/interest-groups`)
        .expect(200);
      expect(response.body.total).toEqual(1);
      expect(response.body.items).toEqual([
        expect.objectContaining({
          id: group.id,
          name: 'Test interest group (team and leader)',
          active: true,
        }),
      ]);
    });
  });

  test('can patch the logged-in user', async () => {
    await supertest(app)
      .patch(`/users/${loggedInUser.id}`)
      .send({ firstName: 'Changed' })
      .expect(200);

    await retryable(async () => {
      const response = await supertest(app)
        .get(`/users/${loggedInUser.id}`)
        .expect(200);
      expect(response.body.firstName).toEqual('Changed');
    });
  });

  test('cannot patch a non-logged-in user', async () => {
    const user = await fixtures.createUser(getUserFixture());

    await supertest(app)
      .patch(`/users/${user.id}`)
      .send({ firstName: 'Changed' })
      .expect(403);
  });
});
