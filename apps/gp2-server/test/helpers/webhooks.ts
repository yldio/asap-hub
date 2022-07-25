import { signPayload } from '@asap-hub/server-common';
import { WebhookPayload } from '@asap-hub/squidex';
import { squidexSharedSecret } from '../../src/config';
import { getApiGatewayEvent } from './events';

export const createSignedPayload = <T>(payload: WebhookPayload<T>) =>
  getApiGatewayEvent({
    headers: {
      'x-signature': signPayload(payload, squidexSharedSecret),
    },
    body: JSON.stringify(payload),
  });
