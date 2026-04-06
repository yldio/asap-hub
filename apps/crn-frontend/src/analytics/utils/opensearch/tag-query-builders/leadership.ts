import type {
  AggregationBucket,
  SearchScope,
  ShouldClause,
  TagQueryBuilder,
  TagSuggestionsResponse,
  TermsField,
} from '../types';

// Unique aggregation keys for leadership-based index (used by wg-leadership)
const LEADERSHIP_BASED_INDEX_TEAMS = 'leadershipBasedIndex_teams' as const;
const LEADERSHIP_BASED_INDEX_FILTERED_TEAMS =
  'leadershipBasedIndex_filteredTeams' as const;

// Empty query types (when no search string is provided)
type LeadershipBasedIndexEmptyQueryAggregation = {
  [LEADERSHIP_BASED_INDEX_TEAMS]: {
    terms: TermsField;
  };
};

export type LeadershipBasedIndexEmptyQueryResponse = {
  aggregations: {
    [LEADERSHIP_BASED_INDEX_TEAMS]: {
      buckets: AggregationBucket[];
    };
  };
};

// Search query types (when a search string is provided)
export type LeadershipBasedIndexSearchQueryAggregation = {
  [LEADERSHIP_BASED_INDEX_FILTERED_TEAMS]: {
    filter: {
      wildcard: Record<string, { value: string; case_insensitive: boolean }>;
    };
    aggs: {
      teams: { terms: TermsField };
    };
  };
};

export type LeadershipBasedIndexSearchQueryResponse = {
  aggregations: {
    [LEADERSHIP_BASED_INDEX_FILTERED_TEAMS]: {
      teams: {
        buckets: AggregationBucket[];
      };
    };
  };
};

// Type guards
function isLeadershipBasedIndexEmptyQueryResponse(
  response: TagSuggestionsResponse,
): response is LeadershipBasedIndexEmptyQueryResponse {
  return LEADERSHIP_BASED_INDEX_TEAMS in response.aggregations;
}

function isLeadershipBasedIndexSearchQueryResponse(
  response: TagSuggestionsResponse,
): response is LeadershipBasedIndexSearchQueryResponse {
  return LEADERSHIP_BASED_INDEX_FILTERED_TEAMS in response.aggregations;
}

export const leadershipRecordTagQueryBuilder: TagQueryBuilder = (
  searchQuery: string,
  searchScope: SearchScope,
): ReturnType<TagQueryBuilder> => {
  if (searchScope === 'extended') {
    throw new Error(
      `The search scope 'extended' is not available for this index`,
    );
  }
  if (!searchQuery) {
    const aggs: LeadershipBasedIndexEmptyQueryAggregation = {
      [LEADERSHIP_BASED_INDEX_TEAMS]: {
        terms: {
          field: 'displayName.raw',
          size: 10,
        },
      },
    };

    return {
      query: {
        size: 0,
        aggs,
      },
      responseTransformer: (response: TagSuggestionsResponse) => {
        if (isLeadershipBasedIndexEmptyQueryResponse(response)) {
          return response.aggregations[
            LEADERSHIP_BASED_INDEX_TEAMS
          ].buckets.map((b) => b.key);
        }
        return [];
      },
    };
  }

  const wildcardPattern = `*${searchQuery.toLowerCase()}*`;

  const shouldClauses: ShouldClause[] = [
    {
      wildcard: {
        'displayName.raw': {
          value: wildcardPattern,
          case_insensitive: true,
        },
      },
    },
  ];

  const aggs: LeadershipBasedIndexSearchQueryAggregation = {
    [LEADERSHIP_BASED_INDEX_FILTERED_TEAMS]: {
      filter: {
        wildcard: {
          'displayName.raw': {
            value: wildcardPattern,
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
  };

  return {
    query: {
      size: 0,
      query: {
        bool: {
          should: shouldClauses,
        },
      },
      aggs,
    },
    responseTransformer: (response: TagSuggestionsResponse) => {
      if (isLeadershipBasedIndexSearchQueryResponse(response)) {
        return response.aggregations[
          LEADERSHIP_BASED_INDEX_FILTERED_TEAMS
        ].teams.buckets.map((b) => b.key);
      }
      return [];
    },
  };
};
