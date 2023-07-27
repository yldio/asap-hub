import { SearchOptions, SearchResponse } from '@algolia/client-search';
import { SearchIndex } from 'algoliasearch';
import { gp2 } from './';
import { EntityResponses, Payload } from './crn/types';

export type EntityRecord<
  T extends EntityResponses | gp2.EntityResponses,
  K extends keyof T,
> = T[K] & {
  objectID: string;
  __meta: {
    type: K;
  };
};

export type DistributeToEntityRecords<
  T extends EntityResponses | gp2.EntityResponses,
  K extends keyof T,
> = K extends keyof T ? EntityRecord<T, K> : never;

export type EntityHit<
  T extends EntityResponses | gp2.EntityResponses,
  K extends keyof T,
> = DistributeToEntityRecords<T, K>;

export type SearchEntityResponse<
  T extends EntityResponses | gp2.EntityResponses,
  K extends keyof T,
> = SearchResponse<DistributeToEntityRecords<T, K>>;

export class AlgoliaSearchClient<
  Responses extends EntityResponses | gp2.EntityResponses = EntityResponses,
  SavePayload extends Payload | gp2.Payload = Payload,
> {
  constructor(
    private index: SearchIndex,
    private reverseEventsIndex: SearchIndex,
    private userToken?: SearchOptions['userToken'],
    private clickAnalytics?: SearchOptions['clickAnalytics'],
  ) {}

  async save({ data, type }: SavePayload): Promise<void> {
    await this.index.saveObject(
      AlgoliaSearchClient.getAlgoliaObject<SavePayload>(data, type),
    );
  }

  async saveMany(payloads: SavePayload[]): Promise<void> {
    await this.index.saveObjects(
      payloads.map(({ data, type }) =>
        AlgoliaSearchClient.getAlgoliaObject<SavePayload>(data, type),
      ),
    );
  }

  async remove(objectID: string): Promise<void> {
    await this.index.deleteObject(objectID);
  }

  async search<ResponsesKey extends keyof Responses>(
    entityTypes: ResponsesKey[],
    query: string,
    requestOptions?: SearchOptions,
    descendingEvents?: boolean,
  ): Promise<SearchEntityResponse<Responses, ResponsesKey>> {
    const entityTypesFilter = entityTypes
      .map((entityType) => `__meta.type:"${String(entityType)}"`)
      .join(' OR ');

    const options: SearchOptions = {
      ...requestOptions,
      clickAnalytics: this.clickAnalytics,
      userToken: this.userToken,
      filters: requestOptions?.filters
        ? `${requestOptions.filters} AND (${entityTypesFilter})`
        : entityTypesFilter,
    };
    if (descendingEvents) {
      const result = await this.reverseEventsIndex.search<
        DistributeToEntityRecords<Responses, ResponsesKey>
      >(query, options);
      return {
        ...result,
        index: this.reverseEventsIndex.indexName,
      };
    }
    const result = await this.index.search<
      DistributeToEntityRecords<Responses, ResponsesKey>
    >(query, options);
    return {
      ...result,
      index: this.index.indexName,
    };
  }

  private static getAlgoliaObject<
    GetPayload extends Payload | gp2.Payload = Payload,
  >(
    body: GetPayload['data'],
    type: GetPayload['type'],
  ): Record<string, unknown> {
    return {
      ...body,
      objectID: body.id,
      __meta: { type },
    };
  }
}
