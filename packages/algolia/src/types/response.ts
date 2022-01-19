import { SearchResponse as AlgoliaSearchResponse } from '@algolia/client-search';

export type SearchResponseEntityMetadata<TEntityName extends string> = {
  type: TEntityName;
};

export type SearchResponseEntity<
  TEntity extends Record<string, unknown>,
  TEntityName extends string,
> = TEntity & {
  objectID: string;
  __meta: SearchResponseEntityMetadata<TEntityName>;
};

export type SearchResponse<
  TEntity extends Record<string, unknown>,
  TEntityName extends string,
> = AlgoliaSearchResponse<SearchResponseEntity<TEntity, TEntityName>>;
