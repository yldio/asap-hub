import { ListResponse } from './common';

export interface CalendarResponse {
  id: string;
  name: string;
  color: string;
}

export type ListCalendarResponse = ListResponse<CalendarResponse>;
