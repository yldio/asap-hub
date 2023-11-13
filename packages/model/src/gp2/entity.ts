import {
  EventResponse,
  OutputResponse,
  ProjectResponse,
  UserResponse,
  NewsResponse,
} from '.';
import { ListResponse } from '../common';

export const output = 'output';
export const event = 'event';
export const user = 'user';
export const project = 'project';
export const news = 'news';

export type EntityType =
  | typeof output
  | typeof event
  | typeof user
  | typeof news
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
  | (NewsResponse & {
      __meta: EntityMetadata;
    })
  | (ProjectResponse & {
      __meta: EntityMetadata;
    });

export type ListEntityResponse = ListResponse<EntityResponse>;
