import type {
  EmptyQueryResultAggregations,
  SearchScope,
  TagQueryBuilder,
  TagSuggestionsResponse,
} from './types';

export const teamWithUsersRecordsTagQueryBuilder: TagQueryBuilder = (
  searchQuery: string,
  searchScope: SearchScope,
): ReturnType<TagQueryBuilder> => {
  if (!searchQuery) {
    const aggs: Record<string, unknown> = {
      teams: {
        terms: {
          field: 'teamName.keyword',
          size: 5,
        },
      },
    };

    if (searchScope === 'extended') {
      aggs.users = {
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
      responseTransformer: (queryResponse: TagSuggestionsResponse) => {
        let teams: string[] = [];
        let users: string[] = [];

        if (
          'teams' in queryResponse.aggregations &&
          queryResponse.aggregations.teams
        ) {
          teams = queryResponse.aggregations.teams.buckets.map((b) => b.key);
        }

        if (
          'users' in queryResponse.aggregations &&
          queryResponse.aggregations.users
        ) {
          users = queryResponse.aggregations.users.names.buckets.map(
            (b) => b.key,
          );
        }

        return [...teams, ...users];
      },
    };
  }

  const shouldClauses: Record<string, unknown>[] = [
    {
      match: {
        teamName: searchQuery,
      },
    },
  ];
  const aggs: Record<string, unknown> = {
    matching_teams: {
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

    aggs.matching_users = {
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
    responseTransformer: (queryResponse: TagSuggestionsResponse) => {
      let teams: string[] = [];
      let users: string[] = [];

      if (
        'matching_teams' in queryResponse.aggregations &&
        queryResponse.aggregations.matching_teams
      ) {
        teams =
          'teams' in queryResponse.aggregations.matching_teams &&
          queryResponse.aggregations.matching_teams.teams
            ? queryResponse.aggregations.matching_teams.teams.buckets.map(
                (b) => b.key,
              )
            : [];
      }

      if (
        'matching_users' in queryResponse.aggregations &&
        queryResponse.aggregations.matching_users
      ) {
        users =
          'filtered_names' in queryResponse.aggregations.matching_users &&
          queryResponse.aggregations.matching_users.filtered_names
            ? queryResponse.aggregations.matching_users.filtered_names.names.buckets.map(
                (b) => b.key,
              )
            : [];
      }

      // Returning teams first because it's the current behavior with Algolia.
      return [...teams, ...users];
    },
  };
};

export const userWithTeamsRecordsTagQueryBuilder: TagQueryBuilder = (
  searchQuery: string,
  searchScope: SearchScope,
): ReturnType<TagQueryBuilder> => {
  if (!searchQuery) {
    const aggs: Record<string, unknown> = {
      users: {
        terms: {
          field: 'name.keyword',
          size: 5,
        },
      },
    };

    if (searchScope === 'extended') {
      aggs.teams = {
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
      responseTransformer: (queryResponse: TagSuggestionsResponse) => {
        let teams: string[] = [];
        let users: string[] = [];

        if ('teams' in queryResponse.aggregations) {
          const aggregations =
            queryResponse.aggregations as EmptyQueryResultAggregations;
          teams = aggregations.teams.names.buckets.map((b) => b.key);
        }

        if ('users' in queryResponse.aggregations) {
          const aggregations =
            queryResponse.aggregations as EmptyQueryResultAggregations;
          users = aggregations.users.buckets.map((b) => b.key);
        }

        // Returning teams first because it's the current behavior with Algolia.
        return [...teams, ...users];
      },
    };
  }

  // A wildcard pattern works better in the typeahead feature
  const wildcardPattern = `*${searchQuery.toLowerCase()}*`;

  const shouldClauses: Record<string, unknown>[] = [
    {
      wildcard: {
        'name.keyword': {
          value: wildcardPattern,
          case_insensitive: true,
        },
      },
    },
  ];

  const aggs: Record<string, unknown> = {
    matching_users: {
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

    aggs.matching_teams = {
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
    responseTransformer: (queryResponse: TagSuggestionsResponse) => {
      let teams: string[] = [];
      let users: string[] = [];
      if (
        'matching_users' in queryResponse.aggregations &&
        queryResponse.aggregations.matching_users
      ) {
        users =
          'users' in queryResponse.aggregations.matching_users &&
          queryResponse.aggregations.matching_users.users
            ? queryResponse.aggregations.matching_users.users.buckets.map(
                (b) => b.key,
              )
            : [];
      }

      if (
        'matching_teams' in queryResponse.aggregations &&
        queryResponse.aggregations.matching_teams
      ) {
        teams =
          'filtered_names' in queryResponse.aggregations.matching_teams &&
          queryResponse.aggregations.matching_teams.filtered_names
            ? queryResponse.aggregations.matching_teams.filtered_names.names.buckets.map(
                (b) => b.key,
              )
            : [];
      }

      // Returning teams first because it's the current behavior with Algolia.
      return [...teams, ...users];
    },
  };
};

export const unsupportedTagQueryBuilder: TagQueryBuilder = (
  _searchQuery: string,
  _searchScope: SearchScope,
): ReturnType<TagQueryBuilder> => {
  throw new Error(`This Opensearch index doesn't support tag suggestions`);
};

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
    const aggs: Record<string, unknown> = {
      teams: {
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
      responseTransformer: (queryResponse: TagSuggestionsResponse) => {
        let teams: string[] = [];

        if ('teams' in queryResponse.aggregations) {
          const aggregations =
            queryResponse.aggregations as EmptyQueryResultAggregations;
          teams = aggregations.teams.buckets.map((b) => b.key);
        }

        return teams;
      },
    };
  }

  // A wildcard pattern works better in the typeahead feature
  const wildcardPattern = `*${searchQuery.toLowerCase()}*`;

  const shouldClauses: Record<string, unknown>[] = [
    {
      wildcard: {
        'name.raw': {
          value: wildcardPattern,
          case_insensitive: true,
        },
      },
    },
  ];

  const aggs: Record<string, unknown> = {
    matching_teams: {
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
    responseTransformer: (queryResponse: TagSuggestionsResponse) => {
      let teams: string[] = [];
      if (
        'matching_teams' in queryResponse.aggregations &&
        queryResponse.aggregations.matching_teams
      ) {
        teams =
          'teams' in queryResponse.aggregations.matching_teams &&
          queryResponse.aggregations.matching_teams.teams
            ? queryResponse.aggregations.matching_teams.teams.buckets.map(
                (b) => b.key,
              )
            : [];
      }
      return teams;
    },
  };
};
