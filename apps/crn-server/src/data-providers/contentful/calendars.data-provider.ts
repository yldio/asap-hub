import {
  CalendarCreateDataObject,
  CalendarDataObject,
  CalendarDataProvider,
  CalendarUpdateDataObject,
  FetchCalendarProviderOptions,
  ListCalendarDataObject,
  isGoogleLegacyCalendarColor,
} from '@asap-hub/model';
import {
  addLocaleToFields,
  GraphQLClient,
  FETCH_CALENDARS,
  FETCH_CALENDAR_BY_ID,
  FetchCalendarByIdQuery,
  FetchCalendarByIdQueryVariables,
  FetchCalendarsQuery,
  FetchCalendarsQueryVariables,
  Environment,
  CalendarsOrder,
} from '@asap-hub/contentful';

export type CalendarItem = NonNullable<
  NonNullable<FetchCalendarsQuery['calendarsCollection']>['items'][number]
>;

export class CalendarContentfulDataProvider implements CalendarDataProvider {
  constructor(
    private contentfulClient: GraphQLClient,
    private getRestClient: () => Promise<Environment>,
  ) {}

  async fetchById(id: string): Promise<CalendarDataObject | null> {
    const { calendars } = await this.contentfulClient.request<
      FetchCalendarByIdQuery,
      FetchCalendarByIdQueryVariables
    >(FETCH_CALENDAR_BY_ID, { id });

    if (!calendars) {
      return null;
    }

    return parseGraphQlCalendarToDataObject(calendars);
  }

  async fetch(
    options?: FetchCalendarProviderOptions,
  ): Promise<ListCalendarDataObject> {
    const { maxExpiration, resourceId } = options || {};

    const { calendarsCollection } = await this.contentfulClient.request<
      FetchCalendarsQuery,
      FetchCalendarsQueryVariables
    >(FETCH_CALENDARS, {
      limit: 50,
      skip: 0,
      order: [CalendarsOrder.NameAsc],
      where: {
        ...(maxExpiration ? { expirationDate_lt: maxExpiration } : {}),
        ...(resourceId ? { resourceId } : {}),
      },
    });

    if (!calendarsCollection?.items) {
      return {
        total: 0,
        items: [],
      };
    }

    return {
      total: calendarsCollection.total,
      items: calendarsCollection.items
        .filter((x): x is CalendarItem => x !== null)
        .map(parseGraphQlCalendarToDataObject),
    };
  }

  async create(create: CalendarCreateDataObject): Promise<string> {
    const environment = await this.getRestClient();

    const calendarEntry = await environment.createEntry('calendars', {
      fields: addLocaleToFields(create),
    });

    await calendarEntry.publish();

    return calendarEntry.sys.id;
  }

  async update(id: string, update: CalendarUpdateDataObject): Promise<void> {
    const environment = await this.getRestClient();

    const calendar = await environment.getEntry(id);

    Object.entries(update).forEach(([fieldName, fieldValue]) => {
      calendar.fields[fieldName] = { 'en-US': fieldValue };
    });

    const calendarUpdated = await calendar.update();
    await calendarUpdated.publish();
  }
}

export const calendarUnreadyResponse = {
  groups: [],
  workingGroups: [],
};

export const parseGraphQlCalendarToDataObject = (
  item: CalendarItem,
): CalendarDataObject => ({
  id: item.sys.id,
  version: item.sys.publishedVersion ?? 1,
  color:
    item.color && isGoogleLegacyCalendarColor(item.color)
      ? item.color
      : ('#333333' as const),
  googleCalendarId: item.googleCalendarId ?? '',
  name: item.name ?? '',
  resourceId: item.resourceId,
  expirationDate: item.expirationDate,
  syncToken: item.syncToken,

  // TODO: implement this when
  // CT-13 Interest Groups
  // CT-17 Working Groups
  // are ready
  ...calendarUnreadyResponse,
});
