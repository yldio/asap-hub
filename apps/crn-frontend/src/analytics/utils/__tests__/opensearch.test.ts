import { OpensearchClient } from '../opensearch';

const originalFetch = global.fetch;
const mockFetch = jest.fn();

type MockData = {
  teamId: string;
  teamName: string;
  users: { name: string }[];
};

describe('OpensearchClient', () => {
  let client: OpensearchClient<MockData>;

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = mockFetch;
    client = new OpensearchClient<MockData>('test-index', 'Bearer fake-token');
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe('search', () => {
    const defaultResponse = {
      ok: true,
      json: async () => ({
        hits: {
          total: { value: 2 },
          hits: [
            {
              _id: '1',
              _index: 'test-index',
              _score: 1.0,
              _source: {
                teamId: 'team-id-1',
                teamName: 'Team A',
                users: [],
              },
            },
            {
              _id: '2',
              _index: 'test-index',
              _score: 1.0,
              _source: {
                title: 'team-id-2',
                teamName: 'Team B',
                users: [{ name: 'Test User 1' }],
              },
            },
          ],
        },
      }),
    };
    it('returns parsed search result', async () => {
      mockFetch.mockResolvedValueOnce(defaultResponse);

      const result = await client.search(['Team'], 0, 10);

      expect(result.total).toBe(2);
      expect(result.items).toHaveLength(2);
      expect(result.items[0]?.teamName).toBe('Team A');
    });

    it('handles default case', async () => {
      mockFetch.mockResolvedValueOnce(defaultResponse);

      const result = await client.search([], null, null);

      expect(result.total).toBe(2);
      expect(result.items).toHaveLength(2);
    });

    it('queries only teams when search scope is "teams"', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          hits: {
            total: { value: 1 },
            hits: [
              {
                _id: '1',
                _index: 'test-index',
                _score: 1.0,
                _source: {
                  teamId: 'team-id-1',
                  teamName: 'Team Only',
                  users: [],
                },
              },
            ],
          },
        }),
      });

      const result = await client.search(['Team Only'], 0, 10, 'all', 'teams');

      expect(result.total).toBe(1);

      const fetchArgs = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(fetchArgs[1].body);

      const shouldClauses = requestBody.query.bool.should;
      expect(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        shouldClauses.some((clause: any) => clause.term?.['teamName.keyword']),
      ).toBe(true);

      expect(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        shouldClauses.some((clause: any) => clause.nested?.path === 'users'),
      ).toBe(false);
    });

    it('queries by time range when provided', async () => {
      mockFetch.mockResolvedValueOnce(defaultResponse);
      const timeRange = '30d';

      await client.search(['Team A'], 0, 10, timeRange);

      const fetchArgs = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(fetchArgs[1].body);

      const mustClauses = requestBody.query.bool.must;
      expect(mustClauses[0]).toEqual({ term: { timeRange } });
    });

    it('excludes must clause if time range not provided', async () => {
      mockFetch.mockResolvedValueOnce(defaultResponse);

      await client.search(['Team Only'], 0, 10);

      const fetchArgs = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(fetchArgs[1].body);

      expect(requestBody.query.bool.must).toBe(undefined);
    });

    it('throws an error on bad response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(client.search([], 0, 10)).rejects.toThrow(
        'Failed to search test-index index. Expected status 2xx. Received status 500 Internal Server Error.',
      );
    });
  });

  describe('getTagSuggestions', () => {
    it('returns parsed tag suggestions', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          aggregations: {
            matching_teams: {
              teams: {
                buckets: [
                  { key: 'Jackson', doc_count: 5 },
                  { key: 'Jacket', doc_count: 1 },
                ],
              },
            },
            matching_users: {
              filtered_names: {
                names: {
                  buckets: [
                    { key: 'Jack Richards', doc_count: 3 },
                    { key: 'Chloe Jackson', doc_count: 2 },
                  ],
                },
              },
            },
          },
        }),
      });

      const result = await client.getTagSuggestions('Jack');

      expect(result).toEqual([
        'Jackson',
        'Jacket',
        'Jack Richards',
        'Chloe Jackson',
      ]);
    });

    it('returns empty tag suggestions when no match is found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          aggregations: {
            matching_teams: {
              teams: {
                buckets: [],
              },
            },
            matching_users: {
              filtered_names: {
                names: {
                  buckets: [],
                },
              },
            },
          },
        }),
      });

      const result = await client.getTagSuggestions('Jack');

      expect(result).toEqual([]);
    });

    it('queries only teams when search scope is team', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          aggregations: {
            matching_teams: {
              teams: {
                buckets: [{ key: 'Team Alpha', doc_count: 10 }],
              },
            },
          },
        }),
      });

      const result = await client.getTagSuggestions('Alpha', 'teams');

      expect(mockFetch).toHaveBeenCalledTimes(1);

      const fetchArgs = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(fetchArgs[1].body);

      expect(requestBody.aggs.matching_users).toBeUndefined();
      expect(JSON.stringify(requestBody.query)).not.toContain('users.name');
      expect(result).toEqual(['Team Alpha']);
    });

    it('handles case when no search value is provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          aggregations: {
            teams: {
              buckets: [{ key: 'Team Alpha', doc_count: 10 }],
            },
            users: {
              names: {
                buckets: [{ key: 'Jackson', doc_count: 10 }],
              },
            },
          },
        }),
      });

      const result = await client.getTagSuggestions('', 'both');

      expect(result).toEqual(['Team Alpha', 'Jackson']);
    });

    it('handles case where response is null', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          aggregations: {
            matching_teams: null,
          },
        }),
      });

      const result = await client.getTagSuggestions('Alpha', 'teams');

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });
});
