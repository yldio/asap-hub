import { GroupRole } from '@asap-hub/model';
import { Rest, Entity } from '../common';

interface GroupUserConnection<T = string> {
  role: GroupRole;
  user: Array<T | undefined>;
}

interface Group<
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

export interface RestGroup extends Entity, Rest<Group> {}
