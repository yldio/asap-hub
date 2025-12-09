export type {
  OpensearchIndex,
  OpensearchSort,
  SearchResult,
  OpensearchHit,
  OpensearchHitsResponse,
  SearchScope,
  OpensearchSearchOptions,
  TagQueryBuilder,
  SearchQuery,
  ShouldClause,
  TagSuggestionsResponse,
  EmptyQueryResultAggregations,
  SearchQueryResultAggregations,
  ResultAggregation,
  SearchResultAggregation,
  AggregationBucket,
} from './types';

export { OpensearchClient } from './client';

// Query Builders (exported for testing)
export {
  buildNormalizedStringSort,
  teamWithUsersRecordSearchQueryBuilder,
  userWithTeamsRecordSearchQueryBuilder,
  teamRecordSearchQueryBuilder,
  taglessSearchQueryBuilder,
} from './query-builders';

// Tag Query Builders (exported for testing)
export {
  teamWithUsersRecordsTagQueryBuilder,
  userWithTeamsRecordsTagQueryBuilder,
  teamRecordTagQueryBuilder,
  unsupportedTagQueryBuilder,
} from './tag-query-builders';
