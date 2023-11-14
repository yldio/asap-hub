import { EventResponse } from './event';
import { ResearchOutputResponse } from './research-output';
import { TeamResponse } from './team';
import { UserResponse } from './user';

export type TagSearchResponse =
  | ResearchOutputResponse
  | UserResponse
  | EventResponse
  | TeamResponse;
