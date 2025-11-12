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
  ListManuscriptVersionResponse,
  ListPartialManuscriptResponse,
  ListTeamResponse,
  ManuscriptVersionResponse,
  TeamPatchRequest,
  TeamResponse,
} from '@asap-hub/model';
import { GetListOptions } from '@asap-hub/frontend-utils';
import {
  createResearchOutput as originalCreateResearchOutput,
  GetTeamsListOptions,
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

export const getAlgoliaTeams = jest.fn(
  async ({ pageSize }: GetTeamsListOptions): Promise<ListTeamResponse> =>
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
        id: 'manuscript-id-1',
        lastUpdated: '2020-09-23T20:45:22.000Z',
        manuscriptId: 'DA1-000463-002-org-G-1',
        title: 'Manuscript 1',
        teams: 'Team 1',
        assignedUsers: [],
        team: {
          id: 'team-id-1',
          displayName: 'Team 1',
        },
        status: 'Compliant',
      },
    ],
  }),
);

export const getManuscriptVersions = jest.fn(
  async (): Promise<ListManuscriptVersionResponse> => ({
    total: 1,
    items: [
      {
        id: 'mv-manuscript-id-1',
        hasLinkedResearchOutput: false,
        title: 'Manuscript 1',
        type: 'Original Research',
        lifecycle: 'Preprint',
        versionId: 'version-id-1',
        manuscriptId: 'DA1-000463-002-org-G-1',
        url: 'http://example.com',
      },
    ],
  }),
);

export const getManuscriptVersionByManuscriptId = jest.fn(
  async (): Promise<ManuscriptVersionResponse> => ({
    id: 'mv-manuscript-id-1',
    title: 'Manuscript 1',
    type: 'Original Research',
    lifecycle: 'Publication',
    versionId: 'version-id-2',
    manuscriptId: 'DA1-000463-002-org-G-1',
    url: 'http://example.com',
    hasLinkedResearchOutput: false,
  }),
);
