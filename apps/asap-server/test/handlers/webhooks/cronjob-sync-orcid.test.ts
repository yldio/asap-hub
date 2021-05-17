import nock from 'nock';
import matches from 'lodash.matches';
import { config } from '@asap-hub/squidex';

import { handler } from '../../../src/handlers/webhooks/cronjob-sync-orcid';
import { identity } from '../../helpers/squidex';
import * as fixtures from './cronjob-sync-orcid.fixtures';

describe('Cronjob - Sync Users ORCID', () => {
  const orcid = '0000-0001-9884-1913';

  beforeAll(() => {
    identity();
    // Add recently synced user
    fixtures.fetchUsersResponse.items[1]!.data.orcidLastSyncDate!.iv =
      new Date().toISOString();
  });

  afterAll(() => {
    expect(nock.isDone()).toBe(true);
  });

  test('should fetch ORCID works for users with orcid and lastSyncDate 1 month away', async () => {
    nock('https://pub.orcid.org')
      .get(`/v2.1/${orcid}/works`)
      .reply(200, fixtures.orcidWorksResponse);

    const patchedUser = JSON.parse(
      JSON.stringify(fixtures.fetchUsersResponse.items[0]),
    );
    patchedUser.data.orcidWorks.iv = fixtures.ORCIDWorksDeserialisedExpectation;

    nock(config.baseUrl)
      .get(`/api/content/${config.appName}/users`)
      .query({
        q: JSON.stringify({
          take: 30,
          filter: {
            path: 'data.orcid.iv',
            op: 'contains',
            value: '-',
          },
          sort: [
            {
              path: 'data.orcidLastSyncDate.iv',
              order: 'ascending',
            },
          ],
        }),
      })
      .reply(200, fixtures.fetchUsersResponse)
      .patch(
        `/api/content/${config.appName}/users/57d80949-7a75-462d-b3b0-34173423c490`,
        matches({
          email: { iv: patchedUser.data.email.iv },
          orcidWorks: { iv: fixtures.ORCIDWorksDeserialisedExpectation },
        }),
      )
      .reply(200, patchedUser);

    const res = await handler();
    expect(res.statusCode).toBe(200);
  });
});
