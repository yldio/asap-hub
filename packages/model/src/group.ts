import { FetchOptions, ListResponse } from './common';
import { TeamResponse } from './team';
import { UserResponse } from './user';
import { CalendarResponse } from './calendar';

export type GroupTools = {
  readonly slack?: string;
  readonly googleDrive?: string;
  readonly googleCalendar?: string;
};

export type GroupTeam = Omit<TeamResponse, 'members' | 'labCount'>;

export const groupRole = ['Chair', 'Project Manager'] as const;

export type GroupRole = (typeof groupRole)[number];

export type GroupLeader = {
  readonly user: Pick<
    UserResponse,
    | 'id'
    | 'firstName'
    | 'lastName'
    | 'displayName'
    | 'email'
    | 'alumniSinceDate'
    | 'avatarUrl'
    | 'teams'
  >;
  readonly role: GroupRole;
  readonly inactiveSinceDate?: string;
};

export const isGroupRole = (data: string | null): data is GroupRole =>
  groupRole.includes(data as GroupRole);

export type GroupDataObject = {
  readonly id: string;
  readonly active: boolean;
  readonly createdDate: string;
  readonly contactEmails: string[];
  readonly name: string;
  readonly tags: ReadonlyArray<string>;
  readonly description: string;
  readonly tools: GroupTools;
  readonly teams: ReadonlyArray<GroupTeam>;
  readonly leaders: ReadonlyArray<GroupLeader>;
  readonly calendars: ReadonlyArray<CalendarResponse>;
  readonly lastModifiedDate: string;
  readonly thumbnail?: string;
};

export type ListGroupDataObject = ListResponse<GroupDataObject>;

export type GroupResponse = GroupDataObject;

export type ListGroupResponse = ListResponse<GroupResponse>;

type GroupFilter = {
  teamId?: string[];
  userId?: string;
  active?: boolean;
};

export type FetchGroupOptions = FetchOptions<GroupFilter>;

export type InterestGroupMembership = {
  id: string;
  name: string;
  active: boolean;
};
