import { Settings } from 'luxon';
import { resubscribeCalendarsHandlerFactory } from '../../../src/handlers/calendar/resubscribe-handler';
import { calendarControllerMock } from '../../mocks/calendar-controller.mock';
import {
  getCalendarRaw,
  getCalendarResponse,
} from '../../fixtures/calendars.fixtures';
import {
  UnsubscribeFromEventChanges,
  SubscribeToEventChanges,
} from '../../../src/handlers/calendar/subscribe-handler';
import {
  createEventBridgeScheduledEventMock,
  createHandlerContext,
} from '../../helpers/events';

describe('Resubscribe calendar handler', () => {
  const unsubscribeMock: jest.MockedFunction<UnsubscribeFromEventChanges> =
    jest.fn();
  const subscribeMock: jest.MockedFunction<SubscribeToEventChanges> = jest.fn();
  const resubscribeCalendarsHandler = resubscribeCalendarsHandlerFactory(
    calendarControllerMock,
    unsubscribeMock,
    subscribeMock,
  );
  const invokeHandler = () =>
    resubscribeCalendarsHandler(
      createEventBridgeScheduledEventMock(),
      createHandlerContext(),
    );

  const fakeNow = 1614697798681;
  const realDate = Date.now.bind(Date);

  beforeAll(() => {
    Settings.now = () => fakeNow;
  });

  afterAll(() => {
    Settings.now = realDate;
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  test('Should get the list of calendars expiring within 24h', async () => {
    calendarControllerMock.fetchRaw.mockResolvedValueOnce([]);

    await invokeHandler();

    expect(calendarControllerMock.fetchRaw).toHaveBeenCalledWith({
      maxExpiration: fakeNow + 24 * 60 * 60 * 1000,
      take: 100,
      skip: 0,
    });
  });

  test('Should get the list of calendars, unsubscribe each and subscribe again', async () => {
    const calendarRaw1 = getCalendarRaw();
    const calendarRaw2 = {
      ...getCalendarRaw(),
      id: 'uuid2',
      resourceId: 'resource-id-2',
    };

    calendarControllerMock.fetchRaw.mockResolvedValueOnce([
      calendarRaw1,
      calendarRaw2,
    ]);

    const resourceId = 'some-resource-id';
    const expiration = 123456;
    subscribeMock.mockResolvedValue({ resourceId, expiration });

    await invokeHandler();

    expect(unsubscribeMock).toHaveBeenCalledWith(
      calendarRaw1.resourceId,
      calendarRaw1.id,
    );
    expect(unsubscribeMock).toHaveBeenCalledWith(
      calendarRaw2.resourceId,
      calendarRaw2.id,
    );
    expect(subscribeMock).toHaveBeenCalledWith(
      calendarRaw1.googleCalendarId,
      calendarRaw1.id,
    );
    expect(subscribeMock).toHaveBeenCalledWith(
      calendarRaw2.googleCalendarId,
      calendarRaw2.id,
    );
  });

  test('Should resubscribe all calendars even if one of them fails to subscribe', async () => {
    const calendarRaw1 = getCalendarRaw();
    const calendarRaw2 = {
      ...getCalendarRaw(),
      id: 'uuid2',
      resourceId: 'resource-id-2',
    };

    calendarControllerMock.fetchRaw.mockResolvedValueOnce([
      calendarRaw1,
      calendarRaw2,
    ]);

    subscribeMock.mockRejectedValueOnce(new Error());
    const resourceId = 'some-resource-id';
    const expiration = 123456;
    subscribeMock.mockResolvedValueOnce({ resourceId, expiration });

    await invokeHandler();

    expect(subscribeMock).toHaveBeenCalledTimes(2);
    expect(subscribeMock).toHaveBeenCalledWith(
      calendarRaw1.googleCalendarId,
      calendarRaw1.id,
    );
    expect(subscribeMock).toHaveBeenCalledWith(
      calendarRaw2.googleCalendarId,
      calendarRaw2.id,
    );
  });

  test('Should remove the resourceId after unsubscribing and update it again along with expiration after successfully subscribing', async () => {
    calendarControllerMock.fetchRaw.mockResolvedValueOnce([getCalendarRaw()]);
    const resourceId = 'some-resource-id';
    const expiration = 123456;
    subscribeMock.mockResolvedValueOnce({ resourceId, expiration });

    await invokeHandler();

    expect(unsubscribeMock).toHaveBeenCalled();
    expect(calendarControllerMock.update).toHaveBeenCalledWith(
      getCalendarRaw().id,
      {
        resourceId: null,
      },
    );
    expect(subscribeMock).toHaveBeenCalled();
    expect(calendarControllerMock.update).toHaveBeenCalledWith(
      getCalendarRaw().id,
      {
        resourceId,
        expirationDate: expiration,
      },
    );
  });

  test('Should continue to subscribe even after unsubscribing fails', async () => {
    calendarControllerMock.fetchRaw.mockResolvedValueOnce([getCalendarRaw()]);
    unsubscribeMock.mockRejectedValueOnce(new Error());
    const resourceId = 'some-resource-id';
    const expiration = 123456;
    subscribeMock.mockResolvedValueOnce({ resourceId, expiration });

    await invokeHandler();

    expect(calendarControllerMock.update).not.toHaveBeenCalledWith(
      getCalendarRaw().id,
      {
        resourceId: null,
      },
    );
    expect(subscribeMock).toHaveBeenCalled();
    expect(calendarControllerMock.update).toHaveBeenCalledWith(
      getCalendarRaw().id,
      {
        resourceId,
        expirationDate: expiration,
      },
    );
  });

  test('Should continue to subscribe even after nullifying resourceId fails', async () => {
    calendarControllerMock.fetchRaw.mockResolvedValueOnce([getCalendarRaw()]);
    calendarControllerMock.update.mockImplementation(
      async (_calendarId, data) => {
        if ('resourceId' in data && data.resourceId === null) {
          throw new Error();
        }

        return getCalendarResponse();
      },
    );

    const resourceId = 'some-resource-id';
    const expiration = 123456;
    subscribeMock.mockResolvedValueOnce({ resourceId, expiration });

    await invokeHandler();

    expect(subscribeMock).toHaveBeenCalled();
    expect(calendarControllerMock.update).toHaveBeenCalledWith(
      getCalendarRaw().id,
      {
        resourceId,
        expirationDate: expiration,
      },
    );
  });

  test('Should skip unsubscribing if resourceId is not present', async () => {
    const calendarWithNoResource = {
      ...getCalendarRaw(),
      resourceId: null,
    };
    calendarControllerMock.fetchRaw.mockResolvedValueOnce([
      calendarWithNoResource,
    ]);
    const resourceId = 'some-resource-id';
    const expiration = 123456;
    subscribeMock.mockResolvedValueOnce({ resourceId, expiration });

    await invokeHandler();

    expect(unsubscribeMock).not.toHaveBeenCalled();
    expect(subscribeMock).toHaveBeenCalled();
    expect(calendarControllerMock.update).toHaveBeenCalledWith(
      getCalendarRaw().id,
      {
        resourceId,
        expirationDate: expiration,
      },
    );
  });
});
