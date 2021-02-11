/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DateTime, Duration } from 'luxon';
import { GraphqlEvent } from '@asap-hub/squidex';
import { EventBaseResponse } from '../controllers/events';
import { parseGraphQLCalendar } from './calendar';
import { parseDate } from '../utils/squidex';

export const parseGraphQLEvent = (item: GraphqlEvent): EventBaseResponse => {
  const calendar = parseGraphQLCalendar(item.flatData!.calendar![0]);
  const startDate = DateTime.fromISO(item.flatData!.startDate!);
  const now = DateTime.local();
  const oneDayDuration = Duration.fromObject({ day: 1 });

  const meetingLink =
    now.plus(oneDayDuration) > startDate
      ? item.flatData!.meetingLink || undefined
      : undefined;

  return {
    id: item.id,
    startDate: startDate.toUTC().toString(),
    endDate: parseDate(item.flatData!.endDate!).toISOString(),
    lastModifiedDate: parseDate(item.lastModified).toISOString(),
    title: item.flatData!.title!,
    meetingLink,

    calendar,
  };
};
