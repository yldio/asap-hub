import {
  CalendarResponse,
  CalendarUpdateRequest,
  ListCalendarResponse,
} from '@asap-hub/model';

export interface CalendarController {
  fetch: () => Promise<ListCalendarResponse>;
  fetchById(id: string, options?: { raw: false }): Promise<CalendarResponse>;
  update: (
    calendarId: string,
    data: CalendarUpdateRequest,
  ) => Promise<CalendarResponse>;
}
