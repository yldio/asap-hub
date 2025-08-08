import { UserResponse } from '@asap-hub/model';
import { OpenSearchRequest, OpenSearchResponse } from '@asap-hub/server-common';
import OpenSearchController from '../../src/controllers/opensearch.controller';
import OpenSearchProvider from '../../src/data-providers/opensearch.data-provider';

// Mock the OpenSearchProvider
jest.mock('../../src/data-providers/opensearch.data-provider');

describe('OpenSearchController', () => {
  let opensearchController: OpenSearchController;
  let mockOpenSearchProvider: jest.Mocked<OpenSearchProvider>;

  const mockUser: UserResponse = {
    id: 'user-123',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
  } as UserResponse;

  const mockSearchRequest: OpenSearchRequest = {
    query: {
      match: {
        title: 'test query',
      },
    },
    size: 10,
    from: 0,
  };

  const mockSearchResponse: OpenSearchResponse = {
    hits: {
      total: {
        value: 1,
        relation: 'eq',
      },
      hits: [
        {
          _id: 'doc-1',
          _index: 'opensearch-index',
          _source: {
            title: 'Test Document',
            description: 'This is a test document',
          },
          _score: 1.0,
        },
      ],
    },
    _shards: {
      failed: 0,
      failures: undefined,
      skipped: undefined,
      successful: 0,
      total: 0,
    },
    timed_out: false,
    took: 0,
  };

  beforeEach(() => {
    // Create a mock instance of OpenSearchProvider
    mockOpenSearchProvider =
      new OpenSearchProvider() as jest.Mocked<OpenSearchProvider>;

    // Reset all mocks
    jest.clearAllMocks();

    // Create controller instance with mocked provider
    opensearchController = new OpenSearchController(mockOpenSearchProvider);
  });

  describe('search method', () => {
    it('should successfully perform a search and return results', async () => {
      const index = 'manuscripts';
      mockOpenSearchProvider.search.mockResolvedValueOnce(mockSearchResponse);

      const result = await opensearchController.search(
        index,
        mockSearchRequest,
        mockUser,
      );

      expect(result).toEqual(mockSearchResponse);
      expect(mockOpenSearchProvider.search).toHaveBeenCalledTimes(1);
      expect(mockOpenSearchProvider.search).toHaveBeenCalledWith({
        index,
        body: mockSearchRequest,
        loggedInUser: mockUser,
      });
    });

    it('should pass through all parameters correctly', async () => {
      const index = 'users';
      const customSearchRequest: OpenSearchRequest = {
        query: {
          bool: {
            must: [
              { match: { name: 'John' } },
              { range: { age: { gte: 18 } } },
            ],
          },
        },
        size: 20,
        from: 10,
        sort: [{ created_at: { order: 'desc' } }],
      };

      mockOpenSearchProvider.search.mockResolvedValueOnce(mockSearchResponse);

      await opensearchController.search(index, customSearchRequest, mockUser);

      expect(mockOpenSearchProvider.search).toHaveBeenCalledWith({
        index: 'users',
        body: customSearchRequest,
        loggedInUser: mockUser,
      });
    });

    it('should throw error when opensearch provider throws', async () => {
      const index = 'manuscripts';
      const searchError = new Error('OpenSearch connection failed');
      mockOpenSearchProvider.search.mockRejectedValueOnce(searchError);

      await expect(
        opensearchController.search(index, mockSearchRequest, mockUser),
      ).rejects.toThrow('OpenSearch connection failed');

      expect(mockOpenSearchProvider.search).toHaveBeenCalledWith({
        index,
        body: mockSearchRequest,
        loggedInUser: mockUser,
      });
    });

    it('should handle empty search results', async () => {
      const index = 'manuscripts';
      const emptyResponse: OpenSearchResponse = {
        hits: {
          total: {
            value: 0,
            relation: 'eq',
          },
          hits: [],
        },
        _shards: {
          failed: 0,
          failures: undefined,
          skipped: undefined,
          successful: 0,
          total: 0,
        },
        timed_out: false,
        took: 0,
      };

      mockOpenSearchProvider.search.mockResolvedValueOnce(emptyResponse);

      const result = await opensearchController.search(
        index,
        mockSearchRequest,
        mockUser,
      );

      expect(result).toEqual(emptyResponse);
      expect(result.hits.hits).toHaveLength(0);
      // OpenSearch 'total' can be a number or an object of type OpenSearchTotalHits; handle both cases
      if (typeof result.hits.total === 'number') {
        expect(result.hits.total).toBe(0);
      } else {
        expect(result.hits.total?.value).toBe(0);
      }
    });

    it('should handle complex search queries with aggregations', async () => {
      const index = 'manuscripts';
      const complexSearchRequest: OpenSearchRequest = {
        query: {
          bool: {
            must: [{ match: { status: 'published' } }],
            filter: [{ term: { category: 'research' } }],
          },
        },
        aggs: {
          authors: {
            terms: {
              field: 'author.keyword',
              size: 10,
            },
          },
        },
      };

      const responseWithAggregations: OpenSearchResponse = {
        hits: {
          total: { value: 5, relation: 'eq' },
          hits: [],
        },
        aggregations: {
          authors: {
            buckets: [
              { key: 'John Doe', doc_count: 3 },
              { key: 'Jane Smith', doc_count: 2 },
            ],
          },
        },
        _shards: {
          failed: 0,
          failures: undefined,
          skipped: undefined,
          successful: 0,
          total: 0,
        },
        timed_out: false,
        took: 0,
      };

      mockOpenSearchProvider.search.mockResolvedValueOnce(
        responseWithAggregations,
      );

      const result = await opensearchController.search(
        index,
        complexSearchRequest,
        mockUser,
      );

      expect(result).toEqual(responseWithAggregations);
      expect(mockOpenSearchProvider.search).toHaveBeenCalledWith({
        index,
        body: complexSearchRequest,
        loggedInUser: mockUser,
      });
    });
  });
});
