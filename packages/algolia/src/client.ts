import { SearchOptions, SearchResponse } from '@algolia/client-search';
import { SearchIndex } from 'algoliasearch';
import { gp2 } from '.';
import { EntityResponses, Payload } from './crn/types';

type Apps = 'crn' | 'gp2';
type SavePayload = Payload | gp2.Payload;
type DistributeToEntityRecords<
  Responses extends EntityResponses[Apps],
  ResponsesKey extends keyof Responses,
> = Responses[ResponsesKey] & {
  objectID: string;
  __meta: {
    type: ResponsesKey;
  };
};
export type ClientSearchResponse<
  App extends Apps,
  ResponsesKey extends keyof EntityResponses[App],
> = SearchResponse<
  DistributeToEntityRecords<EntityResponses[App], ResponsesKey>
>;
export interface SearchClient {
  search: <ResponsesKey extends keyof EntityResponses[Apps]>(
    entityTypes: ResponsesKey[],
    query: string,
    requestOptions?: SearchOptions,
    descendingEvents?: boolean,
  ) => Promise<ClientSearchResponse<Apps, keyof EntityResponses[Apps]>>;
  save: (payload: SavePayload) => Promise<void>;
  saveMany: (payload: SavePayload[]) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export class AlgoliaSearchClient<App extends Apps> implements SearchClient {
  constructor(
    private index: SearchIndex,
    private reverseEventsIndex: SearchIndex,
    private userToken?: SearchOptions['userToken'],
    private clickAnalytics?: SearchOptions['clickAnalytics'],
  ) {} // eslint-disable-line no-empty-function

  async save({ data, type }: SavePayload) {
    await this.index.saveObject(
      AlgoliaSearchClient.getAlgoliaObject(data, type),
    );
  }

  async saveMany(payload: SavePayload[]) {
    await this.index.saveObjects(
      payload.map(({ data, type }) =>
        AlgoliaSearchClient.getAlgoliaObject(data, type),
      ),
    );
  }

  async remove(id: string) {
    await this.index.deleteObject(id);
  }

  async search<ResponsesKey extends keyof EntityResponses[App]>(
    entityTypes: ResponsesKey[],
    query: string,
    requestOptions?: SearchOptions,
    descendingEvents?: boolean,
  ): Promise<ClientSearchResponse<App, ResponsesKey>> {
    const entityTypesFilter = entityTypes
      .map((entityType) => `__meta.type:"${String(entityType)}"`)
      .join(' OR ');

    const options = {
      ...requestOptions,
      clickAnalytics: this.clickAnalytics,
      userToken: this.userToken,
      filters: requestOptions?.filters
        ? `${requestOptions.filters} AND (${entityTypesFilter})`
        : entityTypesFilter,
    };
    if (descendingEvents) {
      const result = await this.reverseEventsIndex.search<
        DistributeToEntityRecords<EntityResponses[App], ResponsesKey>
      >(query, options);
      return {
        ...result,
        index: this.reverseEventsIndex.indexName,
      };
    }
    const result = await this.index.search<
      DistributeToEntityRecords<EntityResponses[App], ResponsesKey>
    >(query, options);
    return {
      ...result,
      index: this.index.indexName,
    };
  }

  private static getAlgoliaObject(
    body: SavePayload['data'],
    type: SavePayload['type'],
  ): Record<string, unknown> {
    return {
      ...body,
      objectID: body.id,
      __meta: { type },
    };
  }
}
