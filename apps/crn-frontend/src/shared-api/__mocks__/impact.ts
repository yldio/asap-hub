import { ListImpactsResponse } from '@asap-hub/model';

export const getImpacts = jest.fn(
  async (): Promise<ListImpactsResponse> => ({
    total: 0,
    items: [],
  }),
);
