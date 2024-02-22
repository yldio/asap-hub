import supertest from 'supertest';
import { Express } from 'express';

import { PAGE_SIZE } from '../../scripts/export-entity';
import { AppHelper } from './helpers/app';
import { FixtureFactory, getUserFixture, UserFixture } from './fixtures';

const fixtures = FixtureFactory();

describe('events', () => {
  let app: Express;
  let loggedInUser: UserFixture;

  beforeAll(async () => {
    loggedInUser = await fixtures.createUser(getUserFixture());
    app = AppHelper(() => loggedInUser);
  });

  test('can fetch a list of events', async () => {
    await supertest(app).get('/events').query({ take: PAGE_SIZE }).expect(200);
  });
});
