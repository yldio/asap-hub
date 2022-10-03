import {
  ListCalendarResponse,
  CalendarResponse,
  CalendarDataObject,
  CalendarUpdateRequest,
} from '@asap-hub/model';
import { NotFoundError } from '@asap-hub/errors';
import { CalendarDataProvider } from '../data-providers/calendars.data-provider';

export interface CalendarController {
  fetch: () => Promise<ListCalendarResponse>;
  fetchById(id: string, options?: { raw: false }): Promise<CalendarResponse>;
  update: (
    calendarId: string,
    data: CalendarUpdateRequest,
  ) => Promise<CalendarResponse>;
}

export default class Calendars implements CalendarController {
  dataProvider: CalendarDataProvider;

  constructor(dataProvider: CalendarDataProvider) {
    this.dataProvider = dataProvider;
  }
  async fetch(): Promise<ListCalendarResponse> {
    const { total, items: calendars } = await this.dataProvider.fetch({
      active: true,
    });

    const items =
      total > 0 ? calendars.map(parseCalendarDataObjectToResponse) : [];

    return { total, items };
  }

  async fetchById(calendarId: string): Promise<CalendarResponse> {
    const calendar = await this.dataProvider.fetchById(calendarId);

    if (!calendar) {
      throw new NotFoundError(
        undefined,
        `Calendar with id ${calendarId} not found`,
      );
    }

    return parseCalendarDataObjectToResponse(calendar);
  }

  async update(
    calendarId: string,
    data: CalendarUpdateRequest,
  ): Promise<CalendarResponse> {
    await this.dataProvider.update(calendarId, data);
    return this.fetchById(calendarId);
  }
}

export const parseCalendarDataObjectToResponse = (
  calendarDataObject: Pick<
    CalendarDataObject,
    'googleCalendarId' | 'color' | 'name'
  >,
): CalendarResponse => ({
  id: calendarDataObject.googleCalendarId,
  name: calendarDataObject.name,
  color: calendarDataObject.color,
});
