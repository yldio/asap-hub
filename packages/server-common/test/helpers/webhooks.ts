import { signPayload } from '@asap-hub/server-common';
import { WebhookPayload } from '@asap-hub/squidex';

export const createSignedHeader = <T>(
  payload: WebhookPayload<T>,
  squidexSharedSecret: string,
) => ({
  'x-signature': signPayload(JSON.stringify(payload), squidexSharedSecret),
});
