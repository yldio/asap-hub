import { APIGatewayProxyResult } from 'aws-lambda';
import { WebhookPayload, Calendar } from '@asap-hub/squidex';

import {
  SubscribeToEventChanges,
  webhookCalendarCreatedHandlerFactory,
} from '../../../src/handlers/webhooks/webhook-calendar-created';
import { apiGatewayEvent } from '../../helpers/events';
import { signPayload } from '../../../src/utils/validate-squidex-request';
import { createCalendarEvent } from './webhook-sync-calendar.fixtures';

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

    const handler = webhookCalendarCreatedHandlerFactory(subscribe);

    afterEach(() => {
      subscribe.mockClear();
    });

    test('Should return 204 and not subscribe when the event type is not implemented', async () => {
      const res = (await handler(
        createSignedPayload({
          ...createCalendarEvent,
          type: 'notImplemented',
        }),
      )) as APIGatewayProxyResult;

      expect(res.statusCode).toStrictEqual(204);
      expect(subscribe).not.toHaveBeenCalled();
    });

    test('Should return 200 and subscribe with the calendar ID when the type is valid', async () => {
      const res = (await handler(
        createSignedPayload(createCalendarEvent),
      )) as APIGatewayProxyResult;

      expect(res.statusCode).toStrictEqual(200);
      expect(subscribe).toHaveBeenCalledWith(
        createCalendarEvent.payload.data.id.iv,
      );
    });
  });

  // describe("Subscription")
});

// describe('POST /webhook/calendars', () => {
//   test('returns 200 when successfully fetches user orcid', async () => {
//     const res = (await handler(
//       createSignedPayload(fixtures.createCalendarEvent),
//     )) as APIGatewayProxyResult;

//     expect(res.statusCode).toStrictEqual(200);
//   });
// });
