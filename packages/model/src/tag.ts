import { EventResponse } from './event';
import { InterestGroupResponse } from './interest-group';
import { ResearchOutputResponse } from './research-output';
import { TeamResponse } from './team';
import { UserResponse } from './user';
import { WorkingGroupResponse } from './working-group';

export type TagSearchResponse =
  | ResearchOutputResponse
  | UserResponse
  | EventResponse
  | TeamResponse
  | WorkingGroupResponse
  | InterestGroupResponse;
