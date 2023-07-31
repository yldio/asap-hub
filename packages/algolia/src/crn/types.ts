import {
  EventResponse,
  ExternalAuthorResponse,
  gp2 as gp2Model,
  LabResponse,
  ResearchOutputResponse,
  UserResponse,
} from '@asap-hub/model';

export const RESEARCH_OUTPUT_ENTITY_TYPE = 'research-output';
export const USER_ENTITY_TYPE = 'user';
export const EXTERNAL_AUTHOR_ENTITY_TYPE = 'external-author';
export const LAB_ENTITY_TYPE = 'lab';
export const EVENT_ENTITY_TYPE = 'event';
export const OUTPUT_ENTITY_TYPE = 'output';
export type Payload =
  | {
      data: EventResponse;
      type: 'event';
    }
  | {
      data: ExternalAuthorResponse;
      type: 'external-author';
    }
  | {
      data: LabResponse;
      type: 'lab';
    }
  | {
      data: ResearchOutputResponse;
      type: 'research-output';
    }
  | {
      data: UserResponse;
      type: 'user';
    };

export type EntityResponses = {
  crn: {
    [RESEARCH_OUTPUT_ENTITY_TYPE]: ResearchOutputResponse;
    [USER_ENTITY_TYPE]: UserResponse;
    [EXTERNAL_AUTHOR_ENTITY_TYPE]: ExternalAuthorResponse;
    [EVENT_ENTITY_TYPE]: EventResponse;
  };
  gp2: {
    [OUTPUT_ENTITY_TYPE]: gp2Model.OutputResponse;
  };
};
