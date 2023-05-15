import { EventBridgeEvent } from 'aws-lambda';
import {
  calendarCreatedSquidexHandlerFactory,
  CalendarEvent,
  CalendarPayload,
  SubscribeToEventChanges,
  UnsubscribeFromEventChanges,
} from '../../../src';
import { Alerts } from '../../../src/utils/alerts';
import { getCalendarDataObject } from '../../fixtures/calendar.fixtures';
import { createEventBridgeEventMock } from '../../helpers/events';
import { calendarDataProviderMock } from '../../mocks/calendar-data-provider.mock';
import { loggerMock as logger } from '../../mocks/logger.mock';
import {
  inOrderfirstSave,
  inOrderfirstSaveUpdateFromUnSubscribe,
  inOrderSecondSave,
  inOrderSecondUpdateFromSubscribe,
  outOfOrderFirstSave,
  outOfOrderSecondSave,
  outOfOrderSecondUpdateFromSubscribe,
  outOfOrderSecondUpdateFromUnsubscribe,
} from './fixtures/payload';
import {
  getCalendarCreateEvent,
  getCalendarUpdateEvent,
} from './webhook-sync-calendar.fixtures';

describe('Calendar handler', () => {
  const subscribe: jest.MockedFunction<SubscribeToEventChanges> = jest.fn();
  const unsubscribe: jest.MockedFunction<UnsubscribeFromEventChanges> =
    jest.fn();
  const alerts: jest.Mocked<Alerts> = {
    error: jest.fn(),
  };
  const handler = calendarCreatedSquidexHandlerFactory(
    subscribe,
    unsubscribe,
    calendarDataProviderMock,
    alerts,
    logger,
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Validation', () => {
    test('valid: additional fields in payload are allowed', async () => {
      const event = getEvent();
      (event.detail.payload as any).additionalField = 'hi';
      const resourceId = 'some-resource-id';
      const expiration = 123456;
      subscribe.mockResolvedValueOnce({ resourceId, expiration });

      await expect(
        handler(event as EventBridgeEvent<CalendarEvent, CalendarPayload>),
      ).resolves.toBe('OK');
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
      await expect(handler(getEvent(undefined, {} as any))).rejects.toThrow(
        /Validation error/,
      );
    });

    test('Should skip any actions and return status OK for an unknown event type', async () => {
      const event = getEvent();
      (event.detail as any).type = 'some-other-type';

      const res = await handler(
        event as EventBridgeEvent<CalendarEvent, CalendarPayload>,
      );

      expect(res).toBe('OK');
      expect(subscribe).not.toHaveBeenCalled();
      expect(calendarDataProviderMock.update).not.toHaveBeenCalled();
    });
  });

  describe('Create and Update events', () => {
    test('Should subscribe with the correct data, save the resource ID and return 200 when the subscription was successful', async () => {
      const resourceId = 'some-resource-id';
      const expiration = 123456;
      subscribe.mockResolvedValueOnce({ resourceId, expiration });

      const res = await handler(getEvent());

      expect(res).toBe('OK');
      expect(subscribe).toHaveBeenCalledWith(
        getCalendarCreateEvent().payload.data.googleCalendarId.iv,
        getCalendarCreateEvent().payload.id,
      );
      expect(calendarDataProviderMock.update).toHaveBeenCalledWith(
        getCalendarCreateEvent().payload.id,
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
      const calendarUpdateEvent = getCalendarUpdateEvent(2);
      calendarUpdateEvent.payload.data.googleCalendarId.iv = '';

      calendarDataProviderMock.fetchById.mockResolvedValueOnce({
        ...getCalendarDataObject(),
        version: 1,
      });

      const res = await handler(
        getEvent('CalendarsUpdated', calendarUpdateEvent),
      );

      expect(res).toBe('OK');
      expect(unsubscribe).toHaveBeenCalled();
      expect(subscribe).not.toHaveBeenCalled();
    });
  });

  describe('Calendar Update trigger', () => {
    test('Should skip subscription and unsubscribing and return 200 if the calendar ID did not change', async () => {
      const calendarUpdateEvent = getCalendarUpdateEvent();
      calendarUpdateEvent.payload.dataOld!.googleCalendarId.iv = 'calendar-id';
      calendarUpdateEvent.payload.data.googleCalendarId.iv =
        calendarUpdateEvent.payload.dataOld!.googleCalendarId.iv;

      const res = await handler(
        getEvent('CalendarsUpdated', calendarUpdateEvent),
      );

      expect(res).toBe('OK');
      expect(unsubscribe).not.toHaveBeenCalled();
      expect(subscribe).not.toHaveBeenCalled();
    });

    describe('Calendar ID changed', () => {
      const resourceId = 'some-resource-id';
      const expiration = 123456;

      test('Should unsubscribe and remove the resourceId then resubscribe', async () => {
        const calendarUpdateEvent = getCalendarUpdateEvent(2);
        subscribe.mockResolvedValueOnce({ resourceId, expiration });
        calendarDataProviderMock.fetchById.mockResolvedValueOnce({
          ...getCalendarDataObject(),
          version: 1,
        });

        const res = await handler(
          getEvent('CalendarsUpdated', calendarUpdateEvent),
        );

        expect(res).toBe('OK');
        expect(unsubscribe).toHaveBeenCalledWith(
          calendarUpdateEvent.payload.dataOld!.resourceId!.iv,
          calendarUpdateEvent.payload.id,
        );
        expect(calendarDataProviderMock.update).toHaveBeenCalledWith(
          calendarUpdateEvent.payload.id,
          {
            resourceId: null,
          },
        );
        expect(subscribe).toHaveBeenCalled();
      });

      test('Should skip subscription and unsubscribing and return 200 when the version is old', async () => {
        const calendarUpdateEvent = getCalendarUpdateEvent(11);
        subscribe.mockResolvedValueOnce({ resourceId, expiration });

        const res = await handler(
          getEvent('CalendarsUpdated', calendarUpdateEvent),
        );

        expect(res).toBe('OK');
        expect(unsubscribe).not.toHaveBeenCalled();
        expect(subscribe).not.toHaveBeenCalled();
      });
    });

    describe('Old resource was not defined', () => {
      const resourceId = 'some-resource-id';
      const expiration = 123456;

      test('Should not unsubscribe', async () => {
        const calendarUpdateEvent = getCalendarUpdateEvent(2);
        calendarUpdateEvent.payload.dataOld!.resourceId = undefined;
        subscribe.mockResolvedValueOnce({ resourceId, expiration });
        calendarDataProviderMock.fetchById.mockResolvedValueOnce({
          ...getCalendarDataObject(),
          version: 1,
        });

        const res = await handler(
          getEvent('CalendarsUpdated', calendarUpdateEvent),
        );

        expect(res).toBe('OK');
        expect(unsubscribe).not.toHaveBeenCalled();
        expect(subscribe).toHaveBeenCalled();
      });

      test('Should not unsubscribe or subscribe is the version is old', async () => {
        const calendarUpdateEvent = getCalendarUpdateEvent(11);
        calendarUpdateEvent.payload.dataOld!.resourceId = undefined;
        subscribe.mockResolvedValueOnce({ resourceId, expiration });

        const res = await handler(
          getEvent('CalendarsUpdated', calendarUpdateEvent),
        );

        expect(res).toBe('OK');
        expect(unsubscribe).not.toHaveBeenCalled();
        expect(subscribe).not.toHaveBeenCalled();
      });
    });

    test('Should alert and continue to subscription even when unsubscribing failed', async () => {
      const resourceId = 'some-resource-id';
      const expiration = 123456;
      const calendarUpdateEvent = getCalendarUpdateEvent(2);
      calendarDataProviderMock.fetchById.mockResolvedValueOnce({
        ...getCalendarDataObject(),
        version: 1,
      });
      subscribe.mockResolvedValueOnce({ resourceId, expiration });
      const error = new Error();
      unsubscribe.mockRejectedValueOnce(error);

      const res = await handler(
        getEvent('CalendarsUpdated', calendarUpdateEvent),
      );

      expect(res).toBe('OK');
      expect(subscribe).toHaveBeenCalled();
      expect(alerts.error).toBeCalledWith(error);
    });
  });

  describe('multiple calls', () => {
    test(`events played in order should update accordingly.
    The first event invalidates a calendar,
    the second event should update to a valid calendar.
    Events are fired when we call the update method on calendar controller.
    (this updates the record in SquidEx firing an event)
`, async () => {
      const firstEvent = inOrderfirstSave();
      const firstEventUpdate = inOrderfirstSaveUpdateFromUnSubscribe();
      const secondEvent = inOrderSecondSave();
      const secondEventUpdate = inOrderSecondUpdateFromSubscribe();
      const currentVersion1 = await updateEventExpects(
        27,
        firstEvent,
        subscribe,
        unsubscribe,
      );
      expect(currentVersion1).toBe(28);
      const currentVersion2 = await ignoredEventExpects(
        currentVersion1,
        firstEventUpdate,
        subscribe,
        unsubscribe,
      );
      expect(currentVersion2).toBe(29);
      const currentVersion3 = await updateEventExpects(
        currentVersion2,
        secondEvent,
        subscribe,
        unsubscribe,
      );
      expect(currentVersion3).toBe(30);
      const currentVersion4 = await ignoredEventExpects(
        currentVersion3,
        secondEventUpdate,
        subscribe,
        unsubscribe,
      );
      expect(currentVersion4).toBe(31);
    });

    test(`first event should be ignore if after the second.
    The first save event is ignored, as the second has been generated by
    another save on the UI.
    The second runs and unsubscribes as it still has a reference to the
    rsourceId.
`, async () => {
      const firstEvent = outOfOrderFirstSave();
      const secondEvent = outOfOrderSecondSave();
      const secondEventUpdate1 = outOfOrderSecondUpdateFromUnsubscribe();
      const secondEventUpdate2 = outOfOrderSecondUpdateFromSubscribe();
      const currentVersion1 = await updateEventExpects(
        31,
        secondEvent,
        subscribe,
        unsubscribe,
      );
      expect(currentVersion1).toBe(33);
      const currentVersion2 = await ignoredEventExpects(
        currentVersion1,
        firstEvent,
        subscribe,
        unsubscribe,
        true,
      );
      expect(currentVersion2).toBe(33);
      const currentVersion3 = await ignoredEventExpects(
        currentVersion2,
        secondEventUpdate1,
        subscribe,
        unsubscribe,
      );
      expect(currentVersion3).toBe(34);
      const currentVersion4 = await ignoredEventExpects(
        currentVersion2,
        secondEventUpdate2,
        subscribe,
        unsubscribe,
      );
      expect(currentVersion4).toBe(35);
    });

    const updateEventExpects: EventExpects = async (
      currentVersion,
      event,
      subscribe,
      unsubscribe,
    ) => {
      jest.clearAllMocks();
      const handler = generateHandler(
        currentVersion,
        subscribe,
        unsubscribe,
        alerts,
      );
      const resourceId = 'some-resource-id';
      const expiration = 123456;
      calendarDataProviderMock.fetchById.mockResolvedValueOnce({
        ...getCalendarDataObject(),
        version: currentVersion,
      });
      subscribe.mockResolvedValueOnce({ resourceId, expiration });

      const res = await handler(getEvent('CalendarsUpdated', event));

      expect(res).toBe('OK');
      const { dataOld, id, data, version } = event.payload;
      expect(unsubscribe).toHaveBeenCalledWith(dataOld!.resourceId!.iv, id);
      expect(calendarDataProviderMock.update).toHaveBeenCalledWith(id, {
        resourceId: null,
      });
      expect(subscribe).toHaveBeenCalledWith(data.googleCalendarId.iv, id);
      expect(calendarDataProviderMock.update).toHaveBeenCalledWith(id, {
        resourceId,
        expirationDate: expiration,
      });
      return version;
    };

    const ignoredEventExpects: EventExpects = async (
      currentVersion,
      event,
      subscribe,
      unsubscribe,
      outOfOrder = false,
    ) => {
      jest.clearAllMocks();
      const handler = generateHandler(
        currentVersion,
        subscribe,
        unsubscribe,
        alerts,
      );
      calendarDataProviderMock.fetchById.mockResolvedValueOnce({
        ...getCalendarDataObject(),
        version: currentVersion,
      });
      const res = await handler(getEvent('CalendarsUpdated', event));
      expect(res).toBe('OK');
      expect(unsubscribe).not.toHaveBeenCalled();
      expect(subscribe).not.toHaveBeenCalled();
      expect(calendarDataProviderMock.update).not.toHaveBeenCalled();
      return outOfOrder ? currentVersion : event.payload.version;
    };
    type EventExpects = (
      currentVersion: number,
      event: CalendarPayload,
      subscribe: jest.MockedFunction<
        (
          calendarId: string,
          subscriptionId: string,
        ) => Promise<{ resourceId: string; expiration: number }>
      >,
      unsubscribe: jest.MockedFunction<
        (resourceId: string, channelId: string) => Promise<void>
      >,
      outOfOrder?: boolean,
    ) => Promise<number>;
  });
});

const getEvent = (type?: CalendarEvent, detail?: CalendarPayload) =>
  createEventBridgeEventMock(
    detail || getCalendarCreateEvent(),
    type || 'CalendarsPublished',
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
) => {
  const fetchById = jest.fn(() =>
    Promise.resolve({ ...getCalendarDataObject(), version: currentVersion }),
  );
  const handler = calendarCreatedSquidexHandlerFactory(
    subscribe,
    unsubscribe,
    { ...calendarDataProviderMock, fetchById },
    alerts,
    logger,
  );
  return handler;
};
