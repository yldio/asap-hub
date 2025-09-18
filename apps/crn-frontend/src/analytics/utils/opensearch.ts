import { createSentryHeaders } from '@asap-hub/frontend-utils';
import { TimeRangeOption } from '@asap-hub/model';
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

interface AggregationBucket {
  key: string;
  doc_count: number;
}

interface OpensearchHitsResponse<T> {
  hits: {
    total: {
      value: number;
    };
    hits: OpensearchHit<T>[];
  };
}

interface TagSuggestionsResponse {
  aggregations: {
    matching_teams?: {
      teams?: {
        buckets?: AggregationBucket[];
      };
    };
    matching_users?: {
      filtered_names?: {
        names?: {
          buckets?: AggregationBucket[];
        };
      };
    };
    teams?: {
      buckets?: AggregationBucket[];
    };
    users?: {
      names?: {
        buckets?: AggregationBucket[];
      };
    };
  };
}

type SearchScope = 'teams' | 'both';

interface OpensearchSearchOptions {
  currentPage?: number | null;
  pageSize?: number | null;
  timeRange?: TimeRangeOption;
  searchTags: string[];
  searchScope: SearchScope;
  fetchTags?: boolean;
}

export class OpensearchClient<T> {
  private index: string;
  private authorization: string;

  constructor(index: string, authorization: string) {
    this.index = index;
    this.authorization = authorization;
  }

  private async request<S>(query: object): Promise<S> {
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

  async search(
    searchTags: string[],
    currentPage: number | null,
    pageSize: number | null,
    timeRange: TimeRangeOption = 'all',
    searchScope: SearchScope = 'both',
  ): Promise<SearchResult<T>> {
    const query = buildOpensearchQuery({
      searchTags,
      currentPage,
      pageSize,
      searchScope,
      timeRange,
    });
    const response = await this.request<OpensearchHitsResponse<T>>(query);

    const items = (response.hits?.hits || []).map(
      // eslint-disable-next-line no-underscore-dangle
      (hit: OpensearchHit<T>) => hit._source,
    );

    return {
      items,
      total: response.hits?.total?.value || 0,
    };
  }

  async getTagSuggestions(
    queryText: string,
    searchScope: SearchScope = 'both',
  ): Promise<string[]> {
    const isEmptyQuery = !queryText;

    const query = isEmptyQuery
      ? buildDefaultAggregationQuery(searchScope)
      : buildAggregationQuery(queryText, searchScope);
    const response = await this.request<TagSuggestionsResponse>(query);

    const teams = isEmptyQuery
      ? response.aggregations?.teams?.buckets?.map((b) => b.key)
      : response.aggregations?.matching_teams?.teams?.buckets?.map(
          (b) => b.key,
        );

    const users = isEmptyQuery
      ? response.aggregations?.users?.names?.buckets?.map((b) => b.key)
      : response.aggregations?.matching_users?.filtered_names?.names?.buckets?.map(
          (b) => b.key,
        );
    return [...(teams || []), ...(users || [])];
  }
}

const generateDefaultQuery = (page: number, size: number) => ({
  query: {
    match_all: {},
  },
  size,
  from: page * size,
});

const generateDefaultQueryWithTimeRange = (page: number, size: number, timeRange: TimeRangeOption) => ({
  query: {
    bool: {
      must: [
        {
          term: {
            timeRange,
          },
        },
      ],
        }
  },
  size,
  from: page * size,
});

const buildAggregationQuery = (
  searchQuery: string,
  searchScope: SearchScope,
) => {
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

  if (searchScope === 'both') {
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
    size: 0,
    query: {
      bool: {
        should: shouldClauses,
      },
    },
    aggs,
  };
};

const buildDefaultAggregationQuery = (
  searchScope: SearchScope,
): Record<string, unknown> => {
  const aggs: Record<string, unknown> = {
    teams: {
      terms: {
        field: 'teamName.keyword',
        size: 5,
      },
    },
  };

  if (searchScope === 'both') {
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
    size: 0,
    aggs,
  };
};

const buildSearchQuery = (
  tags: string[],
  page: number,
  size: number,
  searchScope: SearchScope,
  timeRange?: TimeRangeOption,
) => {
  const shouldClauses = tags.flatMap((term) => {
    const clauses: Record<string, unknown>[] = [
      {
        term: {
          'teamName.keyword': term,
        },
      },
    ];

    if (searchScope === 'both') {
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

  const mustClauses: Record<string, unknown>[] = [];

  if (timeRange) {
    mustClauses.push({
      term: {
        timeRange,
      },
    });
  }


  return {
    from: page * size,
    size,
    query: {
      bool: {
        should: shouldClauses,
        minimum_should_match: 1,
        ...(mustClauses.length > 0 ? { must: mustClauses } : {}),
      },
    },
    sort: [
      {
        'teamName.keyword': {
          order: 'asc',
        },
      },
    ],
  };
};

const buildOpensearchQuery = (options: OpensearchSearchOptions) => {
  const { currentPage, pageSize, searchTags, searchScope, timeRange } = options;

  if (searchTags?.length === 0) {
    if (timeRange) {
      return generateDefaultQueryWithTimeRange(
      currentPage || DEFAULT_PAGE_NUMBER,
      pageSize || DEFAULT_PAGE_SIZE,
      timeRange        
      )
    }
    return generateDefaultQuery(
      currentPage || DEFAULT_PAGE_NUMBER,
      pageSize || DEFAULT_PAGE_SIZE,
    );
  }

  return buildSearchQuery(
    searchTags,
    currentPage || DEFAULT_PAGE_NUMBER,
    pageSize || DEFAULT_PAGE_SIZE,
    searchScope,
    timeRange
  );
};
