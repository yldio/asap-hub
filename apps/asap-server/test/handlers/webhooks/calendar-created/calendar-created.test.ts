import nock from 'nock';
import { APIGatewayProxyResult } from 'aws-lambda';
import { WebhookPayload, Calendar } from '@asap-hub/squidex';

import {
  SubscribeToEventChanges,
  calendarCreatedHandlerFactory,
  subscribeToEventChangesFactory,
  UnsubscribeFromEventChanges,
  unsubscribeFromEventChangesFactory,
} from '../../../../src/handlers/webhooks/calendar-created/calendar-created';
import { apiGatewayEvent } from '../../../helpers/events';
import { signPayload } from '../../../../src/utils/validate-squidex-request';
import {
  createCalendarEvent,
  updateCalendarEvent,
} from './webhook-sync-calendar.fixtures';
import {
  googleApiUrl,
  asapApiUrl,
  googleApiToken,
} from '../../../../src/config';
import { googleApiAuthJWTCredentials } from '../../../mocks/google-api.mock';
import { calendarControllerMock } from '../../../mocks/calendar-controller.mock';
import { GetJWTCredentials } from '../../../../src/utils/aws-secret-manager';

const createSignedPayload = (payload: WebhookPayload<Calendar>) =>
  apiGatewayEvent({
    headers: {
      'x-signature': signPayload(payload),
    },
    body: JSON.stringify(payload),
  });

describe('Calendar Webhook', () => {
  const subscribe: jest.MockedFunction<SubscribeToEventChanges> = jest.fn();
  const unsubscribe: jest.MockedFunction<UnsubscribeFromEventChanges> =
    jest.fn();
  const handler = calendarCreatedHandlerFactory(
    subscribe,
    unsubscribe,
    calendarControllerMock,
  );

  afterEach(() => {
    subscribe.mockClear();
    unsubscribe.mockClear();
  });

  describe('Validation', () => {
    test('Should return 204 and not subscribe when the event type is not supported', async () => {
      const res = (await handler(
        createSignedPayload({
          ...createCalendarEvent,
          type: 'notImplemented',
        }),
      )) as APIGatewayProxyResult;

      expect(res.statusCode).toStrictEqual(204);
      expect(subscribe).not.toHaveBeenCalled();
    });
  });

  describe('Create and Update events', () => {
    test('Should subscribe with the correct data, save the resource ID and return 200 when the subscription was successful', async () => {
      const resourceId = 'some-resource-id';
      const expiration = 123456;
      subscribe.mockResolvedValueOnce({ resourceId, expiration });

      const res = (await handler(
        createSignedPayload(createCalendarEvent),
      )) as APIGatewayProxyResult;

      expect(res.statusCode).toStrictEqual(200);
      expect(subscribe).toHaveBeenCalledWith(
        createCalendarEvent.payload.data.id.iv,
        createCalendarEvent.payload.id,
      );
      expect(calendarControllerMock.update).toHaveBeenCalledWith(
        createCalendarEvent.payload.id,
        {
          resourceId,
          expirationDate: expiration,
        },
      );
    });

    test('Should return 502 when the subscription was unsuccessful', async () => {
      const errorMessage =
        'Channel id 238c6b46-706e-11eb-9439-0242ac130002 not unique';
      subscribe.mockRejectedValueOnce(new Error(errorMessage));

      const res = (await handler(
        createSignedPayload(createCalendarEvent),
      )) as APIGatewayProxyResult;

      expect(res.statusCode).toStrictEqual(502);
      expect(res.body).toContain(errorMessage);
    });

    test('Should unsubscribe and skip the subscription if the calendar ID was set to an empty string', async () => {
      const res = (await handler(
        createSignedPayload({
          ...updateCalendarEvent,
          payload: {
            ...updateCalendarEvent.payload,
            data: {
              ...updateCalendarEvent.payload.data,
              id: {
                iv: '',
              },
            },
          },
        }),
      )) as APIGatewayProxyResult;

      expect(res.statusCode).toStrictEqual(200);
      expect(unsubscribe).toHaveBeenCalled();
      expect(subscribe).not.toHaveBeenCalled();
    });
  });

  describe('Calendar Update trigger', () => {
    test('Should skip subscription and unsubscribing and return 200 if the calendar ID did not change', async () => {
      const res = (await handler(
        createSignedPayload({
          ...updateCalendarEvent,
          payload: {
            ...updateCalendarEvent.payload,
            data: {
              ...updateCalendarEvent.payload.data,
              id: {
                iv: 'calendar-id',
              },
            },
            dataOld: {
              ...updateCalendarEvent.payload.dataOld!,
              id: {
                iv: 'calendar-id',
              },
            },
          },
        }),
      )) as APIGatewayProxyResult;

      expect(res.statusCode).toStrictEqual(200);
      expect(unsubscribe).not.toHaveBeenCalled();
      expect(subscribe).not.toHaveBeenCalled();
    });

    test('Should unsubscribe and remove the resourceId then resubscribe if the calendar ID changed', async () => {
      const resourceId = 'some-resource-id';
      const expiration = 123456;
      subscribe.mockResolvedValueOnce({ resourceId, expiration });

      const res = (await handler(
        createSignedPayload(updateCalendarEvent),
      )) as APIGatewayProxyResult;

      expect(res.statusCode).toStrictEqual(200);
      expect(unsubscribe).toHaveBeenCalledWith(
        updateCalendarEvent.payload.dataOld!.resourceId!.iv,
        updateCalendarEvent.payload.id,
      );
      expect(calendarControllerMock.update).toHaveBeenCalledWith(
        createCalendarEvent.payload.id,
        {
          resourceId: null,
        },
      );
      expect(subscribe).toHaveBeenCalled();
    });

    test('Should not unsubscribe if the old resource ID was not defined', async () => {
      const resourceId = 'some-resource-id';
      const expiration = 123456;
      subscribe.mockResolvedValueOnce({ resourceId, expiration });

      const res = (await handler(
        createSignedPayload({
          ...updateCalendarEvent,
          payload: {
            ...updateCalendarEvent.payload,
            dataOld: {
              ...updateCalendarEvent.payload.dataOld!,
              resourceId: undefined,
            },
          },
        }),
      )) as APIGatewayProxyResult;

      expect(res.statusCode).toStrictEqual(200);
      expect(unsubscribe).not.toHaveBeenCalled();
      expect(subscribe).toHaveBeenCalled();
    });

    test('Should continue to subscription even if unsubscribing failed', async () => {
      const resourceId = 'some-resource-id';
      const expiration = 123456;
      subscribe.mockResolvedValueOnce({ resourceId, expiration });
      unsubscribe.mockRejectedValueOnce(new Error());

      const res = (await handler(
        createSignedPayload(updateCalendarEvent),
      )) as APIGatewayProxyResult;

      expect(res.statusCode).toStrictEqual(200);
      expect(subscribe).toHaveBeenCalled();
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
        id: createCalendarEvent.payload.id,
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
      createCalendarEvent.payload.id,
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
