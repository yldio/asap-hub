import { SearchIndex } from 'algoliasearch';
import { SearchOptions, SearchResponse } from '@algolia/client-search';
import {
  ExternalAuthorResponse,
  LabResponse,
  ResearchOutputResponse,
  UserResponse,
} from '@asap-hub/model';

export const RESEARCH_OUTPUT_ENTITY_TYPE = 'research-output';
export const USER_ENTITY_TYPE = 'user';
export const EXTERNAL_AUTHOR_ENTITY_TYPE = 'external-author';
export const LAB_ENTITY_TYPE = 'Lab';

export type EntityResponses = {
  [RESEARCH_OUTPUT_ENTITY_TYPE]: ResearchOutputResponse & { id: string };
  [USER_ENTITY_TYPE]: UserResponse & { id: string };
  [EXTERNAL_AUTHOR_ENTITY_TYPE]: ExternalAuthorResponse & { id: string };
  [LAB_ENTITY_TYPE]: LabResponse & { id: string };
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

export type Payload<T extends EntityResponses[keyof EntityResponses]> = {
  data: T;
  type: keyof EntityResponses;
};

export class AlgoliaSearchClient {
  public constructor(private index: SearchIndex) {
    // do nothing
  }

  async save<T extends EntityResponses[keyof EntityResponses]>({
    data,
    type,
  }: Payload<T>): Promise<void> {
    await this.index.saveObject(
      AlgoliaSearchClient.getAlgoliaObject(data, type),
    );
  }

  async saveMany<T extends EntityResponses[keyof EntityResponses]>(
    payloads: Payload<T>[],
  ): Promise<void> {
    await this.index.saveObjects(
      payloads.map(({ data, type }) =>
        AlgoliaSearchClient.getAlgoliaObject(data, type),
      ),
    );
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

  private static getAlgoliaObject(
    body: EntityResponses[keyof EntityResponses],
    type: keyof EntityResponses,
  ): Record<string, unknown> {
    return {
      ...body,
      objectID: body.id,
      __meta: { type },
    };
  }
}
