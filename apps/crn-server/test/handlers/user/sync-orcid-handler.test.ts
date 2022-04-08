import { syncOrcidUserHandler } from '../../../src/handlers/user/sync-orcid-handler';
import { getUserEvent, getUserResponse } from '../../fixtures/users.fixtures';
import { userControllerMock } from '../../mocks/user-controller.mock';

const orcid = '0000-0002-9079-593X';
const notOrcid = 'different-id';

describe('POST /webhook/users/orcid', () => {
  const syncHandler = syncOrcidUserHandler(userControllerMock);

  afterEach(() => jest.clearAllMocks());

  describe('type UserCreated', () => {
    test('calls sync method when there is a orcid', async () => {
      const event = createEvent();
      const userResponse = getUserResponse();
      event.detail.payload.data.orcid = { iv: orcid };
      userControllerMock.fetchById.mockResolvedValueOnce(userResponse);

      await syncHandler(event);

      expect(userControllerMock.syncOrcidProfile).toHaveBeenCalledWith(
        event.detail.payload.id,
        undefined,
      );
    });
    test('does not call sync method when there is not orcid', async () => {
      const event = createEvent();
      const userResponse = getUserResponse();
      userControllerMock.fetchById.mockResolvedValueOnce(userResponse);

      await syncHandler(event);

      expect(userControllerMock.syncOrcidProfile).not.toHaveBeenCalled();
    });
  });

  describe('type UserUpdated', () => {
    test('calls sync method when data has changed', async () => {
      const event = updateEvent();
      const userResponse = getUserResponse();
      event.detail.payload.data.orcid = { iv: orcid };
      event.detail.payload.dataOld = { orcid: { iv: notOrcid } };
      userControllerMock.fetchById.mockResolvedValueOnce(userResponse);

      await syncHandler(event);

      expect(userControllerMock.syncOrcidProfile).toHaveBeenCalledWith(
        event.detail.payload.id,
        undefined,
      );
    });
    test('does not calls sync method when data has not changed', async () => {
      // Arrange
      const event = updateEvent();
      const userResponse = getUserResponse();
      event.detail.payload.data.orcid = { iv: orcid };
      event.detail.payload.dataOld = { orcid: { iv: orcid } };
      userControllerMock.fetchById.mockResolvedValueOnce(userResponse);

      await syncHandler(event);

      expect(userControllerMock.syncOrcidProfile).not.toHaveBeenCalled();
    });
    test('does not calls sync method when there is no orcid', async () => {
      // Arrange
      const event = updateEvent();
      const userResponse = getUserResponse();
      userControllerMock.fetchById.mockResolvedValueOnce(userResponse);

      await syncHandler(event);

      expect(userControllerMock.syncOrcidProfile).not.toHaveBeenCalled();
    });
  });
  const createEvent = (id: string = 'user-1234') =>
    getUserEvent(id, 'UsersCreated');

  const updateEvent = (id: string = 'user-1234') =>
    getUserEvent(id, 'UsersUpdated');
});
