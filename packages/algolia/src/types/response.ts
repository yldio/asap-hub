export type SearchResponseMetadata<TEntityName extends string> = {
  type: TEntityName;
};

export type SearchResponse<TEntity extends {}, TEntityName extends string> =
  TEntity & {
    objectID: string;
    __meta: SearchResponseMetadata<TEntityName>;
  };
