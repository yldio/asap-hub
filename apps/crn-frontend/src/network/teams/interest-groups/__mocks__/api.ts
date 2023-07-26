import { ListInterestGroupResponse } from '@asap-hub/model';
import { createListInterestGroupResponse } from '@asap-hub/fixtures';

export const getTeamInterestGroups = jest.fn(
  async (): Promise<ListInterestGroupResponse> => ({
    ...createListInterestGroupResponse(2),
  }),
);
