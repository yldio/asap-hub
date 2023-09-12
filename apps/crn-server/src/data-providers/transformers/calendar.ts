import { FetchCalendarsQuery } from '@asap-hub/contentful';
import {
  CalendarDataObject,
  CalendarResponse,
  isGoogleLegacyCalendarColor,
} from '@asap-hub/model';
import { parseCalendarDataObjectToResponse } from '../../controllers/calendar.controller';

export const parseContentfulGraphqlCalendarToResponse = (
  graphqlCalendar: Pick<
    NonNullable<
      NonNullable<FetchCalendarsQuery['calendarsCollection']>['items'][number]
    >,
    'name' | 'googleCalendarId' | 'color'
  >,
): CalendarResponse =>
  parseCalendarDataObjectToResponse(
    parseContentfulGraphqlCalendarPartialToDataObject(graphqlCalendar),
  );

export const parseContentfulGraphqlCalendarPartialToDataObject = (
  graphqlCalendar: Pick<
    NonNullable<
      NonNullable<FetchCalendarsQuery['calendarsCollection']>['items'][number]
    >,
    'name' | 'googleCalendarId' | 'color'
  >,
): Pick<CalendarDataObject, 'name' | 'googleCalendarId' | 'color'> => ({
  color:
    graphqlCalendar.color && isGoogleLegacyCalendarColor(graphqlCalendar.color)
      ? graphqlCalendar.color
      : ('#333333' as const),
  googleCalendarId: graphqlCalendar.googleCalendarId ?? '',
  name: graphqlCalendar.name ?? '',
});
