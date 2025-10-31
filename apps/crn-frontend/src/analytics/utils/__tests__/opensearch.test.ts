import {
  OpensearchClient,
  OpensearchIndex,
  buildNormalizedStringSort,
  teamBasedRecordSearchQueryBuilder,
  userBasedRecordSearchQueryBuilder,
  taglessSearchQueryBuilder,
} from '../opensearch';

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

      const result = await client.search(['Team'], 0, 10, 'all');

      expect(result.total).toBe(2);
      expect(result.items).toHaveLength(2);
      expect(result.items[0]?.teamName).toBe('Team A');
    });

    it('handles default case', async () => {
      mockFetch.mockResolvedValueOnce(defaultResponse);

      const result = await client.search([], null, null, 'all');

      expect(result.total).toBe(2);
      expect(result.items).toHaveLength(2);
    });

    it('handles default case with time range', async () => {
      mockFetch.mockResolvedValueOnce(defaultResponse);
      const timeRange = '90d';

      const result = await client.search([], null, null, timeRange);

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

    it('throws an error on bad response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(client.search([], 0, 10, 'all')).rejects.toThrow(
        `Failed to search ${TARGET_TEST_INDEX} index. Expected status 2xx. Received status 500 Internal Server Error.`,
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

      await teamClient.search(['Team A'], 0, 10, '30d', 'both');

      expect(requestSpy).toHaveBeenCalledTimes(1);
      const query = requestSpy.mock.calls[0]?.[0] as {
        query: { bool: { should: unknown[] } };
        sort?: unknown[];
      };

      // Verify team-based structure
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

      // Verify default sort
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

        await teamClient.search(['Team A'], 0, 10, '30d', 'teams');

        const query = requestSpy.mock.calls[0]?.[0] as {
          query: { bool: { should: unknown[] } };
        };

        // Should only have team name query, no nested users
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

      await userClient.search(['User A'], 0, 10, '30d', 'both');

      expect(requestSpy).toHaveBeenCalledTimes(1);
      const query = requestSpy.mock.calls[0]?.[0] as {
        query: { bool: { should: unknown[] } };
        sort?: unknown[];
      };

      // Verify user-based structure
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

      // Verify no default sort for user-based
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

      await userClient.search(['User A'], 0, 10, '30d', 'teams');

      const query = requestSpy.mock.calls[0]?.[0] as {
        query: { bool: { should: unknown[] } };
      };

      // Should only have user name query, no nested teams
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

      await taglessClient.search(['ignored tag'], 0, 10, '30d');

      expect(requestSpy).toHaveBeenCalledTimes(1);
      const query = requestSpy.mock.calls[0]?.[0] as {
        query: { bool: { must: unknown[]; should?: unknown[] } };
      };

      // Verify tagless structure - no should clauses
      expect(query.query.bool).not.toHaveProperty('should');
      expect(query).toHaveProperty('query.bool.must');

      // Should only have timeRange in must clause
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

      await taglessClient.search([], 0, 10, '30d', 'both', 'article');

      const query = requestSpy.mock.calls[0]?.[0] as {
        query: { bool: { must: unknown[] } };
      };

      // Should have both timeRange and documentCategory
      expect(query.query.bool.must).toEqual([
        { term: { timeRange: '30d' } },
        { term: { documentCategory: 'article' } },
      ]);
    });
  });

  describe('buildNormalizedStringSort', () => {
    it('builds script sort with ascending order', () => {
      const result = buildNormalizedStringSort({
        keyword: 'teamName.keyword',
        order: 'asc',
      });

      expect(result).toEqual({
        _script: {
          type: 'string',
          script: {
            source: "doc['teamName.keyword'].value.toLowerCase()",
            lang: 'painless',
          },
          order: 'asc',
        },
      });
    });

    it('builds script sort with descending order', () => {
      const result = buildNormalizedStringSort({
        keyword: 'name.keyword',
        order: 'desc',
      });

      expect(result).toEqual({
        _script: {
          type: 'string',
          script: {
            source: "doc['name.keyword'].value.toLowerCase()",
            lang: 'painless',
          },
          order: 'desc',
        },
      });
    });

    it('builds script sort with nested path', () => {
      const result = buildNormalizedStringSort({
        keyword: 'teams.team.keyword',
        order: 'asc',
        nested: { path: 'teams' },
      });

      expect(result).toEqual({
        _script: {
          type: 'string',
          script: {
            source: "doc['teams.team.keyword'].value.toLowerCase()",
            lang: 'painless',
          },
          order: 'asc',
          nested: { path: 'teams' },
        },
      });
    });

    it('builds script sort without nested path when not provided', () => {
      const result = buildNormalizedStringSort({
        keyword: 'title.keyword',
        order: 'asc',
      });

      expect(result).not.toHaveProperty('_script.nested');
    });

    it('handles deeply nested field paths', () => {
      const result = buildNormalizedStringSort({
        keyword: 'user.profile.displayName.keyword',
        order: 'asc',
        nested: { path: 'user.profile' },
      });

      expect(result).toEqual({
        _script: {
          type: 'string',
          script: {
            source:
              "doc['user.profile.displayName.keyword'].value.toLowerCase()",
            lang: 'painless',
          },
          order: 'asc',
          nested: { path: 'user.profile' },
        },
      });
    });
  });

  describe('teamBasedRecordSearchQueryBuilder', () => {
    it('builds query with empty searchTags array', () => {
      const result = teamBasedRecordSearchQueryBuilder({
        searchTags: [],
        currentPage: 0,
        pageSize: 10,
        timeRange: '30d',
        searchScope: 'both',
      });

      expect(result.query.bool).not.toHaveProperty('should');
      expect(result.query.bool).not.toHaveProperty('minimum_should_match');
      expect(result.query.bool.must).toEqual([{ term: { timeRange: '30d' } }]);
    });

    it('builds query with single tag and scope="teams"', () => {
      const result = teamBasedRecordSearchQueryBuilder({
        searchTags: ['Team Alpha'],
        currentPage: 0,
        pageSize: 10,
        timeRange: '30d',
        searchScope: 'teams',
      });

      expect('should' in result.query.bool && result.query.bool.should).toEqual(
        [{ term: { 'teamName.keyword': 'Team Alpha' } }],
      );
      expect(
        'minimum_should_match' in result.query.bool &&
          result.query.bool.minimum_should_match,
      ).toBe(1);
    });

    it('builds query with single tag and scope="both"', () => {
      const result = teamBasedRecordSearchQueryBuilder({
        searchTags: ['Team Alpha'],
        currentPage: 0,
        pageSize: 10,
        timeRange: '30d',
        searchScope: 'both',
      });

      expect('should' in result.query.bool && result.query.bool.should).toEqual(
        [
          { term: { 'teamName.keyword': 'Team Alpha' } },
          {
            nested: {
              path: 'users',
              query: { term: { 'users.name.keyword': 'Team Alpha' } },
            },
          },
        ],
      );
      expect(
        'minimum_should_match' in result.query.bool &&
          result.query.bool.minimum_should_match,
      ).toBe(1);
    });

    it('builds query with multiple tags and scope="teams"', () => {
      const result = teamBasedRecordSearchQueryBuilder({
        searchTags: ['Team Alpha', 'Team Beta'],
        currentPage: 0,
        pageSize: 10,
        timeRange: '30d',
        searchScope: 'teams',
      });

      expect('should' in result.query.bool && result.query.bool.should).toEqual(
        [
          { term: { 'teamName.keyword': 'Team Alpha' } },
          { term: { 'teamName.keyword': 'Team Beta' } },
        ],
      );
      expect(
        'should' in result.query.bool && result.query.bool.should,
      ).toHaveLength(2);
    });

    it('builds query with multiple tags and scope="both"', () => {
      const result = teamBasedRecordSearchQueryBuilder({
        searchTags: ['Team Alpha', 'Team Beta'],
        currentPage: 0,
        pageSize: 10,
        timeRange: '30d',
        searchScope: 'both',
      });

      expect('should' in result.query.bool && result.query.bool.should).toEqual(
        [
          { term: { 'teamName.keyword': 'Team Alpha' } },
          {
            nested: {
              path: 'users',
              query: { term: { 'users.name.keyword': 'Team Alpha' } },
            },
          },
          { term: { 'teamName.keyword': 'Team Beta' } },
          {
            nested: {
              path: 'users',
              query: { term: { 'users.name.keyword': 'Team Beta' } },
            },
          },
        ],
      );
      expect(
        'should' in result.query.bool && result.query.bool.should,
      ).toHaveLength(4);
    });

    it('includes documentCategory in must clauses when provided', () => {
      const result = teamBasedRecordSearchQueryBuilder({
        searchTags: [],
        currentPage: 0,
        pageSize: 10,
        timeRange: '30d',
        searchScope: 'teams',
        documentCategory: 'article',
      });

      expect(result.query.bool.must).toEqual([
        { term: { timeRange: '30d' } },
        { term: { documentCategory: 'article' } },
      ]);
    });

    it('excludes documentCategory from must clauses when undefined', () => {
      const result = teamBasedRecordSearchQueryBuilder({
        searchTags: [],
        currentPage: 0,
        pageSize: 10,
        timeRange: '30d',
        searchScope: 'teams',
      });

      expect(result.query.bool.must).toEqual([{ term: { timeRange: '30d' } }]);
    });

    it('uses provided custom sort', () => {
      const customSort = [{ ratio: { order: 'desc' as const } }];
      const result = teamBasedRecordSearchQueryBuilder({
        searchTags: [],
        currentPage: 0,
        pageSize: 10,
        timeRange: '30d',
        searchScope: 'teams',
        sort: customSort,
      });

      expect(result.sort).toEqual(customSort);
    });

    it('uses default sort when sort is undefined', () => {
      const result = teamBasedRecordSearchQueryBuilder({
        searchTags: [],
        currentPage: 0,
        pageSize: 10,
        timeRange: '30d',
        searchScope: 'teams',
      });

      expect(result.sort).toEqual([{ 'teamName.keyword': { order: 'asc' } }]);
    });

    it('calculates pagination correctly for page 0 size 10', () => {
      const result = teamBasedRecordSearchQueryBuilder({
        searchTags: [],
        currentPage: 0,
        pageSize: 10,
        timeRange: '30d',
        searchScope: 'teams',
      });

      expect(result.from).toBe(0);
      expect(result.size).toBe(10);
    });

    it('calculates pagination correctly for page 2 size 20', () => {
      const result = teamBasedRecordSearchQueryBuilder({
        searchTags: [],
        currentPage: 2,
        pageSize: 20,
        timeRange: '30d',
        searchScope: 'teams',
      });

      expect(result.from).toBe(40);
      expect(result.size).toBe(20);
    });

    it('includes different timeRange values in must clause', () => {
      const result = teamBasedRecordSearchQueryBuilder({
        searchTags: [],
        currentPage: 0,
        pageSize: 10,
        timeRange: '90d',
        searchScope: 'teams',
      });

      expect(result.query.bool.must).toContainEqual({
        term: { timeRange: '90d' },
      });
    });
  });

  describe('userBasedRecordSearchQueryBuilder', () => {
    it('builds query with empty searchTags array', () => {
      const result = userBasedRecordSearchQueryBuilder({
        searchTags: [],
        currentPage: 0,
        pageSize: 10,
        timeRange: '30d',
        searchScope: 'both',
      });

      expect(result.query.bool).not.toHaveProperty('should');
      expect(result.query.bool).not.toHaveProperty('minimum_should_match');
      expect(result.query.bool.must).toEqual([{ term: { timeRange: '30d' } }]);
    });

    it('builds query with single tag and scope="teams"', () => {
      const result = userBasedRecordSearchQueryBuilder({
        searchTags: ['John Doe'],
        currentPage: 0,
        pageSize: 10,
        timeRange: '30d',
        searchScope: 'teams',
      });

      expect('should' in result.query.bool && result.query.bool.should).toEqual(
        [{ term: { 'name.keyword': 'John Doe' } }],
      );
      expect(
        'minimum_should_match' in result.query.bool &&
          result.query.bool.minimum_should_match,
      ).toBe(1);
    });

    it('builds query with single tag and scope="both"', () => {
      const result = userBasedRecordSearchQueryBuilder({
        searchTags: ['John Doe'],
        currentPage: 0,
        pageSize: 10,
        timeRange: '30d',
        searchScope: 'both',
      });

      expect('should' in result.query.bool && result.query.bool.should).toEqual(
        [
          { term: { 'name.keyword': 'John Doe' } },
          {
            nested: {
              path: 'teams',
              query: { term: { 'teams.team.keyword': 'John Doe' } },
            },
          },
        ],
      );
      expect(
        'minimum_should_match' in result.query.bool &&
          result.query.bool.minimum_should_match,
      ).toBe(1);
    });

    it('builds query with multiple tags and scope="teams"', () => {
      const result = userBasedRecordSearchQueryBuilder({
        searchTags: ['John Doe', 'Jane Smith'],
        currentPage: 0,
        pageSize: 10,
        timeRange: '30d',
        searchScope: 'teams',
      });

      expect('should' in result.query.bool && result.query.bool.should).toEqual(
        [
          { term: { 'name.keyword': 'John Doe' } },
          { term: { 'name.keyword': 'Jane Smith' } },
        ],
      );
      expect(
        'should' in result.query.bool && result.query.bool.should,
      ).toHaveLength(2);
    });

    it('builds query with multiple tags and scope="both"', () => {
      const result = userBasedRecordSearchQueryBuilder({
        searchTags: ['John Doe', 'Jane Smith'],
        currentPage: 0,
        pageSize: 10,
        timeRange: '30d',
        searchScope: 'both',
      });

      expect('should' in result.query.bool && result.query.bool.should).toEqual(
        [
          { term: { 'name.keyword': 'John Doe' } },
          {
            nested: {
              path: 'teams',
              query: { term: { 'teams.team.keyword': 'John Doe' } },
            },
          },
          { term: { 'name.keyword': 'Jane Smith' } },
          {
            nested: {
              path: 'teams',
              query: { term: { 'teams.team.keyword': 'Jane Smith' } },
            },
          },
        ],
      );
      expect(
        'should' in result.query.bool && result.query.bool.should,
      ).toHaveLength(4);
    });

    it('includes documentCategory in must clauses when provided', () => {
      const result = userBasedRecordSearchQueryBuilder({
        searchTags: [],
        currentPage: 0,
        pageSize: 10,
        timeRange: '30d',
        searchScope: 'teams',
        documentCategory: 'protocol',
      });

      expect(result.query.bool.must).toEqual([
        { term: { timeRange: '30d' } },
        { term: { documentCategory: 'protocol' } },
      ]);
    });

    it('excludes documentCategory from must clauses when undefined', () => {
      const result = userBasedRecordSearchQueryBuilder({
        searchTags: [],
        currentPage: 0,
        pageSize: 10,
        timeRange: '30d',
        searchScope: 'teams',
      });

      expect(result.query.bool.must).toEqual([{ term: { timeRange: '30d' } }]);
    });

    it('includes sort property when custom sort is provided', () => {
      const customSort = [{ asapOutput: { order: 'asc' as const } }];
      const result = userBasedRecordSearchQueryBuilder({
        searchTags: [],
        currentPage: 0,
        pageSize: 10,
        timeRange: '30d',
        searchScope: 'teams',
        sort: customSort,
      });

      expect(result.sort).toEqual(customSort);
    });

    it('does not include sort property when sort is undefined', () => {
      const result = userBasedRecordSearchQueryBuilder({
        searchTags: [],
        currentPage: 0,
        pageSize: 10,
        timeRange: '30d',
        searchScope: 'teams',
      });

      expect(result).not.toHaveProperty('sort');
    });

    it('calculates pagination correctly for page 0 size 10', () => {
      const result = userBasedRecordSearchQueryBuilder({
        searchTags: [],
        currentPage: 0,
        pageSize: 10,
        timeRange: '30d',
        searchScope: 'teams',
      });

      expect(result.from).toBe(0);
      expect(result.size).toBe(10);
    });

    it('calculates pagination correctly for page 1 size 15', () => {
      const result = userBasedRecordSearchQueryBuilder({
        searchTags: [],
        currentPage: 1,
        pageSize: 15,
        timeRange: '30d',
        searchScope: 'teams',
      });

      expect(result.from).toBe(15);
      expect(result.size).toBe(15);
    });

    it('includes different timeRange values in must clause', () => {
      const result = userBasedRecordSearchQueryBuilder({
        searchTags: [],
        currentPage: 0,
        pageSize: 10,
        timeRange: 'last-year',
        searchScope: 'teams',
      });

      expect(result.query.bool.must).toContainEqual({
        term: { timeRange: 'last-year' },
      });
    });
  });

  describe('taglessSearchQueryBuilder', () => {
    it('includes both timeRange and documentCategory when both provided', () => {
      const result = taglessSearchQueryBuilder({
        searchTags: [],
        currentPage: 0,
        pageSize: 10,
        timeRange: '30d',
        searchScope: 'teams',
        documentCategory: 'article',
      });

      expect(result.query.bool.must).toEqual([
        { term: { timeRange: '30d' } },
        { term: { documentCategory: 'article' } },
      ]);
    });

    it('includes only timeRange when documentCategory is undefined', () => {
      const result = taglessSearchQueryBuilder({
        searchTags: [],
        currentPage: 0,
        pageSize: 10,
        timeRange: '90d',
        searchScope: 'teams',
      });

      expect(result.query.bool.must).toEqual([{ term: { timeRange: '90d' } }]);
    });

    it('includes only documentCategory when timeRange is undefined', () => {
      const result = taglessSearchQueryBuilder({
        searchTags: [],
        currentPage: 0,
        pageSize: 10,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        timeRange: undefined as any,
        searchScope: 'teams',
        documentCategory: 'dataset',
      });

      expect(result.query.bool.must).toEqual([
        { term: { documentCategory: 'dataset' } },
      ]);
    });

    it('has empty must array when both timeRange and documentCategory are undefined', () => {
      const result = taglessSearchQueryBuilder({
        searchTags: [],
        currentPage: 0,
        pageSize: 10,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        timeRange: undefined as any,
        searchScope: 'teams',
      });

      expect(result.query.bool.must).toEqual([]);
    });

    it('calculates pagination correctly', () => {
      const result = taglessSearchQueryBuilder({
        searchTags: [],
        currentPage: 3,
        pageSize: 25,
        timeRange: '30d',
        searchScope: 'teams',
      });

      expect(result.from).toBe(75);
      expect(result.size).toBe(25);
    });

    it('ignores searchTags parameter', () => {
      const result = taglessSearchQueryBuilder({
        searchTags: ['Team Alpha', 'User Beta'],
        currentPage: 0,
        pageSize: 10,
        timeRange: '30d',
        searchScope: 'teams',
      });

      expect(result.query.bool).not.toHaveProperty('should');
      expect(JSON.stringify(result)).not.toContain('Team Alpha');
      expect(JSON.stringify(result)).not.toContain('User Beta');
    });

    it('ignores sort parameter and does not include sort in response', () => {
      const result = taglessSearchQueryBuilder({
        searchTags: [],
        currentPage: 0,
        pageSize: 10,
        timeRange: '30d',
        searchScope: 'teams',
        sort: [{ ratio: { order: 'desc' as const } }],
      });

      expect(result).not.toHaveProperty('sort');
    });
  });
});
