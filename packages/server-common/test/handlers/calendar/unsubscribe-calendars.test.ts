import { Settings } from 'luxon';
import {
  unsubscribeCalendarsHandlerFactory,
  UnsubscribeFromEventChanges,
} from '../../../src';
import { getCalendarDataObject } from '../../fixtures/calendar.fixtures';
import {
  createEventBridgeScheduledEventMock,
  createHandlerContext,
} from '../../helpers/events';
import { calendarDataProviderMock } from '../../mocks/calendar-data-provider.mock';
import { loggerMock as logger } from '../../mocks/logger.mock';

describe('Unsubscribe calendar handler', () => {
  const unsubscribeMock: jest.MockedFunction<UnsubscribeFromEventChanges> =
    jest.fn();
  const unsubscribeCalendarsHandler = unsubscribeCalendarsHandlerFactory(
    calendarDataProviderMock,
    unsubscribeMock,
    logger,
  );
  const invokeHandler = () =>
    unsubscribeCalendarsHandler(
      createEventBridgeScheduledEventMock(),
      createHandlerContext(),
    );

  const getCalendarId = (id: string) => `cms:${id}`;

  const unsubscribeCalendarsHandlerWithIdFunction =
    unsubscribeCalendarsHandlerFactory(
      calendarDataProviderMock,
      unsubscribeMock,
      logger,
      getCalendarId,
    );
  const invokeHandlerWithIdFunction = () =>
    unsubscribeCalendarsHandlerWithIdFunction(
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

  test('Should get the list of calendars and unsubscribe each of them', async () => {
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

    await invokeHandler();

    expect(unsubscribeMock).toHaveBeenCalledWith(
      calendarDataObject1.resourceId,
      calendarDataObject1.channelId,
    );
    expect(unsubscribeMock).toHaveBeenCalledWith(
      calendarDataObject2.resourceId,
      calendarDataObject2.channelId,
    );
  });

  test('Should use `getCalendarId` function if provided when unsubscribing', async () => {
    const calendarDataObject1 = {
      ...getCalendarDataObject(),
      channelId: undefined,
    };
    const calendarDataObject2 = {
      ...getCalendarDataObject(),
      id: 'uuid2',
      resourceId: 'resource-id-2',
      channelId: undefined,
    };

    calendarDataProviderMock.fetch.mockResolvedValueOnce({
      items: [calendarDataObject1, calendarDataObject2],
      total: 2,
    });

    await invokeHandlerWithIdFunction();
    expect(unsubscribeMock).toHaveBeenCalledWith(
      calendarDataObject1.resourceId,
      `cms:${calendarDataObject1.id}`,
    );
    expect(unsubscribeMock).toHaveBeenCalledWith(
      calendarDataObject2.resourceId,
      `cms:${calendarDataObject2.id}`,
    );
  });

  test('Should remove the googleApiMetadata after unsubscribing', async () => {
    calendarDataProviderMock.fetch.mockResolvedValueOnce({
      items: [getCalendarDataObject()],
      total: 1,
    });

    await invokeHandler();

    expect(unsubscribeMock).toHaveBeenCalled();
    expect(calendarDataProviderMock.update).toHaveBeenCalledWith(
      getCalendarDataObject().id,
      {
        googleApiMetadata: null,
      },
    );
  });

  test('Should log if nullifying resourceId fails and should keep updating the calendars even if one fails', async () => {
    const calendarDataObject1 = {
      ...getCalendarDataObject(),
      id: 'uuid1',
      resourceId: 'resource-id-1',
      channelId: undefined,
    };
    const calendarDataObject2 = {
      ...getCalendarDataObject(),
      id: 'uuid2',
      resourceId: 'resource-id-2',
      channelId: undefined,
    };

    calendarDataProviderMock.update
      .mockRejectedValueOnce('failed')
      .mockResolvedValueOnce();

    calendarDataProviderMock.fetch.mockResolvedValueOnce({
      items: [calendarDataObject1, calendarDataObject2],
      total: 2,
    });

    await invokeHandler();

    expect(logger.error).toHaveBeenCalledWith(
      'failed',
      'Error during unsubscribing from the calendar with resourceId resource-id-1 and CMS id uuid1',
    );
    expect(calendarDataProviderMock.update).toHaveBeenCalledTimes(2);
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

    await invokeHandler();

    expect(unsubscribeMock).not.toHaveBeenCalled();
  });
});
