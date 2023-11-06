import {
  SearchOptions,
  SearchResponse,
  SearchForFacetValuesResponse,
} from '@algolia/client-search';
import {
  EventResponse,
  ExternalAuthorResponse,
  gp2 as gp2Model,
  ResearchOutputResponse,
  UserResponse,
} from '@asap-hub/model';
import { SearchIndex } from 'algoliasearch';
import {
  EVENT_ENTITY_TYPE,
  EXTERNAL_AUTHOR_ENTITY_TYPE,
  Payload,
  RESEARCH_OUTPUT_ENTITY_TYPE,
  USER_ENTITY_TYPE,
} from './crn';
import {
  NEWS_ENTITY_TYPE,
  OUTPUT_ENTITY_TYPE,
  Payload as GP2Payload,
  PROJECT_ENTITY_TYPE,
  EXTERNAL_USER_ENTITY_TYPE,
} from './gp2';

const CRN = 'crn';
const GP2 = 'gp2';
export type Apps = typeof CRN | typeof GP2;
export type EntityResponses = {
  [CRN]: {
    [RESEARCH_OUTPUT_ENTITY_TYPE]: ResearchOutputResponse;
    [USER_ENTITY_TYPE]: UserResponse;
    [EXTERNAL_AUTHOR_ENTITY_TYPE]: ExternalAuthorResponse;
    [EVENT_ENTITY_TYPE]: EventResponse;
  };
  [GP2]: {
    [EVENT_ENTITY_TYPE]: gp2Model.EventResponse;
    [NEWS_ENTITY_TYPE]: gp2Model.NewsResponse;
    [OUTPUT_ENTITY_TYPE]: gp2Model.OutputResponse;
    [PROJECT_ENTITY_TYPE]: gp2Model.ProjectResponse;
    [USER_ENTITY_TYPE]: gp2Model.UserResponse;
    [EXTERNAL_USER_ENTITY_TYPE]: gp2Model.ExternalUserResponse;
  };
};
export type SavePayload = Payload | GP2Payload;
export type DistributeToEntityRecords<
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
export type ClientSearch<
  App extends Apps,
  ResponsesKey extends keyof EntityResponses[App],
> = (
  entityTypes: ResponsesKey[],
  query: string,
  requestOptions?: SearchOptions,
  descendingEvents?: boolean,
) => Promise<ClientSearchResponse<App, keyof EntityResponses[App]>>;
export interface SearchClient {
  search: ClientSearch<Apps, keyof EntityResponses[Apps]>;
  save: (payload: SavePayload) => Promise<void>;
  saveMany: (payload: SavePayload[]) => Promise<void>;
  remove: (id: string) => Promise<void>;
  searchForTagValues: <ResponsesKey extends keyof EntityResponses[Apps]>(
    entityTypes: ResponsesKey[],
    query: string,
    requestOptions?: SearchOptions | undefined,
  ) => Promise<SearchForFacetValuesResponse>;
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

  private getSearchOptions<ResponsesKey extends keyof EntityResponses[App]>(
    entityTypes: ResponsesKey[],
    requestOptions?: SearchOptions,
  ): SearchOptions {
    const entityTypesFilter = entityTypes
      .map((entityType) => `__meta.type:"${String(entityType)}"`)
      .join(' OR ');

    return {
      ...requestOptions,
      clickAnalytics: this.clickAnalytics,
      userToken: this.userToken,
      filters: requestOptions?.filters
        ? `${requestOptions.filters} AND (${entityTypesFilter})`
        : entityTypesFilter,
    };
  }

  async search<ResponsesKey extends keyof EntityResponses[App]>(
    entityTypes: ResponsesKey[],
    query: string,
    requestOptions?: SearchOptions,
    descendingEvents?: boolean,
  ): Promise<ClientSearchResponse<App, ResponsesKey>> {
    const options = this.getSearchOptions(entityTypes, requestOptions);
    try {
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
    } catch (error) {
      throw new Error(`Could not search: ${(error as Error).message}`);
    }
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

  async searchForTagValues<ResponsesKey extends keyof EntityResponses[App]>(
    entityTypes: ResponsesKey[],
    query: string,
    requestOptions?: SearchOptions,
  ): Promise<SearchForFacetValuesResponse> {
    try {
      const result = await this.index.searchForFacetValues(
        '_tags',
        query,
        this.getSearchOptions(entityTypes, requestOptions),
      );
      return result;
    } catch (error) {
      throw new Error(
        `Could not search for facet values: ${(error as Error).message}`,
      );
    }
  }
}

export type CRNEntities = keyof EntityResponses['crn'];

// we don't show external author cards
export type CRNTagSearchEntities = Exclude<CRNEntities, 'external-author'>;

export type CRNTagSearchEntitiesList = Array<CRNTagSearchEntities>;
