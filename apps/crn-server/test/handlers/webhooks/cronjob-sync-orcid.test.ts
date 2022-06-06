import { OrcidWork } from '@asap-hub/model';
import { config, SquidexGraphql } from '@asap-hub/squidex';
import nock from 'nock';
import { handler } from '../../../src/handlers/webhooks/cronjob-sync-orcid';
import {
  generateGraphqlFetchUsersResponse,
  getGraphQLUser,
  getSquidexUserGraphqlResponse,
} from '../../fixtures/users.fixtures';
import { identity } from '../../helpers/squidex';
import * as fixtures from './cronjob-sync-orcid.fixtures';

const mockRequest: jest.MockedFunction<SquidexGraphql['request']> = jest.fn();

jest.mock('@asap-hub/squidex', () => ({
  ...jest.requireActual('@asap-hub/squidex'),
  SquidexGraphql: class SquidexGraphql {
    request = mockRequest;
  },
}));

describe('Cronjob - Sync Users ORCID', () => {
  const orcid = '0000-0001-9884-1913';

  beforeAll(identity);
  beforeEach(jest.resetAllMocks);

  test('should fetch ORCID works for users with orcid and lastSyncDate 1 month away', async () => {
    nock('https://pub.orcid.org')
      .get(`/v2.1/${orcid}/works`)
      .reply(200, fixtures.orcidWorksResponse);

    const userResponse = getGraphQLUser();
    const userToSync = {
      ...userResponse,
      flatData: {
        ...userResponse.flatData,
        orcidLastSyncDate: '2020-01-01T00:00:00.000Z',
        orcid,
        orcidWorks: fixtures.ORCIDWorksDeserialisedExpectation,
      },
    };
    const userNotToSync = {
      ...userResponse,
      flatData: {
        ...userResponse.flatData,
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

    nock(config.baseUrl)
      .patch(
        `/api/content/${config.appName}/users/user-id-1`,
        (body) =>
          body.email.iv === userToSync.flatData.email &&
          areOrcidWorksEqual(
            body.orcidWorks.iv,
            userToSync.flatData.orcidWorks,
          ),
      )
      .reply(200, userResponse);

    const { statusCode } = await handler();
    expect(statusCode).toBe(200);
    expect(nock.isDone()).toBe(true);
  });
});

const isOrcidWorkEqual = (orcidWork1: OrcidWork, orcidWork2: OrcidWork) =>
  Object.keys(orcidWork1).length === Object.keys(orcidWork2).length &&
  orcidWork1.doi === orcidWork2.doi &&
  orcidWork1.title === orcidWork2.title &&
  orcidWork1.type === orcidWork2.type &&
  orcidWork1.lastModifiedDate === orcidWork2.lastModifiedDate &&
  orcidWork1.id === orcidWork2.id;

const areOrcidWorksEqual = (
  orcidWorks1: OrcidWork[],
  orcidWorks2: OrcidWork[],
) =>
  orcidWorks1.length === orcidWorks2.length &&
  orcidWorks1.every((orcidWork, idx) =>
    isOrcidWorkEqual(orcidWork, orcidWorks2[idx]!),
  );
