import { GetJWTCredentials, syncCalendarFactory } from '../../src';
import { getListEventsResponse } from '../fixtures/google-events.fixtures';
import { loggerMock as logger } from '../mocks/logger.mock';

var mockGoogleAuth = jest.fn();
const mockList = jest.fn();

jest.mock('@googleapis/calendar', () => ({
  ...jest.requireActual('@googleapis/calendar'),
  calendar: () => ({
    events: {
      list: mockList,
    },
  }),
}));

jest.mock('google-auth-library', () => ({
  ...jest.requireActual('google-auth-library'),
  GoogleAuth: jest
    .fn()
    .mockImplementation(() => ({ fromJSON: mockGoogleAuth })),
}));

describe('Sync calendar util hook', () => {
  const syncEvent = jest.fn();
  const syncToken = 'a-sync-token';
  const getJWTCredentialsMock: jest.MockedFunction<GetJWTCredentials> =
    jest.fn();
  const syncCalendarHandler = syncCalendarFactory(
    syncEvent,
    getJWTCredentialsMock,
    logger,
  );

  const googleCalendarId = 'google-calendar-id';
  const calendarId = 'calendar-id';
  const defaultCalendarTimezone = 'Europe/Lisbon';

  afterEach(jest.clearAllMocks);

  beforeEach(() => {
    getJWTCredentialsMock.mockResolvedValue({
      client_email: 'random-data',
      private_key: 'random-data',
    });
    mockGoogleAuth.mockReturnValue({
      scopes: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
      ],
    });
  });
  test('Should throw when get unknown error from google', async () => {
    mockList.mockRejectedValueOnce(new Error('Google Error'));
    await expect(
      syncCalendarHandler(googleCalendarId, calendarId, syncToken),
    ).rejects.toThrow('Google Error');
  });

  test('Should throw when it fails to get the credentials from AWS', async () => {
    getJWTCredentialsMock.mockRejectedValueOnce(new Error('AWS Error'));

    await expect(
      syncCalendarHandler(googleCalendarId, calendarId, syncToken),
    ).rejects.toThrow('AWS Error');
  });

  test('Should trigger full sync when syncToken is invalidated', async () => {
    const listEventsResponse = getListEventsResponse();
    jest.spyOn(global.Date, 'now').mockImplementationOnce(() => 1677926270000);
    mockList.mockRejectedValueOnce(new GoneError());
    mockList.mockResolvedValueOnce({ data: listEventsResponse });

    const result = await syncCalendarHandler(
      googleCalendarId,
      calendarId,
      syncToken,
    );

    expect(mockList).toHaveBeenCalledWith({
      calendarId: 'google-calendar-id',
      singleEvents: true,
      showDeleted: true,
      timeMin: '2020-10-01T00:00:00.000Z',
      timeMax: '2023-09-04T10:37:50.000Z',
      pageToken: undefined,
    });
    expect(syncEvent).toHaveBeenCalledTimes(2);
    expect(result).toStrictEqual('next-sync-token-1');
  });

  test('Should not throw if google sends null items', async () => {
    const listEventsResponse = getListEventsResponse();
    mockList.mockResolvedValueOnce({
      data: {
        ...listEventsResponse,
        items: null,
      },
    });

    await syncCalendarHandler(googleCalendarId, calendarId, syncToken);
    expect(syncEvent).toHaveBeenCalledTimes(0);
  });

  test('Should not throw when syncEvent fails to update event', async () => {
    const listEventsResponse = getListEventsResponse();
    syncEvent.mockRejectedValueOnce(new Error());
    mockList.mockResolvedValueOnce({ data: listEventsResponse });

    await syncCalendarHandler(googleCalendarId, calendarId, syncToken);
    expect(syncEvent).toHaveBeenCalledTimes(2);
  });

  test('Should call syncEvent with the google events', async () => {
    const listEventsResponse = getListEventsResponse();
    mockList.mockResolvedValueOnce({ data: listEventsResponse });

    await syncCalendarHandler(googleCalendarId, calendarId, syncToken);

    expect(mockList).toHaveBeenCalledTimes(1);
    expect(mockList).toHaveBeenCalledWith({
      calendarId: 'google-calendar-id',
      singleEvents: true,
      showDeleted: true,
      syncToken,
      pageToken: undefined,
    });
    expect(syncEvent).toHaveBeenCalledTimes(2);
    expect(syncEvent).toHaveBeenCalledWith(
      listEventsResponse.items![0],
      googleCalendarId,
      calendarId,
      defaultCalendarTimezone,
    );
    expect(syncEvent).toHaveBeenCalledWith(
      listEventsResponse.items![1],
      googleCalendarId,
      calendarId,
      defaultCalendarTimezone,
    );
  });

  test('Should trigger fetch more events if nextPageToken is set', async () => {
    const listEventsResponse = getListEventsResponse();
    const nextPageToken = 'next-page-token-1';
    mockList.mockResolvedValueOnce({
      data: {
        ...listEventsResponse,
        nextPageToken,
      },
    });
    mockList.mockResolvedValueOnce({ data: listEventsResponse });

    await syncCalendarHandler(googleCalendarId, calendarId, syncToken);

    expect(mockList).toHaveBeenCalledTimes(2);
    expect(mockList).toHaveBeenNthCalledWith(1, {
      calendarId: 'google-calendar-id',
      singleEvents: true,
      showDeleted: true,
      syncToken,
      pageToken: undefined,
    });
    expect(mockList).toHaveBeenNthCalledWith(2, {
      calendarId: 'google-calendar-id',
      singleEvents: true,
      showDeleted: true,
      syncToken,
      pageToken: nextPageToken,
    });
    expect(syncEvent).toHaveBeenCalledTimes(4);
  });
});

class GoneError extends Error {
  status = 410;
}
