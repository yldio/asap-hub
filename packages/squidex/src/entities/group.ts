import { GroupRole } from '@asap-hub/model';

import { Rest, Entity, Graphql } from './common';
import { GraphqlTeam } from './team';
import { GraphqlUser } from './user';
import { GraphqlCalendar } from './calendar';

export interface GroupUserConnection<T = string> {
  role: GroupRole;
  user: T[];
}

export interface Group<
  TUserConnection = string,
  TTeamConnection = string,
  TCalendar = string
> {
  name: string;
  tags: string[];
  description: string;
  tools: {
    slack?: string;
    googleDrive?: string;
  }[];
  teams: TTeamConnection[];
  leaders: GroupUserConnection<TUserConnection>[];
  calendars: TCalendar[];
}

export interface RestGroup extends Entity, Rest<Group> {}
export interface GraphqlGroup
  extends Entity,
    Graphql<Group<GraphqlUser, GraphqlTeam, GraphqlCalendar>> {}
