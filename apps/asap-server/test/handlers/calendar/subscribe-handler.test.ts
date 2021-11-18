import nock from 'nock';
import { EventBridgeEvent } from 'aws-lambda';
import { WebhookPayload, Calendar } from '@asap-hub/squidex';

import {
  SubscribeToEventChanges,
  calendarCreatedHandlerFactory,
  subscribeToEventChangesFactory,
  UnsubscribeFromEventChanges,
  unsubscribeFromEventChangesFactory,
} from '../../../src/handlers/calendar/subscribe-handler';
import { createEventBridgeEventMock } from '../../helpers/events';
import {
  getCalendarCreateEvent,
  getCalendarUpdateEvent,
} from './webhook-sync-calendar.fixtures';
import { googleApiUrl, asapApiUrl, googleApiToken } from '../../../src/config';
import { googleApiAuthJWTCredentials } from '../../mocks/google-api.mock';
import { calendarControllerMock } from '../../mocks/calendar-controller.mock';
import { GetJWTCredentials } from '../../../src/utils/aws-secret-manager';
import { Alerts } from '../../../src/utils/alerts';
import { CalendarEventType } from '../../../src/handlers/webhooks/webhook-calendar';
import { CalendarRaw } from '../../../src/controllers/calendars';
import {
  firstSaveGeneratedPayload,
  firstSavePayload,
} from './fixtures/payload';

describe('Calendar handler', () => {
  const subscribe: jest.MockedFunction<SubscribeToEventChanges> = jest.fn();
  const unsubscribe: jest.MockedFunction<UnsubscribeFromEventChanges> =
    jest.fn();
  const alerts: jest.Mocked<Alerts> = {
    error: jest.fn(),
  };
  const handler = generateHandler(23, subscribe, unsubscribe, alerts);

  afterEach(() => {
    subscribe.mockClear();
    unsubscribe.mockClear();
  });

  describe('Validation', () => {
    test('Should throw an error and not subscribe when the payload is not valid', async () => {
      await expect(handler(getEvent(undefined, {} as any))).rejects.toThrow(
        /is required/,
      );
    });

    test('Should skip any actions and return status OK for an unknown event type', async () => {
      const event = getEvent();
      event.detail.type = 'some-other-type';

      const res = await handler(event);

      expect(res).toBe('OK');
      expect(subscribe).not.toHaveBeenCalled();
      expect(calendarControllerMock.update).not.toHaveBeenCalled();
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
      expect(calendarControllerMock.update).toHaveBeenCalledWith(
        getCalendarCreateEvent().payload.id,
        {
          resourceId,
          expirationDate: expiration,
        },
      );
    });

    test('Should return "ERROR" and alert when the subscription was unsuccessful, but should not throw', async () => {
      const errorMessage =
        'Channel id 238c6b46-706e-11eb-9439-0242ac130002 not unique';
      const error = new Error(errorMessage);
      subscribe.mockRejectedValueOnce(error);

      const res = await handler(getEvent());

      expect(res).toBe('ERROR');
      expect(alerts.error).toBeCalledWith(error);
    });

    test('Should unsubscribe and skip the subscription if the calendar ID was set to an empty string', async () => {
      const calendarUpdateEvent = getCalendarUpdateEvent();
      calendarUpdateEvent.payload.data.googleCalendarId.iv = '';

      const res = await handler(
        getEvent('CalendarUpdated', calendarUpdateEvent),
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
        getEvent('CalendarUpdated', calendarUpdateEvent),
      );

      expect(res).toBe('OK');
      expect(unsubscribe).not.toHaveBeenCalled();
      expect(subscribe).not.toHaveBeenCalled();
    });

    describe('Calendar ID changed', () => {
      const resourceId = 'some-resource-id';
      const expiration = 123456;
      test('Should unsubscribe and remove the resourceId then resubscribe', async () => {
        const calendarUpdateEvent = getCalendarUpdateEvent();
        subscribe.mockResolvedValueOnce({ resourceId, expiration });

        const res = await handler(
          getEvent('CalendarUpdated', calendarUpdateEvent),
        );

        expect(res).toBe('OK');
        expect(unsubscribe).toHaveBeenCalledWith(
          calendarUpdateEvent.payload.dataOld!.resourceId!.iv,
          calendarUpdateEvent.payload.id,
        );
        expect(calendarControllerMock.update).toHaveBeenCalledWith(
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
          getEvent('CalendarUpdated', calendarUpdateEvent),
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
        const calendarUpdateEvent = getCalendarUpdateEvent();
        calendarUpdateEvent.payload.dataOld!.resourceId = undefined;
        subscribe.mockResolvedValueOnce({ resourceId, expiration });

        const res = await handler(
          getEvent('CalendarUpdated', calendarUpdateEvent),
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
          getEvent('CalendarUpdated', calendarUpdateEvent),
        );

        expect(res).toBe('OK');
        expect(unsubscribe).not.toHaveBeenCalled();
        expect(subscribe).not.toHaveBeenCalled();
      });
    });

    test('Should alert and continue to subscription even when unsubscribing failed', async () => {
      const resourceId = 'some-resource-id';
      const expiration = 123456;
      const calendarUpdateEvent = getCalendarUpdateEvent();

      subscribe.mockResolvedValueOnce({ resourceId, expiration });
      const error = new Error();
      unsubscribe.mockRejectedValueOnce(error);

      const res = await handler(
        getEvent('CalendarUpdated', calendarUpdateEvent),
      );

      expect(res).toBe('OK');
      expect(subscribe).toHaveBeenCalled();
      expect(alerts.error).toBeCalledWith(error);
    });
  });
  describe('multilple calls', () => {
    test('events played in order should update accordingly', async () => {
      const firstEvent = getCalendarUpdateEvent(28);
      const firstEventGenerated = generatedPayload(29);
      const secondEvent = getCalendarUpdateEvent(30);
      const secondEventGenerated = generatedPayload(31);
      const currentVersion1 = await updateEventExpects(
        23,
        firstEvent,
        subscribe,
        unsubscribe,
      );
      const currentVersion2 = await ignoredEventExpects(
        currentVersion1,
        firstEventGenerated,
        subscribe,
        unsubscribe,
      );
      const currentVersion3 = await updateEventExpects(
        currentVersion2,
        secondEvent,
        subscribe,
        unsubscribe,
      );
      await ignoredEventExpects(
        currentVersion3,
        secondEventGenerated,
        subscribe,
        unsubscribe,
      );
    });
    test('first event should be ignore if after the second', async () => {
      const firstEvent = getCalendarUpdateEvent(28);
      const secondEvent = getCalendarUpdateEvent(29);
      const secondEventGenerated = firstSaveGeneratedPayload(30);
      const currentVersion1 = await updateEventExpects(
        23,
        secondEvent,
        subscribe,
        unsubscribe,
      );
      const currentVersion2 = await ignoredEventExpects(
        currentVersion1,
        firstEvent,
        subscribe,
        unsubscribe,
      );
      await ignoredEventExpects(
        currentVersion2,
        secondEventGenerated,
        subscribe,
        unsubscribe,
      );
    });
    const generatedPayload = (version: number) => {
      const event = getCalendarUpdateEvent(version);
      const calendarId = 'a-calendar-id';
      event.payload.dataOld!.googleCalendarId.iv = calendarId;
      event.payload.data.googleCalendarId.iv = calendarId;
      return event;
    };

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
      subscribe.mockResolvedValueOnce({ resourceId, expiration });

      const res = await handler(getEvent('CalendarUpdated', event));

      expect(res).toBe('OK');
      const { dataOld, id, data, version } = event.payload;
      expect(unsubscribe).toHaveBeenCalledWith(dataOld!.resourceId!.iv, id);
      expect(calendarControllerMock.update).toHaveBeenCalledWith(id, {
        resourceId: null,
      });
      expect(subscribe).toHaveBeenCalledWith(data.googleCalendarId.iv, id);
      expect(calendarControllerMock.update).toHaveBeenCalledWith(id, {
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
    ) => {
      jest.clearAllMocks();
      const handler = generateHandler(
        currentVersion,
        subscribe,
        unsubscribe,
        alerts,
      );
      const res = await handler(getEvent('CalendarUpdated', event));
      expect(res).toBe('OK');
      expect(unsubscribe).not.toHaveBeenCalled();
      expect(subscribe).not.toHaveBeenCalled();
      expect(calendarControllerMock.update).not.toHaveBeenCalled();
      return currentVersion;
    };
    type EventExpects = (
      currentVersion: number,
      event: WebhookPayload<Calendar>,
      subscribe: jest.MockedFunction<
        (
          calendarId: string,
          subscriptionId: string,
        ) => Promise<{ resourceId: string; expiration: number }>
      >,
      unsubscribe: jest.MockedFunction<
        (resourceId: string, channelId: string) => Promise<void>
      >,
    ) => Promise<number>;
  });
});

describe('Subscription', () => {
  const calendarId = 'calendar-id';
  const getJWTCredentials: jest.MockedFunction<GetJWTCredentials> = jest.fn();
  const subscribeToEventChanges =
    subscribeToEventChangesFactory(getJWTCredentials);

  test('Should subscribe to the calendar events notifications and return the resourceId', async () => {
    getJWTCredentials.mockResolvedValueOnce(googleApiAuthJWTCredentials);

    const expiration = 1617196357000;

    nock(googleApiUrl)
      .post('/oauth2/v4/token')
      .reply(200, {
        access_token: '1/8xbJqaOZXSUZbHLl5EOtu1pxz3fmmetKx9W8CV4t79M',
        scope: 'https://www.googleapis.com/auth/prediction',
        token_type: 'Bearer',
        expires_in: 3600,
      })
      .post(`/calendar/v3/calendars/${calendarId}/events/watch`, {
        id: getCalendarCreateEvent().payload.id,
        token: googleApiToken,
        type: 'web_hook',
        address: `${asapApiUrl}/webhook/events`,
        params: {
          // 30 days, which is a maximum TTL
          ttl: 2592000,
        },
      })
      .reply(200, {
        resourceId: 'some-resource-id',
        expiration: `${expiration}`,
      });

    const result = await subscribeToEventChanges(
      calendarId,
      getCalendarCreateEvent().payload.id,
    );

    expect(result).toEqual({
      resourceId: 'some-resource-id',
      expiration,
    });
    expect(nock.isDone()).toBe(true);
  });
});

describe('Unsubscribing', () => {
  const resourceId = 'resource-id';
  const channelId = 'channel-id';
  const getJWTCredentials: jest.MockedFunction<GetJWTCredentials> = jest.fn();
  const unsubscribeFromEventChanges =
    unsubscribeFromEventChangesFactory(getJWTCredentials);

  test('Should unsubscribe from the calendar events notifications', async () => {
    getJWTCredentials.mockResolvedValueOnce(googleApiAuthJWTCredentials);

    nock.cleanAll();

    nock(googleApiUrl)
      .post('/oauth2/v4/token')
      .reply(200, {
        access_token: '1/8xbJqaOZXSUZbHLl5EOtu1pxz3fmmetKx9W8CV4t79M',
        scope: 'https://www.googleapis.com/auth/prediction',
        token_type: 'Bearer',
        expires_in: 3600,
      })
      .post(`/calendar/v3/channels/stop`, {
        id: channelId,
        resourceId,
      })
      .reply(200, {});

    await unsubscribeFromEventChanges(resourceId, channelId);

    if (!nock.isDone()) {
      console.error('pending mocks: %j', nock.pendingMocks());
    }

    expect(nock.isDone()).toBe(true);
  });
});

const getEvent = (
  type?: CalendarEventType,
  detail?: WebhookPayload<Calendar>,
): EventBridgeEvent<CalendarEventType, WebhookPayload<Calendar>> =>
  createEventBridgeEventMock(
    detail || getCalendarCreateEvent(),
    type || 'CalendarCreated',
  );
function generateHandler(
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
) {
  const fetchById = jest.fn(() =>
    Promise.resolve({ version: currentVersion } as CalendarRaw),
  );
  const handler = calendarCreatedHandlerFactory(
    subscribe,
    unsubscribe,
    { ...calendarControllerMock, fetchById },
    alerts,
  );
  return handler;
}
