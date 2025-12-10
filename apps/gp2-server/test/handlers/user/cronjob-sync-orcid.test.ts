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

  afterEach(() => {
    jest.resetAllMocks();
    nock.cleanAll();
  });

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

  describe('ORCID validation', () => {
    test('should skip users with empty ORCID', async () => {
      const user = {
        id: 'user-1',
        email: 'test@example.com',
        orcid: '',
      };

      mockDataProvider.fetchForOrcidSync.mockResolvedValueOnce({
        total: 1,
        items: [user],
      });

      const { statusCode } = await unloggedHandler();
      expect(statusCode).toBe(200);
      expect(nock.pendingMocks()).toHaveLength(0);
      expect(mockDataProvider.update).not.toHaveBeenCalled();
    });

    test('should skip users with placeholder ORCID "-"', async () => {
      const user = {
        id: 'user-1',
        email: 'test@example.com',
        orcid: '-',
      };

      mockDataProvider.fetchForOrcidSync.mockResolvedValueOnce({
        total: 1,
        items: [user],
      });

      const { statusCode } = await unloggedHandler();
      expect(statusCode).toBe(200);
      expect(nock.pendingMocks()).toHaveLength(0);
      expect(mockDataProvider.update).not.toHaveBeenCalled();
    });

    test('should skip users with invalid ORCID format (too short)', async () => {
      const user = {
        id: 'user-1',
        email: 'test@example.com',
        orcid: '363-98-9330',
      };

      mockDataProvider.fetchForOrcidSync.mockResolvedValueOnce({
        total: 1,
        items: [user],
      });

      const { statusCode } = await unloggedHandler();
      expect(statusCode).toBe(200);
      expect(nock.pendingMocks()).toHaveLength(0);
      expect(mockDataProvider.update).not.toHaveBeenCalled();
    });

    test('should skip users with invalid ORCID format (missing hyphens)', async () => {
      const user = {
        id: 'user-1',
        email: 'test@example.com',
        orcid: '00000000198841913',
      };

      mockDataProvider.fetchForOrcidSync.mockResolvedValueOnce({
        total: 1,
        items: [user],
      });

      const { statusCode } = await unloggedHandler();
      expect(statusCode).toBe(200);
      expect(nock.pendingMocks()).toHaveLength(0);
      expect(mockDataProvider.update).not.toHaveBeenCalled();
    });

    test('should skip users with invalid ORCID format (non-numeric)', async () => {
      const user = {
        id: 'user-1',
        email: 'test@example.com',
        orcid: 'abcd-efgh-ijkl-mnop',
      };

      mockDataProvider.fetchForOrcidSync.mockResolvedValueOnce({
        total: 1,
        items: [user],
      });

      const { statusCode } = await unloggedHandler();
      expect(statusCode).toBe(200);
      expect(nock.pendingMocks()).toHaveLength(0);
      expect(mockDataProvider.update).not.toHaveBeenCalled();
    });

    test('should process users with valid ORCID and skip users with invalid ORCID', async () => {
      nock('https://pub.orcid.org')
        .get(`/v2.1/${orcid}/works`)
        .reply(200, fixtures.orcidWorksResponse);

      const validUser = {
        id: 'user-1',
        email: 'valid@example.com',
        orcid,
      };

      const invalidUser = {
        id: 'user-2',
        email: 'invalid@example.com',
        orcid: '-',
      };

      mockDataProvider.fetchForOrcidSync.mockResolvedValueOnce({
        total: 2,
        items: [validUser, invalidUser],
      });

      mockDataProvider.fetchById.mockResolvedValueOnce({
        ...fetchUserResponseDataObject(),
        ...validUser,
      });

      const { statusCode } = await unloggedHandler();
      expect(statusCode).toBe(200);
      expect(nock.isDone()).toBe(true);
      expect(mockDataProvider.update).toHaveBeenCalledTimes(1);
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
});
