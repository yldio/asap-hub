import supertest from 'supertest';
import { Express } from 'express';

import { AppHelper } from '../helpers/app';
import { FixtureFactory, getUserFixture, UserFixture } from '../fixtures';

jest.setTimeout(120000);

const fixtures = FixtureFactory(process.env.INTEGRATION_TEST_CMS);

describe('research tags', () => {
  let app: Express;
  let loggedInUser: UserFixture;

  beforeAll(async () => {
    loggedInUser = await fixtures.createUser(getUserFixture());
    app = AppHelper(() => loggedInUser);
  });

  afterAll(async () => {
    await fixtures.teardown();
  });

  test('can fetch a list of research tags', async () => {
    const response = await supertest(app).get('/research-tags').expect(200);

    expect(response.body.total).toEqual(expect.any(Number));
    expect(response.body.items).toEqual(expect.any(Array));
  });
});
