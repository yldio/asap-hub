import { createDiscoverResponse } from '@asap-hub/fixtures';
import { DiscoverResponse } from '@asap-hub/model';

export const getDiscover = jest.fn(
  async (): Promise<DiscoverResponse> => ({
    ...createDiscoverResponse(),
  }),
);
