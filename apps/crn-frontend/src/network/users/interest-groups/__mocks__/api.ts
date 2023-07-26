import { ListInterestGroupResponse } from '@asap-hub/model';
import { createListInterestGroupResponse } from '@asap-hub/fixtures';

export const getUserInterestGroups = jest.fn(
  async (id: string): Promise<ListInterestGroupResponse> =>
    createListInterestGroupResponse(1),
);
