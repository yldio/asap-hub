import { Environment } from '@asap-hub/contentful';
import { CalendarEvent } from '@asap-hub/model';
import { EventBridgeEvent } from 'aws-lambda';
import {
  CalendarContentfulPayload,
  SubscribeToEventChanges,
  UnsubscribeFromEventChanges,
} from '../../../src';
import { calendarCreatedContentfulHandlerFactory } from '../../../src/handlers/calendar/subscribe-handler.contentful';
import { Alerts } from '../../../src/utils/alerts';
import { createEventBridgeEventMock } from '../../helpers/events';
import { calendarDataProviderMock } from '../../mocks/calendar-data-provider.mock';
import { loggerMock as logger } from '../../mocks/logger.mock';
import {
  CalendarSnapshot,
  getCalendarContentfulEvent,
  getCalendarContentfulWebhookDetail,
  getCalendarDataObject,
  getCalendarSnapshot,
  getCalendarSnapshots,
} from './webhook-sync-calendar.fixtures';

describe('Calendar handler', () => {
  const subscribe: jest.MockedFunction<SubscribeToEventChanges> = jest.fn();
  const unsubscribe: jest.MockedFunction<UnsubscribeFromEventChanges> =
    jest.fn();
  const alerts: jest.Mocked<Alerts> = {
    error: jest.fn(),
  };

  let handler;
  beforeEach(() => {
    jest.resetAllMocks();

    const calendarSnapshots = getCalendarSnapshots();
    const getEntryMock = jest.fn().mockResolvedValue({
      getSnapshots: jest.fn().mockResolvedValue(calendarSnapshots),
    });
    const getContentfulRestClientFactory: jest.MockedFunction<
      () => Promise<Environment>
    > = jest.fn().mockResolvedValue({
      getEntry: getEntryMock,
    });
    handler = calendarCreatedContentfulHandlerFactory(
      subscribe,
      unsubscribe,
      calendarDataProviderMock,
      alerts,
      logger,
      getContentfulRestClientFactory,
    );
  });

  describe('Validation', () => {
    test('valid: additional fields are allowed', async () => {
      const event = getEvent();
      (event.detail as any).additionalField = 'hi';
      const resourceId = 'some-resource-id';
      const expiration = 123456;
      subscribe.mockResolvedValueOnce({ resourceId, expiration });

      await expect(handler(event)).resolves.toBe('OK');
    });

    test('valid: additional fields in detail are allowed', async () => {
      const event = getEvent();
      // @ts-expect-error testing unknown fields
      event.detail.additionalField = 'hi';

      const resourceId = 'some-resource-id';
      const expiration = 123456;
      subscribe.mockResolvedValueOnce({ resourceId, expiration });

      await expect(handler(event)).resolves.toBe('OK');
    });

    test('Should throw an error and not subscribe when the payload is not valid', async () => {
      await expect(handler(getEvent({} as any))).rejects.toThrow(
        /Validation error/,
      );
    });

    test('Should skip any actions and return status OK for an unknown event type', async () => {
      const event = getEvent();
      (event['detail-type'] as any) = 'some-other-type';

      const res = await handler(event);

      expect(res).toBe('OK');
      expect(subscribe).not.toHaveBeenCalled();
      expect(calendarDataProviderMock.update).not.toHaveBeenCalled();
    });
  });

  describe('Create and Update events', () => {
    test('Should subscribe with the correct data, save the resource ID and return 200 when the subscription was successful', async () => {
      const event = getEvent();
      const resourceId = 'some-resource-id';
      const expiration = 123456;
      subscribe.mockResolvedValueOnce({ resourceId, expiration });

      const res = await handler(getEvent());

      expect(res).toBe('OK');
      expect(subscribe).toHaveBeenCalledWith(
        'fields' in event.detail
          ? event.detail.fields['googleCalendarId']['en-US']
          : '',
        event.detail.resourceId,
      );
      expect(calendarDataProviderMock.update).toHaveBeenCalledWith(
        event.detail.resourceId,
        {
          resourceId,
          expirationDate: expiration,
        },
      );
    });

    test('Should to throw and alert when the subscription was unsuccessful', async () => {
      const errorMessage =
        'Channel id 238c6b46-706e-11eb-9439-0242ac130002 not unique';
      const error = new Error(errorMessage);
      subscribe.mockRejectedValueOnce(error);

      await expect(handler(getEvent())).rejects.toThrow(error);
      expect(alerts.error).toBeCalledWith(error);
    });

    test('Should unsubscribe and skip the subscription if the calendar ID was set to an empty string', async () => {
      const calendarUpdateEvent = getEvent();
      const resourceId = 'some-resource-id';

      if ('fields' in calendarUpdateEvent.detail) {
        calendarUpdateEvent.detail.fields.googleCalendarId['en-US'] = '';
        calendarUpdateEvent.detail.sys.revision = 2;
      }

      calendarDataProviderMock.fetchById.mockResolvedValueOnce({
        ...getCalendarDataObject(),
        version: 1,
      });

      const res = await handler(calendarUpdateEvent);

      expect(res).toBe('OK');
      expect(unsubscribe).toHaveBeenCalledWith(
        resourceId,
        calendarUpdateEvent.detail.resourceId,
      );
      expect(subscribe).not.toHaveBeenCalled();
    });
  });

  describe('Calendar Update trigger', () => {
    test('Should skip subscription and unsubscribing and return 200 if the calendar ID did not change', async () => {
      const calendarSnapshots = getCalendarSnapshots();
      const previousCalendarSnapshot = calendarSnapshots.items[1];

      const calendarUpdateEvent = getEvent();

      calendarUpdateEvent.detail.sys.revision = 2;
      if ('fields' in calendarUpdateEvent.detail) {
        calendarUpdateEvent.detail.fields.googleCalendarId['en-US'] =
          previousCalendarSnapshot.snapshot.fields.googleCalendarId['en-US'];
      }

      const res = await handler(calendarUpdateEvent);

      expect(res).toBe('OK');
      expect(unsubscribe).not.toHaveBeenCalled();
      expect(subscribe).not.toHaveBeenCalled();
    });

    describe('Calendar ID changed', () => {
      const resourceId = 'some-resource-id';
      const expiration = 123456;

      test('Should unsubscribe and remove the resourceId then resubscribe', async () => {
        const calendarId = 'calendar-id';
        const newGoogleCalendarId = 'new-calendar-id';

        const calendarUpdateEvent = getEvent();
        calendarUpdateEvent.detail.sys.revision = 2;
        calendarUpdateEvent.detail.resourceId = calendarId;
        if ('fields' in calendarUpdateEvent.detail) {
          calendarUpdateEvent.detail.fields.googleCalendarId['en-US'] =
            newGoogleCalendarId;
        }

        subscribe.mockResolvedValueOnce({ resourceId, expiration });
        calendarDataProviderMock.fetchById.mockResolvedValueOnce({
          ...getCalendarDataObject(),
          version: 1,
        });

        const res = await handler(calendarUpdateEvent);

        expect(res).toBe('OK');
        expect(unsubscribe).toHaveBeenCalledWith(resourceId, calendarId);
        expect(calendarDataProviderMock.update).toHaveBeenNthCalledWith(
          1,
          calendarId,
          { resourceId: null },
        );
        expect(subscribe).toHaveBeenCalledWith(newGoogleCalendarId, calendarId);
        expect(calendarDataProviderMock.update).toHaveBeenNthCalledWith(
          2,
          calendarId,
          { expirationDate: expiration, resourceId },
        );
      });

      test('Should skip subscription and unsubscribing and return 200 when the version is old', async () => {
        const calendarUpdateEvent = getEvent();
        subscribe.mockResolvedValueOnce({ resourceId, expiration });

        calendarUpdateEvent.detail.sys.revision = 2;

        subscribe.mockResolvedValueOnce({ resourceId, expiration });
        calendarDataProviderMock.fetchById.mockResolvedValueOnce({
          ...getCalendarDataObject(),
          version: 3,
        });

        const res = await handler(calendarUpdateEvent);

        expect(res).toBe('OK');
        expect(unsubscribe).not.toHaveBeenCalled();
        expect(subscribe).not.toHaveBeenCalled();
      });
    });
  });

  test('Should alert and continue to subscription even when unsubscribing failed', async () => {
    const resourceId = 'some-resource-id';
    const expiration = 123456;
    const calendarUpdateEvent = getEvent();

    calendarUpdateEvent.detail.sys.revision = 2;
    if ('fields' in calendarUpdateEvent.detail) {
      calendarUpdateEvent.detail.fields.googleCalendarId['en-US'] =
        'new-calendar-id';
    }
    calendarDataProviderMock.fetchById.mockResolvedValueOnce({
      ...getCalendarDataObject(),
      version: 1,
    });
    subscribe.mockResolvedValueOnce({ resourceId, expiration });
    const error = new Error();
    unsubscribe.mockRejectedValueOnce(error);

    const res = await handler(calendarUpdateEvent);

    expect(res).toBe('OK');
    expect(subscribe).toHaveBeenCalled();
    expect(alerts.error).toBeCalledWith(error);
  });

  describe('Old resource was not defined', () => {
    const resourceId = 'some-resource-id';
    const expiration = 123456;

    test('Should not unsubscribe', async () => {
      const eventGoogleCalendarId = 'new-calendar-id';

      const calendarSnapshots = getCalendarSnapshots();
      const calendarSnapshot = calendarSnapshots.items[1];
      calendarSnapshot.snapshot.fields.resourceId!['en-US'] = null;

      const getEntryMock = jest.fn().mockResolvedValue({
        getSnapshots: jest.fn().mockResolvedValue({
          items: [calendarSnapshots.items[0], calendarSnapshot],
        }),
      });

      const getContentfulRestClientFactory: jest.MockedFunction<
        () => Promise<Environment>
      > = jest.fn().mockResolvedValue({
        getEntry: getEntryMock,
      });

      const handler = calendarCreatedContentfulHandlerFactory(
        subscribe,
        unsubscribe,
        calendarDataProviderMock,
        alerts,
        logger,
        getContentfulRestClientFactory,
      );

      const calendarUpdateEvent = getEvent();

      if ('fields' in calendarUpdateEvent.detail) {
        calendarUpdateEvent.detail.fields.googleCalendarId['en-US'] =
          eventGoogleCalendarId;
      }

      subscribe.mockResolvedValueOnce({ resourceId, expiration });
      calendarDataProviderMock.fetchById.mockResolvedValueOnce({
        ...getCalendarDataObject(),
        version: 1,
      });

      const res = await handler(calendarUpdateEvent);

      expect(res).toBe('OK');
      expect(unsubscribe).not.toHaveBeenCalled();
      expect(subscribe).toHaveBeenCalledWith(
        eventGoogleCalendarId,
        calendarUpdateEvent.detail.resourceId,
      );
    });

    test('Should not unsubscribe or subscribe is the version is old', async () => {
      const calendarSnapshots = getCalendarSnapshots();
      const calendarSnapshot = calendarSnapshots.items[1];
      calendarSnapshot.snapshot.fields.resourceId!['en-US'] = null;

      const getEntryMock = jest.fn().mockResolvedValue({
        getSnapshots: jest.fn().mockResolvedValue({
          items: [calendarSnapshots.items[0], calendarSnapshot],
        }),
      });

      const getContentfulRestClientFactory: jest.MockedFunction<
        () => Promise<Environment>
      > = jest.fn().mockResolvedValue({
        getEntry: getEntryMock,
      });

      const handler = calendarCreatedContentfulHandlerFactory(
        subscribe,
        unsubscribe,
        calendarDataProviderMock,
        alerts,
        logger,
        getContentfulRestClientFactory,
      );

      const calendarUpdateEvent = getEvent();
      calendarUpdateEvent.detail.sys.revision = 3;

      calendarDataProviderMock.fetchById.mockResolvedValueOnce({
        ...getCalendarDataObject(),
        version: 4,
      });

      subscribe.mockResolvedValueOnce({ resourceId, expiration });

      const res = await handler(calendarUpdateEvent);

      expect(res).toBe('OK');
      expect(unsubscribe).not.toHaveBeenCalled();
      expect(subscribe).not.toHaveBeenCalled();
    });
  });

  describe('multiple calls', () => {
    type EventExpects = (
      currentVersion: number,
      event: EventBridgeEvent<CalendarEvent, CalendarContentfulPayload>,
      subscribe: jest.MockedFunction<
        (
          calendarId: string,
          subscriptionId: string,
        ) => Promise<{ resourceId: string; expiration: number }>
      >,
      unsubscribe: jest.MockedFunction<
        (resourceId: string, channelId: string) => Promise<void>
      >,
      calendarSnapshot: CalendarSnapshot,
      outOfOrder?: boolean,
    ) => Promise<number>;

    const updateEventExpects: EventExpects = async (
      currentVersion,
      event,
      subscribe,
      unsubscribe,
      calendarSnapshot,
    ) => {
      jest.clearAllMocks();

      const getEntryMock = jest.fn().mockResolvedValue({
        getSnapshots: jest.fn().mockResolvedValue({
          items: [getCalendarSnapshot({}), calendarSnapshot],
        }),
      });
      const getContentfulRestClientFactory: jest.MockedFunction<
        () => Promise<Environment>
      > = jest.fn().mockResolvedValue({
        getEntry: getEntryMock,
      });

      const handler = generateHandler(
        currentVersion,
        subscribe,
        unsubscribe,
        alerts,
        getContentfulRestClientFactory,
      );
      const resourceId = 'some-resource-id';
      const expiration = 123456;
      calendarDataProviderMock.fetchById.mockResolvedValueOnce({
        ...getCalendarDataObject(),
        version: currentVersion,
      });
      subscribe.mockResolvedValueOnce({ resourceId, expiration });

      const res = await handler(event);

      expect(res).toBe('OK');
      const id = event.detail.resourceId;

      expect(unsubscribe).toHaveBeenCalledWith(
        calendarSnapshot.snapshot.fields.resourceId!['en-US'],
        id,
      );
      expect(calendarDataProviderMock.update).toHaveBeenCalledWith(id, {
        resourceId: null,
      });
      expect(subscribe).toHaveBeenCalledWith(
        'fields' in event.detail
          ? event.detail.fields.googleCalendarId['en-US']
          : '',
        id,
      );
      expect(calendarDataProviderMock.update).toHaveBeenCalledWith(id, {
        resourceId,
        expirationDate: expiration,
      });
      return event.detail.sys.revision;
    };

    const ignoredEventExpects: EventExpects = async (
      currentVersion,
      event,
      subscribe,
      unsubscribe,
      calendarSnapshot,
      outOfOrder = false,
    ) => {
      jest.clearAllMocks();

      const getEntryMock = jest.fn().mockResolvedValue({
        getSnapshots: jest.fn().mockResolvedValue({
          items: [getCalendarSnapshot({}), calendarSnapshot],
        }),
      });
      const getContentfulRestClientFactory: jest.MockedFunction<
        () => Promise<Environment>
      > = jest.fn().mockResolvedValue({
        getEntry: getEntryMock,
      });

      const handler = generateHandler(
        currentVersion,
        subscribe,
        unsubscribe,
        alerts,
        getContentfulRestClientFactory,
      );
      calendarDataProviderMock.fetchById.mockResolvedValueOnce({
        ...getCalendarDataObject(),
        version: currentVersion,
      });
      const res = await handler(event);
      expect(res).toBe('OK');
      expect(unsubscribe).not.toHaveBeenCalled();
      expect(subscribe).not.toHaveBeenCalled();
      expect(calendarDataProviderMock.update).not.toHaveBeenCalled();
      return outOfOrder ? currentVersion : event.detail.sys.revision;
    };

    test(`events played in order should update accordingly.
    The first event invalidates a calendar,
    the second event should update to a valid calendar.
    Events are fired when we call the update method on calendar controller.
`, async () => {
      const firstEvent = getCalendarContentfulEvent({
        version: 2,
        calendarGoogleId: 'A',
        calendarResourceId: 'resourceID',
      });

      const calendarFirstSnapshot = getCalendarSnapshot({
        version: 1,
        calendarGoogleId: 'Old',
        calendarResourceId: 'resourceID',
      });

      const currentVersion1 = await updateEventExpects(
        1,
        firstEvent,
        subscribe,
        unsubscribe,
        calendarFirstSnapshot,
      );

      expect(currentVersion1).toBe(2);

      const firstEventUpdate = getCalendarContentfulEvent({
        version: 3,
        calendarGoogleId: 'A',
        calendarResourceId: null,
      });

      const calendarFirstEventUpdateSnapshot = getCalendarSnapshot({
        version: 2,
        calendarGoogleId: 'A',
        calendarResourceId: 'resourceID',
      });

      const currentVersion2 = await ignoredEventExpects(
        currentVersion1,
        firstEventUpdate,
        subscribe,
        unsubscribe,
        calendarFirstEventUpdateSnapshot,
      );

      expect(currentVersion2).toBe(3);

      const secondEvent = getCalendarContentfulEvent({
        version: 4,
        calendarGoogleId: 'B',
        calendarResourceId: null,
      });

      const calendarSecondEventSnapshot = getCalendarSnapshot({
        version: 3,
        calendarGoogleId: 'A',
        calendarResourceId: null,
      });

      const currentVersion3 = await updateEventExpects(
        currentVersion2,
        secondEvent,
        subscribe,
        unsubscribe,
        calendarSecondEventSnapshot,
      );

      expect(currentVersion3).toBe(4);

      const secondEventUpdate = getCalendarContentfulEvent({
        version: 5,
        calendarGoogleId: 'B',
        calendarResourceId: 'new-resource-id',
      });

      const calendarSecondEventUpdateSnapshot = getCalendarSnapshot({
        version: 4,
        calendarGoogleId: 'B',
        calendarResourceId: null,
      });

      const currentVersion4 = await ignoredEventExpects(
        currentVersion3,
        secondEventUpdate,
        subscribe,
        unsubscribe,
        calendarSecondEventUpdateSnapshot,
      );
      expect(currentVersion4).toBe(5);
    });
  });
});

const getEvent = (
  detail?: CalendarContentfulPayload,
): EventBridgeEvent<'CalendarsPublished', CalendarContentfulPayload> =>
  createEventBridgeEventMock(
    detail || getCalendarContentfulWebhookDetail({}),
    'CalendarsPublished',
  );

const generateHandler = (
  currentVersion: number,
  subscribe: jest.MockedFunction<
    (
      calendarId: string,
      subscriptionId: string,
    ) => Promise<{ resourceId: string; expiration: number }>
  >,
  unsubscribe: jest.MockedFunction<
    (resourceId: string, channelId: string) => Promise<void>
  >,
  alerts: jest.Mocked<Alerts>,
  getContentfulRestClientFactory: jest.MockedFunction<
    () => Promise<Environment>
  >,
) => {
  const fetchById = jest.fn(() =>
    Promise.resolve({ ...getCalendarDataObject(), version: currentVersion }),
  );
  const handler = calendarCreatedContentfulHandlerFactory(
    subscribe,
    unsubscribe,
    { ...calendarDataProviderMock, fetchById },
    alerts,
    logger,
    getContentfulRestClientFactory,
  );
  return handler;
};
