import {
  teamWithUsersRecordsTagQueryBuilder,
  TeamWithUsersIndexEmptyQueryResponse,
  TeamWithUsersIndexSearchQueryResponse,
} from '../team-with-users-records';

describe('teamWithUsersRecordsTagQueryBuilder', () => {
  describe('query structure', () => {
    it('builds query without search text and flat scope', () => {
      const { query } = teamWithUsersRecordsTagQueryBuilder('', 'flat');

      expect(query).toEqual({
        size: 0,
        aggs: {
          teamWithUsersIndex_teams: {
            terms: {
              field: 'teamName.keyword',
              size: 5,
            },
          },
        },
      });
    });

    it('builds query without search text and extended scope', () => {
      const { query } = teamWithUsersRecordsTagQueryBuilder('', 'extended');

      expect(query).toEqual({
        size: 0,
        aggs: {
          teamWithUsersIndex_teams: {
            terms: {
              field: 'teamName.keyword',
              size: 5,
            },
          },
          teamWithUsersIndex_nestedUsers: {
            nested: {
              path: 'users',
            },
            aggs: {
              names: {
                terms: {
                  field: 'users.name.keyword',
                  size: 5,
                },
              },
            },
          },
        },
      });
    });

    it('builds query with search text and flat scope', () => {
      const { query } = teamWithUsersRecordsTagQueryBuilder('Alpha', 'flat');

      expect(query).toMatchObject({
        size: 0,
        query: {
          bool: {
            should: [{ match: { teamName: 'Alpha' } }],
          },
        },
        aggs: {
          teamWithUsersIndex_filteredTeams: expect.objectContaining({
            filter: { match: { teamName: 'Alpha' } },
          }),
        },
      });
      expect(query.aggs).not.toHaveProperty('teamWithUsersIndex_filteredUsers');
    });

    it('builds query with search text and extended scope', () => {
      const { query } = teamWithUsersRecordsTagQueryBuilder(
        'Alpha',
        'extended',
      );

      expect(query).toMatchObject({
        size: 0,
        query: {
          bool: {
            should: expect.arrayContaining([
              { match: { teamName: 'Alpha' } },
              {
                nested: {
                  path: 'users',
                  query: { match: { 'users.name': 'Alpha' } },
                },
              },
            ]),
          },
        },
      });
      expect(query.aggs).toHaveProperty('teamWithUsersIndex_filteredTeams');
      expect(query.aggs).toHaveProperty('teamWithUsersIndex_filteredUsers');
    });
  });

  describe('response transformer', () => {
    it('transforms empty query response with teams only (flat scope)', () => {
      const { responseTransformer } = teamWithUsersRecordsTagQueryBuilder(
        '',
        'flat',
      );

      const response: TeamWithUsersIndexEmptyQueryResponse = {
        aggregations: {
          teamWithUsersIndex_teams: {
            buckets: [
              { key: 'Team A', doc_count: 5 },
              { key: 'Team B', doc_count: 3 },
            ],
          },
        },
      };

      const result = responseTransformer(response);

      expect(result).toEqual(['Team A', 'Team B']);
    });

    it('transforms empty query response with teams and users (extended scope)', () => {
      const { responseTransformer } = teamWithUsersRecordsTagQueryBuilder(
        '',
        'extended',
      );

      const response: TeamWithUsersIndexEmptyQueryResponse = {
        aggregations: {
          teamWithUsersIndex_teams: {
            buckets: [{ key: 'Team A', doc_count: 5 }],
          },
          teamWithUsersIndex_nestedUsers: {
            names: {
              buckets: [{ key: 'John Doe', doc_count: 3 }],
            },
          },
        },
      };

      const result = responseTransformer(response);

      expect(result).toEqual(['Team A', 'John Doe']);
    });

    it('transforms search query response with filtered teams and users', () => {
      const { responseTransformer } = teamWithUsersRecordsTagQueryBuilder(
        'Alpha',
        'extended',
      );

      const response: TeamWithUsersIndexSearchQueryResponse = {
        aggregations: {
          teamWithUsersIndex_filteredTeams: {
            teams: {
              buckets: [{ key: 'Alpha Team', doc_count: 10 }],
            },
          },
          teamWithUsersIndex_filteredUsers: {
            filtered_names: {
              names: {
                buckets: [{ key: 'Alpha User', doc_count: 5 }],
              },
            },
          },
        },
      };

      const result = responseTransformer(response);

      expect(result).toEqual(['Alpha Team', 'Alpha User']);
    });

    it('handles response with teams only (no users in search)', () => {
      const { responseTransformer } = teamWithUsersRecordsTagQueryBuilder(
        'Alpha',
        'flat',
      );

      const response: TeamWithUsersIndexSearchQueryResponse = {
        aggregations: {
          teamWithUsersIndex_filteredTeams: {
            teams: {
              buckets: [{ key: 'Alpha Team', doc_count: 10 }],
            },
          },
        },
      };

      const result = responseTransformer(response);

      expect(result).toEqual(['Alpha Team']);
    });

    it('returns empty array for unrecognized response in search query', () => {
      const { responseTransformer } = teamWithUsersRecordsTagQueryBuilder(
        'Alpha',
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
      const { responseTransformer } = teamWithUsersRecordsTagQueryBuilder(
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
      const { responseTransformer } = teamWithUsersRecordsTagQueryBuilder(
        '',
        'extended',
      );

      const response: TeamWithUsersIndexEmptyQueryResponse = {
        aggregations: {
          teamWithUsersIndex_teams: {
            buckets: [],
          },
          teamWithUsersIndex_nestedUsers: {
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
