import { DateTime } from 'luxon';
import { syncOrcidUserHandler } from '../../../src/handlers/user/sync-orcid-handler';
import { getUserEvent, getUserResponse } from '../../fixtures/users.fixtures';
import { userControllerMock } from '../../mocks/user-controller.mock';

describe('POST /webhook/users/orcid', () => {
  const syncHandler = syncOrcidUserHandler(userControllerMock);
  let currentTime: DateTime;

  beforeAll(() => {
    jest.useFakeTimers();

    currentTime = DateTime.fromISO('2022-09-01T08:00:00Z');
    jest.setSystemTime(currentTime.toJSDate());
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  afterEach(jest.clearAllMocks);

  test('Should skip the sync when orcidLastSyncDate is less than 24 hours ago', async () => {
    const event = createEvent();
    const userResponse = getUserResponse();
    // set orcidLastSyncDate to 30 seconds ago
    userResponse.orcidLastSyncDate = currentTime.minus({ hours: 23 }).toISO();
    userControllerMock.fetchById.mockResolvedValueOnce(userResponse);

    await syncHandler(event);

    expect(userControllerMock.syncOrcidProfile).not.toHaveBeenCalled();
  });

  test('Should sync when orcidLastSyncDate is more than 24 hours ago', async () => {
    const event = createEvent();
    const userResponse = getUserResponse();
    // set orcidLastSyncDate to 24 hours and one minute ago
    userResponse.orcidLastSyncDate = currentTime
      .minus({ hours: 24, minutes: 1 })
      .toISO();
    userControllerMock.fetchById.mockResolvedValueOnce(userResponse);

    await syncHandler(event);

    expect(userControllerMock.syncOrcidProfile).toHaveBeenCalledWith(
      event.detail.payload.id,
      undefined,
    );
  });

  test('Should skip the sync when orcid is not present', async () => {
    const event = createEvent();
    const userResponse = getUserResponse();
    // set orcidLastSyncDate to 30 seconds ago
    userResponse.orcidLastSyncDate = currentTime
      .minus({ hours: 24, minutes: 1 })
      .toISO();
    userResponse.orcid = undefined;
    userControllerMock.fetchById.mockResolvedValueOnce(userResponse);

    await syncHandler(event);

    expect(userControllerMock.syncOrcidProfile).not.toHaveBeenCalled();
  });

  const createEvent = (id: string = 'user-1234') =>
    getUserEvent(id, 'UsersCreated');
});
