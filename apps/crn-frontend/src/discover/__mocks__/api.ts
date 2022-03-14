import { DiscoverResponse } from '@asap-hub/model';
import { createDiscoverResponse } from '@asap-hub/fixtures';

export const getDiscover = jest.fn(
  async (): Promise<DiscoverResponse> => createDiscoverResponse(),
);
