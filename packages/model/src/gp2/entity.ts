import {
  EventResponse,
  NewsResponse,
  OutputResponse,
  ProjectResponse,
  UserResponse,
  WorkingGroupResponse,
} from '.';
import { ListResponse } from '../common';

export const entityType = [
  'event',
  'news',
  'output',
  'project',
  'user',
  'working-group',
] as const;
export type EntityType = (typeof entityType)[number];

export type EntityMetadata = {
  type: EntityType;
};

export type EntityResponse =
  | (EventResponse & {
      __meta: EntityMetadata;
    })
  | (NewsResponse & {
      __meta: EntityMetadata;
    })
  | (OutputResponse & {
      __meta: EntityMetadata;
    })
  | (ProjectResponse & {
      __meta: EntityMetadata;
    })
  | (UserResponse & {
      __meta: EntityMetadata;
    })
  | (WorkingGroupResponse & {
      __meta: EntityMetadata;
    });

export type ListEntityResponse = ListResponse<EntityResponse>;
