import supertest from 'supertest';
import { Express } from 'express';

import { PAGE_SIZE } from '../../../scripts/export-entity';
import { AppHelper } from '../helpers/app';
import { FixtureFactory, getUserFixture, UserFixture } from '../fixtures';

jest.setTimeout(120000);

const fixtures = FixtureFactory(process.env.INTEGRATION_TEST_CMS);

describe('events', () => {
  let app: Express;
  let loggedInUser: UserFixture;

  beforeAll(async () => {
    loggedInUser = await fixtures.createUser(getUserFixture());
    app = AppHelper(() => loggedInUser);
  });

  afterAll(async () => {
    await fixtures.teardown();
  });

  test('can fetch a list of events', async () => {
    await supertest(app).get('/events').query({ take: PAGE_SIZE }).expect(200);
  });
});
