import { RestCalendar } from '@asap-hub/squidex';
import { ListCalendarResponse } from '@asap-hub/model';

import { InstrumentedSquidex } from '../utils/instrumented-client';
import { parseCalendar } from '../entities';

export default class Calendars {
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
    });

    return {
      total,
      items: calendars.map(parseCalendar),
    };
  }
}
