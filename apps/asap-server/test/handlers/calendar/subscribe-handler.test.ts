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

describe('Calendar Webhook', () => {
  const subscribe: jest.MockedFunction<SubscribeToEventChanges> = jest.fn();
  const unsubscribe: jest.MockedFunction<UnsubscribeFromEventChanges> =
    jest.fn();
  const alerts: jest.Mocked<Alerts> = {
    error: jest.fn(),
  };
  const handler = calendarCreatedHandlerFactory(
    subscribe,
    unsubscribe,
    calendarControllerMock,
    alerts,
  );

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
  });

  describe('Create and Update events', () => {
    test('Should subscribe with the correct data, save the resource ID and return 200 when the subscription was successful', async () => {
      const resourceId = 'some-resource-id';
      const expiration = 123456;
      subscribe.mockResolvedValueOnce({ resourceId, expiration });

      const res = await handler(getEvent());

      expect(res).toBe('OK');
      expect(subscribe).toHaveBeenCalledWith(
        getCalendarCreateEvent().payload.data.id.iv,
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

    test('Should return 502 and alert when the subscription was unsuccessful', async () => {
      const errorMessage =
        'Channel id 238c6b46-706e-11eb-9439-0242ac130002 not unique';
      const error = new Error(errorMessage);
      subscribe.mockRejectedValueOnce(error);

      await expect(handler(getEvent())).rejects.toThrow(error);
      expect(alerts.error).toBeCalledWith(error);
    });

    test('Should unsubscribe and skip the subscription if the calendar ID was set to an empty string', async () => {
      const calendarUpdateEvent = getCalendarUpdateEvent();
      calendarUpdateEvent.payload.data.id.iv = '';

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
      calendarUpdateEvent.payload.dataOld!.id.iv = 'calendar-id';
      calendarUpdateEvent.payload.data.id.iv =
        calendarUpdateEvent.payload.dataOld!.id.iv;

      const res = await handler(
        getEvent('CalendarUpdated', calendarUpdateEvent),
      );

      expect(res).toBe('OK');
      expect(unsubscribe).not.toHaveBeenCalled();
      expect(subscribe).not.toHaveBeenCalled();
    });

    test('Should unsubscribe and remove the resourceId then resubscribe if the calendar ID changed', async () => {
      const resourceId = 'some-resource-id';
      const expiration = 123456;
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

    test('Should not unsubscribe if the old resource ID was not defined', async () => {
      const resourceId = 'some-resource-id';
      const expiration = 123456;
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
