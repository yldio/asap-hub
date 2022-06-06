import { RestUser, SquidexGraphql, SquidexRestClient } from '@asap-hub/squidex';
import nock from 'nock';
import { handler } from '../../../src/handlers/webhooks/cronjob-sync-orcid';
import {
  generateGraphqlFetchUsersResponse,
  getGraphQLUser,
  getSquidexUserGraphqlResponse,
  patchResponse,
} from '../../fixtures/users.fixtures';
import * as fixtures from './cronjob-sync-orcid.fixtures';

const mockRequest: jest.MockedFunction<SquidexGraphql['request']> = jest.fn();
const mockPatch: jest.MockedFunction<SquidexRestClient<RestUser>['patch']> =
  jest.fn();

jest.mock('@asap-hub/squidex', () => ({
  ...jest.requireActual('@asap-hub/squidex'),
  SquidexGraphql: class SquidexGraphql {
    request = mockRequest;
  },
  SquidexRest: class SquidexRest {
    patch = mockPatch;
  },
}));

describe('Cronjob - Sync Users ORCID', () => {
  const orcid = '0000-0001-9884-1913';

  beforeEach(jest.resetAllMocks);

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

    mockRequest
      .mockResolvedValueOnce(outdatedUsersResponse)
      .mockResolvedValueOnce(singleUserResponse);

    mockPatch.mockResolvedValueOnce(userResponse);

    const { statusCode } = await handler();
    expect(statusCode).toBe(200);
    expect(mockPatch).toHaveBeenCalledWith(
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
