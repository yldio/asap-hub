import { WebhookPayload } from '@asap-hub/squidex';
import { signPayload } from '../../src/utils/validate-squidex-request';
import { apiGatewayEvent } from './events';

export const createSignedPayload = <T>(payload: WebhookPayload<T>) =>
  apiGatewayEvent({
    headers: {
      'x-signature': signPayload(payload),
    },
    body: JSON.stringify(payload),
  });
