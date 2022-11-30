import {
  createWorkingGroupListResponse,
  createWorkingGroupResponse,
} from '@asap-hub/fixtures';
import {
  WorkingGroupListResponse,
  WorkingGroupResponse,
} from '@asap-hub/model';

export const getWorkingGroup = jest.fn(
  async (id: string): Promise<WorkingGroupResponse> => ({
    ...createWorkingGroupResponse({}),
    id,
  }),
);

export const getWorkingGroups = jest.fn(
  async (): Promise<WorkingGroupListResponse> =>
    createWorkingGroupListResponse(1),
);
