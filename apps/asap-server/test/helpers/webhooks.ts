import { WebhookPayload } from '@asap-hub/squidex';
import { signPayload } from '../../src/utils/validate-squidex-request';
import { getApiGatewayEvent } from './events';

export const createSignedPayload = <T>(payload: WebhookPayload<T>) =>
  getApiGatewayEvent({
    headers: {
      'x-signature': signPayload(payload),
    },
    body: JSON.stringify(payload),
  });
