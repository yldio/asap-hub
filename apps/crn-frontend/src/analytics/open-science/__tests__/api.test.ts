import { PreprintComplianceOpensearchResponse } from '@asap-hub/model';
import { OpensearchClient } from '../../utils/opensearch';
import { getPreprintCompliance } from '../api';

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
    sortOption             | expectedSort
    ${'posted_prior_desc'} | ${[{ postedPriorPercentage: { order: 'desc', missing: '_last' } }]}
    ${'posted_prior_asc'}  | ${[{ postedPriorPercentage: { order: 'asc', missing: '_first' } }]}
  `(
    'maps $sortOption sort correctly',
    async ({
      sortOption,
      expectedSort,
    }: {
      sortOption: 'posted_prior_desc' | 'posted_prior_asc';
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
