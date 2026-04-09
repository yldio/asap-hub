import {
  PreprintComplianceOpensearchResponse,
  PublicationComplianceOpensearchResponse,
} from '@asap-hub/model';
import { OpensearchClient } from '../../utils/opensearch';
import { getPreprintCompliance, getPublicationCompliance } from '../api';

const mockSearch = jest.fn();

const mockOpensearchClient = {
  search: mockSearch,
} as unknown as OpensearchClient<PreprintComplianceOpensearchResponse>;

const baseOptions = {
  tags: [],
  currentPage: 0,
  pageSize: 10,
  timeRange: 'all' as const,
};

const defaultResponse = {
  items: [],
  total: 0,
};

describe('getPreprintCompliance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls opensearch client with correct parameters', async () => {
    mockSearch.mockResolvedValue(defaultResponse);

    const options = {
      tags: ['tag1', 'tag2'],
      currentPage: 1,
      pageSize: 20,
      timeRange: 'last-year' as const,
      sort: 'team_asc' as const,
    };

    const result = await getPreprintCompliance(mockOpensearchClient, options);

    expect(mockSearch).toHaveBeenCalledWith({
      searchTags: ['tag1', 'tag2'],
      currentPage: 1,
      pageSize: 20,
      timeRange: 'last-year',
      searchScope: 'flat',
      sort: [{ 'teamName.keyword': { order: 'asc' } }],
    });
    expect(result).toEqual(defaultResponse);
  });

  it('handles empty tags array', async () => {
    mockSearch.mockResolvedValue(defaultResponse);

    await getPreprintCompliance(mockOpensearchClient, {
      ...baseOptions,
      sort: 'team_asc',
    });

    expect(mockSearch).toHaveBeenCalledWith({
      searchTags: [],
      currentPage: 0,
      pageSize: 10,
      timeRange: 'all',
      searchScope: 'flat',
      sort: [{ 'teamName.keyword': { order: 'asc' } }],
    });
  });

  it.each`
    sortOption                    | expectedSort
    ${'posted_prior_desc'}        | ${[{ postedPriorPercentage: { order: 'desc', missing: '_last' } }]}
    ${'posted_prior_asc'}         | ${[{ postedPriorPercentage: { order: 'asc', missing: '_first' } }]}
    ${'number_of_preprints_asc'}  | ${[{ numberOfPreprints: { order: 'asc', missing: '_first' } }]}
    ${'number_of_preprints_desc'} | ${[{ numberOfPreprints: { order: 'desc', missing: '_last' } }]}
  `(
    'maps $sortOption sort correctly',
    async ({
      sortOption,
      expectedSort,
    }: {
      sortOption:
        | 'posted_prior_desc'
        | 'posted_prior_asc'
        | 'number_of_preprints_asc'
        | 'number_of_preprints_desc';
      expectedSort: unknown;
    }) => {
      mockSearch.mockResolvedValue(defaultResponse);

      await getPreprintCompliance(mockOpensearchClient, {
        ...baseOptions,
        sort: sortOption,
      });

      expect(mockSearch).toHaveBeenCalledWith({
        searchTags: [],
        currentPage: 0,
        pageSize: 10,
        timeRange: 'all',
        searchScope: 'flat',
        sort: expectedSort,
      });
    },
  );

  it('returns undefined when opensearch client returns undefined', async () => {
    mockSearch.mockResolvedValue(undefined);

    const result = await getPreprintCompliance(mockOpensearchClient, {
      ...baseOptions,
      tags: ['tag1'],
      sort: 'team_asc',
    });

    expect(result).toBeUndefined();
  });
});

describe('getPublicationCompliance', () => {
  const mockPublicationOpensearchClient = {
    search: mockSearch,
  } as unknown as OpensearchClient<PublicationComplianceOpensearchResponse>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // N/A rows must surface first when sorting asc and last when sorting desc,
  // so missing values never push real data off the visible page.
  it.each`
    sortOption              | expectedSort
    ${'publications_asc'}   | ${[{ overallCompliance: { order: 'asc', missing: '_first' } }]}
    ${'publications_desc'}  | ${[{ overallCompliance: { order: 'desc', missing: '_last' } }]}
    ${'datasets_asc'}       | ${[{ datasetsPercentage: { order: 'asc', missing: '_first' } }]}
    ${'datasets_desc'}      | ${[{ datasetsPercentage: { order: 'desc', missing: '_last' } }]}
    ${'protocols_asc'}      | ${[{ protocolsPercentage: { order: 'asc', missing: '_first' } }]}
    ${'protocols_desc'}     | ${[{ protocolsPercentage: { order: 'desc', missing: '_last' } }]}
    ${'code_asc'}           | ${[{ codePercentage: { order: 'asc', missing: '_first' } }]}
    ${'code_desc'}          | ${[{ codePercentage: { order: 'desc', missing: '_last' } }]}
    ${'lab_materials_asc'}  | ${[{ labMaterialsPercentage: { order: 'asc', missing: '_first' } }]}
    ${'lab_materials_desc'} | ${[{ labMaterialsPercentage: { order: 'desc', missing: '_last' } }]}
  `(
    'maps $sortOption sort correctly',
    async ({
      sortOption,
      expectedSort,
    }: {
      sortOption:
        | 'publications_asc'
        | 'publications_desc'
        | 'datasets_asc'
        | 'datasets_desc'
        | 'protocols_asc'
        | 'protocols_desc'
        | 'code_asc'
        | 'code_desc'
        | 'lab_materials_asc'
        | 'lab_materials_desc';
      expectedSort: unknown;
    }) => {
      mockSearch.mockResolvedValue(defaultResponse);

      await getPublicationCompliance(mockPublicationOpensearchClient, {
        ...baseOptions,
        sort: sortOption,
      });

      expect(mockSearch).toHaveBeenCalledWith({
        searchTags: [],
        currentPage: 0,
        pageSize: 10,
        timeRange: 'all',
        searchScope: 'flat',
        sort: expectedSort,
      });
    },
  );
});
