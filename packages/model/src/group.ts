import { ListResponse } from './common';
import { TeamResponse } from './team';
import { UserResponse } from './user';
import { CalendarResponse } from './calendar';

export type GroupTools = {
  slack?: string;
  googleDrive?: string;
  googleCalendar?: string;
};

export type GroupTeam = Omit<TeamResponse, 'members'>;

export type GroupRole = 'Lead PI - Chair' | 'Project Manager';
export type GroupLeader = {
  user: UserResponse;
  role: GroupRole;
};

export interface GroupResponse {
  id: string;
  createdDate: string;
  name: string;
  tags: string[];
  description: string;
  tools: GroupTools;
  teams: GroupTeam[];
  leaders: GroupLeader[];
  calendars: CalendarResponse[];
}

export type ListGroupResponse = ListResponse<GroupResponse>;
