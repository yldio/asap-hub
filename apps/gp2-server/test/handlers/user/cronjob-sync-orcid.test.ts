import nock from 'nock';
import { unloggedHandler } from '../../../src/handlers/user/cronjob-sync-orcid';
import { fetchUserResponseDataObject } from '../../fixtures/user.fixtures';
import * as fixtures from '../../fixtures/cronjob-sync-orcid.fixtures';
import { userDataProviderMock } from '../../mocks/user.data-provider.mock';

const mockDataProvider = userDataProviderMock;

jest.mock('../../../src/utils/logger');
jest.mock('../../../src/dependencies/user.dependency', () => ({
  getUserDataProvider: () => mockDataProvider,
  getAssetDataProvider: jest.fn(),
}));

describe('Cronjob - Sync Users ORCID', () => {
  const orcid = '0000-0001-9884-1913';

  afterEach(jest.resetAllMocks);

  test('should fetch ORCID works for users with orcid and lastSyncDate 1 month away', async () => {
    nock('https://pub.orcid.org')
      .get(`/v2.1/${orcid}/works`)
      .reply(200, fixtures.orcidWorksResponse);

    const user = {
      id: 'user-1',
      email: 'test@example.com',
      orcid,
    };

    mockDataProvider.fetchForOrcidSync.mockResolvedValueOnce({
      total: 1,
      items: [user],
    });

    mockDataProvider.fetchById.mockResolvedValueOnce({
      ...fetchUserResponseDataObject(),
      ...user,
    });

    const { statusCode } = await unloggedHandler();
    expect(statusCode).toBe(200);
    expect(mockDataProvider.update).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({
        orcidWorks: expect.arrayContaining(
          fixtures.ORCIDWorksDeserialisedExpectation,
        ),
      }),
    );
  });
});
