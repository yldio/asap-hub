import { CalendarResponse } from '@asap-hub/model';
import { RestCalendar } from '@asap-hub/squidex';

export const parseCalendar = (item: RestCalendar): CalendarResponse => ({
  id: item.data.id.iv,
  color: item.data.color.iv,
  name: item.data.name.iv,
});
