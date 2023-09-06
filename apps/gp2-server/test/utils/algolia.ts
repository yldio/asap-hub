import { EntityResponses, gp2 } from '@asap-hub/algolia';

export const toPayload =
  (
    type: keyof EntityResponses['gp2'],
  ): ((data: gp2.Payload['data']) => gp2.Payload) =>
  (data: gp2.Payload['data']): gp2.Payload =>
    ({ data, type } as gp2.Payload);
