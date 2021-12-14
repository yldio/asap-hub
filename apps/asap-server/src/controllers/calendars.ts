import Boom from '@hapi/boom';
import Intercept from 'apr-intercept';
import {
  RestCalendar,
  Calendar,
  Query,
  Squidex,
  SquidexGraphql,
  SquidexGraphqlClient,
  SquidexRestClient,
} from '@asap-hub/squidex';
import {
  ListCalendarResponse,
  CalendarResponse,
  isGoogleLegacyCalendarColor,
} from '@asap-hub/model';
import { parseCalendar } from '../entities';
import logger from '../utils/logger';
import { FETCH_CALENDAR } from '../queries/calendars.queries';
import {
  FetchCalendarQuery,
  FetchCalendarQueryVariables,
} from '../gql/graphql';

export default class Calendars implements CalendarController {
  calendarSquidexRestClient: SquidexRestClient<RestCalendar>;
  squidexGraphqlClient: SquidexGraphqlClient;

  constructor() {
    this.calendarSquidexRestClient = new Squidex('calendars');
    this.squidexGraphqlClient = new SquidexGraphql();
  }

  async fetch(options: {
    take: number;
    skip: number;
  }): Promise<ListCalendarResponse> {
    const { take = 50, skip = 0 } = options;
    const { total, items: calendars } =
      await this.calendarSquidexRestClient.fetch({
        take,
        skip,
        sort: [{ path: 'data.name.iv', order: 'ascending' }],
      });

    return {
      total,
      items: calendars.map(parseCalendar),
    };
  }

  async fetchRaw(options: {
    maxExpiration?: number;
    take: number;
    skip: number;
  }): Promise<CalendarRaw[]> {
    const { maxExpiration, take, skip } = options;

    const query: Query = {
      take,
      skip,
      sort: [{ path: 'data.name.iv', order: 'ascending' }],
    };

    if (maxExpiration) {
      query.filter = {
        path: 'data.expirationDate.iv',
        op: 'lt',
        value: maxExpiration,
      };
    }

    const { items: calendars } = await this.calendarSquidexRestClient.fetch(
      query,
    );

    return calendars.map(
      (restCalendar): CalendarRaw => ({
        id: restCalendar.id,
        googleCalendarId: restCalendar.data.googleCalendarId.iv,
        color: restCalendar.data.color.iv,
        name: restCalendar.data.name.iv,
        expirationDate: restCalendar.data.expirationDate?.iv,
        resourceId: restCalendar.data.resourceId?.iv,
        syncToken: restCalendar.data.syncToken?.iv,
        version: restCalendar.version,
      }),
    );
  }

  async fetchByResourceId(resourceId: string): Promise<RestCalendar> {
    const [err, res] = await Intercept(
      this.calendarSquidexRestClient.client
        .get('calendars', {
          searchParams: {
            $top: 1,
            $filter: `data/resourceId/iv eq '${resourceId}'`,
          },
        })
        .json() as Promise<{ items: RestCalendar[] }>,
    );

    if (err) {
      logger.error(err, 'Error fetching calendar by resourceId');
      throw Boom.badGateway();
    }

    if (res.items.length === 0 || !res.items[0]) {
      throw Boom.notFound();
    }

    return res.items[0];
  }

  fetchById(id: string, options?: { raw: false }): Promise<CalendarResponse>;
  fetchById(id: string, options?: { raw: true }): Promise<CalendarRaw>;
  async fetchById(
    calendarId: string,
    options?: { raw: boolean },
  ): Promise<CalendarRaw | CalendarResponse> {
    const calendarResponse = await this.squidexGraphqlClient.request<
      FetchCalendarQuery,
      FetchCalendarQueryVariables
    >(FETCH_CALENDAR, { id: calendarId });

    const { findCalendarsContent: calendar } = calendarResponse;

    if (!calendar) {
      throw Boom.notFound();
    }

    const { googleCalendarId, color, name } = calendar.flatData;
    if (!googleCalendarId || !name || !color) {
      throw Boom.badGateway('Missing required data');
    }

    if (!isGoogleLegacyCalendarColor(color)) {
      throw Boom.badGateway('Invalid colour');
    }

    if (options?.raw === true) {
      return {
        id: calendar.id,
        version: calendar.version,
        googleCalendarId,
        color,
        name,
        expirationDate: calendar.flatData.expirationDate ?? undefined,
        resourceId: calendar.flatData.resourceId,
        syncToken: calendar.flatData.syncToken ?? undefined,
      };
    }

    return {
      id: googleCalendarId,
      name,
      color,
    };
  }

  async getSyncToken(calendarId: string): Promise<string | undefined> {
    const res = await this.calendarSquidexRestClient.fetchById(calendarId);
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
    const res = await this.calendarSquidexRestClient.patch(calendarId, update);
    return parseCalendar(res);
  }
}

export interface CalendarController {
  fetch: (options: {
    take: number;
    skip: number;
  }) => Promise<ListCalendarResponse>;
  fetchRaw: (options: {
    take: number;
    skip: number;
    maxExpiration: number;
  }) => Promise<CalendarRaw[]>;
  fetchByResourceId: (resourceId: string) => Promise<RestCalendar>;
  getSyncToken: (calendarId: string) => Promise<string | undefined>;
  update: (
    calendarId: string,
    data: Partial<Calendar>,
  ) => Promise<CalendarResponse>;

  fetchById(id: string, options?: { raw: false }): Promise<CalendarResponse>;
  fetchById(id: string, options?: { raw: true }): Promise<CalendarRaw>;
}

export type CalendarRaw = Calendar & {
  id: string;
  version: number;
};
