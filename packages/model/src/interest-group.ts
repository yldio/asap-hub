import { FetchOptions, ListResponse } from './common';
import { TeamListItemResponse } from './team';
import { UserResponse } from './user';
import { CalendarResponse } from './calendar';
import { ResearchTagDataObject } from './research-tag';

export type InterestGroupTools = {
  readonly slack?: string;
  readonly googleDrive?: string;
  readonly googleCalendar?: string;
};

export type InterestGroupTeam = Omit<
  TeamListItemResponse,
  'memberCount' | 'labCount'
>;

export const interestGroupRole = ['Chair', 'Project Manager'] as const;

export type InterestGroupRole = (typeof interestGroupRole)[number];

export type InterestGroupLeader = {
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
  readonly role: InterestGroupRole;
  readonly inactiveSinceDate?: string;
};

export const isInterestGroupRole = (
  data: string | null,
): data is InterestGroupRole =>
  interestGroupRole.includes(data as InterestGroupRole);

export type InterestGroupDataObject = {
  readonly id: string;
  readonly active: boolean;
  readonly createdDate: string;
  readonly contactEmails: string[];
  readonly name: string;
  readonly tags: Pick<ResearchTagDataObject, 'id' | 'name'>[];
  readonly description: string;
  readonly tools: InterestGroupTools;
  readonly teams: ReadonlyArray<InterestGroupTeam>;
  readonly leaders: ReadonlyArray<InterestGroupLeader>;
  readonly calendars: ReadonlyArray<CalendarResponse>;
  readonly lastModifiedDate: string;
  readonly thumbnail?: string;
};

export type ListInterestGroupDataObject = ListResponse<InterestGroupDataObject>;

export type InterestGroupResponse = InterestGroupDataObject;

export type ListInterestGroupResponse = ListResponse<InterestGroupResponse>;

type InterestGroupFilter = {
  teamId?: [string, ...string[]];
  userId?: string;
  active?: boolean;
};

export type FetchInterestGroupOptions = FetchOptions<InterestGroupFilter>;

export type InterestGroupMembership = {
  id: string;
  name: string;
  active: boolean;
  role?: string;
};
