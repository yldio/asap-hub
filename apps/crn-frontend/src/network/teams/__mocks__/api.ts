import {
  createDiscussionResponse,
  createListLabsResponse,
  createListTeamResponse,
  createMessage,
  createResearchOutputResponse,
  createTeamResponse,
} from '@asap-hub/fixtures';
import {
  DiscussionRequest,
  DiscussionResponse,
  ListLabsResponse,
  ListPartialManuscriptResponse,
  ListTeamResponse,
  TeamPatchRequest,
  TeamResponse,
} from '@asap-hub/model';
import { GetListOptions } from '@asap-hub/frontend-utils';
import {
  createResearchOutput as originalCreateResearchOutput,
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

export const createResearchOutput: jest.Mocked<
  typeof originalCreateResearchOutput
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

export const getDiscussion = jest.fn(
  async (id: string): Promise<DiscussionResponse> => ({
    ...createDiscussionResponse(),
    id,
  }),
);

export const updateDiscussion = jest.fn(
  async (id: string, patch: DiscussionRequest): Promise<DiscussionResponse> => {
    const discussion = await getDiscussion(id);
    discussion.replies = [createMessage(patch.text)];
    return discussion;
  },
);

export const getManuscripts = jest.fn(
  async (): Promise<ListPartialManuscriptResponse> => ({
    total: 1,
    items: [
      {
        id: 'DA1-000463-002-org-G-1',
        lastUpdated: '2020-09-23T20:45:22.000Z',
        manuscriptId: 'manuscript-id-1',
        team: {
          id: 'team-id-1',
          displayName: 'Team 1',
        },
        status: 'Compliant',
      },
    ],
  }),
);
