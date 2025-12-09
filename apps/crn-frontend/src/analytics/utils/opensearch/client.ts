import { createSentryHeaders } from '@asap-hub/frontend-utils';
import { API_BASE_URL } from '../../../config';
import {
  teamWithUsersRecordSearchQueryBuilder,
  userWithTeamsRecordSearchQueryBuilder,
  teamRecordSearchQueryBuilder,
  taglessSearchQueryBuilder,
} from './query-builders';
import {
  teamWithUsersRecordsTagQueryBuilder,
  userWithTeamsRecordsTagQueryBuilder,
  unsupportedTagQueryBuilder,
  teamRecordTagQueryBuilder,
} from './tag-query-builders';
import type {
  OpensearchHit,
  OpensearchHitsResponse,
  OpensearchIndex,
  OpensearchSearchOptions,
  OpensearchSort,
  SearchQuery,
  SearchResult,
  SearchScope,
  TagQueryBuilder,
  TagSuggestionsResponse,
} from './types';

const DEFAULT_PAGE_NUMBER = 0;
const DEFAULT_PAGE_SIZE = 10;

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

const tagQueryBuilderByIndex: Record<OpensearchIndex, TagQueryBuilder> = {
  attendance: teamWithUsersRecordsTagQueryBuilder,
  'os-champion': teamWithUsersRecordsTagQueryBuilder,
  'preliminary-data-sharing': teamWithUsersRecordsTagQueryBuilder,
  'preprint-compliance': teamWithUsersRecordsTagQueryBuilder,
  'publication-compliance': teamWithUsersRecordsTagQueryBuilder,
  'user-productivity': userWithTeamsRecordsTagQueryBuilder,
  'user-productivity-performance': unsupportedTagQueryBuilder,
  'team-productivity': teamRecordTagQueryBuilder,
  'team-productivity-performance': unsupportedTagQueryBuilder,
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
      sort: sort as OpensearchSort[],
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
