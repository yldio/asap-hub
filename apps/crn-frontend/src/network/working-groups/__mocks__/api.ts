import { createWorkingGroupResponse } from '@asap-hub/fixtures';
import { WorkingGroupResponse } from '@asap-hub/model';

export const getWorkingGroup = jest.fn(
  async (id: string): Promise<WorkingGroupResponse> => ({
    ...createWorkingGroupResponse({}),
    id,
  }),
);
