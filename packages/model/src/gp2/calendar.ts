import { CalendarBaseDataObject, CalendarBaseResponse } from '../calendar';
import { FetchPaginationOptions, ListResponse } from '../common';

export interface CalendarDataObject extends CalendarBaseDataObject {}

export type CalendarCreateDataObject = Omit<
  CalendarDataObject,
  'version' | 'id'
>;

export type CalendarUpdateDataObject = Partial<CalendarCreateDataObject>;

export type ListCalendarDataObject = ListResponse<CalendarDataObject>;

export interface CalendarResponse extends CalendarBaseResponse {}

export type ListCalendarResponse = ListResponse<CalendarResponse>;

export type { CalendarUpdateRequest } from '../calendar';

export type FetchCalendarOptions = FetchPaginationOptions;
