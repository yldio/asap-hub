import nock from 'nock';
import { unloggedHandler } from '../../../src/handlers/webhooks/cronjob-sync-orcid';
import {
  generateGraphqlFetchUsersResponse,
  getGraphQLUser,
  getSquidexUserGraphqlResponse,
  patchResponse,
} from '../../fixtures/users.fixtures';
import { getSquidexClientMock } from '../../mocks/squidex-client.mock';
import { getSquidexGraphqlClientMock } from '../../mocks/squidex-graphql-client.mock';
import * as fixtures from './cronjob-sync-orcid.fixtures';

const mockGraphqlClient = getSquidexGraphqlClientMock();
const mockRestClient = getSquidexClientMock();

jest.mock('@asap-hub/squidex', () => ({
  ...jest.requireActual('@asap-hub/squidex'),
  SquidexGraphql: jest.fn(() => mockGraphqlClient),
  SquidexRest: jest.fn(() => mockRestClient),
}));

describe('Cronjob - Sync Users ORCID', () => {
  const orcid = '0000-0001-9884-1913';

  afterEach(jest.resetAllMocks);

  test('should fetch ORCID works for users with orcid and lastSyncDate 1 month away', async () => {
    nock('https://pub.orcid.org')
      .get(`/v2.1/${orcid}/works`)
      .reply(200, fixtures.orcidWorksResponse);

    const userResponse = patchResponse();
    const user = getGraphQLUser();
    const userToSync = {
      ...user,
      flatData: {
        ...user.flatData,
        orcidLastSyncDate: '2020-01-01T00:00:00.000Z',
        orcid,
        orcidWorks: fixtures.ORCIDWorksDeserialisedExpectation,
      },
    };
    const userNotToSync = {
      ...user,
      flatData: {
        ...user.flatData,
        orcidLastSyncDate: new Date().toISOString(),
        orcid,
        orcidWorks: fixtures.ORCIDWorksDeserialisedExpectation,
      },
    };
    const outdatedUsersResponse = generateGraphqlFetchUsersResponse([
      userToSync,
      userNotToSync,
    ]);
    const singleUserResponse = getSquidexUserGraphqlResponse(userToSync);

    mockGraphqlClient.request
      .mockResolvedValueOnce(outdatedUsersResponse)
      .mockResolvedValueOnce(singleUserResponse);

    mockRestClient.patch.mockResolvedValueOnce(userResponse);

    const { statusCode } = await unloggedHandler();
    expect(statusCode).toBe(200);
    expect(mockRestClient.patch).toHaveBeenCalledWith(
      singleUserResponse.findUsersContent?.id,
      expect.objectContaining({
        email: { iv: userToSync.flatData.email },
        orcidWorks: {
          iv: expect.arrayContaining(userToSync.flatData.orcidWorks),
        },
      }),
    );
  });
});
