import {
  addLocaleToFields,
  Environment,
  gp2,
  GraphQLClient,
  updateEntryFields,
} from '@asap-hub/contentful';
import {
  CalendarCreateDataObject,
  CalendarUpdateDataObject,
  FetchCalendarProviderOptions,
  gp2 as gp2Model,
} from '@asap-hub/model';
import { parseContentfulGraphqlCalendarPartialToDataObject } from '../../entities';

export type CalendarItem = NonNullable<
  NonNullable<gp2.FetchCalendarsQuery['calendarsCollection']>['items'][number]
>;

export class CalendarContentfulDataProvider
  implements gp2Model.CalendarDataProvider
{
  constructor(
    private graphQLClient: GraphQLClient,
    private getRestClient: () => Promise<Environment>,
  ) {}

  async fetchById(id: string) {
    const { calendars } = await this.graphQLClient.request<
      gp2.FetchCalendarByIdQuery,
      gp2.FetchCalendarByIdQueryVariables
    >(gp2.FETCH_CALENDAR_BY_ID, { id });

    return calendars ? parseGraphQlCalendarToDataObject(calendars) : null;
  }

  async fetch(options?: FetchCalendarProviderOptions) {
    const { maxExpiration, resourceId } = options || {};

    const { calendarsCollection } = await this.graphQLClient.request<
      gp2.FetchCalendarsQuery,
      gp2.FetchCalendarsQueryVariables
    >(gp2.FETCH_CALENDARS, {
      limit: 50,
      skip: 0,
      order: [gp2.CalendarsOrder.NameAsc],
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
        .filter((item): item is CalendarItem => item !== null)
        .map(parseGraphQlCalendarToDataObject),
    };
  }

  async create(create: CalendarCreateDataObject) {
    const environment = await this.getRestClient();

    const calendarEntry = await environment.createEntry('calendars', {
      fields: addLocaleToFields(create),
    });

    await calendarEntry.publish();

    return calendarEntry.sys.id;
  }

  async update(id: string, update: CalendarUpdateDataObject) {
    const environment = await this.getRestClient();

    const calendar = await environment.getEntry(id);

    const calendarWithUpdatedFields = updateEntryFields(calendar, update);

    const calendarUpdated = await calendarWithUpdatedFields.update();
    await calendarUpdated.publish();
  }
}

export const calendarUnreadyResponse = {
  projects: [],
  workingGroups: [],
};

export const parseGraphQlCalendarToDataObject = (
  item: CalendarItem,
): gp2Model.CalendarDataObject => ({
  id: item.sys.id,
  version: item.sys.publishedVersion ?? 1,
  resourceId: item.resourceId,
  expirationDate: item.expirationDate,
  syncToken: item.syncToken,
  ...parseContentfulGraphqlCalendarPartialToDataObject(item),
  ...calendarUnreadyResponse,
});
