import {
  AlgoliaSearchClient,
  AnalyticsSearchOptionsWithFiltering,
  ClientSearchResponse,
  createAlgoliaResponse,
} from '@asap-hub/algolia';
import {
  teamCollaborationPerformance,
  teamCollaborationResponse,
  userCollaborationPerformance,
  userCollaborationResponse,
  preliminaryDataSharingResponse,
  mockOpensearchResponse,
} from '@asap-hub/fixtures';
import {
  DocumentCategoryOption,
  OutputTypeOption,
  SortTeamCollaboration,
  SortUserCollaboration,
  TimeRangeOption,
  PreliminaryDataSharingDataObject,
} from '@asap-hub/model';
import nock from 'nock';

import {
  getTeamCollaboration,
  getTeamCollaborationPerformance,
  getUserCollaboration,
  getUserCollaborationPerformance,
  getPreliminaryDataSharing,
} from '../api';
import { OpensearchClient } from '../../utils/opensearch';

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

const defaultUserOptions: AnalyticsSearchOptionsWithFiltering<SortUserCollaboration> =
  {
    pageSize: 10,
    currentPage: 0,
    timeRange: '30d',
    tags: [],
    sort: 'user_asc',
  };

const defaultTeamOptions: AnalyticsSearchOptionsWithFiltering<SortTeamCollaboration> =
  {
    pageSize: 10,
    currentPage: 0,
    timeRange: '30d',
    tags: [],
    sort: 'team_asc',
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
      defaultUserOptions,
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
      ...defaultUserOptions,
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
    ${'Lab Material'}   | ${'lab-material'}
    ${'Protocol'}       | ${'protocol'}
    ${'All'}            | ${'all'}
  `(
    'returns user collaboration for document category $category',
    async ({ documentCategory }) => {
      await getUserCollaboration(algoliaSearchClient, {
        ...defaultUserOptions,
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

  it('should pass the search query to Algolia', async () => {
    await getUserCollaboration(algoliaSearchClient, {
      ...defaultUserOptions,
      tags: ['Alessi'],
    });
    expect(search).toHaveBeenCalledWith(
      ['user-collaboration'],
      '',
      expect.objectContaining({
        tagFilters: [['Alessi']],
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
      defaultTeamOptions,
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
      ...defaultTeamOptions,
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
        ...defaultTeamOptions,
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

  it('should pass the search query to Algolia', async () => {
    await getTeamCollaboration(algoliaSearchClient, {
      ...defaultTeamOptions,
      tags: ['Alessi'],
    });
    expect(search).toHaveBeenCalledWith(
      ['team-collaboration'],
      '',
      expect.objectContaining({
        tagFilters: [['Alessi']],
      }),
    );
  });
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
    ${'Lab Material'}   | ${'lab-material'}
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

describe('getPreliminaryDataSharing', () => {
  const mockRequest = jest.fn();
  const opensearchClient = {
    request: mockRequest,
  } as unknown as OpensearchClient<PreliminaryDataSharingDataObject>;

  beforeEach(() => {
    mockRequest.mockReset();
    mockRequest.mockResolvedValue(mockOpensearchResponse);
  });

  it('returns successfully fetched preliminary data sharing', async () => {
    const result = await getPreliminaryDataSharing(opensearchClient, {
      currentPage: 0,
      pageSize: 10,
      tags: [],
      timeRange: 'all',
    });

    expect(result).toEqual(preliminaryDataSharingResponse);
  });

  it('calls opensearch with correct query for basic request', async () => {
    await getPreliminaryDataSharing(opensearchClient, {
      currentPage: 0,
      pageSize: 10,
      tags: [],
      timeRange: 'all',
    });

    expect(mockRequest).toHaveBeenCalledWith({
      query: {
        bool: {
          must: [
            {
              match: {
                timeRange: 'all',
              },
            },
          ],
        },
      },
      from: 0,
      size: 10,
      sort: [
        {
          'teamName.keyword': {
            order: 'asc',
          },
        },
      ],
    });
  });

  it.each`
    range                        | timeRange
    ${'Last 12 months'}          | ${'last-year'}
    ${'Since Hub Launch (2020)'} | ${'all'}
  `('handles time range $range', async ({ timeRange }) => {
    await getPreliminaryDataSharing(opensearchClient, {
      currentPage: 0,
      pageSize: 10,
      tags: [],
      timeRange,
    });

    expect(mockRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        query: {
          bool: {
            must: [
              {
                match: {
                  timeRange,
                },
              },
            ],
          },
        },
      }),
    );
  });

  it('handles tags filtering', async () => {
    await getPreliminaryDataSharing(opensearchClient, {
      currentPage: 0,
      pageSize: 10,
      tags: ['Team A', 'Team B'],
      timeRange: 'all',
    });

    expect(mockRequest).toHaveBeenCalledWith({
      query: {
        bool: {
          must: [
            {
              match: {
                timeRange: 'all',
              },
            },
            {
              bool: {
                should: [
                  {
                    term: {
                      'teamName.keyword': 'Team A',
                    },
                  },
                  {
                    term: {
                      'teamName.keyword': 'Team B',
                    },
                  },
                ],
                minimum_should_match: 1,
              },
            },
          ],
        },
      },
      from: 0,
      size: 10,
      sort: [
        {
          'teamName.keyword': {
            order: 'asc',
          },
        },
      ],
    });
  });

  it('handles pagination correctly', async () => {
    await getPreliminaryDataSharing(opensearchClient, {
      currentPage: 2,
      pageSize: 5,
      tags: [],
      timeRange: 'all',
    });

    expect(mockRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 10, // (currentPage: 2) * (pageSize: 5)
        size: 5,
      }),
    );
  });

  it('handles null pagination parameters with defaults', async () => {
    await getPreliminaryDataSharing(opensearchClient, {
      currentPage: null,
      pageSize: null,
      tags: [],
      timeRange: 'all',
    });

    expect(mockRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 0, // (null || 0) * (null || 10)
        size: 10,
      }),
    );
  });

  it('handles empty tags array', async () => {
    await getPreliminaryDataSharing(opensearchClient, {
      currentPage: 0,
      pageSize: 10,
      tags: [],
      timeRange: 'all',
    });

    expect(mockRequest).toHaveBeenCalledWith({
      query: {
        bool: {
          must: [
            {
              match: {
                timeRange: 'all',
              },
            },
          ],
        },
      },
      from: 0,
      size: 10,
      sort: [
        {
          'teamName.keyword': {
            order: 'asc',
          },
        },
      ],
    });
  });
});
