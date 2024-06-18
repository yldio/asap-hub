import { AlgoliaSearchClient, ClientSearchResponse } from '@asap-hub/algolia';
import {
  ListTeamCollaborationAlgoliaResponse,
  ListUserCollaborationAlgoliaResponse,
} from '@asap-hub/model';
import nock from 'nock';

import { createAlgoliaResponse } from '../../../__fixtures__/algolia';
import {
  getUserCollaboration,
  CollaborationListOptions,
  getTeamCollaboration,
} from '../api';

jest.mock('../../../config');

afterEach(() => {
  nock.cleanAll();
});

type Search = () => Promise<
  ClientSearchResponse<
    'analytics',
    | 'team-productivity'
    | 'team-productivity-performance'
    | 'user-productivity'
    | 'user-productivity-performance'
    | 'team-collaboration'
    | 'user-collaboration'
  >
>;

const search: jest.MockedFunction<Search> = jest.fn();

const algoliaSearchClient = {
  search,
} as unknown as AlgoliaSearchClient<'analytics'>;

const defaultOptions: CollaborationListOptions = {
  pageSize: 10,
  currentPage: 0,
  timeRange: '30d',
};

const userCollaborationResponse: ListUserCollaborationAlgoliaResponse = {
  total: 1,
  items: [
    {
      id: '1',
      name: 'Test User',
      isAlumni: false,
      teams: [
        {
          id: '1',
          team: 'Team A',
          isTeamInactive: false,
          role: 'Collaborating PI',
          outputsCoAuthoredAcrossTeams: 1,
          outputsCoAuthoredWithinTeam: 2,
        },
      ],
    },
  ],
};

const teamCollaborationResponse: ListTeamCollaborationAlgoliaResponse = {
  total: 1,
  items: [
    {
      id: '1',
      name: 'Team 1',
      isInactive: false,
      outputsCoProducedWithin: {
        Article: 1,
        Bioinformatics: 0,
        Dataset: 0,
        'Lab Resource': 0,
        Protocol: 1,
      },
      outputsCoProducedAcross: {
        byDocumentType: {
          Article: 1,
          Bioinformatics: 0,
          Dataset: 0,
          'Lab Resource': 0,
          Protocol: 1,
        },
        byTeam: [
          {
            id: '2',
            name: 'Team 2',
            isInactive: false,
            Article: 1,
            Bioinformatics: 0,
            Dataset: 0,
            'Lab Resource': 0,
            Protocol: 1,
          },
        ],
      },
    },
  ],
};

describe('getUserCollaboration', () => {
  beforeEach(() => {
    search.mockReset();

    search.mockResolvedValue(
      createAlgoliaResponse<'analytics', 'user-collaboration'>([
        {
          ...userCollaborationResponse.items[0]!,
          objectID: `${
            userCollaborationResponse.items[0]!.id
          }-user-collaboration-30d`,
          __meta: { type: 'user-collaboration', range: '30d' },
        },
      ]),
    );
  });

  it('returns successfully fetched user collaboration', async () => {
    const userCollaboration = await getUserCollaboration(
      algoliaSearchClient,
      defaultOptions,
    );

    expect(userCollaboration).toMatchObject(userCollaborationResponse);
  });

  it.each`
    range                        | timeRange
    ${'Last 30 days'}            | ${'30d'}
    ${'Last 90 days'}            | ${'90d'}
    ${'This year (Jan-Today)'}   | ${'current-year'}
    ${'Last 12 months'}          | ${'last-year'}
    ${'Since Hub Launch (2020)'} | ${'all'}
  `('returns user collaboration for $range', async ({ timeRange }) => {
    await getUserCollaboration(algoliaSearchClient, {
      ...defaultOptions,
      timeRange,
    });

    expect(search).toHaveBeenCalledWith(
      ['user-collaboration'],
      '',
      expect.objectContaining({
        filters: `__meta.range:"${timeRange}"`,
      }),
    );
  });
});

describe('getTeamCollaboration', () => {
  beforeEach(() => {
    search.mockReset();

    search.mockResolvedValue(
      createAlgoliaResponse<'analytics', 'team-collaboration'>([
        {
          ...teamCollaborationResponse.items[0]!,
          objectID: `${
            teamCollaborationResponse.items[0]!.id
          }-team-collaboration-30d`,
          __meta: { type: 'team-collaboration', range: '30d' },
        },
      ]),
    );
  });

  it('returns successfully fetched team collaboration', async () => {
    const teamCollaboration = await getTeamCollaboration(
      algoliaSearchClient,
      defaultOptions,
    );

    expect(teamCollaboration).toMatchObject(teamCollaborationResponse);
  });

  it.each`
    range                        | timeRange
    ${'Last 30 days'}            | ${'30d'}
    ${'Last 90 days'}            | ${'90d'}
    ${'This year (Jan-Today)'}   | ${'current-year'}
    ${'Last 12 months'}          | ${'last-year'}
    ${'Since Hub Launch (2020)'} | ${'all'}
  `('returns user collaboration for $range', async ({ timeRange }) => {
    await getTeamCollaboration(algoliaSearchClient, {
      ...defaultOptions,
      timeRange,
    });

    expect(search).toHaveBeenCalledWith(
      ['team-collaboration'],
      '',
      expect.objectContaining({
        filters: `__meta.range:"${timeRange}"`,
      }),
    );
  });
});
