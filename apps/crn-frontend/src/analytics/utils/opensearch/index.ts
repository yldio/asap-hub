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

export { buildNormalizedStringSort } from './query-builders';
