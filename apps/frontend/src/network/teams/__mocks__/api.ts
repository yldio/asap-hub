import {
  TeamResponse,
  TeamPatchRequest,
  ListTeamResponse,
} from '@asap-hub/model';
import { createTeamResponse, createListTeamResponse } from '@asap-hub/fixtures';
import { GetListOptions } from '../../../api-util';

export const getTeam = jest.fn(
  async (id: string): Promise<TeamResponse> => ({
    ...createTeamResponse(),
    id,
  }),
);

export const patchTeam = jest.fn(
  async (id: string, patch: TeamPatchRequest): Promise<TeamResponse> => {
    const user = await getTeam(id);
    return {
      ...user,
      ...patch,
    };
  },
);

export const getTeams = jest.fn(
  async ({ pageSize }: GetListOptions): Promise<ListTeamResponse> =>
    createListTeamResponse(pageSize ?? 10),
);
