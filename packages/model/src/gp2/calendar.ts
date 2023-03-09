import { BasicCalendar, BasicCalendarResponse } from '../calendar-common';
import { FetchPaginationOptions, ListResponse } from '../common';
import { WorkingGroupDataObject, WorkingGroupResponse } from './working-group';
import { ProjectDataObject, ProjectResponse } from './project';

export interface CalendarDataObject extends BasicCalendar {
  projects?: Pick<ProjectDataObject, 'id' | 'title'>[];
  workingGroups?: Pick<WorkingGroupDataObject, 'id' | 'title'>[];
}

export type ListCalendarDataObject = ListResponse<CalendarDataObject>;

export interface CalendarResponse extends BasicCalendarResponse {
  projects: Pick<ProjectResponse, 'id' | 'title'>[];
  workingGroups: Pick<WorkingGroupResponse, 'id' | 'title'>[];
}

export type ListCalendarResponse = ListResponse<CalendarResponse>;

export type FetchCalendarOptions = FetchPaginationOptions;
