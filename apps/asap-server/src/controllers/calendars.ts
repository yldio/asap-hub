import { RestCalendar, Calendar } from '@asap-hub/squidex';
import { ListCalendarResponse, CalendarResponse } from '@asap-hub/model';

import { InstrumentedSquidex } from '../utils/instrumented-client';
import { parseCalendar } from '../entities';

export default class Calendars implements CalendarController {
  calendars: InstrumentedSquidex<RestCalendar>;

  constructor(ctxHeaders?: Record<string, string>) {
    this.calendars = new InstrumentedSquidex('calendars', ctxHeaders);
  }

  async fetch(options: {
    take: number;
    skip: number;
  }): Promise<ListCalendarResponse> {
    const { take = 50, skip = 0 } = options;
    const { total, items: calendars } = await this.calendars.fetch({
      take,
      skip,
      sort: [{ path: 'data.name.iv', order: 'ascending' }],
    });

    return {
      total,
      items: calendars.map(parseCalendar),
    };
  }

  async getSyncToken(calendarId: string): Promise<string | undefined> {
    const res = await this.calendars.fetchById(calendarId);
    return res.data.syncToken?.iv;
  }

  async update(
    calendarId: string,
    data: Partial<Calendar>,
  ): Promise<CalendarResponse> {
    const update = Object.entries(data).reduce((acc, [key, value]) => {
      acc[key] = { iv: value };
      return acc;
    }, {} as { [key: string]: { iv: unknown } });
    const res = await this.calendars.patch(calendarId, update);
    return parseCalendar(res);
  }
}

export interface CalendarController {
  fetch: (options: {
    take: number;
    skip: number;
  }) => Promise<ListCalendarResponse>;
  getSyncToken: (calendarId: string) => Promise<string | undefined>;
  update: (
    calendarId: string,
    data: Partial<Calendar>,
  ) => Promise<CalendarResponse>;
}
