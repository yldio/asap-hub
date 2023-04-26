import { signPayload } from '@asap-hub/server-common';
import { SquidexWebhookPayload } from '@asap-hub/squidex';

export const createSignedHeader = <T>(
  payload: SquidexWebhookPayload<T>,
  squidexSharedSecret: string,
) => ({
  'x-signature': signPayload(JSON.stringify(payload), squidexSharedSecret),
});
