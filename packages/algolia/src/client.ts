import {
  SearchClient,
  SearchForFacetValuesResponse,
  SearchResponse,
} from 'algoliasearch';
import {
  DocumentCategoryOption,
  EventResponse,
  ExternalAuthorResponse,
  gp2 as gp2Model,
  InterestGroupResponse,
  NewsResponse,
  ResearchOutputResponse,
  TeamListItemResponse,
  TimeRangeOption,
  TutorialsResponse,
  UserListItemResponse,
  UserResponse,
  WithMeta,
  WorkingGroupResponse,
  OutputTypeOption,
  PartialManuscriptResponse,
  ManuscriptVersionResponse,
  ProjectResponse,
} from '@asap-hub/model';
import {
  EVENT_ENTITY_TYPE,
  EXTERNAL_AUTHOR_ENTITY_TYPE,
  INTEREST_GROUP_ENTITY_TYPE,
  MANUSCRIPT_ENTITY_TYPE,
  MANUSCRIPT_VERSION_ENTITY_TYPE,
  NEWS_ENTITY_TYPE as CRN_NEWS_ENTITY_TYPE,
  Payload,
  PROJECT_ENTITY_TYPE as CRN_PROJECT_ENTITY_TYPE,
  RESEARCH_OUTPUT_ENTITY_TYPE,
  TEAM_ENTITY_TYPE,
  TUTORIAL_ENTITY_TYPE,
  USER_ENTITY_TYPE,
  WORKING_GROUP_ENTITY_TYPE,
} from './crn';
import {
  EXTERNAL_USER_ENTITY_TYPE,
  NEWS_ENTITY_TYPE,
  OUTPUT_ENTITY_TYPE,
  Payload as GP2Payload,
  PROJECT_ENTITY_TYPE,
} from './gp2';

const CRN = 'crn';
const GP2 = 'gp2';
export type Apps = typeof CRN | typeof GP2;

export type EntityData =
  | EventResponse
  | ExternalAuthorResponse
  | InterestGroupResponse
  | NewsResponse
  | ProjectResponse
  | ResearchOutputResponse
  | TeamListItemResponse
  | TutorialsResponse
  | UserResponse
  | WorkingGroupResponse
  | PartialManuscriptResponse
  | ManuscriptVersionResponse;

export type EntityResponses = {
  [CRN]: {
    [RESEARCH_OUTPUT_ENTITY_TYPE]: WithMeta<
      ResearchOutputResponse,
      typeof RESEARCH_OUTPUT_ENTITY_TYPE
    >;
    [USER_ENTITY_TYPE]: WithMeta<UserListItemResponse, typeof USER_ENTITY_TYPE>;
    [EXTERNAL_AUTHOR_ENTITY_TYPE]: WithMeta<
      ExternalAuthorResponse,
      typeof EXTERNAL_AUTHOR_ENTITY_TYPE
    >;
    [EVENT_ENTITY_TYPE]: WithMeta<EventResponse, typeof EVENT_ENTITY_TYPE>;
    [TEAM_ENTITY_TYPE]: WithMeta<TeamListItemResponse, typeof TEAM_ENTITY_TYPE>;
    [WORKING_GROUP_ENTITY_TYPE]: WithMeta<
      WorkingGroupResponse,
      typeof WORKING_GROUP_ENTITY_TYPE
    >;
    [INTEREST_GROUP_ENTITY_TYPE]: WithMeta<
      InterestGroupResponse,
      typeof INTEREST_GROUP_ENTITY_TYPE
    >;
    [TUTORIAL_ENTITY_TYPE]: WithMeta<
      TutorialsResponse,
      typeof TUTORIAL_ENTITY_TYPE
    >;
    [CRN_NEWS_ENTITY_TYPE]: WithMeta<NewsResponse, typeof CRN_NEWS_ENTITY_TYPE>;
    [MANUSCRIPT_ENTITY_TYPE]: WithMeta<
      PartialManuscriptResponse,
      typeof MANUSCRIPT_ENTITY_TYPE
    >;
    [CRN_PROJECT_ENTITY_TYPE]: WithMeta<
      ProjectResponse,
      typeof CRN_PROJECT_ENTITY_TYPE
    >;
    [MANUSCRIPT_VERSION_ENTITY_TYPE]: WithMeta<
      ManuscriptVersionResponse,
      typeof MANUSCRIPT_VERSION_ENTITY_TYPE
    >;
  };
  [GP2]: {
    [EVENT_ENTITY_TYPE]: gp2Model.EventResponse;
    [EXTERNAL_USER_ENTITY_TYPE]: gp2Model.ExternalUserResponse;
    [NEWS_ENTITY_TYPE]: gp2Model.NewsResponse;
    [OUTPUT_ENTITY_TYPE]: gp2Model.OutputResponse;
    [PROJECT_ENTITY_TYPE]: gp2Model.ProjectResponse;
    [USER_ENTITY_TYPE]: gp2Model.UserResponse;
    [WORKING_GROUP_ENTITY_TYPE]: gp2Model.WorkingGroupResponse;
  };
};

export type SearchOptions = {
  filters?: string;
  userToken?: string;
  clickAnalytics?: boolean;
  hitsPerPage?: number;
  page?: number;
  [key: string]: unknown;
};

export type SavePayload = Payload | GP2Payload;
export type DistributeToEntityRecords<
  Responses extends EntityResponses[Apps],
  ResponsesKey extends keyof Responses,
> = Responses[ResponsesKey] & {
  objectID: string;
  __meta: {
    type: ResponsesKey;
    range?: TimeRangeOption;
    documentCategory?: DocumentCategoryOption;
    outputType?: OutputTypeOption;
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
export interface SearchClientInterface<App extends Apps = Apps> {
  search: ClientSearch<App, keyof EntityResponses[App]>;
  save: (payload: SavePayload) => Promise<void>;
  saveMany: (payload: SavePayload[]) => Promise<void>;
  remove: (id: string) => Promise<void>;
  searchForTagValues: <ResponsesKey extends keyof EntityResponses[App]>(
    entityTypes: ResponsesKey[],
    query: string,
    requestOptions?: SearchOptions | undefined,
  ) => Promise<SearchForFacetValuesResponse>;
}

export class AlgoliaSearchClient<App extends Apps>
  implements SearchClientInterface<App>
{
  constructor(
    private client: SearchClient,
    private indexName: string,
    private reverseEventsIndexName: string,
    private userToken?: string,
    private clickAnalytics?: boolean,
  ) {} // eslint-disable-line no-empty-function

  async save({ data, type }: SavePayload) {
    await this.client.saveObject({
      indexName: this.indexName,
      body: AlgoliaSearchClient.getAlgoliaObject(data, type),
    });
  }

  async saveMany(payload: SavePayload[]) {
    await this.client.saveObjects({
      indexName: this.indexName,
      objects: payload.map(({ data, type }) =>
        AlgoliaSearchClient.getAlgoliaObject(data, type),
      ),
    });
  }

  async remove(id: string) {
    await this.client.deleteObject({
      indexName: this.indexName,
      objectID: id,
    });
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
        const result = await this.client.searchSingleIndex<
          DistributeToEntityRecords<EntityResponses[App], ResponsesKey>
        >({
          indexName: this.reverseEventsIndexName,
          searchParams: { query, ...options },
        });
        return {
          ...result,
          index: this.reverseEventsIndexName,
        } as ClientSearchResponse<App, ResponsesKey>;
      }

      const result = await this.client.searchSingleIndex<
        DistributeToEntityRecords<EntityResponses[App], ResponsesKey>
      >({
        indexName: this.indexName,
        searchParams: { query, ...options },
      });
      return {
        ...result,
        index: this.indexName,
      } as ClientSearchResponse<App, ResponsesKey>;
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
      const options = this.getSearchOptions(entityTypes, requestOptions);
      const result = await this.client.searchForFacetValues({
        indexName: this.indexName,
        facetName: '_tags',
        searchForFacetValuesRequest: { facetQuery: query, ...options },
      });
      return result;
    } catch (error) {
      throw new Error(
        `Could not search for facet values: ${(error as Error).message}`,
      );
    }
  }
}

export type CRNEntities = keyof EntityResponses['crn'];

// we don't show cards of these entities
export type CRNTagSearchEntities = Exclude<
  CRNEntities,
  'external-author' | 'manuscript' | 'manuscript-version'
>;

export type CRNTagSearchEntitiesList = Array<CRNTagSearchEntities>;

export const CRNTagSearchEntitiesListArray: CRNTagSearchEntitiesList = [
  'event',
  'interest-group',
  'news',
  'project',
  'research-output',
  'team',
  'tutorial',
  'user',
  'working-group',
];
