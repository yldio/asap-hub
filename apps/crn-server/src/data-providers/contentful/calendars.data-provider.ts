import {
  CalendarCreateDataObject,
  CalendarDataObject,
  CalendarDataProvider,
  CalendarUpdateDataObject,
  FetchCalendarProviderOptions,
  ListCalendarDataObject,
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
  updateEntryFields,
} from '@asap-hub/contentful';
import { parseContentfulGraphqlCalendarPartialToDataObject } from '../../entities';

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
        ...(maxExpiration || resourceId
          ? { googleApiMetadata_exists: true }
          : {}),
      },
    });

    if (!calendarsCollection?.items) {
      return {
        total: 0,
        items: [],
      };
    }

    if (resourceId || maxExpiration) {
      const filteredCalendarItems = calendarsCollection?.items.filter(
        (calendar) => {
          if (resourceId && maxExpiration) {
            return (
              calendar?.googleApiMetadata.resourceId === resourceId &&
              calendar?.googleApiMetadata.expirationDate <= maxExpiration
            );
          }

          if (resourceId) {
            return calendar?.googleApiMetadata.resourceId === resourceId;
          }

          if (maxExpiration) {
            return calendar?.googleApiMetadata.expirationDate <= maxExpiration;
          }

          return false;
        },
      );

      return {
        total: (filteredCalendarItems || [])?.length,
        items: (filteredCalendarItems || [])
          .filter((x): x is CalendarItem => x !== null)
          .map(parseGraphQlCalendarToDataObject),
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
    const previousGoogleApiMetadata = calendar.fields.googleApiMetadata;

    const { resourceId, expirationDate, syncToken, ...otherFields } = update;

    const calendarWithUpdatedFields = updateEntryFields(calendar, otherFields);

    if (resourceId || expirationDate || syncToken)
      calendarWithUpdatedFields.fields.googleApiMetadata = {
        'en-US': {
          ...previousGoogleApiMetadata,
          // if the resourceId is updated, we change associatedGoogleCalendarId
          // this field is used by webhooks
          ...(resourceId ? { resourceId, associatedGoogleCalendarId: id } : {}),
          ...(syncToken ? { syncToken } : {}),
          ...(expirationDate ? { expirationDate } : {}),
        },
      };

    const calendarUpdated = await calendarWithUpdatedFields.update();
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
  resourceId: item.googleApiMetadata.resourceId ?? undefined,
  expirationDate: item.googleApiMetadata.expirationDate ?? undefined,
  syncToken: item.googleApiMetadata.syncToken ?? undefined,
  associatedGoogleCalendarId:
    item.googleApiMetadata.associatedGoogleCalendarId ?? undefined,
  ...parseContentfulGraphqlCalendarPartialToDataObject(item),
  // TODO: implement this when
  // CT-13 Interest Groups
  // CT-17 Working Groups
  // are ready
  ...calendarUnreadyResponse,
});
