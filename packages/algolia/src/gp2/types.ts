import { gp2 as gp2Model } from '@asap-hub/model';

export const EVENT_ENTITY_TYPE = 'event';
export const NEWS_ENTITY_TYPE = 'news';
export const OUTPUT_ENTITY_TYPE = 'output';
export const PROJECT_ENTITY_TYPE = 'project';
export const USER_ENTITY_TYPE = 'user';
export const WORKING_GROUP_ENTITY_TYPE = 'working-group';

export type Payload =
  | {
      data: gp2Model.OutputResponse;
      type: typeof OUTPUT_ENTITY_TYPE;
    }
  | {
      data: gp2Model.ProjectResponse;
      type: typeof PROJECT_ENTITY_TYPE;
    }
  | {
      data: gp2Model.EventResponse;
      type: typeof EVENT_ENTITY_TYPE;
    }
  | {
      data: gp2Model.NewsResponse;
      type: typeof NEWS_ENTITY_TYPE;
    }
  | {
      data: gp2Model.UserResponse;
      type: typeof USER_ENTITY_TYPE;
    }
  | {
      data: gp2Model.WorkingGroupResponse;
      type: typeof WORKING_GROUP_ENTITY_TYPE;
    };
