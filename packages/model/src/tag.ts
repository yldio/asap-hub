import { EventResponse } from './event';
import { NewsResponse } from './news';
import { ResearchOutputResponse } from './research-output';
import { TeamResponse } from './team';
import { TutorialsResponse } from './tutorials';
import { UserListItem } from './user';
import { WorkingGroupResponse } from './working-group';

export type WithMeta<Response, Type> = Response & { __meta: { type: Type } };

export type WithAlgoliaTags<Response> = Response & { _tags: string[] };

export type TagSearchResponse =
  | WithMeta<ResearchOutputResponse, 'research-output'>
  | WithMeta<UserListItem, 'user'>
  | WithMeta<EventResponse, 'event'>
  | WithMeta<TeamResponse, 'team'>
  | WithMeta<WorkingGroupResponse, 'working-group'>
  | WithMeta<TutorialsResponse, 'tutorial'>
  | WithMeta<NewsResponse, 'news'>;
