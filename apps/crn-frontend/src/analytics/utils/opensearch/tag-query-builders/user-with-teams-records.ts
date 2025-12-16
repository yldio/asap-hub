import type {
  AggregationBucket,
  NestedConfig,
  SearchScope,
  ShouldClause,
  TagQueryBuilder,
  TagSuggestionsResponse,
  TermsField,
} from '../types';

// Unique aggregation keys for user-with-teams index (used by user-productivity)
const USER_WITH_TEAMS_INDEX_USERS = 'userWithTeamsIndex_users' as const;
const USER_WITH_TEAMS_INDEX_NESTED_TEAMS =
  'userWithTeamsIndex_nestedTeams' as const;
const USER_WITH_TEAMS_INDEX_FILTERED_USERS =
  'userWithTeamsIndex_filteredUsers' as const;
const USER_WITH_TEAMS_INDEX_FILTERED_TEAMS =
  'userWithTeamsIndex_filteredTeams' as const;

// Empty query types (when no search string is provided)
type UserWithTeamsIndexEmptyQueryAggregation = {
  [USER_WITH_TEAMS_INDEX_USERS]: {
    terms: TermsField;
  };
  [USER_WITH_TEAMS_INDEX_NESTED_TEAMS]?: {
    nested: NestedConfig;
    aggs: {
      names: { terms: TermsField };
    };
  };
};

export type UserWithTeamsIndexEmptyQueryResponse = {
  aggregations: {
    [USER_WITH_TEAMS_INDEX_USERS]: {
      buckets: AggregationBucket[];
    };
    [USER_WITH_TEAMS_INDEX_NESTED_TEAMS]?: {
      names: {
        buckets: AggregationBucket[];
      };
    };
  };
};

// Search query types (when a search string is provided)
export type UserWithTeamsIndexSearchQueryAggregation = {
  [USER_WITH_TEAMS_INDEX_FILTERED_USERS]: {
    filter: {
      wildcard: Record<string, { value: string; case_insensitive: boolean }>;
    };
    aggs: {
      users: { terms: TermsField };
    };
  };
  [USER_WITH_TEAMS_INDEX_FILTERED_TEAMS]?: {
    nested: NestedConfig;
    aggs: {
      filtered_names: {
        filter: {
          wildcard: Record<
            string,
            { value: string; case_insensitive: boolean }
          >;
        };
        aggs: {
          names: { terms: TermsField };
        };
      };
    };
  };
};

export type UserWithTeamsIndexSearchQueryResponse = {
  aggregations: {
    [USER_WITH_TEAMS_INDEX_FILTERED_USERS]: {
      users: {
        buckets: AggregationBucket[];
      };
    };
    [USER_WITH_TEAMS_INDEX_FILTERED_TEAMS]?: {
      filtered_names: {
        names: {
          buckets: AggregationBucket[];
        };
      };
    };
  };
};

// Type guards
function isUserWithTeamsIndexEmptyQueryResponse(
  response: TagSuggestionsResponse,
): response is UserWithTeamsIndexEmptyQueryResponse {
  return USER_WITH_TEAMS_INDEX_USERS in response.aggregations;
}

function isUserWithTeamsIndexSearchQueryResponse(
  response: TagSuggestionsResponse,
): response is UserWithTeamsIndexSearchQueryResponse {
  return USER_WITH_TEAMS_INDEX_FILTERED_USERS in response.aggregations;
}

export const userWithTeamsRecordsTagQueryBuilder: TagQueryBuilder = (
  searchQuery: string,
  searchScope: SearchScope,
): ReturnType<TagQueryBuilder> => {
  if (!searchQuery) {
    const aggs: UserWithTeamsIndexEmptyQueryAggregation = {
      [USER_WITH_TEAMS_INDEX_USERS]: {
        terms: {
          field: 'name.keyword',
          size: 5,
        },
      },
    };

    if (searchScope === 'extended') {
      aggs[USER_WITH_TEAMS_INDEX_NESTED_TEAMS] = {
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
      };
    }

    return {
      query: {
        size: 0,
        aggs,
      },
      responseTransformer: (response: TagSuggestionsResponse) => {
        if (isUserWithTeamsIndexEmptyQueryResponse(response)) {
          const users = response.aggregations[
            USER_WITH_TEAMS_INDEX_USERS
          ].buckets.map((b) => b.key);
          const teams =
            response.aggregations[
              USER_WITH_TEAMS_INDEX_NESTED_TEAMS
            ]?.names.buckets.map((b) => b.key) ?? [];
          // Returning teams first because it's the current behavior with Algolia.
          return [...teams, ...users];
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
        'name.keyword': {
          value: wildcardPattern,
          case_insensitive: true,
        },
      },
    },
  ];

  const aggs: UserWithTeamsIndexSearchQueryAggregation = {
    [USER_WITH_TEAMS_INDEX_FILTERED_USERS]: {
      filter: {
        wildcard: {
          'name.keyword': {
            value: wildcardPattern,
            case_insensitive: true,
          },
        },
      },
      aggs: {
        users: {
          terms: {
            field: 'name.keyword',
            size: 10,
          },
        },
      },
    },
  };

  if (searchScope === 'extended') {
    shouldClauses.push({
      nested: {
        path: 'teams',
        query: {
          wildcard: {
            'teams.team.keyword': {
              value: wildcardPattern,
              case_insensitive: true,
            },
          },
        },
      },
    });

    aggs[USER_WITH_TEAMS_INDEX_FILTERED_TEAMS] = {
      nested: {
        path: 'teams',
      },
      aggs: {
        filtered_names: {
          filter: {
            wildcard: {
              'teams.team.keyword': {
                value: wildcardPattern,
                case_insensitive: true,
              },
            },
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
    };
  }

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
      if (isUserWithTeamsIndexSearchQueryResponse(response)) {
        const users = response.aggregations[
          USER_WITH_TEAMS_INDEX_FILTERED_USERS
        ].users.buckets.map((b) => b.key);
        const teams =
          response.aggregations[
            USER_WITH_TEAMS_INDEX_FILTERED_TEAMS
          ]?.filtered_names.names.buckets.map((b) => b.key) ?? [];
        // Returning teams first because it's the current behavior with Algolia.
        return [...teams, ...users];
      }
      return [];
    },
  };
};
