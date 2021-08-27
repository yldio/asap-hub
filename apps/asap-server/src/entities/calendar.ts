import { CalendarResponse } from '@asap-hub/model';
import { RestCalendar, GraphqlCalendar } from '@asap-hub/squidex';

export const parseCalendar = (item: RestCalendar): CalendarResponse => ({
  id: item.data.googleCalendarId.iv,
  color: item.data.color.iv,
  name: item.data.name.iv,
});

export const parseGraphQLCalendar = (
  item: GraphqlCalendar,
): CalendarResponse => ({
  id: item.flatData?.googleCalendarId || '',
  // default should never be picked. Field required on CMS
  color: item.flatData?.color || '#333333',
  name: item.flatData?.name || '',
});
