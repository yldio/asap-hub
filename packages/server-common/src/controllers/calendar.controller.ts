import {
  CalendarResponse as DefaultCalendarResponse,
  CalendarUpdateRequest,
  ListCalendarResponse as DefaultListCalendarResponse,
} from '@asap-hub/model';

export interface CalendarController<
  CalendarResponse = DefaultCalendarResponse,
  ListCalendarResponse = DefaultListCalendarResponse,
> {
  fetch: () => Promise<ListCalendarResponse>;
  fetchById(id: string, options?: { raw: false }): Promise<CalendarResponse>;
  update: (
    calendarId: string,
    data: CalendarUpdateRequest,
  ) => Promise<CalendarResponse>;
}
