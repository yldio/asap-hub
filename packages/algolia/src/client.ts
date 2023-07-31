import { SearchOptions, SearchResponse } from '@algolia/client-search';
import { SearchIndex } from 'algoliasearch';
import { gp2 } from '.';
import { EntityResponses, Payload } from './crn/types';

type DistributeToEntityRecords<
  Responses extends EntityResponses | gp2.EntityResponses,
  ResponsesKey extends keyof Responses,
> = Responses[ResponsesKey] & {
  objectID: string;
  __meta: {
    type: ResponsesKey;
  };
};

type SavePayload = Payload | gp2.Payload;
export interface SearchClient {
  search: <
    Responses extends EntityResponses | gp2.EntityResponses,
    ResponsesKey extends keyof Responses,
  >(
    entityTypes: ResponsesKey[],
    query: string,
    requestOptions?: SearchOptions,
    descendingEvents?: boolean,
  ) => Promise<
    SearchResponse<DistributeToEntityRecords<Responses, ResponsesKey>>
  >;
  save: <SavePayload extends Payload | gp2.Payload>(
    payload: SavePayload,
  ) => Promise<void>;
  saveMany: <SavePayload extends Payload | gp2.Payload>(
    payload: SavePayload[],
  ) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

// helper to get the type of the function
export const getSearchReturnType: SearchClient['search'] = () =>
  null as unknown as ReturnType<SearchClient['search']>;

export class AlgoliaSearchClient implements SearchClient {
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

  async search<
    Responses extends EntityResponses | gp2.EntityResponses,
    ResponsesKey extends keyof Responses,
  >(
    entityTypes: ResponsesKey[],
    query: string,
    requestOptions?: SearchOptions,
    descendingEvents?: boolean,
  ): Promise<
    SearchResponse<DistributeToEntityRecords<Responses, ResponsesKey>>
  > {
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
