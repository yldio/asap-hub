import { GroupRole } from '@asap-hub/model';
import { Calendar, GraphqlCalendar } from './calendar';

import { Rest, Entity, Graphql } from './common';
import { GraphqlTeam } from './team';
import { GraphqlUser } from './user';

export interface GroupUserConnection<T = string> {
  role: GroupRole;
  user: Array<T | undefined>;
}

export interface Group<
  TUserConnection = string,
  TTeamConnection = string,
  TCalendar = string,
  TThumbnail = string,
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
  thumbnail: TThumbnail[];
}
interface GraphqlCalendar extends Entity, Graphql<Calendar> {
  referencingGroupsContents?: GraphqlGroup[];
}

export interface RestGroup extends Entity, Rest<Group> {}
export interface GraphqlGroup
  extends Entity,
    Graphql<Group<GraphqlUser, GraphqlTeam, GraphqlCalendar, Entity>> {}
