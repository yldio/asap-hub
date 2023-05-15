import { BasicCalendar, BasicCalendarResponse } from './calendar-common';
import { FetchPaginationOptions, ListResponse } from './common';
import { GroupDataObject, GroupResponse } from './group';
import { WorkingGroupDataObject, WorkingGroupResponse } from './working-group';

export interface CalendarDataObject extends BasicCalendar {
  groups?: Pick<GroupDataObject, 'id' | 'active'>[];
  workingGroups?: Pick<WorkingGroupDataObject, 'id' | 'complete'>[];
}

export type ListCalendarDataObject = ListResponse<CalendarDataObject>;

export interface CalendarResponse extends BasicCalendarResponse {
  groups: Pick<GroupResponse, 'id' | 'active'>[];
  workingGroups: Pick<WorkingGroupResponse, 'id' | 'complete'>[];
}

export type ListCalendarResponse = ListResponse<CalendarResponse>;

export type FetchCalendarOptions = FetchPaginationOptions;
