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
    mockList.mockRejectedValueOnce({ code: '410' });
    mockList.mockResolvedValueOnce({ data: fixtures.listEventsResponse });

    const result = await syncCalendarHandler(calendarId);

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
