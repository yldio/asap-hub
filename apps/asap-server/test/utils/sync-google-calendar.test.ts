import { Auth } from 'googleapis';

import { syncCalendarFactory } from '../../src/utils/sync-google-calendar';
import * as fixtures from '../fixtures/google-events.fixtures';

const mockList = jest.fn();
jest.mock('googleapis', () => ({
  google: {
    auth: {
      GoogleAuth: jest.fn(),
    },
    calendar: () => ({
      events: {
        list: mockList,
      },
    }),
  },
}));

describe('Sync calendar util hook', () => {
  const syncEvent = jest.fn();
  const syncToken = '';
  const syncCalendarHandler = syncCalendarFactory(
    syncToken,
    syncEvent,
    {} as Auth.GoogleAuth,
  );

  const calendarId = 'google-calendar-id';
  const defaultCalendarTimezone = 'Europe/Lisbon';

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Should throw when get unknown error from google', async () => {
    mockList.mockRejectedValueOnce(new Error('Google Error'));
    await expect(syncCalendarHandler(calendarId)).rejects.toThrow(
      'Google Error',
    );
  });

  test('Should trigger full sync when syncToken is invalidated', async () => {
    // Mock time to be 2023
    jest.spyOn(global.Date, 'now').mockImplementationOnce(() => 1677926270000);
    mockList.mockRejectedValueOnce({ code: '410' });
    mockList.mockResolvedValueOnce({ data: fixtures.listEventsResponse });

    const result = await syncCalendarHandler(calendarId);

    const googleParams = {
      calendarId: 'google-calendar-id',
      singleEvents: true,
      timeMin: '2020-10-01T00:00:00.000Z',
      timeMax: '2023-09-04T10:37:50.000Z',
      pageToken: undefined,
    };

    expect(mockList).toHaveBeenCalledWith(googleParams);
    expect(syncEvent).toBeCalledTimes(2);
    expect(result).toStrictEqual('next-sync-token-1');
  });

  test('Should not throw if google sends null items', async () => {
    mockList.mockResolvedValueOnce({
      data: {
        ...fixtures.listEventsResponse,
        items: null,
      },
    });

    await syncCalendarHandler(calendarId);
    expect(syncEvent).toBeCalledTimes(0);
  });

  test('Should not throw when syncEvent fails to update event', async () => {
    syncEvent.mockRejectedValueOnce(new Error('Squidex Error'));
    mockList.mockResolvedValueOnce({ data: fixtures.listEventsResponse });

    await syncCalendarHandler(calendarId);
    expect(syncEvent).toBeCalledTimes(2);
  });

  test('Should call syncEvent with the google events', async () => {
    mockList.mockResolvedValueOnce({ data: fixtures.listEventsResponse });

    await syncCalendarHandler(calendarId);

    expect(mockList).toHaveBeenCalledTimes(1);
    expect(syncEvent).toBeCalledTimes(2);
    expect(syncEvent).toHaveBeenCalledWith(
      fixtures.listEventsResponse.items![0],
      defaultCalendarTimezone,
    );
    expect(syncEvent).toHaveBeenCalledWith(
      fixtures.listEventsResponse.items![1],
      defaultCalendarTimezone,
    );
  });

  test('Should trigger fetch more events if nextPageToken is set', async () => {
    mockList.mockResolvedValueOnce({
      data: {
        ...fixtures.listEventsResponse,
        nextPageToken: 'next-page-token-1',
      },
    });
    mockList.mockResolvedValueOnce({ data: fixtures.listEventsResponse });

    await syncCalendarHandler(calendarId);

    expect(mockList).toHaveBeenCalledTimes(2);
    expect(syncEvent).toBeCalledTimes(4);
  });
});
