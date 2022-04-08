import { GetListOptions } from '@asap-hub/api-util';
import {
  createListLabsResponse,
  createListTeamResponse,
  createTeamResponse,
} from '@asap-hub/fixtures';
import {
  ListLabsResponse,
  ListTeamResponse,
  TeamPatchRequest,
  TeamResponse,
} from '@asap-hub/model';

import { createTeamResearchOutput as originalCreateTeamResearchOutput } from '../api';

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

export const createTeamResearchOutput: jest.Mocked<
  typeof originalCreateTeamResearchOutput
> = jest.fn(async () => ({
  id: 'research-output-id',
}));

export const getLabs = jest.fn(
  async (): Promise<ListLabsResponse> => createListLabsResponse(5),
);
