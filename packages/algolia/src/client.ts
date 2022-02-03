import { SearchIndex } from 'algoliasearch';
import { SearchOptions, SearchResponse } from '@algolia/client-search';
import { ResearchOutputResponse, UserResponse } from '@asap-hub/model';

type EntityResponses = {
  'research-output': ResearchOutputResponse;
  user: UserResponse;
};

export type EntityRecord<T extends keyof EntityResponses> =
  EntityResponses[T] & {
    objectID: string;
    __meta: {
      type: T;
    };
  };

export const getEntityType = (
  entity: EntityResponses[keyof EntityResponses],
): keyof EntityResponses => {
  if ('title' in entity) {
    return 'research-output';
  }

  return 'user';
};
export class AlgoliaSearchClient {
  public constructor(private index: SearchIndex) {}

  save = async (
    payload: EntityResponses[keyof EntityResponses],
  ): Promise<void> => {
    await this.index.saveObject({
      ...payload,
      objectID: payload.id,
      __meta: { type: getEntityType(payload) },
    });
  };

  remove = async (objectID: string): Promise<void> => {
    await this.index.deleteObject(objectID);
  };

  async searchEntity<T extends keyof EntityResponses>(
    entityType: T,
    query: string,
    requestOptions?: SearchOptions,
  ): Promise<SearchResponse<EntityRecord<T>>> {
    const options: SearchOptions = {
      ...requestOptions,
      filters: requestOptions?.filters
        ? `${requestOptions.filters} AND __meta.type:"${entityType}"`
        : `__meta.type:"${entityType}"`,
    };

    return this.index.search<EntityRecord<T>>(query, options);
  }
}
