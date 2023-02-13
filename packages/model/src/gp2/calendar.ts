import { CalendarBaseDataObject, CalendarBaseResponse } from '../calendar';
import { FetchPaginationOptions, ListResponse } from '../common';

export type CalendarDataObject = CalendarBaseDataObject;

export type CalendarCreateDataObject = Omit<
  CalendarDataObject,
  'version' | 'id'
>;

export type CalendarUpdateDataObject = Partial<CalendarCreateDataObject>;

export type ListCalendarDataObject = ListResponse<CalendarDataObject>;

export type CalendarResponse = CalendarBaseResponse;

export type ListCalendarResponse = ListResponse<CalendarResponse>;

export type { CalendarUpdateRequest } from '../calendar';

export type FetchCalendarOptions = FetchPaginationOptions;
