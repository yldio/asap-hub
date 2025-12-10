import type {
  AggregationBucket,
  NestedConfig,
  SearchScope,
  ShouldClause,
  TagQueryBuilder,
  TagSuggestionsResponse,
  TermsField,
} from './types';

// ─── teamWithUsersRecordsTagQueryBuilder Types ───────────────────────────────
// Unique aggregation keys for team-with-users index
// (used by attendance, os-champion, preliminary-data-sharing, preprint-compliance, publication-compliance)

const TEAM_WITH_USERS_INDEX_TEAMS = 'teamWithUsersIndex_teams' as const;
const TEAM_WITH_USERS_INDEX_NESTED_USERS =
  'teamWithUsersIndex_nestedUsers' as const;
const TEAM_WITH_USERS_INDEX_FILTERED_TEAMS =
  'teamWithUsersIndex_filteredTeams' as const;
const TEAM_WITH_USERS_INDEX_FILTERED_USERS =
  'teamWithUsersIndex_filteredUsers' as const;

// Empty query types (when no search string is provided)
type TeamWithUsersIndexEmptyQueryAggregation = {
  [TEAM_WITH_USERS_INDEX_TEAMS]: {
    terms: TermsField;
  };
  [TEAM_WITH_USERS_INDEX_NESTED_USERS]?: {
    nested: NestedConfig;
    aggs: {
      names: { terms: TermsField };
    };
  };
};

type TeamWithUsersIndexEmptyQueryResponse = {
  aggregations: {
    [TEAM_WITH_USERS_INDEX_TEAMS]: {
      buckets: AggregationBucket[];
    };
    [TEAM_WITH_USERS_INDEX_NESTED_USERS]?: {
      names: {
        buckets: AggregationBucket[];
      };
    };
  };
};

// Search query types (when a search string is provided)
type TeamWithUsersIndexSearchQueryAggregation = {
  [TEAM_WITH_USERS_INDEX_FILTERED_TEAMS]: {
    filter: { match: Record<string, string> };
    aggs: {
      teams: { terms: TermsField };
    };
  };
  [TEAM_WITH_USERS_INDEX_FILTERED_USERS]?: {
    nested: NestedConfig;
    aggs: {
      filtered_names: {
        filter: { match: Record<string, string> };
        aggs: {
          names: { terms: TermsField };
        };
      };
    };
  };
};

type TeamWithUsersIndexSearchQueryResponse = {
  aggregations: {
    [TEAM_WITH_USERS_INDEX_FILTERED_TEAMS]: {
      teams: {
        buckets: AggregationBucket[];
      };
    };
    [TEAM_WITH_USERS_INDEX_FILTERED_USERS]?: {
      filtered_names: {
        names: {
          buckets: AggregationBucket[];
        };
      };
    };
  };
};

// Type guards
function isTeamWithUsersIndexEmptyQueryResponse(
  response: TagSuggestionsResponse,
): response is TeamWithUsersIndexEmptyQueryResponse {
  return TEAM_WITH_USERS_INDEX_TEAMS in response.aggregations;
}

function isTeamWithUsersIndexSearchQueryResponse(
  response: TagSuggestionsResponse,
): response is TeamWithUsersIndexSearchQueryResponse {
  return TEAM_WITH_USERS_INDEX_FILTERED_TEAMS in response.aggregations;
}

export const teamWithUsersRecordsTagQueryBuilder: TagQueryBuilder = (
  searchQuery: string,
  searchScope: SearchScope,
): ReturnType<TagQueryBuilder> => {
  if (!searchQuery) {
    const aggs: TeamWithUsersIndexEmptyQueryAggregation = {
      [TEAM_WITH_USERS_INDEX_TEAMS]: {
        terms: {
          field: 'teamName.keyword',
          size: 5,
        },
      },
    };

    if (searchScope === 'extended') {
      aggs[TEAM_WITH_USERS_INDEX_NESTED_USERS] = {
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
      };
    }

    return {
      query: {
        size: 0,
        aggs,
      },
      responseTransformer: (response: TagSuggestionsResponse) => {
        if (isTeamWithUsersIndexEmptyQueryResponse(response)) {
          const teams = response.aggregations[
            TEAM_WITH_USERS_INDEX_TEAMS
          ].buckets.map((b) => b.key);
          const users =
            response.aggregations[
              TEAM_WITH_USERS_INDEX_NESTED_USERS
            ]?.names.buckets.map((b) => b.key) ?? [];
          return [...teams, ...users];
        }
        return [];
      },
    };
  }

  const shouldClauses: ShouldClause[] = [
    {
      match: {
        teamName: searchQuery,
      },
    },
  ];

  const aggs: TeamWithUsersIndexSearchQueryAggregation = {
    [TEAM_WITH_USERS_INDEX_FILTERED_TEAMS]: {
      filter: {
        match: {
          teamName: searchQuery,
        },
      },
      aggs: {
        teams: {
          terms: {
            field: 'teamName.keyword',
            size: 10,
          },
        },
      },
    },
  };

  if (searchScope === 'extended') {
    shouldClauses.push({
      nested: {
        path: 'users',
        query: {
          match: {
            'users.name': searchQuery,
          },
        },
      },
    });

    aggs[TEAM_WITH_USERS_INDEX_FILTERED_USERS] = {
      nested: {
        path: 'users',
      },
      aggs: {
        filtered_names: {
          filter: {
            match: {
              'users.name': searchQuery,
            },
          },
          aggs: {
            names: {
              terms: {
                field: 'users.name.keyword',
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
      if (isTeamWithUsersIndexSearchQueryResponse(response)) {
        const teams = response.aggregations[
          TEAM_WITH_USERS_INDEX_FILTERED_TEAMS
        ].teams.buckets.map((b) => b.key);
        const users =
          response.aggregations[
            TEAM_WITH_USERS_INDEX_FILTERED_USERS
          ]?.filtered_names.names.buckets.map((b) => b.key) ?? [];
        // Returning teams first because it's the current behavior with Algolia.
        return [...teams, ...users];
      }
      return [];
    },
  };
};

// ─── userWithTeamsRecordsTagQueryBuilder Types ───────────────────────────────
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

type UserWithTeamsIndexEmptyQueryResponse = {
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
type UserWithTeamsIndexSearchQueryAggregation = {
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
          wildcard: Record<string, { value: string; case_insensitive: boolean }>;
        };
        aggs: {
          names: { terms: TermsField };
        };
      };
    };
  };
};

type UserWithTeamsIndexSearchQueryResponse = {
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

export const unsupportedTagQueryBuilder: TagQueryBuilder = (
  _searchQuery: string,
  _searchScope: SearchScope,
): ReturnType<TagQueryBuilder> => {
  throw new Error(`This Opensearch index doesn't support tag suggestions`);
};

// ─── teamRecordTagQueryBuilder Types ─────────────────────────────────────────
// Unique aggregation keys for team-based index (used by team-productivity)

const TEAM_BASED_INDEX_TEAMS = 'teamBasedIndex_teams' as const;
const TEAM_BASED_INDEX_FILTERED_TEAMS = 'teamBasedIndex_filteredTeams' as const;

// Empty query types (when no search string is provided)
type TeamBasedIndexEmptyQueryAggregation = {
  [TEAM_BASED_INDEX_TEAMS]: {
    terms: TermsField;
  };
};

type TeamBasedIndexEmptyQueryResponse = {
  aggregations: {
    [TEAM_BASED_INDEX_TEAMS]: {
      buckets: AggregationBucket[];
    };
  };
};

// Search query types (when a search string is provided)
type TeamBasedIndexSearchQueryAggregation = {
  [TEAM_BASED_INDEX_FILTERED_TEAMS]: {
    filter: {
      wildcard: Record<string, { value: string; case_insensitive: boolean }>;
    };
    aggs: {
      teams: { terms: TermsField };
    };
  };
};

type TeamBasedIndexSearchQueryResponse = {
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

// ─── Exported Types for Testing ──────────────────────────────────────────────

export type {
  TeamWithUsersIndexEmptyQueryResponse,
  TeamWithUsersIndexSearchQueryResponse,
  UserWithTeamsIndexEmptyQueryResponse,
  UserWithTeamsIndexSearchQueryResponse,
  TeamBasedIndexEmptyQueryResponse,
  TeamBasedIndexSearchQueryResponse,
};
