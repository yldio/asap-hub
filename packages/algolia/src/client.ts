import { SearchIndex } from 'algoliasearch';
import {
  SearchOptions,
  SearchResponse,
  BatchActionType,
  BatchRequest,
} from '@algolia/client-search';
import { ResearchOutputResponse, UserResponse } from '@asap-hub/model';

export type EntityResponses = {
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

export type AlgoliaBatchRequest = {
  action: BatchActionType;
  body: EntityResponses[keyof EntityResponses];
};

export class AlgoliaSearchClient {
  public constructor(private index: SearchIndex) {
    // do nothing
  }

  async batch(requests: AlgoliaBatchRequest[]): Promise<void> {
    await this.index.batch(
      requests.map(
        ({ action, body }): BatchRequest => ({
          action,
          body: {
            ...body,
            objectID: body.id,
            __meta: { type: getEntityType(body) },
          },
        }),
      ),
    );
  }

  async save(payload: EntityResponses[keyof EntityResponses]): Promise<void> {
    await this.index.saveObject({
      ...payload,
      objectID: payload.id,
      __meta: { type: getEntityType(payload) },
    });
  }

  async remove(objectID: string): Promise<void> {
    await this.index.deleteObject(objectID);
  }

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
