import { PageResponse } from '@asap-hub/model';
import { createPageResponse } from '@asap-hub/fixtures';

export const getPageByPath = jest.fn(
  async (id: string): Promise<PageResponse> => createPageResponse(id),
);
