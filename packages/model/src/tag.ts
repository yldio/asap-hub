import { EventResponse } from './event';
import { ResearchOutputResponse } from './research-output';
import { TeamResponse } from './team';
import { TutorialsResponse } from './tutorials';
import { UserResponse } from './user';
import { WorkingGroupResponse } from './working-group';

type WithMeta<Response, Type> = Response & { __meta: { type: Type } };

export type TagSearchResponse =
  | WithMeta<ResearchOutputResponse, 'research-output'>
  | WithMeta<UserResponse, 'user'>
  | WithMeta<EventResponse, 'event'>
  | WithMeta<TeamResponse, 'team'>
  | WithMeta<WorkingGroupResponse, 'working-group'>
  | WithMeta<TutorialsResponse, 'tutorial'>;
