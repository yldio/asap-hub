import type {
  AggregationBucket,
  SearchScope,
  ShouldClause,
  TagQueryBuilder,
  TagSuggestionsResponse,
  TermsField,
} from '../types';

// Unique aggregation keys for team-based index (used by team-productivity)
const TEAM_BASED_INDEX_TEAMS = 'teamBasedIndex_teams' as const;
const TEAM_BASED_INDEX_FILTERED_TEAMS = 'teamBasedIndex_filteredTeams' as const;

// Empty query types (when no search string is provided)
type TeamBasedIndexEmptyQueryAggregation = {
  [TEAM_BASED_INDEX_TEAMS]: {
    terms: TermsField;
  };
};

export type TeamBasedIndexEmptyQueryResponse = {
  aggregations: {
    [TEAM_BASED_INDEX_TEAMS]: {
      buckets: AggregationBucket[];
    };
  };
};

// Search query types (when a search string is provided)
export type TeamBasedIndexSearchQueryAggregation = {
  [TEAM_BASED_INDEX_FILTERED_TEAMS]: {
    filter: {
      wildcard: Record<string, { value: string; case_insensitive: boolean }>;
    };
    aggs: {
      teams: { terms: TermsField };
    };
  };
};

export type TeamBasedIndexSearchQueryResponse = {
  aggregations: {
    [TEAM_BASED_INDEX_FILTERED_TEAMS]: {
      teams: {
        buckets: AggregationBucket[];
      };
    };
  };
};

// Type guards
function isTeamBasedIndexEmptyQueryResponse(
  response: TagSuggestionsResponse,
): response is TeamBasedIndexEmptyQueryResponse {
  return TEAM_BASED_INDEX_TEAMS in response.aggregations;
}

function isTeamBasedIndexSearchQueryResponse(
  response: TagSuggestionsResponse,
): response is TeamBasedIndexSearchQueryResponse {
  return TEAM_BASED_INDEX_FILTERED_TEAMS in response.aggregations;
}

export const teamRecordTagQueryBuilder: TagQueryBuilder = (
  searchQuery: string,
  searchScope: SearchScope,
): ReturnType<TagQueryBuilder> => {
  if (searchScope === 'extended') {
    throw new Error(
      `The search scope 'extended' is not available for this index`,
    );
  }

  if (!searchQuery) {
    const aggs: TeamBasedIndexEmptyQueryAggregation = {
      [TEAM_BASED_INDEX_TEAMS]: {
        terms: {
          field: 'name.raw',
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
        if (isTeamBasedIndexEmptyQueryResponse(response)) {
          return response.aggregations[TEAM_BASED_INDEX_TEAMS].buckets.map(
            (b) => b.key,
          );
        }
        return [];
      },
    };
  }

  // A wildcard pattern works better in the typeahead feature
  const wildcardPattern = `*${searchQuery.toLowerCase()}*`;

  const shouldClauses: ShouldClause[] = [
    {
      wildcard: {
        'name.raw': {
          value: wildcardPattern,
          case_insensitive: true,
        },
      },
    },
  ];

  const aggs: TeamBasedIndexSearchQueryAggregation = {
    [TEAM_BASED_INDEX_FILTERED_TEAMS]: {
      filter: {
        wildcard: {
          'name.raw': {
            value: wildcardPattern,
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
      if (isTeamBasedIndexSearchQueryResponse(response)) {
        return response.aggregations[
          TEAM_BASED_INDEX_FILTERED_TEAMS
        ].teams.buckets.map((b) => b.key);
      }
      return [];
    },
  };
};
