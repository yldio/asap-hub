import { NotFoundError } from '@asap-hub/errors';
import { gp2 } from '@asap-hub/model';
import { CalendarDataProvider } from '../data-providers/calendar.data-provider';

export interface CalendarController {
  fetch: () => Promise<gp2.ListCalendarResponse>;
  fetchById(
    id: string,
    options?: { raw: false },
  ): Promise<gp2.CalendarResponse>;
  update: (
    calendarId: string,
    data: gp2.CalendarUpdateRequest,
  ) => Promise<gp2.CalendarResponse>;
}

export default class Calendars implements CalendarController {
  dataProvider: CalendarDataProvider;

  constructor(dataProvider: CalendarDataProvider) {
    this.dataProvider = dataProvider;
  }
  async fetch(): Promise<gp2.ListCalendarResponse> {
    const { total, items: calendars } = await this.dataProvider.fetch({
      active: true,
    });

    const items =
      total > 0 ? calendars.map(parseCalendarDataObjectToResponse) : [];

    return { total, items };
  }

  async fetchById(calendarId: string): Promise<gp2.CalendarResponse> {
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
    data: gp2.CalendarUpdateRequest,
  ): Promise<gp2.CalendarResponse> {
    await this.dataProvider.update(calendarId, data);
    return this.fetchById(calendarId);
  }
}

export const parseCalendarDataObjectToResponse = (
  calendarDataObject: Pick<
    gp2.CalendarDataObject,
    'googleCalendarId' | 'color' | 'name'
  >,
): gp2.CalendarResponse => ({
  id: calendarDataObject.googleCalendarId,
  name: calendarDataObject.name,
  color: calendarDataObject.color,
});
