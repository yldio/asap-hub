import {
  EventResponse,
  ExternalAuthorResponse,
  InterestGroupResponse,
  LabResponse,
  NewsResponse,
  ResearchOutputResponse,
  TeamListItemResponse,
  TutorialsResponse,
  UserListItemResponse,
  WithAlgoliaTags,
  WorkingGroupResponse,
} from '@asap-hub/model';

export const EVENT_ENTITY_TYPE = 'event';
export const EXTERNAL_AUTHOR_ENTITY_TYPE = 'external-author';
export const INTEREST_GROUP_ENTITY_TYPE = 'interest-group';
export const LAB_ENTITY_TYPE = 'lab';
export const NEWS_ENTITY_TYPE = 'news';
export const RESEARCH_OUTPUT_ENTITY_TYPE = 'research-output';
export const TEAM_ENTITY_TYPE = 'team';
export const TUTORIAL_ENTITY_TYPE = 'tutorial';
export const USER_ENTITY_TYPE = 'user';
export const WORKING_GROUP_ENTITY_TYPE = 'working-group';

export type Payload =
  | {
      data: EventResponse;
      type: typeof EVENT_ENTITY_TYPE;
    }
  | {
      data: ExternalAuthorResponse;
      type: typeof EXTERNAL_AUTHOR_ENTITY_TYPE;
    }
  | {
      data: InterestGroupResponse;
      type: typeof INTEREST_GROUP_ENTITY_TYPE;
    }
  | {
      data: LabResponse;
      type: typeof LAB_ENTITY_TYPE;
    }
  | {
      data: NewsResponse;
      type: typeof NEWS_ENTITY_TYPE;
    }
  | {
      data: ResearchOutputResponse;
      type: typeof RESEARCH_OUTPUT_ENTITY_TYPE;
    }
  | {
      data: WithAlgoliaTags<TeamListItemResponse>;
      type: typeof TEAM_ENTITY_TYPE;
    }
  | {
      data: TutorialsResponse;
      type: typeof TUTORIAL_ENTITY_TYPE;
    }
  | {
      data: UserListItemResponse;
      type: typeof USER_ENTITY_TYPE;
    }
  | {
      data: WorkingGroupResponse;
      type: typeof WORKING_GROUP_ENTITY_TYPE;
    };
