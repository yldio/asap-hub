import { ListResponse } from './common';
import { TeamResponse } from './team';
import { UserResponse } from './user';
import { CalendarResponse } from './calendar';

export type GroupRole = 'Lead PI - Chair' | 'Project Manager';

export type GroupTool = { name: string; description?: string; url: string };

export type GroupTeam = Omit<TeamResponse, 'members'>;

export interface GroupResponse {
  id: string;
  createdDate: string;
  name: string;
  tags: string[];
  description: string;
  summary: string;
  tools: GroupTool[];
  teams: GroupTeam[];
  leaders: {
    user: UserResponse;
    role: GroupRole;
  }[];
  calendars: CalendarResponse[];
}

export type ListGroupResponse = ListResponse<GroupResponse>;
