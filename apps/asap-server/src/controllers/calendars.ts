import Boom from '@hapi/boom';
import Intercept from 'apr-intercept';
import { RestCalendar, Calendar } from '@asap-hub/squidex';
import { ListCalendarResponse, CalendarResponse } from '@asap-hub/model';

import { InstrumentedSquidex } from '../utils/instrumented-client';
import { parseCalendar } from '../entities';
import logger from '../utils/logger';

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

  async fetchByResouceId(resourceId: string): Promise<RestCalendar> {
    const [err, res] = await Intercept(
      this.calendars.client
        .get('calendars', {
          searchParams: {
            $top: 1,
            $filter: `data/resourceId/iv eq '${resourceId}'`,
          },
        })
        .json() as Promise<{ items: RestCalendar[] }>,
    );

    if (err) {
      logger('Error fetching calendar by resourceId:', err);
      throw Boom.badGateway();
    }

    if (res.items.length === 0) {
      throw Boom.notFound();
    }

    return res.items[0];
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
  fetchByResouceId: (resourceId: string) => Promise<RestCalendar>;
  getSyncToken: (calendarId: string) => Promise<string | undefined>;
  update: (
    calendarId: string,
    data: Partial<Calendar>,
  ) => Promise<CalendarResponse>;
}
