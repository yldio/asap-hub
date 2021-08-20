import { ListResponse } from './common';
import { TeamResponse } from './team';
import { UserResponse } from './user';
import { CalendarResponse } from './calendar';

export type GroupTools = {
  readonly slack?: string;
  readonly googleDrive?: string;
  readonly googleCalendar?: string;
};

export type GroupTeam = Omit<TeamResponse, 'members' | 'outputs' | 'labCount'>;

export type GroupRole = 'Chair' | 'Project Manager';
export type GroupLeader = {
  readonly user: UserResponse;
  readonly role: GroupRole;
};

export interface GroupResponse {
  readonly id: string;
  readonly createdDate: string;
  readonly name: string;
  readonly tags: ReadonlyArray<string>;
  readonly description: string;
  readonly tools: GroupTools;
  readonly teams: ReadonlyArray<GroupTeam>;
  readonly leaders: ReadonlyArray<GroupLeader>;
  readonly calendars: ReadonlyArray<CalendarResponse>;
  readonly lastModifiedDate: string;
  readonly thumbnail?: string;
}

export type ListGroupResponse = ListResponse<GroupResponse>;
