import { GraphqlEvent } from '@asap-hub/squidex';
import { EventBaseResponse } from '../controllers/events';
import { parseGraphQLCalendar } from './calendar';
import { parseDate } from '../utils/squidex';

export const parseGraphQLEvent = (item: GraphqlEvent): EventBaseResponse => {
  const calendar = parseGraphQLCalendar(item.flatData!.calendar![0]);
  const startDate = parseDate(item.flatData!.startDate!);
  const currentDate = new Date(Date.now());
  const meetingLink =
    startDate.getTime() - 3600 * 24 < currentDate.getTime()
      ? item.flatData!.meetingLink || undefined
      : undefined;

  return {
    id: item.id,
    startDate: startDate.toISOString(),
    endDate: parseDate(item.flatData!.endDate!).toISOString(),
    lastModifiedDate: parseDate(item.lastModified).toISOString(),
    title: item.flatData!.title!,
    meetingLink,

    calendar,
  };
};
