import { createDiscoverResponse } from '@asap-hub/fixtures';

export const getDiscover = jest
  .fn()
  .mockResolvedValue(createDiscoverResponse());
