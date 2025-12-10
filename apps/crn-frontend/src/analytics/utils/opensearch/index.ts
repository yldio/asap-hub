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
  AggregationBucket,
  NestedConfig,
  TermsField,
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

// Response types (exported for testing)
export type {
  TeamWithUsersIndexEmptyQueryResponse,
  TeamWithUsersIndexSearchQueryResponse,
  UserWithTeamsIndexEmptyQueryResponse,
  UserWithTeamsIndexSearchQueryResponse,
  TeamBasedIndexEmptyQueryResponse,
  TeamBasedIndexSearchQueryResponse,
} from './tag-query-builders';
