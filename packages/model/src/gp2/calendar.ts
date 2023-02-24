import { BasicCalendar, BasicCalendarResponse } from '../calendar-common';
import { FetchPaginationOptions, ListResponse } from '../common';

export type CalendarDataObject = BasicCalendar;

export type ListCalendarDataObject = ListResponse<BasicCalendar>;

export type CalendarResponse = BasicCalendarResponse;

export type ListCalendarResponse = ListResponse<CalendarResponse>;

export type FetchCalendarOptions = FetchPaginationOptions;
