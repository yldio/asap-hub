import { createSentryHeaders } from '@asap-hub/frontend-utils';
import {
  DocumentCategoryOption,
  OutputTypeOption,
  TimeRangeOption,
} from '@asap-hub/model';
import { API_BASE_URL } from '../../config';

const DEFAULT_PAGE_NUMBER = 0;
const DEFAULT_PAGE_SIZE = 10;

export interface SearchResult<T> {
  items: T[];
  total: number;
}

export interface OpensearchHit<T> {
  _index: string;
  _id: string;
  _score: number;
  _source: T;
}

export interface OpensearchHitsResponse<T> {
  hits: {
    total: {
      value: number;
    };
    hits: OpensearchHit<T>[];
  };
}

type AggregationBucket = {
  key: string;
  doc_count: number;
};

type SearchResultAggregation =
  | {
      filtered_names: {
        names: {
          buckets: AggregationBucket[];
        };
      };
      buckets: never;
    }
  | {
      filtered_names: never;
      buckets: AggregationBucket[];
    };

// When there is a search query (filtered results) for tags
type SearchQueryResultAggregations = {
  matching_teams?:
    | {
        teams: SearchResultAggregation;
      }
    | SearchResultAggregation;
  matching_users?:
    | {
        users: SearchResultAggregation;
      }
    | SearchResultAggregation;
};

type ResultAggregation =
  | {
      names: { buckets: AggregationBucket[] };
      buckets: never;
    }
  | {
      names: never;
      buckets: AggregationBucket[];
    };

// When there is NO search query (default results) for tags
// Assumes there will always be some results (builders return a min number of results)
type EmptyQueryResultAggregations = {
  teams: ResultAggregation;
  users: ResultAggregation;
};

type TagSuggestionsResponse = {
  aggregations: EmptyQueryResultAggregations | SearchQueryResultAggregations;
};

/**
 * Controls whether search queries match only the primary record or also include
 * nested/related entities.
 *
 * - `flat`: Only match the primary entity field (team name for team-based
 *   indices, user name for user-based indices)
 * - `extended`: Also search related entities (e.g., searching "Hawk" in a team
 *   index will find teams that have a member named "Hawk")
 *
 * Used by query builders to conditionally add nested search clauses.
 */
type SearchScope = 'flat' | 'extended';

type OpensearchSearchOptions = {
  currentPage: number;
  pageSize: number;
  timeRange: TimeRangeOption;
  searchTags: string[];
  searchScope: SearchScope;
  documentCategory?: DocumentCategoryOption;
  sort?: OpensearchSort[];
  outputType?: OutputTypeOption;
};

type SortConfigOrder = 'asc' | 'desc';

type SortConfigNested = {
  path: string;
};

type OpensearchPropertySort = {
  [id: string]: {
    order: SortConfigOrder;
    mode?: 'avg' | 'sum' | 'median' | 'min' | 'max';
    nested?: SortConfigNested;
    missing?: '_first' | '_last' | number | string;
  };
};

type OpensearchScriptSort = {
  _script: {
    type: 'string';
    script: {
      source: string;
      lang: 'painless';
    };
    order: SortConfigOrder;
    nested?: SortConfigNested;
  };
};

export type OpensearchSort = OpensearchScriptSort | OpensearchPropertySort;

export const buildNormalizedStringSort = (options: {
  keyword: `${string}.keyword`;
  order: SortConfigOrder;
  nested?: SortConfigNested;
}): OpensearchScriptSort => ({
  _script: {
    type: 'string',
    script: {
      source: `doc['${options.keyword}'].value.toLowerCase()`,
      lang: 'painless',
    },
    order: options.order,
    ...(options.nested ? { nested: options.nested } : {}),
  },
});

export type OpensearchIndex =
  | 'publication-compliance'
  | 'preprint-compliance'
  | 'os-champion'
  | 'attendance'
  | 'preliminary-data-sharing'
  | 'user-productivity'
  | 'user-productivity-performance'
  | 'team-productivity'
  | 'team-productivity-performance';

type ShouldClause =
  | {
      term: Record<string, string>;
    }
  | {
      nested: {
        path: string;
        query: {
          term: Record<string, string>;
        };
      };
    };

type SearchQuery = {
  query: {
    bool:
      | {
          must: { term: Record<string, unknown> }[];
        }
      | {
          should: ShouldClause[];
          minimum_should_match: number;
          must?: { term: Record<string, unknown> }[];
        };
  };
  sort?: Record<string, { order: 'asc' | 'desc' }>[];
  from: number;
  size: number;
};

export const teamWithUsersRecordSearchQueryBuilder = (
  options: OpensearchSearchOptions,
): SearchQuery => {
  const shouldClauses = options.searchTags.flatMap((term) => {
    const clauses: ShouldClause[] = [
      {
        term: {
          'teamName.keyword': term,
        },
      },
    ];

    if (options.searchScope === 'extended') {
      clauses.push({
        nested: {
          path: 'users',
          query: {
            term: {
              'users.name.keyword': term,
            },
          },
        },
      });
    }
    return clauses;
  });

  const mustClauses: SearchQuery['query']['bool']['must'] = [];

  mustClauses.push({
    term: {
      timeRange: options.timeRange,
    },
  });

  if (options.documentCategory) {
    mustClauses.push({
      term: { documentCategory: options.documentCategory },
    });
  }

  return {
    from: options.currentPage * options.pageSize,
    size: options.pageSize,
    query: {
      bool: {
        ...(shouldClauses.length > 0
          ? { should: shouldClauses, minimum_should_match: 1 }
          : {}),
        must: mustClauses,
      },
    },
    sort: options.sort
      ? options.sort
      : [
          // Provide a default sorting to keep existing behavior.
          {
            'teamName.keyword': {
              order: 'asc',
            },
          },
        ],
  };
};

export const userWithTeamsRecordSearchQueryBuilder = (
  options: OpensearchSearchOptions,
): SearchQuery => {
  const shouldClauses = options.searchTags.flatMap((term) => {
    const clauses: ShouldClause[] = [
      {
        term: {
          'name.keyword': term,
        },
      },
    ];

    if (options.searchScope === 'extended') {
      clauses.push({
        nested: {
          path: 'teams',
          query: {
            term: {
              'teams.team.keyword': term,
            },
          },
        },
      });
    }
    return clauses;
  });

  const mustClauses: SearchQuery['query']['bool']['must'] = [];

  mustClauses.push({
    term: {
      timeRange: options.timeRange,
    },
  });

  if (options.documentCategory) {
    mustClauses.push({
      term: { documentCategory: options.documentCategory },
    });
  }

  return {
    from: options.currentPage * options.pageSize,
    size: options.pageSize,
    query: {
      bool: {
        ...(shouldClauses.length > 0
          ? { should: shouldClauses, minimum_should_match: 1 }
          : {}),
        must: mustClauses,
      },
    },
    ...(options.sort ? { sort: options.sort } : {}),
  };
};

export const teamRecordSearchQueryBuilder = (
  options: OpensearchSearchOptions,
): SearchQuery => {
  if (options.searchScope === 'extended') {
    throw new Error(
      `The search scope 'extended' is not available for this index`,
    );
  }
  const shouldClauses = options.searchTags.flatMap((term) => {
    const clauses: ShouldClause[] = [
      {
        term: {
          'name.keyword': term,
        },
      },
    ];

    return clauses;
  });

  const mustClauses: SearchQuery['query']['bool']['must'] = [];

  mustClauses.push({
    term: {
      timeRange: options.timeRange,
    },
  });

  if (options.outputType) {
    mustClauses.push({
      term: { outputType: options.outputType },
    });
  }

  return {
    from: options.currentPage * options.pageSize,
    size: options.pageSize,
    query: {
      bool: {
        ...(shouldClauses.length > 0
          ? { should: shouldClauses, minimum_should_match: 1 }
          : {}),
        must: mustClauses,
      },
    },
    ...(options.sort ? { sort: options.sort } : {}),
  };
};

export const taglessSearchQueryBuilder = (
  options: OpensearchSearchOptions,
): SearchQuery => {
  if (options.searchScope === 'extended') {
    throw new Error(
      `The search scope 'extended' is not available for this index`,
    );
  }

  return {
    from: options.currentPage * options.pageSize,
    size: options.pageSize,
    query: {
      bool: {
        must: [
          ...(options.timeRange
            ? [{ term: { timeRange: options.timeRange } }]
            : []),
          ...(options.documentCategory
            ? [{ term: { documentCategory: options.documentCategory } }]
            : []),
          ...(options.outputType
            ? [{ term: { outputType: options.outputType } }]
            : []),
        ],
      },
    },
  };
};

const queryBuilderByIndex: Record<
  OpensearchIndex,
  (options: OpensearchSearchOptions) => SearchQuery
> = {
  attendance: teamWithUsersRecordSearchQueryBuilder,
  'os-champion': teamWithUsersRecordSearchQueryBuilder,
  'preliminary-data-sharing': teamWithUsersRecordSearchQueryBuilder,
  'preprint-compliance': teamWithUsersRecordSearchQueryBuilder,
  'publication-compliance': teamWithUsersRecordSearchQueryBuilder,
  'user-productivity': userWithTeamsRecordSearchQueryBuilder,
  'user-productivity-performance': taglessSearchQueryBuilder,
  'team-productivity': teamRecordSearchQueryBuilder,
  'team-productivity-performance': taglessSearchQueryBuilder,
};

type TagQueryBuilder = (
  searchQuery: string,
  searchScope: SearchScope,
) => {
  query: Record<string, unknown>;
  responseTransformer: (queryResponse: TagSuggestionsResponse) => string[];
};

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
      responseTransformer: (_queryResponse) => {
        // temporary stub
        return [];
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
    responseTransformer: (_queryResponse) => {
      // temporary stub
      return [];
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

  const wildcardPattern = `*${searchQuery.toLowerCase()}*`; // a wildcard pattern works better in the typeahead feature

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
        queryResponse.aggregations.matching_users // Just for type compliance
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
        queryResponse.aggregations.matching_teams // Just for type compliance
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

const unsupportedCall: TagQueryBuilder = (
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

  const wildcardPattern = `*${searchQuery.toLowerCase()}*`; // a wildcard pattern works better in the typeahead feature

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
        queryResponse.aggregations.matching_teams // Just for type compliance
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

const tagQueryBuilderByIndex: Record<OpensearchIndex, TagQueryBuilder> = {
  attendance: teamWithUsersRecordsTagQueryBuilder,
  'os-champion': teamWithUsersRecordsTagQueryBuilder,
  'preliminary-data-sharing': teamWithUsersRecordsTagQueryBuilder,
  'preprint-compliance': teamWithUsersRecordsTagQueryBuilder,
  'publication-compliance': teamWithUsersRecordsTagQueryBuilder,
  'user-productivity': userWithTeamsRecordsTagQueryBuilder,
  'user-productivity-performance': unsupportedCall,
  'team-productivity': teamRecordTagQueryBuilder,
  'team-productivity-performance': teamRecordTagQueryBuilder,
};

export class OpensearchClient<T> {
  private index: OpensearchIndex;
  private authorization: string;

  constructor(index: OpensearchIndex, authorization: string) {
    this.index = index;
    this.authorization = authorization;
  }

  async request<S>(query: object): Promise<S> {
    const url = `${API_BASE_URL}/opensearch/search/${this.index}`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        authorization: this.authorization,
        'content-type': 'application/json',
        ...createSentryHeaders(),
      },
      body: JSON.stringify(query),
    });

    if (!resp.ok) {
      throw new Error(
        `Failed to search ${
          this.index
        } index. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
      );
    }

    return resp.json();
  }

  async search({
    searchTags,
    currentPage,
    pageSize,
    timeRange,
    searchScope,
    documentCategory,
    sort,
    outputType,
  }: Omit<OpensearchSearchOptions, 'currentPage' | 'pageSize'> & {
    currentPage?: number;
    pageSize?: number;
  }): Promise<SearchResult<T>> {
    const searchQuery = queryBuilderByIndex[this.index]({
      pageSize: pageSize ?? DEFAULT_PAGE_SIZE,
      currentPage: currentPage ?? DEFAULT_PAGE_NUMBER,
      searchScope,
      documentCategory,
      timeRange,
      searchTags,
      sort,
      outputType,
    });
    const response = await this.request<OpensearchHitsResponse<T>>(searchQuery);

    const items = (response.hits?.hits || []).map((hit: OpensearchHit<T>) => ({
      // eslint-disable-next-line no-underscore-dangle
      ...hit._source,
      // eslint-disable-next-line no-underscore-dangle
      objectID: hit._id,
    }));

    return {
      items,
      total: response.hits?.total?.value || 0,
    };
  }

  async getTagSuggestions(
    queryText: string,
    searchScope: SearchScope = 'extended',
  ): Promise<string[]> {
    const { query, responseTransformer } = tagQueryBuilderByIndex[this.index](
      queryText,
      searchScope,
    );
    const response = await this.request<TagSuggestionsResponse>(query);
    return responseTransformer(response);
  }
}
