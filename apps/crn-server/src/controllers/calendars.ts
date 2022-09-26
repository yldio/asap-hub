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
  async fetch(): Promise<ListCalendarResponse> {
    try {
      const calendars = handleFetchCalendarError(
        await this.dataProvider.fetch({ take: 50, skip: 0, onlyActive: true }),
      );

      return {
        total: calendars.length,
        items: calendars.map(parseRawCalendar),
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
      const calendars = handleFetchCalendarError(
        await this.dataProvider.fetch(options),
      );

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
    const calendar = handleFetchCalendarError<RestCalendar>(
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
    const calendar = handleFetchCalendarError<CalendarRawDataObject>(
      await this.dataProvider.fetchById(calendarId),
    );

    return options?.raw === true ? calendar : parseRawCalendar(calendar);
  }

  async getSyncToken(calendarId: string): Promise<string | undefined> {
    const res = handleFetchCalendarError<CalendarRawDataObject>(
      await this.dataProvider.fetchById(calendarId),
    );

    return res.syncToken || undefined;
  }

  async update(
    calendarId: string,
    data: Partial<Calendar>,
  ): Promise<CalendarResponse> {
    return parseRawCalendar(await this.dataProvider.update(calendarId, data));
  }

  async create(
    data: Calendar,
  ): Promise<CalendarResponse & { googleCalendarId: string }> {
    const res = await this.dataProvider.create(data);

    return {
      ...parseRawCalendar(res),
      googleCalendarId: res.googleCalendarId,
    };
  }
}

const parseRawCalendar = (raw: CalendarRawDataObject): CalendarResponse => ({
  id: raw.googleCalendarId,
  name: raw.name,
  color: raw.color,
});

const handleFetchCalendarError = <T>(item: T | FetchCalendarError): T => {
  if (
    typeof item === 'number' &&
    item === FetchCalendarError.CalendarNotFound
  ) {
    throw Boom.notFound();
  }

  if (typeof item === 'number' && item === FetchCalendarError.InvalidColor) {
    throw Boom.badGateway('Invalid colour');
  }

  if (
    typeof item === 'number' &&
    item === FetchCalendarError.MissingRequiredData
  ) {
    throw Boom.badGateway('Missing required data');
  }

  return item as T;
};
