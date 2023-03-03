import { NotFoundError } from '@asap-hub/errors';
import { CalendarUpdateRequest, gp2 } from '@asap-hub/model';
import { CalendarController as CalendarControllerBase } from '@asap-hub/server-common';
import { CalendarDataProvider } from '../data-providers/calendar.data-provider';

export type CalendarController = CalendarControllerBase<
  gp2.CalendarResponse,
  gp2.ListCalendarResponse
>;
export default class Calendars implements CalendarController {
  constructor(private dataProvider: CalendarDataProvider) {}

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
    data: CalendarUpdateRequest,
  ): Promise<gp2.CalendarResponse> {
    await this.dataProvider.update(calendarId, data);
    return this.fetchById(calendarId);
  }
}

export const parseCalendarDataObjectToResponse = (
  calendarDataObject: Pick<
    gp2.CalendarDataObject,
    'googleCalendarId' | 'color' | 'name' | 'projects' | 'workingGroups'
  >,
): gp2.CalendarResponse => ({
  id: calendarDataObject.googleCalendarId,
  name: calendarDataObject.name,
  color: calendarDataObject.color,
  projects: calendarDataObject.projects || [],
  workingGroups: calendarDataObject.workingGroups || [],
});
