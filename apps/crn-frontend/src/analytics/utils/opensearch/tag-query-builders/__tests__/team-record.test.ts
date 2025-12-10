import {
  teamRecordTagQueryBuilder,
  TeamBasedIndexEmptyQueryResponse,
  TeamBasedIndexSearchQueryResponse,
  TeamBasedIndexSearchQueryAggregation,
} from '../team-record';

describe('teamRecordTagQueryBuilder', () => {
  describe('query structure', () => {
    it('throws error when searchScope is extended', () => {
      expect(() => teamRecordTagQueryBuilder('', 'extended')).toThrow(
        "The search scope 'extended' is not available for this index",
      );
    });

    it('builds query without search text', () => {
      const { query } = teamRecordTagQueryBuilder('', 'flat');

      expect(query).toEqual({
        size: 0,
        aggs: {
          teamBasedIndex_teams: {
            terms: {
              field: 'name.raw',
              size: 10,
            },
          },
        },
      });
    });

    it('builds query with search text using wildcard', () => {
      const { query } = teamRecordTagQueryBuilder('alpha', 'flat');

      expect(query).toMatchObject({
        size: 0,
        query: {
          bool: {
            should: [
              {
                wildcard: {
                  'name.raw': {
                    value: '*alpha*',
                    case_insensitive: true,
                  },
                },
              },
            ],
          },
        },
        aggs: {
          teamBasedIndex_filteredTeams: {
            filter: {
              wildcard: {
                'name.raw': {
                  value: '*alpha*',
                  case_insensitive: true,
                },
              },
            },
            aggs: {
              teams: {
                terms: {
                  field: 'name.raw',
                  size: 10,
                },
              },
            },
          },
        },
      });
    });

    it('converts search text to lowercase for wildcard pattern', () => {
      const { query } = teamRecordTagQueryBuilder('ALPHA', 'flat');
      const aggs = query.aggs as TeamBasedIndexSearchQueryAggregation;
      const wildcardConfig = aggs.teamBasedIndex_filteredTeams.filter.wildcard[
        'name.raw'
      ] as { value: string };

      expect(wildcardConfig.value).toBe('*alpha*');
    });
  });

  describe('response transformer', () => {
    it('transforms empty query response with teams', () => {
      const { responseTransformer } = teamRecordTagQueryBuilder('', 'flat');

      const response: TeamBasedIndexEmptyQueryResponse = {
        aggregations: {
          teamBasedIndex_teams: {
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
      const { responseTransformer } = teamRecordTagQueryBuilder(
        'alpha',
        'flat',
      );

      const response: TeamBasedIndexSearchQueryResponse = {
        aggregations: {
          teamBasedIndex_filteredTeams: {
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
      const { responseTransformer } = teamRecordTagQueryBuilder(
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
      const { responseTransformer } = teamRecordTagQueryBuilder('', 'flat');

      const response = {
        aggregations: {
          some_unknown_key: { buckets: [] },
        },
      };

      const result = responseTransformer(response);

      expect(result).toEqual([]);
    });

    it('handles empty buckets gracefully', () => {
      const { responseTransformer } = teamRecordTagQueryBuilder('', 'flat');

      const response: TeamBasedIndexEmptyQueryResponse = {
        aggregations: {
          teamBasedIndex_teams: {
            buckets: [],
          },
        },
      };

      const result = responseTransformer(response);

      expect(result).toEqual([]);
    });
  });
});
