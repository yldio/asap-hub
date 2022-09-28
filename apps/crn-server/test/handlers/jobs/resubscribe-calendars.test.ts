import { Settings } from 'luxon';
import { resubscribeCalendarsHandlerFactory } from '../../../src/handlers/calendar/resubscribe-handler';
import { getCalendarDataObject } from '../../fixtures/calendars.fixtures';
import {
  UnsubscribeFromEventChanges,
  SubscribeToEventChanges,
} from '../../../src/handlers/calendar/subscribe-handler';
import {
  createEventBridgeScheduledEventMock,
  createHandlerContext,
} from '../../helpers/events';
import { calendarDataProviderMock } from '../../mocks/calendar-data-provider.mock';

describe('Resubscribe calendar handler', () => {
  const unsubscribeMock: jest.MockedFunction<UnsubscribeFromEventChanges> =
    jest.fn();
  const subscribeMock: jest.MockedFunction<SubscribeToEventChanges> = jest.fn();
  const resubscribeCalendarsHandler = resubscribeCalendarsHandlerFactory(
    calendarDataProviderMock,
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
    calendarDataProviderMock.fetch.mockResolvedValueOnce({
      total: 0,
      items: [],
    });

    await invokeHandler();

    expect(calendarDataProviderMock.fetch).toHaveBeenCalledWith({
      maxExpiration: fakeNow + 24 * 60 * 60 * 1000,
    });
  });

  test('Should get the list of calendars, unsubscribe each and subscribe again', async () => {
    const calendarDataObject1 = getCalendarDataObject();
    const calendarDataObject2 = {
      ...getCalendarDataObject(),
      id: 'uuid2',
      resourceId: 'resource-id-2',
    };

    calendarDataProviderMock.fetch.mockResolvedValueOnce({
      items: [calendarDataObject1, calendarDataObject2],
      total: 2,
    });

    const resourceId = 'some-resource-id';
    const expiration = 123456;
    subscribeMock.mockResolvedValue({ resourceId, expiration });

    await invokeHandler();

    expect(unsubscribeMock).toHaveBeenCalledWith(
      calendarDataObject1.resourceId,
      calendarDataObject1.id,
    );
    expect(unsubscribeMock).toHaveBeenCalledWith(
      calendarDataObject2.resourceId,
      calendarDataObject2.id,
    );
    expect(subscribeMock).toHaveBeenCalledWith(
      calendarDataObject1.googleCalendarId,
      calendarDataObject1.id,
    );
    expect(subscribeMock).toHaveBeenCalledWith(
      calendarDataObject2.googleCalendarId,
      calendarDataObject2.id,
    );
  });

  test('Should resubscribe all calendars even if one of them fails to subscribe', async () => {
    const calendarDataObject1 = getCalendarDataObject();
    const calendarDataObject2 = {
      ...getCalendarDataObject(),
      id: 'uuid2',
      resourceId: 'resource-id-2',
    };

    calendarDataProviderMock.fetch.mockResolvedValueOnce({
      items: [calendarDataObject1, calendarDataObject2],
      total: 2,
    });

    subscribeMock.mockRejectedValueOnce(new Error());
    const resourceId = 'some-resource-id';
    const expiration = 123456;
    subscribeMock.mockResolvedValueOnce({ resourceId, expiration });

    await invokeHandler();

    expect(subscribeMock).toHaveBeenCalledTimes(2);
    expect(subscribeMock).toHaveBeenCalledWith(
      calendarDataObject1.googleCalendarId,
      calendarDataObject1.id,
    );
    expect(subscribeMock).toHaveBeenCalledWith(
      calendarDataObject2.googleCalendarId,
      calendarDataObject2.id,
    );
  });

  test('Should remove the resourceId after unsubscribing and update it again along with expiration after successfully subscribing', async () => {
    calendarDataProviderMock.fetch.mockResolvedValueOnce({
      items: [getCalendarDataObject()],
      total: 1,
    });
    const resourceId = 'some-resource-id';
    const expiration = 123456;
    subscribeMock.mockResolvedValueOnce({ resourceId, expiration });

    await invokeHandler();

    expect(unsubscribeMock).toHaveBeenCalled();
    expect(calendarDataProviderMock.update).toHaveBeenCalledWith(
      getCalendarDataObject().id,
      {
        resourceId: null,
      },
    );
    expect(subscribeMock).toHaveBeenCalled();
    expect(calendarDataProviderMock.update).toHaveBeenCalledWith(
      getCalendarDataObject().id,
      {
        resourceId,
        expirationDate: expiration,
      },
    );
  });

  test('Should continue to subscribe even after unsubscribing fails', async () => {
    calendarDataProviderMock.fetch.mockResolvedValueOnce({
      items: [getCalendarDataObject()],
      total: 1,
    });
    unsubscribeMock.mockRejectedValueOnce(new Error());
    const resourceId = 'some-resource-id';
    const expiration = 123456;
    subscribeMock.mockResolvedValueOnce({ resourceId, expiration });

    await invokeHandler();

    expect(calendarDataProviderMock.update).not.toHaveBeenCalledWith(
      getCalendarDataObject().id,
      {
        resourceId: null,
      },
    );
    expect(subscribeMock).toHaveBeenCalled();
    expect(calendarDataProviderMock.update).toHaveBeenCalledWith(
      getCalendarDataObject().id,
      {
        resourceId,
        expirationDate: expiration,
      },
    );
  });

  test('Should continue to subscribe even after nullifying resourceId fails', async () => {
    calendarDataProviderMock.fetch.mockResolvedValueOnce({
      items: [getCalendarDataObject()],
      total: 1,
    });
    calendarDataProviderMock.update.mockImplementation(
      async (_calendarId, data) => {
        if ('resourceId' in data && data.resourceId === null) {
          throw new Error();
        }
      },
    );

    const resourceId = 'some-resource-id';
    const expiration = 123456;
    subscribeMock.mockResolvedValueOnce({ resourceId, expiration });

    await invokeHandler();

    expect(subscribeMock).toHaveBeenCalled();
    expect(calendarDataProviderMock.update).toHaveBeenCalledWith(
      getCalendarDataObject().id,
      {
        resourceId,
        expirationDate: expiration,
      },
    );
  });

  test('Should skip unsubscribing if resourceId is not present', async () => {
    const calendarWithNoResource = {
      ...getCalendarDataObject(),
      resourceId: null,
    };
    calendarDataProviderMock.fetch.mockResolvedValueOnce({
      items: [calendarWithNoResource],
      total: 1,
    });
    const resourceId = 'some-resource-id';
    const expiration = 123456;
    subscribeMock.mockResolvedValueOnce({ resourceId, expiration });

    await invokeHandler();

    expect(unsubscribeMock).not.toHaveBeenCalled();
    expect(subscribeMock).toHaveBeenCalled();
    expect(calendarDataProviderMock.update).toHaveBeenCalledWith(
      getCalendarDataObject().id,
      {
        resourceId,
        expirationDate: expiration,
      },
    );
  });
});
