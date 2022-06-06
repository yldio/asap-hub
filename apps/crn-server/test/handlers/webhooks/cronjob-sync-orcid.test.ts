import { config, SquidexGraphql } from '@asap-hub/squidex';
import nock from 'nock';
import { handler } from '../../../src/handlers/webhooks/cronjob-sync-orcid';
import {
  fetchUserResponse,
  generateGraphqlFetchUsersResponse,
  getGraphQLUser,
  getSquidexUserGraphqlResponse,
} from '../../fixtures/users.fixtures';
import { identity } from '../../helpers/squidex';
import * as fixtures from './cronjob-sync-orcid.fixtures';

describe('Cronjob - Sync Users ORCID', () => {
  const orcid = '0000-0001-9884-1913';

  beforeAll(() => {
    identity();
    // Add recently synced user
    fixtures.fetchUsersResponse.items[1]!.data.orcidLastSyncDate!.iv =
      new Date().toISOString();
    jest.resetAllMocks();
  });

  afterAll(() => {
    expect(nock.isDone()).toBe(true);
  });

  test('should fetch ORCID works for users with orcid and lastSyncDate 1 month away', async () => {
    /*
new Date(Date.now()).toUTCString()

      const now = Date.now
      Date.now = jest.fn(() => 1466676000000)

      Date.now = now

    */
    nock('https://pub.orcid.org')
      .get(`/v2.1/${orcid}/works`)
      .reply(200, fixtures.orcidWorksResponse);

    const patchedUser = JSON.parse(
      JSON.stringify(fixtures.fetchUsersResponse.items[0]),
    );
    patchedUser.data.orcidWorks.iv = fixtures.ORCIDWorksDeserialisedExpectation;

    const userResponse = getGraphQLUser();
    const response = generateGraphqlFetchUsersResponse([
      {
        ...userResponse,
        flatData: {
          ...userResponse.flatData,
          orcidLastSyncDate: '2020-01-01T00:00:00.000Z',
          orcid,
        },
      },
    ]);

    jest
      .spyOn(SquidexGraphql.prototype, 'request')
      .mockResolvedValueOnce(response)
      .mockResolvedValueOnce(getSquidexUserGraphqlResponse())
      .mockResolvedValueOnce(fetchUserResponse());

    nock(config.baseUrl)
      .patch(
        `/api/content/${config.appName}/users/user-id-1`,
        // matches({
        //   email: { iv: patchedUser.data.email.iv },
        //   // orcidWorks: { iv: fixtures.ORCIDWorksDeserialisedExpectation },
        // }),
      )
      .reply(200, patchedUser);

    const res = await handler();
    expect(res.statusCode).toBe(200);
  });
});
