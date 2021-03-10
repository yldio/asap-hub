/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DateTime } from 'luxon';
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
  const now = DateTime.utc();

  const meetingLink =
    now.plus({ hours: MEETING_LINK_AVAILABLE_HOURS_BEFORE_EVENT }) > startDate
      ? item.flatData!.meetingLink || undefined
      : undefined;

  // fallback to group thumbnail
  const thumbnail = item.flatData?.thumbnail?.length
    ? createURL(item.flatData.thumbnail.map((t) => t.id))[0]
    : groups.length
    ? groups[0].thumbnail
    : undefined;

  const endDate = DateTime.fromISO(item.flatData!.endDate!);
  const isStale = endDate.diffNow('days').get('days') < -10; // 10 days have passed after the event

  const {
    notesPermanentlyUnavailable,
    videoRecordingPermanentlyUnavailable,
    presentationPermanentlyUnavailable,
    meetingMaterialsPermanentlyUnavailable,
    notes,
    videoRecording,
    presentation,
    meetingMaterials,
  } = item.flatData!;

  const getMeetingDetail = <O = undefined, T = string>(
    isPermanentlyUnavailable: boolean | null | undefined,
    detail: T | null,
    emptyState: O,
  ): T | O | null => {
    if (isPermanentlyUnavailable || (!notes && isStale)) return null;
    return detail ?? emptyState;
  };

  const materials =
    meetingMaterials?.map(({ title, url, label }) => ({
      title,
      url,
      label: label ?? undefined,
    })) || [];

  const meetingMaterialsRes = getMeetingDetail(
    meetingMaterialsPermanentlyUnavailable,
    materials,
    [],
  );
  const notesRes = getMeetingDetail(
    notesPermanentlyUnavailable,
    notes,
    undefined,
  );
  const videoRecordingRes = getMeetingDetail(
    videoRecordingPermanentlyUnavailable,
    videoRecording,
    undefined,
  );
  const presentationRes = getMeetingDetail(
    presentationPermanentlyUnavailable,
    presentation,
    undefined,
  );

  return {
    id: item.id,
    description: item.flatData?.description || '',
    startDate: startDate.toUTC().toString(),
    startDateTimeZone: item.flatData!.startDateTimeZone!,
    endDate: endDate.toUTC().toString(),
    endDateTimeZone: item.flatData!.endDateTimeZone!,
    lastModifiedDate: parseDate(item.lastModified).toISOString(),
    title: item.flatData!.title!,
    notes: notesRes,
    videoRecording: videoRecordingRes,
    presentation: presentationRes,
    meetingMaterials: meetingMaterialsRes,
    thumbnail,
    meetingLink,
    status: item.flatData!.status!,
    tags: item.flatData!.tags!,
    calendar,
    groups,
  };
};
