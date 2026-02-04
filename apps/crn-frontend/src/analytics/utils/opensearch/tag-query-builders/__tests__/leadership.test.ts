import {
  leadershipRecordTagQueryBuilder,
  LeadershipBasedIndexEmptyQueryResponse,
  LeadershipBasedIndexSearchQueryResponse,
} from '../leadership';

describe('leadershipRecordTagQueryBuilder', () => {
  describe('query structure', () => {
    it('throws error when searchScope is extended', () => {
      expect(() => leadershipRecordTagQueryBuilder('', 'extended')).toThrow(
        "The search scope 'extended' is not available for this index",
      );
    });

    it('builds query without search text', () => {
      const { query } = leadershipRecordTagQueryBuilder('', 'flat');

      expect(query).toEqual({
        size: 0,
        aggs: {
          leadershipBasedIndex_teams: {
            terms: {
              field: 'displayName.keyword',
              size: 10,
            },
          },
        },
      });
    });

    it('builds query with search text using wildcard', () => {
      const { query } = leadershipRecordTagQueryBuilder('alpha', 'flat');

      expect(query).toMatchObject({
        size: 0,
        query: {
          bool: {
            should: [
              {
                wildcard: {
                  'displayName.raw': {
                    value: '*alpha*',
                    case_insensitive: true,
                  },
                },
              },
            ],
          },
        },
        aggs: {
          leadershipBasedIndex_filteredTeams: {
            filter: {
              wildcard: {
                'displayName.raw': {
                  value: '*alpha*',
                  case_insensitive: true,
                },
              },
            },
            aggs: {
              teams: {
                terms: {
                  field: 'displayName.raw',
                  size: 10,
                },
              },
            },
          },
        },
      });
    });

    it('converts search text to lowercase for wildcard pattern', () => {
      const { query } = leadershipRecordTagQueryBuilder('ALPHA', 'flat');

      expect(query.aggs).toMatchObject({
        leadershipBasedIndex_filteredTeams: {
          filter: {
            wildcard: {
              'displayName.raw': {
                value: '*alpha*',
              },
            },
          },
        },
      });
    });
  });

  describe('response transformer', () => {
    it('transforms empty query response with teams', () => {
      const { responseTransformer } = leadershipRecordTagQueryBuilder(
        '',
        'flat',
      );

      const response: LeadershipBasedIndexEmptyQueryResponse = {
        aggregations: {
          leadershipBasedIndex_teams: {
            buckets: [
              { key: 'Team Alpha', doc_count: 10 },
              { key: 'Team Beta', doc_count: 5 },
            ],
          },
        },
      };

      const result = responseTransformer(response);

      expect(result).toEqual(['Team Alpha', 'Team Beta']);
    });

    it('transforms search query response with filtered teams', () => {
      const { responseTransformer } = leadershipRecordTagQueryBuilder(
        'alpha',
        'flat',
      );

      const response: LeadershipBasedIndexSearchQueryResponse = {
        aggregations: {
          leadershipBasedIndex_filteredTeams: {
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
      const { responseTransformer } = leadershipRecordTagQueryBuilder(
        'alpha',
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
      const { responseTransformer } = leadershipRecordTagQueryBuilder(
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
      const { responseTransformer } = leadershipRecordTagQueryBuilder(
        '',
        'flat',
      );

      const response: LeadershipBasedIndexEmptyQueryResponse = {
        aggregations: {
          leadershipBasedIndex_teams: {
            buckets: [],
          },
        },
      };

      const result = responseTransformer(response);

      expect(result).toEqual([]);
    });
  });
});
