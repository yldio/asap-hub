import nock from 'nock';
import { APIGatewayProxyResult } from 'aws-lambda';
import { WebhookPayload, Calendar } from '@asap-hub/squidex';

import {
  SubscribeToEventChanges,
  webhookCalendarCreatedHandlerFactory,
  GetJWTCredentials,
  subscribeToEventChangesFactory,
  UnsubscribeFromEventChanges,
} from '../../../src/handlers/webhooks/webhook-calendar-created';
import { apiGatewayEvent } from '../../helpers/events';
import { signPayload } from '../../../src/utils/validate-squidex-request';
import {
  createCalendarEvent,
  updateCalendarEvent,
} from './webhook-sync-calendar.fixtures';
import { googleApiUrl } from '../../../src/config';
import { googleApiAuthJWTCredentials } from '../../mocks/google-api.mock';

const createSignedPayload = (payload: WebhookPayload<Calendar>) =>
  apiGatewayEvent({
    headers: {
      'x-signature': signPayload(payload),
    },
    body: JSON.stringify(payload),
  });

describe('Calendar Created Webhook', () => {
  describe('Validation', () => {
    const subscribe: jest.MockedFunction<SubscribeToEventChanges> = jest.fn();
    const unsubscribe: jest.MockedFunction<UnsubscribeFromEventChanges> = jest.fn();
    const handler = webhookCalendarCreatedHandlerFactory(
      subscribe,
      unsubscribe,
    );

    afterEach(() => {
      subscribe.mockClear();
    });

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

    test('Should subscribe with the correct data and return 200 when the subscription was successful', async () => {
      const res = (await handler(
        createSignedPayload(createCalendarEvent),
      )) as APIGatewayProxyResult;

      expect(res.statusCode).toStrictEqual(200);
      expect(subscribe).toHaveBeenCalledWith(
        createCalendarEvent.payload.data.id.iv,
        createCalendarEvent.payload.id,
      );
    });

    test('Should return 400 when the subscription was unsuccessful', async () => {
      const errorMessage =
        'Channel id 238c6b46-706e-11eb-9439-0242ac130002 not unique';
      subscribe.mockRejectedValueOnce(new Error(errorMessage));

      const res = (await handler(
        createSignedPayload(createCalendarEvent),
      )) as APIGatewayProxyResult;

      expect(res.statusCode).toStrictEqual(400);
      expect(res.body).toContain(errorMessage);
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
        expect(subscribe).not.toHaveBeenCalled();
        expect(subscribe).not.toHaveBeenCalled();
      });

      test('Should unsubscribe first and then resubscribe if the calendar ID changed', async () => {
        const res = (await handler(
          createSignedPayload(updateCalendarEvent),
        )) as APIGatewayProxyResult;

        expect(res.statusCode).toStrictEqual(200);
        expect(unsubscribe).toHaveBeenCalledWith(
          updateCalendarEvent.payload.dataOld!.resourceId.iv,
        );
        expect(subscribe).toHaveBeenCalled();
      });

      test('Should not unsubscribe if the old resource ID was null', async () => {
        const res = (await handler(
          createSignedPayload({
            ...updateCalendarEvent,
            payload: {
              ...updateCalendarEvent.payload,
              dataOld: {
                ...updateCalendarEvent.payload.dataOld!,
                resourceId: {
                  iv: null,
                },
              },
            },
          }),
        )) as APIGatewayProxyResult;

        expect(res.statusCode).toStrictEqual(200);
        expect(unsubscribe).not.toHaveBeenCalled();
        expect(subscribe).toHaveBeenCalled();
      });

      test('Should continue to subscription even if unsubscribing failed', async () => {
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
    const subscribeToEventChanges = subscribeToEventChangesFactory(
      getJWTCredentials,
    );

    test('Should subscribe to the calendar events notifications', async () => {
      getJWTCredentials.mockResolvedValueOnce(googleApiAuthJWTCredentials);

      nock(googleApiUrl)
        .post(`/calendar/v3/calendars/${calendarId}/events/watch`)
        .reply(200, {})
        .post('/oauth2/v4/token')
        .reply(200, {
          access_token: '1/8xbJqaOZXSUZbHLl5EOtu1pxz3fmmetKx9W8CV4t79M',
          scope: 'https://www.googleapis.com/auth/prediction',
          token_type: 'Bearer',
          expires_in: 3600,
        });

      await subscribeToEventChanges(calendarId, createCalendarEvent.payload.id);

      expect(nock.isDone()).toBe(true);
    });
  });
});
