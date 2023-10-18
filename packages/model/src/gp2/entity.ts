import {
  EventResponse,
  OutputResponse,
  ProjectResponse,
  UserResponse,
} from '.';
import { ListResponse } from '../common';

export const output = 'output';
export const event = 'event';
export const user = 'user';
export const project = 'project';

export type EntityType =
  | typeof output
  | typeof event
  | typeof user
  | typeof project;

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
  | (ProjectResponse & {
      __meta: EntityMetadata;
    });

export type ListEntityResponse = ListResponse<EntityResponse>;
