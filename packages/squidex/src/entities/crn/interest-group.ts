import { InterestGroupRole } from '@asap-hub/model';
import { Rest, Entity } from '../common';

interface InterestGroupUserConnection<T = string> {
  role: InterestGroupRole;
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
  leaders: InterestGroupUserConnection<TUserConnection>[];
  calendars: TCalendar[];
  thumbnail: TThumbnail[];
}

export interface RestInterestGroup extends Entity, Rest<Group> {}
