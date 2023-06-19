import Chance from 'chance';
import supertest from 'supertest';
import { Express } from 'express';
import { v4 as uuid } from 'uuid';

import { addLocaleToFields, getLinkEntity } from '@asap-hub/contentful';
import { UserResponse } from '@asap-hub/model';

import { appFactory } from '../../../src/app';
import { getEnvironment, TestEnvironment } from '../../helpers/contentful';
import { retryable } from '../../helpers/retryable';

jest.mock('../../../src/config', () => ({
  ...jest.requireActual('../../../src/config'),
  logLevel: 'silent',
}));

const chance = Chance();

const getUser = (props = {}) => ({
  firstName: chance.first(),
  lastName: chance.last(),
  email: chance.email(),
  role: 'Guest',
  onboarded: true,
  ...props,
});

jest.setTimeout(120000);

describe('users', () => {
  let app: Express;
  let environment: TestEnvironment;
  const loggedInUserId = uuid();

  beforeAll(async () => {
    environment = await getEnvironment();
    app = appFactory({
      authHandler: (req, _res, next) => {
        req.loggedInUser = {
          onboarded: true,
          id: loggedInUserId,
        } as UserResponse;
        next();
      },
    });
    const loggedIn = await environment.createEntryWithId(
      'users',
      loggedInUserId,
      {
        fields: addLocaleToFields(getUser()),
      },
    );
    await loggedIn.publish();
  });

  afterAll(async () => {
    await environment.teardown();
  });

  test('can fetch a list of users', async () => {
    await retryable(async () => {
      const response = await supertest(app).get('/users').expect(200);
      expect(response.body.total).toEqual(expect.any(Number));
      expect(response.body.items).toEqual(expect.any(Array));
    });
  });

  test('can fetch user', async () => {
    const fields = getUser();
    const user = await environment.createEntry('users', {
      fields: addLocaleToFields(fields),
    });
    await user.publish();
    await retryable(async () => {
      const response = await supertest(app)
        .get(`/users/${user.sys.id}`)
        .expect(200);
      expect(response.body).toMatchObject(fields);
    });
  });

  test('cannot fetch user if they are not onboarded', async () => {
    const fields = getUser({
      onboarded: false,
    });
    const user = await environment.createEntry('users', {
      fields: addLocaleToFields(fields),
    });
    await user.publish();
    await retryable(async () => {
      await supertest(app).get(`/users/${user.sys.id}`).expect(404);
    });
  });

  test('can fetch a user by connection code', async () => {
    const code = uuid();
    const fields = getUser({
      connections: [code],
    });
    const user = await environment.createEntry('users', {
      fields: addLocaleToFields(fields),
    });
    await user.publish();
    await retryable(async () => {
      const response = await supertest(app)
        .get(`/users/invites/${code}`)
        .expect(200);
      expect(response.body.id).toEqual(user.sys.id);
    });
  });

  test('can fetch the groups for a user', async () => {
    const fields = getUser();
    const user = await environment.createEntry('users', {
      fields: addLocaleToFields(fields),
    });
    await user.publish();
    const leader = await environment.createEntry('interestGroupLeaders', {
      fields: addLocaleToFields({
        role: 'Chair',
        inactiveSinceDate: null,
        user: getLinkEntity(user.sys.id),
      }),
    });
    await leader.publish();
    const group = await environment.createEntry('interestGroups', {
      fields: addLocaleToFields({
        name: 'Test interest group',
        active: true,
        leaders: [getLinkEntity(leader.sys.id)],
      }),
    });
    await group.publish();
    await retryable(async () => {
      const response = await supertest(app)
        .get(`/users/${user.sys.id}/groups`)
        .expect(200);
      expect(response.body.total).toEqual(1);
      expect(response.body.items).toEqual([
        expect.objectContaining({ name: 'Test interest group', active: true }),
      ]);
    });
  });

  test('can patch the logged-in user', async () => {
    await supertest(app)
      .patch(`/users/${loggedInUserId}`)
      .send({ firstName: 'Changed' })
      .expect(200);

    await retryable(async () => {
      const response = await supertest(app)
        .get(`/users/${loggedInUserId}`)
        .expect(200);
      expect(response.body.firstName).toEqual('Changed');
    });
  });

  test('cannot patch a non-logged-in user', async () => {
    const fields = getUser();
    const user = await environment.createEntry('users', {
      fields: addLocaleToFields(fields),
    });
    await user.publish();

    await supertest(app)
      .patch(`/users/${user.sys.id}`)
      .send({ firstName: 'Changed' })
      .expect(403);
  });
});
