import { EventBridgeEvent } from 'aws-lambda';
import { syncOrcidUserHandler } from '../../../src/handlers/user/sync-orcid-handler';
import { getUserEvent, getUserResponse } from '../../fixtures/user.fixtures';
import { userControllerMock } from '../../mocks/user.controller.mock';
import { UserPayload } from '../../../src/handlers/event-bus';

jest.mock('../../../src/utils/logger');
describe('POST /webhook/users/orcid', () => {
  const syncHandler = syncOrcidUserHandler(userControllerMock);

  afterEach(jest.clearAllMocks);

  test('Should sync when orcid is present and orcidLastSyncDate is empty', async () => {
    const event = createEvent();
    const userResponse = getUserResponse();
    userResponse.orcid = '0000-0000-0000-0001';
    userResponse.orcidLastSyncDate = undefined;

    userControllerMock.fetchById.mockResolvedValueOnce(userResponse);

    await syncHandler(event);

    expect(userControllerMock.syncOrcidProfile).toHaveBeenCalledWith(
      event.detail.resourceId,
      undefined,
    );
  });

  test('Should skip the sync when orcidLastSyncDate is present', async () => {
    const event = createEvent();
    const userResponse = getUserResponse();
    userResponse.orcid = '0000-0000-0000-0001';
    userResponse.orcidLastSyncDate = new Date().toISOString();
    userControllerMock.fetchById.mockResolvedValueOnce(userResponse);

    await syncHandler(event);

    expect(userControllerMock.syncOrcidProfile).not.toHaveBeenCalled();
  });

  test('Should skip the sync when orcid is not present', async () => {
    const event = createEvent();
    const userResponse = getUserResponse();
    userResponse.orcid = undefined;
    userResponse.orcidLastSyncDate = undefined;
    userControllerMock.fetchById.mockResolvedValueOnce(userResponse);

    await syncHandler(event);

    expect(userControllerMock.syncOrcidProfile).not.toHaveBeenCalled();
  });

  const createEvent = (id: string = 'user-1234') =>
    getUserEvent(id, 'UsersPublished') as EventBridgeEvent<
      'UsersPublished',
      UserPayload
    >;
});
