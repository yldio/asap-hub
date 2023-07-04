import { ListGuideResponse } from '@asap-hub/model';
import { createListGuidesResponse } from '@asap-hub/fixtures';

export const getGuides = jest.fn(
  async (): Promise<ListGuideResponse> => createListGuidesResponse(5),
);
