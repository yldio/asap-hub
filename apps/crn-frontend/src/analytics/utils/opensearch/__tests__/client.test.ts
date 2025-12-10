import { OpensearchClient, unsupportedTagQueryBuilder } from '../client';
import type { OpensearchIndex } from '../types';

const originalFetch = global.fetch;
const mockFetch = jest.fn();

type MockData = {
  teamId: string;
  teamName: string;
  users: { name: string }[];
};

describe('OpensearchClient', () => {
  let client: OpensearchClient<MockData>;

  const TARGET_TEST_INDEX: OpensearchIndex = 'os-champion';

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = mockFetch;
    client = new OpensearchClient<MockData>(
      TARGET_TEST_INDEX,
      'Bearer fake-token',
    );
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

      const result = await client.search({
        searchTags: ['Team'],
        currentPage: 0,
        pageSize: 10,
        timeRange: 'all',
        searchScope: 'extended',
      });

      expect(result.total).toBe(2);
      expect(result.items).toHaveLength(2);
      expect(result.items[0]?.teamName).toBe('Team A');
    });

    it('handles default case', async () => {
      mockFetch.mockResolvedValueOnce(defaultResponse);

      const result = await client.search({
        searchTags: [],
        timeRange: 'all',
        searchScope: 'extended',
      });

      expect(result.total).toBe(2);
      expect(result.items).toHaveLength(2);
    });

    it('handles default case with time range', async () => {
      mockFetch.mockResolvedValueOnce(defaultResponse);
      const timeRange = '90d';

      const result = await client.search({
        searchTags: [],
        timeRange,
        searchScope: 'extended',
      });

      const fetchArgs = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(fetchArgs[1].body);

      const mustClauses = requestBody.query.bool.must;
      expect(mustClauses[0]).toEqual({ term: { timeRange } });
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

      const result = await client.search({
        searchTags: ['Team Only'],
        currentPage: 0,
        pageSize: 10,
        timeRange: 'all',
        searchScope: 'flat',
      });

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

      await client.search({
        searchTags: ['Team A'],
        currentPage: 0,
        pageSize: 10,
        timeRange,
        searchScope: 'extended',
      });

      const fetchArgs = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(fetchArgs[1].body);

      const mustClauses = requestBody.query.bool.must;
      expect(mustClauses[0]).toEqual({ term: { timeRange } });
    });

    it('throws an error on bad response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(
        client.search({
          searchTags: [],
          currentPage: 0,
          pageSize: 10,
          timeRange: 'all',
          searchScope: 'extended',
        }),
      ).rejects.toThrow(
        `Failed to search ${TARGET_TEST_INDEX} index. Expected status 2xx. Received status 500 Internal Server Error.`,
      );
    });

    // Just for coverage: tests the || [] fallback when response.hits.hits is missing
    it('handles response with missing hits array', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          hits: {
            total: { value: 0 },
            // hits array is missing
          },
        }),
      });

      const result = await client.search({
        searchTags: [],
        timeRange: 'all',
        searchScope: 'extended',
      });

      expect(result.total).toBe(0);
      expect(result.items).toEqual([]);
    });
  });

  describe('getTagSuggestions', () => {
    it('returns parsed tag suggestions for search query', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          aggregations: {
            teamWithUsersIndex_filteredTeams: {
              teams: {
                buckets: [
                  { key: 'Jackson', doc_count: 5 },
                  { key: 'Jacket', doc_count: 1 },
                ],
              },
            },
            teamWithUsersIndex_filteredUsers: {
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
            teamWithUsersIndex_filteredTeams: {
              teams: {
                buckets: [],
              },
            },
            teamWithUsersIndex_filteredUsers: {
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

    it('queries only teams when search scope is flat', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          aggregations: {
            teamWithUsersIndex_filteredTeams: {
              teams: {
                buckets: [{ key: 'Team Alpha', doc_count: 10 }],
              },
            },
          },
        }),
      });

      const result = await client.getTagSuggestions('Alpha', 'flat');

      expect(mockFetch).toHaveBeenCalledTimes(1);

      const fetchArgs = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(fetchArgs[1].body);

      expect(requestBody.aggs.teamWithUsersIndex_filteredUsers).toBeUndefined();
      expect(JSON.stringify(requestBody.query)).not.toContain('users.name');
      expect(result).toEqual(['Team Alpha']);
    });

    it('handles case when no search value is provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          aggregations: {
            teamWithUsersIndex_teams: {
              buckets: [{ key: 'Team Alpha', doc_count: 10 }],
            },
            teamWithUsersIndex_nestedUsers: {
              names: {
                buckets: [{ key: 'Jackson', doc_count: 10 }],
              },
            },
          },
        }),
      });

      const result = await client.getTagSuggestions('', 'extended');

      expect(result).toEqual(['Team Alpha', 'Jackson']);
    });

    it('handles case where response has no matching aggregations', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          aggregations: {},
        }),
      });

      const result = await client.getTagSuggestions('Alpha', 'flat');

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });

  describe('query builder selection by index', () => {
    it.each`
      index
      ${'attendance'}
      ${'os-champion'}
      ${'preliminary-data-sharing'}
      ${'preprint-compliance'}
      ${'publication-compliance'}
    `('uses team-based query builder for $index index', async ({ index }) => {
      const teamClient = new OpensearchClient<MockData>(
        index,
        'Bearer fake-token',
      );
      const requestSpy = jest.spyOn(teamClient, 'request').mockResolvedValue({
        hits: {
          total: { value: 0 },
          hits: [],
        },
      });

      await teamClient.search({
        searchTags: ['Team A'],
        currentPage: 0,
        pageSize: 10,
        timeRange: '30d',
        searchScope: 'extended',
      });

      expect(requestSpy).toHaveBeenCalledTimes(1);
      const query = requestSpy.mock.calls[0]?.[0] as {
        query: { bool: { should: unknown[] } };
        sort?: unknown[];
      };

      expect(query).toHaveProperty('query.bool.should');
      expect(query.query.bool.should).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            term: { 'teamName.keyword': 'Team A' },
          }),
          expect.objectContaining({
            nested: expect.objectContaining({
              path: 'users',
              query: {
                term: { 'users.name.keyword': 'Team A' },
              },
            }),
          }),
        ]),
      );

      expect(query).toHaveProperty('sort');
      expect(query.sort).toEqual([{ 'teamName.keyword': { order: 'asc' } }]);
    });

    it.each`
      index
      ${'attendance'}
      ${'os-champion'}
      ${'preliminary-data-sharing'}
      ${'preprint-compliance'}
      ${'publication-compliance'}
    `(
      'excludes nested users query for $index when searchScope is "teams"',
      async ({ index }) => {
        const teamClient = new OpensearchClient<MockData>(
          index,
          'Bearer fake-token',
        );
        const requestSpy = jest.spyOn(teamClient, 'request').mockResolvedValue({
          hits: {
            total: { value: 0 },
            hits: [],
          },
        });

        await teamClient.search({
          searchTags: ['Team A'],
          currentPage: 0,
          pageSize: 10,
          timeRange: '30d',
          searchScope: 'flat',
        });

        const query = requestSpy.mock.calls[0]?.[0] as {
          query: { bool: { should: unknown[] } };
        };

        expect(query.query.bool.should).toHaveLength(1);
        expect(query.query.bool.should[0]).toEqual({
          term: { 'teamName.keyword': 'Team A' },
        });
      },
    );

    it('uses user-based query builder for user-productivity index', async () => {
      const userClient = new OpensearchClient<MockData>(
        'user-productivity',
        'Bearer fake-token',
      );
      const requestSpy = jest.spyOn(userClient, 'request').mockResolvedValue({
        hits: {
          total: { value: 0 },
          hits: [],
        },
      });

      await userClient.search({
        searchTags: ['User A'],
        currentPage: 0,
        pageSize: 10,
        timeRange: '30d',
        searchScope: 'extended',
      });

      expect(requestSpy).toHaveBeenCalledTimes(1);
      const query = requestSpy.mock.calls[0]?.[0] as {
        query: { bool: { should: unknown[] } };
        sort?: unknown[];
      };

      expect(query).toHaveProperty('query.bool.should');
      expect(query.query.bool.should).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            term: { 'name.keyword': 'User A' },
          }),
          expect.objectContaining({
            nested: expect.objectContaining({
              path: 'teams',
              query: {
                term: { 'teams.team.keyword': 'User A' },
              },
            }),
          }),
        ]),
      );

      expect(query).not.toHaveProperty('sort');
    });

    it('excludes nested teams query for user-productivity when searchScope is "teams"', async () => {
      const userClient = new OpensearchClient<MockData>(
        'user-productivity',
        'Bearer fake-token',
      );
      const requestSpy = jest.spyOn(userClient, 'request').mockResolvedValue({
        hits: {
          total: { value: 0 },
          hits: [],
        },
      });

      await userClient.search({
        searchTags: ['User A'],
        currentPage: 0,
        pageSize: 10,
        timeRange: '30d',
        searchScope: 'flat',
      });

      const query = requestSpy.mock.calls[0]?.[0] as {
        query: { bool: { should: unknown[] } };
      };

      expect(query.query.bool.should).toHaveLength(1);
      expect(query.query.bool.should[0]).toEqual({
        term: { 'name.keyword': 'User A' },
      });
    });

    it('uses tagless query builder for user-productivity-performance index', async () => {
      const taglessClient = new OpensearchClient<MockData>(
        'user-productivity-performance',
        'Bearer fake-token',
      );
      const requestSpy = jest
        .spyOn(taglessClient, 'request')
        .mockResolvedValue({
          hits: {
            total: { value: 0 },
            hits: [],
          },
        });

      await taglessClient.search({
        searchTags: ['ignored tag'],
        currentPage: 0,
        pageSize: 10,
        timeRange: '30d',
        searchScope: 'flat',
      });

      expect(requestSpy).toHaveBeenCalledTimes(1);
      const query = requestSpy.mock.calls[0]?.[0] as {
        query: { bool: { must: unknown[]; should?: unknown[] } };
      };

      expect(query.query.bool).not.toHaveProperty('should');
      expect(query).toHaveProperty('query.bool.must');

      expect(query.query.bool.must).toEqual([{ term: { timeRange: '30d' } }]);
    });

    it('includes documentCategory in must clauses for user-productivity-performance', async () => {
      const taglessClient = new OpensearchClient<MockData>(
        'user-productivity-performance',
        'Bearer fake-token',
      );
      const requestSpy = jest
        .spyOn(taglessClient, 'request')
        .mockResolvedValue({
          hits: {
            total: { value: 0 },
            hits: [],
          },
        });

      await taglessClient.search({
        searchTags: [],
        currentPage: 0,
        pageSize: 10,
        timeRange: '30d',
        searchScope: 'flat',
        documentCategory: 'article',
      });

      const query = requestSpy.mock.calls[0]?.[0] as {
        query: { bool: { must: unknown[] } };
      };

      expect(query.query.bool.must).toEqual([
        { term: { timeRange: '30d' } },
        { term: { documentCategory: 'article' } },
      ]);
    });

    it('uses team-based query builder for team-productivity index', async () => {
      const teamClient = new OpensearchClient<MockData>(
        'team-productivity',
        'Bearer fake-token',
      );
      const requestSpy = jest.spyOn(teamClient, 'request').mockResolvedValue({
        hits: {
          total: { value: 0 },
          hits: [],
        },
      });

      await teamClient.search({
        searchTags: ['Team A'],
        currentPage: 0,
        pageSize: 10,
        timeRange: '30d',
        searchScope: 'flat',
        outputType: 'public',
      });

      expect(requestSpy).toHaveBeenCalledTimes(1);
      const query = requestSpy.mock.calls[0]?.[0] as {
        query: { bool: { should: unknown[]; must: unknown[] } };
      };

      expect(query).toHaveProperty('query.bool.should');
      expect(query.query.bool.should).toEqual([
        { term: { 'name.keyword': 'Team A' } },
      ]);

      expect(query.query.bool.must).toEqual([
        { term: { timeRange: '30d' } },
        { term: { outputType: 'public' } },
      ]);
    });

    it('uses tagless query builder for team-productivity-performance index', async () => {
      const taglessClient = new OpensearchClient<MockData>(
        'team-productivity-performance',
        'Bearer fake-token',
      );
      const requestSpy = jest
        .spyOn(taglessClient, 'request')
        .mockResolvedValue({
          hits: {
            total: { value: 0 },
            hits: [],
          },
        });

      await taglessClient.search({
        searchTags: ['ignored tag'],
        currentPage: 0,
        pageSize: 10,
        timeRange: '30d',
        searchScope: 'flat',
      });

      expect(requestSpy).toHaveBeenCalledTimes(1);
      const query = requestSpy.mock.calls[0]?.[0] as {
        query: { bool: { must: unknown[]; should?: unknown[] } };
      };

      expect(query.query.bool).not.toHaveProperty('should');
      expect(query).toHaveProperty('query.bool.must');

      expect(query.query.bool.must).toEqual([{ term: { timeRange: '30d' } }]);
    });
  });

  describe('getTagSuggestions with different indices', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      global.fetch = mockFetch;
    });

    afterEach(() => {
      global.fetch = originalFetch;
    });

    it('uses userWithTeamsRecordsTagQueryBuilder for user-productivity index', async () => {
      const userProductivityClient = new OpensearchClient<unknown>(
        'user-productivity',
        'Bearer fake-token',
      );

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          aggregations: {
            userWithTeamsIndex_filteredUsers: {
              users: {
                buckets: [{ key: 'John Doe', doc_count: 5 }],
              },
            },
          },
        }),
      });

      const result = await userProductivityClient.getTagSuggestions(
        'john',
        'flat',
      );

      expect(result).toEqual(['John Doe']);

      const fetchArgs = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(fetchArgs[1].body);

      expect(
        requestBody.aggs.userWithTeamsIndex_filteredUsers.filter.wildcard,
      ).toHaveProperty(['name.keyword']);
    });

    it('uses teamRecordTagQueryBuilder for team-productivity index', async () => {
      const teamProductivityClient = new OpensearchClient<unknown>(
        'team-productivity',
        'Bearer fake-token',
      );

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          aggregations: {
            teamBasedIndex_filteredTeams: {
              teams: {
                buckets: [{ key: 'Alpha Team', doc_count: 10 }],
              },
            },
          },
        }),
      });

      const result = await teamProductivityClient.getTagSuggestions(
        'alpha',
        'flat',
      );

      expect(result).toEqual(['Alpha Team']);

      const fetchArgs = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(fetchArgs[1].body);

      expect(
        requestBody.aggs.teamBasedIndex_filteredTeams.filter.wildcard,
      ).toHaveProperty(['name.raw']);
    });

    it('throws error for user-productivity-performance index', async () => {
      const performanceClient = new OpensearchClient<unknown>(
        'user-productivity-performance',
        'Bearer fake-token',
      );

      await expect(
        performanceClient.getTagSuggestions('test', 'flat'),
      ).rejects.toThrow(
        "This Opensearch index doesn't support tag suggestions",
      );
    });

    it('throws error for team-productivity-performance index', async () => {
      const performanceClient = new OpensearchClient<unknown>(
        'team-productivity-performance',
        'Bearer fake-token',
      );

      await expect(
        performanceClient.getTagSuggestions('test', 'flat'),
      ).rejects.toThrow(
        "This Opensearch index doesn't support tag suggestions",
      );
    });
  });
});

describe('unsupportedTagQueryBuilder', () => {
  it('throws error when called', () => {
    expect(() => unsupportedTagQueryBuilder('', 'flat')).toThrow(
      "This Opensearch index doesn't support tag suggestions",
    );
  });

  it('throws error regardless of parameters', () => {
    expect(() => unsupportedTagQueryBuilder('search', 'extended')).toThrow(
      "This Opensearch index doesn't support tag suggestions",
    );
  });
});
