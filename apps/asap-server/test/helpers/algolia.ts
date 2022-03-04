import { EntityResponses, Payload } from '@asap-hub/algolia';

export const toPayload =
  (type: keyof EntityResponses): ((data: Payload['data']) => Payload) =>
  (data: Payload['data']): Payload =>
    ({ data, type } as Payload);
