import { SearchIndex } from 'algoliasearch';
import {
  SearchOptions,
  SearchResponse,
} from '@algolia/client-search';
import { ResearchOutputResponse, UserResponse } from '@asap-hub/model';

export class AlgoliaSearchClient {
  public constructor(protected index: SearchIndex) {}

  save = async <T extends keyof EntityResponses>(
    entityType: T,
    payload: EntityResponses[T],
  ): Promise<void> => {
    await this.index.saveObject({
      ...payload,
      objectID: payload.id,
      __meta: { type: entityType },
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

type EntityResponses = {
  'research-output': ResearchOutputResponse;
  user: UserResponse;
};
export type EntityRecord<T extends keyof EntityResponses> = EntityResponses[T] & {
  objectID: string;
  __meta: {
    type: T;
  };
};
