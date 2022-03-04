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
export const LAB_ENTITY_TYPE = 'lab';

export type Payload =
  | {
      data: ResearchOutputResponse;
      type: 'research-output';
    }
  | {
      data: UserResponse;
      type: 'user';
    }
  | {
      data: ExternalAuthorResponse;
      type: 'external-author';
    }
  | {
      data: LabResponse;
      type: 'lab';
    };

export type EntityResponses = {
  [RESEARCH_OUTPUT_ENTITY_TYPE]: ResearchOutputResponse;
  [USER_ENTITY_TYPE]: UserResponse;
  [EXTERNAL_AUTHOR_ENTITY_TYPE]: ExternalAuthorResponse;
  [LAB_ENTITY_TYPE]: LabResponse;
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

export class AlgoliaSearchClient {
  public constructor(private index: SearchIndex) {
    // do nothing
  }

  async save({ data, type }: Payload): Promise<void> {
    await this.index.saveObject(
      AlgoliaSearchClient.getAlgoliaObject(data, type),
    );
  }

  async saveMany(payloads: Payload[]): Promise<void> {
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
    body: Payload['data'],
    type: Payload['type'],
  ): Record<string, unknown> {
    return {
      ...body,
      objectID: body.id,
      __meta: { type },
    };
  }
}
