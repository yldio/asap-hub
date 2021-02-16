import { APIGatewayProxyResult } from 'aws-lambda';
import { WebhookPayload, Calendar } from '@asap-hub/squidex';

import { handler } from '../../../src/handlers/webhooks/webhook-sync-calendar';
import { apiGatewayEvent } from '../../helpers/events';
import { signPayload } from '../../../src/utils/validate-squidex-request';

import * as fixtures from './webhook-sync-calendar.fixtures';

const createSignedPayload = (payload: WebhookPayload<Calendar>) =>
  apiGatewayEvent({
    headers: {
      'x-signature': signPayload(payload),
    },
    body: JSON.stringify(payload),
  });

describe('POST /webhook/calendars - validation', () => {
  test('returns 204 when event type is not implemented', async () => {
    const res = (await handler(
      createSignedPayload({
        ...fixtures.createCalendarEvent,
        type: 'notImplemented',
      }),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(204);
  });
});

describe('POST /webhook/calendars', () => {
  test('returns 200 when successfully fetches user orcid', async () => {
    const res = (await handler(
      createSignedPayload(fixtures.createCalendarEvent),
    )) as APIGatewayProxyResult;

    expect(res.statusCode).toStrictEqual(200);
  });
});
