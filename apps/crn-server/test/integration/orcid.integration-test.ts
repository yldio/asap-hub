import nock from 'nock';
import supertest from 'supertest';
import Chance from 'chance';
import { DateTime, Settings } from 'luxon';
import { unloggedHandler } from '../../src/handlers/webhooks/cronjob-sync-orcid';
import { AppHelper } from './helpers/app';
import { FixtureFactory, getUserFixture } from './fixtures';
import { retryable } from './helpers/retryable';
import './helpers/matchers';

jest.setTimeout(120000);

const fixtures = FixtureFactory();
const chance = Chance();

describe('orcid handler', () => {
  beforeAll(() => {
    nock('https://pub.orcid.org')
      .get(/v2\.1\/.*\/works/)
      .reply(200, {
        'last-modified-date': { value: 23423423 },
        group: [],
        path: '',
      });
  });

  test('should fetch a list of users and update their orcids', async () => {
    // set current time to year 2000
    // that way when we look for users whose orcid data
    // has not been synced in the last month
    // we will not get any of the data that has been created
    // through normal app use
    const customDate = new Date('2000-07-06T09:21:23.000Z');
    const overAMonthBeforeCustomDate = DateTime.fromJSDate(customDate)
      .minus({ days: 1, months: 1 })
      .toJSDate();

    // mocking luxon only because using fake timers causes
    // all of our retryable and throttled functions to freeze
    Settings.now = () => DateTime.fromJSDate(customDate).toMillis();

    const user = await fixtures.createUser(
      getUserFixture({
        orcidLastSyncDate: overAMonthBeforeCustomDate.toISOString(),
        orcid: `${chance.pad(
          chance.integer({ max: 9999, min: 0 }),
          4,
        )}-${chance.pad(chance.integer({ max: 9999, min: 0 }), 4)}-${chance.pad(
          chance.integer({ max: 9999, min: 0 }),
          4,
        )}-${chance.pad(chance.integer({ max: 9999, min: 0 }), 4)}`,
      }),
    );

    const response = await unloggedHandler();
    expect(response.statusCode).toBe(200);

    const app = AppHelper(() => user);

    await retryable(async () => {
      const response = await supertest(app).get(`/users/${user.id}`);

      expect(response.body.orcidLastSyncDate).toBeCloseInTimeTo(
        new Date().toString(),
        30000,
      );
    });
  });
});
