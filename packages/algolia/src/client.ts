import {
  SearchForFacetValuesResponse,
  SearchOptions,
  SearchResponse,
} from '@algolia/client-search';
import {
  AnalyticsTeamLeadershipAlgoliaResponse,
  AnalyticsTeamLeadershipResponse,
  DocumentCategoryOption,
  EventResponse,
  ExternalAuthorResponse,
  gp2 as gp2Model,
  InterestGroupResponse,
  NewsResponse,
  ResearchOutputResponse,
  TeamCollaborationResponse,
  TeamListItemResponse,
  TeamProductivityAlgoliaResponse,
  TeamProductivityPerformance,
  TeamCollaborationPerformance,
  TeamProductivityResponse,
  TimeRangeOption,
  TutorialsResponse,
  UserCollaborationResponse,
  UserListItemResponse,
  UserProductivityAlgoliaResponse,
  UserProductivityPerformance,
  UserProductivityResponse,
  UserResponse,
  WithMeta,
  WorkingGroupResponse,
  UserCollaborationPerformance,
  OutputTypeOption,
  EngagementResponse,
  EngagementPerformance,
  PartialManuscriptResponse,
} from '@asap-hub/model';
import { SearchIndex } from 'algoliasearch';
import {
  TEAM_COLLABORATION,
  TEAM_COLLABORATION_PERFORMANCE,
  TEAM_LEADERSHIP,
  TEAM_PRODUCTIVITY,
  TEAM_PRODUCTIVITY_PERFORMANCE,
  USER_COLLABORATION,
  USER_COLLABORATION_PERFORMANCE,
  USER_PRODUCTIVITY,
  USER_PRODUCTIVITY_PERFORMANCE,
  ENGAGEMENT,
  ENGAGEMENT_PERFORMANCE,
} from './analytics';
import {
  EVENT_ENTITY_TYPE,
  EXTERNAL_AUTHOR_ENTITY_TYPE,
  INTEREST_GROUP_ENTITY_TYPE,
  MANUSCRIPT_ENTITY_TYPE,
  NEWS_ENTITY_TYPE as CRN_NEWS_ENTITY_TYPE,
  Payload,
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
const ANALYTICS = 'analytics';
export type Apps = typeof CRN | typeof GP2 | typeof ANALYTICS;

export type EntityData =
  | EventResponse
  | ExternalAuthorResponse
  | InterestGroupResponse
  | NewsResponse
  | ResearchOutputResponse
  | TeamListItemResponse
  | TutorialsResponse
  | UserResponse
  | WorkingGroupResponse
  | PartialManuscriptResponse;

export type AnalyticsData =
  | AnalyticsTeamLeadershipResponse
  | UserProductivityResponse
  | TeamProductivityResponse
  | UserCollaborationResponse
  | TeamCollaborationResponse
  | EngagementResponse;

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
  [ANALYTICS]: {
    [TEAM_LEADERSHIP]: AnalyticsTeamLeadershipAlgoliaResponse;

    [TEAM_PRODUCTIVITY]: TeamProductivityAlgoliaResponse;
    [USER_PRODUCTIVITY]: UserProductivityAlgoliaResponse;
    [TEAM_PRODUCTIVITY_PERFORMANCE]: TeamProductivityPerformance;
    [USER_PRODUCTIVITY_PERFORMANCE]: UserProductivityPerformance;

    [TEAM_COLLABORATION]: TeamCollaborationResponse;
    [USER_COLLABORATION]: UserCollaborationResponse;
    [TEAM_COLLABORATION_PERFORMANCE]: TeamCollaborationPerformance;
    [USER_COLLABORATION_PERFORMANCE]: UserCollaborationPerformance;

    [ENGAGEMENT]: EngagementResponse;
    [ENGAGEMENT_PERFORMANCE]: EngagementPerformance;
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
export type CRNTagSearchEntities = Exclude<
  CRNEntities,
  'external-author' | 'manuscript'
>;

export type CRNTagSearchEntitiesList = Array<CRNTagSearchEntities>;

export const CRNTagSearchEntitiesListArray: CRNTagSearchEntitiesList = [
  'event',
  'interest-group',
  'news',
  'research-output',
  'team',
  'tutorial',
  'user',
  'working-group',
];
