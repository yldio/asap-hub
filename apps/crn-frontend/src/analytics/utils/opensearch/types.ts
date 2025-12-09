import { DocumentCategoryOption, OutputTypeOption } from '@asap-hub/model';

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

export type AggregationBucket = {
  key: string;
  doc_count: number;
};

export type SearchResultAggregation =
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

/** When there is a search query (filtered results) for tags */
export type SearchQueryResultAggregations = {
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

export type ResultAggregation =
  | {
      names: { buckets: AggregationBucket[] };
      buckets: never;
    }
  | {
      names: never;
      buckets: AggregationBucket[];
    };

/**
 * When there is NO search query (default results) for tags.
 * Assumes there will always be some results (builders return a min number of results).
 */
export type EmptyQueryResultAggregations = {
  teams: ResultAggregation;
  users: ResultAggregation;
};

export type TagSuggestionsResponse = {
  aggregations: EmptyQueryResultAggregations | SearchQueryResultAggregations;
};

/**
 * Controls whether search queries match only the primary record or also include
 * nested/related entities.
 *
 * - `flat`: Only match the primary entity field (team name for team based
 *   indices, user name for user based indices)
 * - `extended`: Also search related entities (e.g., searching "Hawk" in a team
 *   index will find teams that have a member named "Hawk")
 *
 * Used by query builders to conditionally add nested search clauses.
 */
export type SearchScope = 'flat' | 'extended';

export type OpensearchSearchOptions = {
  currentPage: number;
  pageSize: number;
  timeRange: string;
  searchTags: string[];
  searchScope: SearchScope;
  documentCategory?: DocumentCategoryOption;
  sort?: OpensearchSort[];
  outputType?: OutputTypeOption;
};

type SortConfigOrder = 'asc' | 'desc';

type NestedConfig = {
  path: string;
};

type OpensearchPropertySort = {
  [id: string]: {
    order: SortConfigOrder;
    mode?: 'avg' | 'sum' | 'median' | 'min' | 'max';
    nested?: NestedConfig;
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
    nested?: NestedConfig;
  };
};

export type OpensearchSort = OpensearchScriptSort | OpensearchPropertySort;

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

export type ShouldClause =
  | {
      wildcard: Record<string, { value: string; case_insensitive: boolean }>;
    }
  | {
      term: Record<string, string>;
    }
  | {
      nested: NestedConfig & {
        query:
          | {
              term: Record<string, string>;
              match?: never;
              wildcard?: never;
            }
          | {
              term?: never;
              match: Record<string, string>;
              wildcard?: never;
            }
          | {
              term?: never;
              match?: never;
              wildcard: Record<
                string,
                { value: string; case_insensitive: boolean }
              >;
            };
      };
    }
  | { match: Record<string, string> };

type TermKey = 'timeRange' | 'documentCategory' | 'outputType';

type ExclusiveRecord<K extends string, V> = {
  [P in K]: { [_ in P]: V } & { [O in Exclude<K, P>]?: never };
}[K];

export type MustClause = {
  // Allow only one key in the term object.
  // Example:
  // {term: {timeRange: 'something'}} -> is valid
  // {term: {timeRange: 'something', documentCategory: 'something-else'}} -> not valid
  term: ExclusiveRecord<TermKey, string>;
};

export type SearchQuery = {
  query: {
    bool:
      | {
          must: MustClause[];
        }
      | {
          should: ShouldClause[];
          minimum_should_match?: number;
          must?: { term: Record<string, unknown> }[];
        };
  };
  sort?: Record<string, { order: 'asc' | 'desc' }>[];
  from: number;
  size: number;
};

type WildcardFilter = Record<
  string,
  { value: string; case_insensitive: boolean }
>;

export type AggregationQuery = {
  size: 0;
  aggs: {
    teams?:
      | {
          terms: {
            field: string;
            size: number;
          };
          nested?: never;
          aggs?: never;
        }
      | {
          terms?: never;
          nested: NestedConfig;
          aggs: {
            names: {
              terms: {
                field: string;
                size: number;
              };
            };
          };
        };
    users?:
      | {
          terms: {
            field: string;
            size: number;
          };
          nested?: never;
          aggs?: never;
        }
      | {
          terms?: never;
          nested: NestedConfig;
          aggs: {
            names: {
              terms: {
                field: string;
                size: number;
              };
            };
          };
        };
    matching_teams?: (
      | {
          filter:
            | {
                match: Record<string, string>;
                wildcard?: never;
              }
            | {
                match?: never;
                wildcard: Record<
                  string,
                  { value: string; case_insensitive: boolean }
                >;
              };
          nested?: never;
        }
      | {
          filter?: never;
          nested: NestedConfig;
        }
    ) & {
      aggs:
        | {
            teams: {
              terms: {
                field: string;
                size: number;
              };
            };
            filtered_names?: never;
          }
        | {
            teams?: never;
            filtered_names: {
              filter: { wildcard: WildcardFilter };
              aggs: {
                names: {
                  terms: { field: string; size: number };
                };
              };
            };
          };
    };

    matching_users?:
      | {
          filter: {
            wildcard: Record<
              string,
              { value: string; case_insensitive: boolean }
            >;
          };
          users?: never;
          nested?: never;
        }
      | {
          filter?: never;
          users: { terms: { field: string; size: number } };
          nested?: never;
          aggs?: never;
        }
      | {
          filter?: never;
          users?: never;
          nested: NestedConfig;
          aggs:
            | {
                users: {
                  terms: {
                    field: string;
                    size: number;
                  };
                };
                filtered_names?: never;
              }
            | {
                users?: never;
                filtered_names: {
                  filter: {
                    match: Record<string, string>;
                  };
                  aggs: {
                    names: {
                      terms: {
                        field: string;
                        size: number;
                      };
                    };
                  };
                };
              };
        };
  };
  query?: SearchQuery['query'];
};

export type TagQueryBuilder = (
  searchQuery: string,
  searchScope: SearchScope,
) => {
  query: AggregationQuery;
  responseTransformer: (queryResponse: TagSuggestionsResponse) => string[];
};
