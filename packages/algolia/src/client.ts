import { SearchIndex } from 'algoliasearch';
import { SearchOptions, SearchResponse } from '@algolia/client-search';
import { ResearchOutputResponse, UserResponse } from '@asap-hub/model';

export const RESEARCH_OUTPUT_ENTITY_TYPE = 'research-output';
export const USER_ENTITY_TYPE = 'user';

export type EntityResponses = {
  [RESEARCH_OUTPUT_ENTITY_TYPE]: ResearchOutputResponse;
  [USER_ENTITY_TYPE]: UserResponse;
};

export type EntityRecord<T extends keyof EntityResponses> =
  EntityResponses[T] & {
    objectID: string;
    __meta: {
      type: T;
    };
  };

export type SearchEntityResponse<TEntityType extends keyof EntityResponses> =
  SearchResponse<EntityRecord<TEntityType>>;

export const getEntityType = (
  entity: EntityResponses[keyof EntityResponses],
): keyof EntityResponses => {
  if ('title' in entity && 'sharingStatus' in entity) {
    return 'research-output';
  }

  return 'user';
};
export class AlgoliaSearchClient {
  public constructor(private index: SearchIndex) {
    // do nothing
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
  ): Promise<SearchEntityResponse<T>> {
    const options: SearchOptions = {
      ...requestOptions,
      filters: requestOptions?.filters
        ? `${requestOptions.filters} AND __meta.type:"${entityType}"`
        : `__meta.type:"${entityType}"`,
    };

    return this.index.search<EntityRecord<T>>(query, options);
  }
}
