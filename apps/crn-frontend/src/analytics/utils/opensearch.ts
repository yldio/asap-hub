import { createSentryHeaders } from '@asap-hub/frontend-utils';
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
  };
}

type SearchScope = 'teams' | 'both';

interface OpensearchSearchOptions {
  currentPage?: number | null;
  pageSize?: number | null;
  searchTags?: string[];
  searchScope?: SearchScope;
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
        `Failed to search os-champion index. Expected status 2xx. Received status ${`${resp.status} ${resp.statusText}`.trim()}.`,
      );
    }

    return resp.json();
  }

  async search(
    searchTags: string[],
    currentPage: number | null,
    pageSize: number | null,
  ): Promise<SearchResult<T>> {
    const query = buildOpenSearchQuery({ searchTags, currentPage, pageSize });
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
    const query = buildAggregationQuery(queryText, searchScope);
    const response = await this.request<TagSuggestionsResponse>(query);

    const teams =
      response.aggregations?.matching_teams?.teams?.buckets?.map(
        (b: AggregationBucket) => b.key,
      ) || [];
    const users =
      response.aggregations?.matching_users?.filtered_names?.names?.buckets?.map(
        (b: AggregationBucket) => b.key,
      ) || [];

    return [...teams, ...users];
  }
}

const generateDefaultQuery = (page: number, size: number) => ({
  query: {
    match_all: {},
  },
  size,
  from: page * size,
});

const buildAggregationQuery = (
  searchQuery: string,
  searchScope: SearchScope = 'both',
) => {
  const shouldClauses: Record<string, unknown>[] = [
    {
      nested: {
        path: 'users',
        query: {
          match: {
            'users.name': searchQuery,
          },
        },
      },
    },
  ];
  const aggs: Record<string, unknown> = {
    matching_users: {
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
    },
  };

  if (searchScope === 'teams' || searchScope === 'both') {
    shouldClauses.push({
      match: {
        teamName: searchQuery,
      },
    });

    aggs.matching_teams = {
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

const buildSearchQuery = (
  tags: string[],
  page: number,
  size: number,
  searchScope: SearchScope = 'both',
) => {
  const shouldClauses = tags.flatMap((term) => {
    const clauses: Record<string, unknown>[] = [
      {
        nested: {
          path: 'users',
          query: {
            match_phrase: {
              'users.name': term,
            },
          },
        },
      },
    ];

    if (searchScope === 'teams' || searchScope === 'both') {
      clauses.push({
        match_phrase: {
          teamName: term,
        },
      });
    }
    return clauses;
  });

  return {
    from: page * size,
    size,
    query: {
      bool: {
        should: shouldClauses,
        minimum_should_match: 1,
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

const buildOpenSearchQuery = (options: OpensearchSearchOptions) => {
  const { currentPage, pageSize, searchTags, searchScope } = options;

  if (!searchTags) {
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
  );
};
