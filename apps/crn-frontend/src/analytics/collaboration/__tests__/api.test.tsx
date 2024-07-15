import {
  createAlgoliaResponse,
  AlgoliaSearchClient,
  ClientSearchResponse,
  AnalyticsSearchOptionsWithFiltering,
} from '@asap-hub/algolia';
import {
  teamCollaborationPerformance,
  userCollaborationPerformance,
} from '@asap-hub/fixtures';
import {
  DocumentCategoryOption,
  ListTeamCollaborationAlgoliaResponse,
  ListUserCollaborationAlgoliaResponse,
  OutputTypeOption,
  TimeRangeOption,
} from '@asap-hub/model';
import nock from 'nock';

import {
  getUserCollaboration,
  getTeamCollaboration,
  getUserCollaborationPerformance,
  getTeamCollaborationPerformance,
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
    | 'user-collaboration-performance'
    | 'team-collaboration-performance'
  >
>;

const search: jest.MockedFunction<Search> = jest.fn();

const algoliaSearchClient = {
  search,
} as unknown as AlgoliaSearchClient<'analytics'>;

const defaultOptions: AnalyticsSearchOptionsWithFiltering = {
  pageSize: 10,
  currentPage: 0,
  timeRange: '30d',
  tags: [],
  sort: '',
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
      objectID: '1-user-collaboration-30d',
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
      objectID: '1-team-collaboration-30d',
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
        filters: `(__meta.range:"${timeRange}")`,
      }),
    );
  });

  it.each`
    category            | documentCategory
    ${'Article'}        | ${'article'}
    ${'Bioinformatics'} | ${'bioinformatics'}
    ${'Dataset'}        | ${'dataset'}
    ${'Lab Resource'}   | ${'lab-resource'}
    ${'Protocol'}       | ${'protocol'}
    ${'All'}            | ${'all'}
  `(
    'returns user collaboration for document category $category',
    async ({ documentCategory }) => {
      await getUserCollaboration(algoliaSearchClient, {
        ...defaultOptions,
        documentCategory,
      });

      expect(search).toHaveBeenCalledWith(
        ['user-collaboration'],
        '',
        expect.objectContaining({
          filters: `(__meta.range:"30d") AND (__meta.documentCategory:"${documentCategory}")`,
        }),
      );
    },
  );
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
  `('returns team collaboration for $range', async ({ timeRange }) => {
    await getTeamCollaboration(algoliaSearchClient, {
      ...defaultOptions,
      timeRange,
    });

    expect(search).toHaveBeenCalledWith(
      ['team-collaboration'],
      '',
      expect.objectContaining({
        filters: `(__meta.range:"${timeRange}")`,
      }),
    );
  });

  it.each`
    type                    | outputType
    ${'ASAP Public Output'} | ${'public'}
    ${'ASAP Output'}        | ${'all'}
  `(
    'returns team collaboration for output type $type',
    async ({ outputType }) => {
      await getTeamCollaboration(algoliaSearchClient, {
        ...defaultOptions,
        outputType,
      });

      expect(search).toHaveBeenCalledWith(
        ['team-collaboration'],
        '',
        expect.objectContaining({
          filters: `(__meta.range:"30d") AND (__meta.outputType:"${outputType}")`,
        }),
      );
    },
  );
});

describe('getUserCollaborationPerformance', () => {
  beforeEach(() => {
    search.mockReset();

    search.mockResolvedValue(
      createAlgoliaResponse<'analytics', 'user-collaboration-performance'>([
        {
          ...userCollaborationPerformance,
          objectID: '1',
          __meta: {
            type: 'user-collaboration-performance',
            range: '30d',
            documentCategory: 'all',
          },
        },
      ]),
    );
  });

  it('returns successfully fetched user collaboration performance', async () => {
    const result = await getUserCollaborationPerformance(algoliaSearchClient, {
      timeRange: '30d',
      documentCategory: 'all',
    });
    expect(result).toEqual(
      expect.objectContaining(userCollaborationPerformance),
    );
  });

  it.each`
    range                        | timeRange
    ${'Last 30 days'}            | ${'30d'}
    ${'Last 90 days'}            | ${'90d'}
    ${'This year (Jan-Today)'}   | ${'current-year'}
    ${'Last 12 months'}          | ${'last-year'}
    ${'Since Hub Launch (2020)'} | ${'all'}
  `(
    'returns user collaboration performance for $range',
    async ({ timeRange }: { timeRange: TimeRangeOption }) => {
      await getUserCollaborationPerformance(algoliaSearchClient, {
        timeRange,
        documentCategory: 'all',
      });

      expect(search).toHaveBeenCalledWith(
        ['user-collaboration-performance'],
        '',
        expect.objectContaining({
          filters: `(__meta.range:"${timeRange}") AND (__meta.documentCategory:"all")`,
        }),
      );
    },
  );

  it.each`
    category            | documentCategory
    ${'Article'}        | ${'article'}
    ${'Bioinformatics'} | ${'bioinformatics'}
    ${'Dataset'}        | ${'dataset'}
    ${'Lab Resource'}   | ${'lab-resource'}
    ${'Protocol'}       | ${'protocol'}
    ${'All'}            | ${'all'}
  `(
    'returns user collaboration performance for $category',
    async ({
      documentCategory,
    }: {
      documentCategory: DocumentCategoryOption;
    }) => {
      await getUserCollaborationPerformance(algoliaSearchClient, {
        timeRange: '30d',
        documentCategory,
      });

      expect(search).toHaveBeenCalledWith(
        ['user-collaboration-performance'],
        '',
        expect.objectContaining({
          filters: `(__meta.range:"30d") AND (__meta.documentCategory:"${documentCategory}")`,
        }),
      );
    },
  );
});

describe('getTeamCollaborationPerformance', () => {
  beforeEach(() => {
    search.mockReset();
    search.mockResolvedValue(
      createAlgoliaResponse<'analytics', 'team-collaboration-performance'>([
        {
          ...teamCollaborationPerformance,
          objectID: '12',
          __meta: {
            type: 'team-collaboration-performance',
            range: '30d',
            outputType: 'all',
          },
        },
      ]),
    );
  });

  it('returns successfully fetched team collaboration performance', async () => {
    const result = await getTeamCollaborationPerformance(algoliaSearchClient, {
      timeRange: '30d',
      outputType: 'all',
    });

    expect(result).toEqual(
      expect.objectContaining(teamCollaborationPerformance),
    );
  });

  it.each`
    range                        | timeRange
    ${'Last 30 days'}            | ${'30d'}
    ${'Last 90 days'}            | ${'90d'}
    ${'This year (Jan-Today)'}   | ${'current-year'}
    ${'Last 12 months'}          | ${'last-year'}
    ${'Since Hub Launch (2020)'} | ${'all'}
  `(
    'returns team collaboration performance for $range',
    async ({ timeRange }: { timeRange: TimeRangeOption }) => {
      await getTeamCollaborationPerformance(algoliaSearchClient, {
        timeRange,
        outputType: 'all',
      });

      expect(search).toHaveBeenCalledWith(
        ['team-collaboration-performance'],
        '',
        expect.objectContaining({
          filters: `(__meta.range:"${timeRange}") AND (__meta.outputType:"all")`,
        }),
      );
    },
  );

  it.each`
    type                    | outputType
    ${'ASAP Public Output'} | ${'public'}
    ${'ASAP Output'}        | ${'all'}
  `(
    'returns team collaboration performance for $type',
    async ({ outputType }: { outputType: OutputTypeOption }) => {
      await getTeamCollaborationPerformance(algoliaSearchClient, {
        timeRange: '30d',
        outputType,
      });

      expect(search).toHaveBeenCalledWith(
        ['team-collaboration-performance'],
        '',
        expect.objectContaining({
          filters: `(__meta.range:"30d") AND (__meta.outputType:"${outputType}")`,
        }),
      );
    },
  );
});
