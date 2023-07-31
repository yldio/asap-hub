import { EntityResponses, Payload } from '@asap-hub/algolia';

type Apps = 'crn' | 'gp2';
export const toPayload =
  <App extends Apps>(
    type: keyof EntityResponses[App],
  ): ((data: Payload['data']) => Payload) =>
  (data: Payload['data']): Payload =>
    ({ data, type } as Payload);
