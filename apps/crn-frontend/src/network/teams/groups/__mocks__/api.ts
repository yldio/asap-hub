import { ListGroupResponse } from '@asap-hub/model';
import { createListGroupResponse } from '@asap-hub/fixtures';

export const getTeamGroups = jest.fn(
  async (): Promise<ListGroupResponse> => ({
    ...createListGroupResponse(2),
  }),
);
