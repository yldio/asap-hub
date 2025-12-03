import { PreprintComplianceOpensearchResponse } from '@asap-hub/model';
import { OpensearchClient } from '../../utils/opensearch';
import { getPreprintCompliance } from '../api';

const mockSearch = jest.fn();

const mockOpensearchClient = {
  search: mockSearch,
} as unknown as OpensearchClient<PreprintComplianceOpensearchResponse>;

describe('getPreprintCompliance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls opensearch client with correct parameters', async () => {
    const mockResponse = {
      items: [],
      total: 0,
    };

    mockSearch.mockResolvedValue(mockResponse);

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
    });
    expect(result).toEqual(mockResponse);
  });

  it('handles empty tags array', async () => {
    const mockResponse = {
      items: [],
      total: 0,
    };

    mockSearch.mockResolvedValue(mockResponse);

    const options = {
      tags: [],
      currentPage: 0,
      pageSize: 10,
      timeRange: 'all' as const,
      sort: 'team_asc' as const,
    };

    await getPreprintCompliance(mockOpensearchClient, options);

    expect(mockSearch).toHaveBeenCalledWith({
      searchTags: [],
      currentPage: 0,
      pageSize: 10,
      timeRange: 'all',
      searchScope: 'flat',
    });
  });

  it('returns undefined when opensearch client returns undefined', async () => {
    mockSearch.mockResolvedValue(undefined);

    const options = {
      tags: ['tag1'],
      currentPage: 0,
      pageSize: 10,
      timeRange: 'all' as const,
      sort: 'team_asc' as const,
    };

    const result = await getPreprintCompliance(mockOpensearchClient, options);

    expect(result).toBeUndefined();
  });
});
