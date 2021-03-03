/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DateTime, Duration } from 'luxon';
import { GraphqlEvent } from '@asap-hub/squidex';
import {
  EventResponse,
  MEETING_LINK_AVAILABLE_HOURS_BEFORE_EVENT,
} from '@asap-hub/model';
import { parseGraphQLCalendar } from './calendar';
import { parseDate, createURL } from '../utils/squidex';
import { parseGraphQLGroup } from './group';

export const parseGraphQLEvent = (item: GraphqlEvent): EventResponse => {
  const calendar = parseGraphQLCalendar(item.flatData!.calendar![0]);
  const groups =
    item.flatData!.calendar![0].referencingGroupsContents?.map((group) =>
      parseGraphQLGroup(group),
    ) || [];
  const startDate = DateTime.fromISO(item.flatData!.startDate!);
  const now = DateTime.local();
  const exposeMeetingLinkBeforeStartDuration = Duration.fromObject({
    hours: MEETING_LINK_AVAILABLE_HOURS_BEFORE_EVENT,
  });

  const meetingLink =
    now.plus(exposeMeetingLinkBeforeStartDuration) > startDate
      ? item.flatData!.meetingLink || undefined
      : undefined;

  // fallback to group thumbnail
  const thumbnail = item.flatData?.thumbnail?.length
    ? createURL(item.flatData.thumbnail.map((t) => t.id))[0]
    : groups.length
    ? groups[0].thumbnail
    : undefined;

  return {
    id: item.id,
    description: item.flatData?.description || '',
    startDate: startDate.toUTC().toString(),
    startDateTimeZone: item.flatData!.startDateTimeZone!,
    endDate: parseDate(item.flatData!.endDate!).toISOString(),
    endDateTimeZone: item.flatData!.endDateTimeZone!,
    lastModifiedDate: parseDate(item.lastModified).toISOString(),
    title: item.flatData!.title!,
    thumbnail,
    meetingLink,
    status: item.flatData!.status!,
    tags: item.flatData!.tags!,
    calendar,
    groups,
  };
};
