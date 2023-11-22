import {
  EventResponse,
  ExternalAuthorResponse,
  InterestGroupResponse,
  LabResponse,
  ResearchOutputResponse,
  TeamResponse,
  UserResponse,
  WorkingGroupResponse,
} from '@asap-hub/model';

export const RESEARCH_OUTPUT_ENTITY_TYPE = 'research-output';
export const USER_ENTITY_TYPE = 'user';
export const EXTERNAL_AUTHOR_ENTITY_TYPE = 'external-author';
export const LAB_ENTITY_TYPE = 'lab';
export const EVENT_ENTITY_TYPE = 'event';
export const TEAM_ENTITY_TYPE = 'team';
export const WORKING_GROUP_ENTITY_TYPE = 'working-group';
export const INTEREST_GROUP_ENTITY_TYPE = 'interest-group';
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
      data: LabResponse;
      type: typeof LAB_ENTITY_TYPE;
    }
  | {
      data: ResearchOutputResponse;
      type: typeof RESEARCH_OUTPUT_ENTITY_TYPE;
    }
  | {
      data: TeamResponse;
      type: typeof TEAM_ENTITY_TYPE;
    }
  | {
      data: UserResponse;
      type: typeof USER_ENTITY_TYPE;
    }
  | {
      data: WorkingGroupResponse;
      type: typeof WORKING_GROUP_ENTITY_TYPE;
    }
  | {
      data: InterestGroupResponse;
      type: typeof INTEREST_GROUP_ENTITY_TYPE;
    };
