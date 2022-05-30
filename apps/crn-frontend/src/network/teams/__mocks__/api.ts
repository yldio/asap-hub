import {
  createListLabsResponse,
  createListTeamResponse,
  createResearchOutputResponse,
  createTeamResponse,
} from '@asap-hub/fixtures';
import {
  ListLabsResponse,
  ListTeamResponse,
  TeamPatchRequest,
  TeamResponse,
} from '@asap-hub/model';
import { GetListOptions } from '@asap-hub/frontend-utils';
import {
  createTeamResearchOutput as originalCreateTeamResearchOutput,
  updateTeamResearchOutput as originalUpdateTeamResearchOutput,
} from '../api';

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
  ...createResearchOutputResponse(),
  id: 'research-output-id',
}));

export const updateTeamResearchOutput: jest.Mocked<
  typeof originalUpdateTeamResearchOutput
> = jest.fn(async () => ({
  ...createResearchOutputResponse(),
  id: 'research-output-id',
}));

export const getLabs = jest.fn(
  async (): Promise<ListLabsResponse> => createListLabsResponse(5),
);
