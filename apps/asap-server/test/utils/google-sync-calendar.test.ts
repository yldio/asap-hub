import { syncCalendarFactory } from '../../src/utils/sync-google-calendar';
import { calendarControllerMock } from '../mocks/calendar-controller.mock';
import { CalendarResponse, GoogleLegacyCalendarColor } from '@asap-hub/model';
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
  const syncCalendarHandler = syncCalendarFactory(
    syncEvent,
    calendarControllerMock,
  );

  const calendarId = 'google-calendar-id';

  const updateCalendarResponse: CalendarResponse = {
    id: calendarId,
    color: 'B1365F' as GoogleLegacyCalendarColor,
    name: 'Kubernetes Meetups',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  calendarControllerMock.getSyncToken.mockResolvedValue(calendarId);

  test('Should throw when fails to fetch syncToken from squidex', async () => {
    calendarControllerMock.getSyncToken.mockRejectedValueOnce(new Error());
    await expect(syncCalendarHandler(calendarId)).rejects.toThrow();
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
    calendarControllerMock.update.mockResolvedValueOnce(updateCalendarResponse);

    await syncCalendarHandler(calendarId);

    expect(syncEvent).toBeCalledTimes(2);
    expect(calendarControllerMock.update).toHaveBeenCalledWith(calendarId, {
      syncToken: 'next-sync-token-1',
    });
  });

  test('Should not throw if google sends null items', async () => {
    mockList.mockResolvedValueOnce({
      data: {
        ...fixtures.listEventsResponse,
        items: null,
      },
    });
    calendarControllerMock.update.mockResolvedValueOnce(updateCalendarResponse);

    await syncCalendarHandler(calendarId);

    expect(syncEvent).toBeCalledTimes(0);
    expect(calendarControllerMock.update).toHaveBeenCalledWith(calendarId, {
      syncToken: 'next-sync-token-1',
    });
  });

  test('Should not throw when it fails to store the syncToken', async () => {
    mockList.mockResolvedValueOnce({ data: fixtures.listEventsResponse });
    calendarControllerMock.update.mockRejectedValueOnce(
      new Error('Squidex Error'),
    );

    await syncCalendarHandler(calendarId);

    expect(syncEvent).toBeCalledTimes(2);
    expect(calendarControllerMock.update).toHaveBeenCalledWith(calendarId, {
      syncToken: 'next-sync-token-1',
    });
  });

  test('Should not throw when syncEvent fails to update event', async () => {
    syncEvent.mockRejectedValueOnce(new Error('Squidex Error'));
    mockList.mockResolvedValueOnce({ data: fixtures.listEventsResponse });
    calendarControllerMock.update.mockResolvedValueOnce(updateCalendarResponse);

    await syncCalendarHandler(calendarId);

    expect(syncEvent).toBeCalledTimes(2);
    expect(calendarControllerMock.update).toHaveBeenCalledWith(calendarId, {
      syncToken: 'next-sync-token-1',
    });
  });

  test('Should trigger fetch more events if nextPageToken is set', async () => {
    mockList.mockResolvedValueOnce({
      data: {
        ...fixtures.listEventsResponse,
        nextPageToken: 'next-page-token-1',
      },
    });
    mockList.mockResolvedValueOnce({ data: fixtures.listEventsResponse });
    calendarControllerMock.update.mockResolvedValueOnce(updateCalendarResponse);

    await syncCalendarHandler(calendarId);

    expect(mockList).toHaveBeenCalledTimes(2);
    expect(syncEvent).toBeCalledTimes(4);
    expect(calendarControllerMock.update).toHaveBeenCalledWith(calendarId, {
      syncToken: 'next-sync-token-1',
    });
  });
});
