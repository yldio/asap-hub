import { SearchOptions, SearchResponse } from '@algolia/client-search';
import { SearchIndex } from 'algoliasearch';
import { gp2 } from '.';
import { EntityResponses, Payload } from './crn/types';

type DistributeToEntityRecords<
  T extends EntityResponses | gp2.EntityResponses,
  K extends keyof T,
> = T[K] & {
  objectID: string;
  __meta: {
    type: K;
  };
};

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

  async save<SavePayload extends Payload | gp2.Payload>({
    data,
    type,
  }: SavePayload): Promise<void> {
    await this.index.saveObject(
      AlgoliaSearchClient.getAlgoliaObject<SavePayload>(data, type),
    );
  }

  async saveMany<SavePayload extends Payload | gp2.Payload>(
    payloads: SavePayload[],
  ): Promise<void> {
    await this.index.saveObjects(
      payloads.map(({ data, type }) =>
        AlgoliaSearchClient.getAlgoliaObject<SavePayload>(data, type),
      ),
    );
  }

  async remove(objectID: string): Promise<void> {
    await this.index.deleteObject(objectID);
  }

  async search<
    Responses extends EntityResponses | gp2.EntityResponses,
    ResponsesKey extends keyof Responses,
  >(
    entityTypes: ResponsesKey[],
    query: string,
    requestOptions?: SearchOptions,
    descendingEvents?: boolean,
  ) {
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
