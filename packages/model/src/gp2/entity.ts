import {
  EventResponse,
  NewsResponse,
  OutputResponse,
  ProjectResponse,
  UserResponse,
} from '.';
import { ListResponse } from '../common';

export const entityType = [
  'output',
  'event',
  'user',
  'news',
  'project',
] as const;
export type EntityType = (typeof entityType)[number];

export type EntityMetadata = {
  type: EntityType;
};

export type EntityResponse =
  | (OutputResponse & {
      __meta: EntityMetadata;
    })
  | (EventResponse & {
      __meta: EntityMetadata;
    })
  | (UserResponse & {
      __meta: EntityMetadata;
    })
  | (NewsResponse & {
      __meta: EntityMetadata;
    })
  | (ProjectResponse & {
      __meta: EntityMetadata;
    });

export type ListEntityResponse = ListResponse<EntityResponse>;
