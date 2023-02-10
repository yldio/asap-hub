import {
  createResearchOutputResponse,
  createWorkingGroupListResponse,
  createWorkingGroupResponse,
} from '@asap-hub/fixtures';
import {
  WorkingGroupListResponse,
  WorkingGroupResponse,
} from '@asap-hub/model';
import { createResearchOutput as originalCreateResearchOutput } from '../../teams/api';

export const getWorkingGroup = jest.fn(
  async (id: string): Promise<WorkingGroupResponse> => ({
    ...createWorkingGroupResponse({}),
    id,
  }),
);

export const getWorkingGroups = jest.fn(
  async (pageSize): Promise<WorkingGroupListResponse> =>
    createWorkingGroupListResponse(pageSize ?? 10),
);

export const createResearchOutput: jest.Mocked<
  typeof originalCreateResearchOutput
> = jest.fn(async () => ({
  ...createResearchOutputResponse(),
  id: 'research-output-id',
}));
