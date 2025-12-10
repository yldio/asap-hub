import {
  userWithTeamsRecordsTagQueryBuilder,
  UserWithTeamsIndexEmptyQueryResponse,
  UserWithTeamsIndexSearchQueryResponse,
  UserWithTeamsIndexSearchQueryAggregation,
} from '../user-with-teams-records';

describe('userWithTeamsRecordsTagQueryBuilder', () => {
  describe('query structure', () => {
    it('builds query without search text and flat scope', () => {
      const { query } = userWithTeamsRecordsTagQueryBuilder('', 'flat');

      expect(query).toEqual({
        size: 0,
        aggs: {
          userWithTeamsIndex_users: {
            terms: {
              field: 'name.keyword',
              size: 5,
            },
          },
        },
      });
    });

    it('builds query without search text and extended scope', () => {
      const { query } = userWithTeamsRecordsTagQueryBuilder('', 'extended');

      expect(query).toEqual({
        size: 0,
        aggs: {
          userWithTeamsIndex_users: {
            terms: {
              field: 'name.keyword',
              size: 5,
            },
          },
          userWithTeamsIndex_nestedTeams: {
            nested: {
              path: 'teams',
            },
            aggs: {
              names: {
                terms: {
                  field: 'teams.team.keyword',
                  size: 10,
                },
              },
            },
          },
        },
      });
    });

    it('builds query with search text and flat scope using wildcard', () => {
      const { query } = userWithTeamsRecordsTagQueryBuilder('john', 'flat');

      expect(query).toMatchObject({
        size: 0,
        query: {
          bool: {
            should: [
              {
                wildcard: {
                  'name.keyword': {
                    value: '*john*',
                    case_insensitive: true,
                  },
                },
              },
            ],
          },
        },
        aggs: {
          userWithTeamsIndex_filteredUsers: expect.objectContaining({
            filter: {
              wildcard: {
                'name.keyword': {
                  value: '*john*',
                  case_insensitive: true,
                },
              },
            },
          }),
        },
      });
      expect(query.aggs).not.toHaveProperty('userWithTeamsIndex_filteredTeams');
    });

    it('builds query with search text and extended scope', () => {
      const { query } = userWithTeamsRecordsTagQueryBuilder('john', 'extended');
      const boolQuery = query.query?.bool as { should: unknown[] } | undefined;

      expect(boolQuery).toHaveProperty('should');
      expect(boolQuery?.should).toHaveLength(2);
      expect(query.aggs).toHaveProperty('userWithTeamsIndex_filteredUsers');
      expect(query.aggs).toHaveProperty('userWithTeamsIndex_filteredTeams');
    });

    it('converts search text to lowercase for wildcard pattern', () => {
      const { query } = userWithTeamsRecordsTagQueryBuilder('JOHN', 'flat');
      const aggs = query.aggs as UserWithTeamsIndexSearchQueryAggregation;
      const wildcardConfig = aggs.userWithTeamsIndex_filteredUsers.filter
        .wildcard['name.keyword'] as { value: string };

      expect(wildcardConfig.value).toBe('*john*');
    });
  });

  describe('response transformer', () => {
    it('transforms empty query response with users only (flat scope)', () => {
      const { responseTransformer } = userWithTeamsRecordsTagQueryBuilder(
        '',
        'flat',
      );

      const response: UserWithTeamsIndexEmptyQueryResponse = {
        aggregations: {
          userWithTeamsIndex_users: {
            buckets: [
              { key: 'John Doe', doc_count: 5 },
              { key: 'Jane Smith', doc_count: 3 },
            ],
          },
        },
      };

      const result = responseTransformer(response);

      expect(result).toEqual(['John Doe', 'Jane Smith']);
    });

    it('transforms empty query response with teams first then users (extended scope)', () => {
      const { responseTransformer } = userWithTeamsRecordsTagQueryBuilder(
        '',
        'extended',
      );

      const response: UserWithTeamsIndexEmptyQueryResponse = {
        aggregations: {
          userWithTeamsIndex_nestedTeams: {
            names: {
              buckets: [{ key: 'Alpha Team', doc_count: 10 }],
            },
          },
          userWithTeamsIndex_users: {
            buckets: [{ key: 'John Doe', doc_count: 5 }],
          },
        },
      };

      const result = responseTransformer(response);

      // Teams first, then users (matching Algolia behavior)
      expect(result).toEqual(['Alpha Team', 'John Doe']);
    });

    it('transforms search query response with filtered users and teams', () => {
      const { responseTransformer } = userWithTeamsRecordsTagQueryBuilder(
        'john',
        'extended',
      );

      const response: UserWithTeamsIndexSearchQueryResponse = {
        aggregations: {
          userWithTeamsIndex_filteredUsers: {
            users: {
              buckets: [{ key: 'John Doe', doc_count: 5 }],
            },
          },
          userWithTeamsIndex_filteredTeams: {
            filtered_names: {
              names: {
                buckets: [{ key: 'Johnson Team', doc_count: 3 }],
              },
            },
          },
        },
      };

      const result = responseTransformer(response);

      // Teams first, then users
      expect(result).toEqual(['Johnson Team', 'John Doe']);
    });

    it('handles response with users only (no teams in search)', () => {
      const { responseTransformer } = userWithTeamsRecordsTagQueryBuilder(
        'john',
        'flat',
      );

      const response: UserWithTeamsIndexSearchQueryResponse = {
        aggregations: {
          userWithTeamsIndex_filteredUsers: {
            users: {
              buckets: [{ key: 'John Doe', doc_count: 5 }],
            },
          },
        },
      };

      const result = responseTransformer(response);

      expect(result).toEqual(['John Doe']);
    });

    it('returns empty array for unrecognized response in search query', () => {
      const { responseTransformer } = userWithTeamsRecordsTagQueryBuilder(
        'john',
        'flat',
      );

      const response = {
        aggregations: {
          some_unknown_key: { buckets: [] },
        },
      };

      const result = responseTransformer(response);

      expect(result).toEqual([]);
    });

    it('returns empty array for unrecognized response in empty query', () => {
      const { responseTransformer } = userWithTeamsRecordsTagQueryBuilder(
        '',
        'flat',
      );

      const response = {
        aggregations: {
          some_unknown_key: { buckets: [] },
        },
      };

      const result = responseTransformer(response);

      expect(result).toEqual([]);
    });

    it('handles empty buckets gracefully', () => {
      const { responseTransformer } = userWithTeamsRecordsTagQueryBuilder(
        '',
        'extended',
      );

      const response: UserWithTeamsIndexEmptyQueryResponse = {
        aggregations: {
          userWithTeamsIndex_users: {
            buckets: [],
          },
          userWithTeamsIndex_nestedTeams: {
            names: {
              buckets: [],
            },
          },
        },
      };

      const result = responseTransformer(response);

      expect(result).toEqual([]);
    });
  });
});
