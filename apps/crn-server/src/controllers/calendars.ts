import Boom, { isBoom } from '@hapi/boom';
import { RestCalendar, Calendar } from '@asap-hub/squidex';
import {
  ListCalendarResponse,
  CalendarResponse,
  FetchCalendarError,
  CalendarRawDataObject,
  FetchCalendarOptions,
} from '@asap-hub/model';
import logger from '../utils/logger';
import { CalendarDataProvider } from '../data-providers/calendars.data-provider';

export interface CalendarController {
  fetch: (options: FetchCalendarOptions) => Promise<ListCalendarResponse>;
  fetchRaw: (options: FetchCalendarOptions) => Promise<CalendarRawDataObject[]>;
  fetchByResourceId: (resourceId: string) => Promise<RestCalendar>;
  getSyncToken: (calendarId: string) => Promise<string | undefined>;
  update: (
    calendarId: string,
    data: Partial<Calendar>,
  ) => Promise<CalendarResponse>;
  create: (data: Calendar) => Promise<CalendarResponse>;
  fetchById(id: string, options?: { raw: false }): Promise<CalendarResponse>;
  fetchById(
    id: string,
    options?: { raw: true },
  ): Promise<CalendarRawDataObject>;
}

export default class Calendars implements CalendarController {
  dataProvider: CalendarDataProvider;

  constructor(dataProvider: CalendarDataProvider) {
    this.dataProvider = dataProvider;
  }

  async parseRawCalendar(
    raw: CalendarRawDataObject,
  ): Promise<CalendarResponse> {
    return {
      id: raw.googleCalendarId,
      name: raw.name,
      color: raw.color,
    };
  }

  async handleFetchCalendarError<T>(item: T | FetchCalendarError) {
    if ((item as any) === FetchCalendarError.CalendarNotFound) {
      throw Boom.notFound();
    }

    if ((item as any) === FetchCalendarError.InvalidColor) {
      throw Boom.badGateway('Invalid color');
    }

    if ((item as any) === FetchCalendarError.MissingRequiredData) {
      throw Boom.badGateway('Missing required data');
    }

    return item as T;
  }

  async fetch(): Promise<ListCalendarResponse> {
    try {
      const calendars = await this.handleFetchCalendarError<
        CalendarRawDataObject[]
      >(await this.dataProvider.fetch({ take: 50, skip: 0, onlyActive: true }));

      return {
        total: calendars.length,
        items: await Promise.all(calendars.map(this.parseRawCalendar)),
      };
    } catch (e) {
      if (isBoom(e)) {
        logger.warn(`Error in fetching calendars: ${e.message}`);
      }

      return {
        total: 0,
        items: [],
      };
    }
  }

  async fetchRaw(
    options: FetchCalendarOptions,
  ): Promise<CalendarRawDataObject[]> {
    try {
      const calendars = await this.handleFetchCalendarError<
        CalendarRawDataObject[]
      >(await this.dataProvider.fetch(options));

      return calendars;
    } catch (e) {
      if (isBoom(e)) {
        logger.warn(`Error in fetching raw calendars: ${e.message}`);
      }
      return [];
    }
  }

  /*
   * todo: Stop serving a Squidex return type directly.
   * We will need to look at where this response is being used on the front end
   * and change it.
   */
  async fetchByResourceId(resourceId: string): Promise<RestCalendar> {
    const calendar = await this.handleFetchCalendarError<RestCalendar>(
      await this.dataProvider.fetchByResourceId(resourceId),
    );

    return calendar;
  }

  fetchById(id: string, options?: { raw: false }): Promise<CalendarResponse>;
  fetchById(
    id: string,
    options?: { raw: true },
  ): Promise<CalendarRawDataObject>;
  async fetchById(
    calendarId: string,
    options?: { raw: boolean },
  ): Promise<CalendarRawDataObject | CalendarResponse> {
    const calendar = await this.handleFetchCalendarError<CalendarRawDataObject>(
      await this.dataProvider.fetchById(calendarId),
    );

    return options?.raw === true
      ? calendar
      : await this.parseRawCalendar(calendar);
  }

  async getSyncToken(calendarId: string): Promise<string | undefined> {
    const res = await this.handleFetchCalendarError<CalendarRawDataObject>(
      await this.dataProvider.fetchById(calendarId),
    );

    return res.syncToken || undefined;
  }

  async update(
    calendarId: string,
    data: Partial<Calendar>,
  ): Promise<CalendarResponse> {
    return await this.parseRawCalendar(
      await this.dataProvider.update(calendarId, data),
    );
  }

  async create(
    data: Calendar,
  ): Promise<CalendarResponse & { googleCalendarId: string }> {
    const res = await this.dataProvider.create(data);

    return {
      ...(await this.parseRawCalendar(res)),
      googleCalendarId: res.googleCalendarId,
    };
  }
}
