import { CalendarResponse, isGoogleLegacyCalendarColor } from '@asap-hub/model';
import { RestCalendar } from '@asap-hub/squidex';
import { Calendars } from '../gql/graphql';

export const parseCalendar = (item: RestCalendar): CalendarResponse => ({
  id: item.data.googleCalendarId.iv,
  color: item.data.color.iv,
  name: item.data.name.iv,
});

export const parseGraphQLCalendar = ({
  flatData: { color, googleCalendarId, name },
}: {
  flatData: Pick<Calendars['flatData'], 'googleCalendarId' | 'name' | 'color'>;
}): CalendarResponse => ({
  id: googleCalendarId ?? '',
  // default should never be picked. Field required on CMS
  color: isGoogleLegacyCalendarColor(color) ? color : ('#333333' as const),
  name: name ?? '',
});
