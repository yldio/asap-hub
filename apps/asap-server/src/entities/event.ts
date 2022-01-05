/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DateTime } from 'luxon';
import {
  EventResponse,
  MEETING_LINK_AVAILABLE_HOURS_BEFORE_EVENT,
  isEventStatus,
} from '@asap-hub/model';

import { parseGraphqlCalendar } from './calendar';
import { parseDate, createURL } from '../utils/squidex';
import { parseGraphQLGroup } from './group';
import { EventContentFragment } from '../gql/graphql';

export const getMeetingMaterial = <T>(
  material: T,
  isPermanentlyUnavailable: boolean,
  isStale: boolean,
  emptyState: T,
): T | null => {
  const isEmpty = !(Array.isArray(material) ? material.length : material);
  if (isPermanentlyUnavailable || (isEmpty && isStale)) {
    return null;
  }
  return isEmpty ? emptyState : material;
};

export const parseGraphQLEvent = (
  item: EventContentFragment,
): EventResponse => {
  if (!item.flatData.calendar?.[0]) {
    throw new Error(`Event (${item.id}) doesn't have a calendar"`);
  }

  const calendar = parseGraphqlCalendar(item.flatData.calendar[0]);
  const group =
    item.flatData.calendar![0].referencingGroupsContents?.map((calGroup) =>
      parseGraphQLGroup(calGroup),
    )[0] || undefined;
  const startDate = DateTime.fromISO(item.flatData.startDate!);
  const now = DateTime.utc();

  const meetingLink =
    now.plus({ hours: MEETING_LINK_AVAILABLE_HOURS_BEFORE_EVENT }) > startDate
      ? item.flatData.meetingLink || undefined
      : undefined;

  // fallback to group thumbnail
  const thumbnail = item.flatData.thumbnail?.length
    ? createURL(item.flatData.thumbnail.map((t) => t.id))[0]
    : group?.thumbnail;

  const endDate = DateTime.fromISO(item.flatData.endDate);
  const isStale = endDate.diffNow('days').get('days') < -14; // 14 days have passed after the event

  const {
    notesPermanentlyUnavailable,
    videoRecordingPermanentlyUnavailable,
    presentationPermanentlyUnavailable,
    meetingMaterialsPermanentlyUnavailable,
    notes,
    videoRecording,
    presentation,
    meetingMaterials,
  } = item.flatData;

  if (!isEventStatus(item.flatData.status)) {
    throw new Error(
      `Invalid event (${item.id}) status "${item.flatData.status}"`,
    );
  }

  return {
    id: item.id,
    description: item.flatData.description || '',
    startDate: startDate.toUTC().toString(),
    startDateTimeZone: item.flatData.startDateTimeZone!,
    endDate: endDate.toUTC().toString(),
    endDateTimeZone: item.flatData.endDateTimeZone!,
    lastModifiedDate: parseDate(item.lastModified).toISOString(),
    title: item.flatData.title!,
    notes: getMeetingMaterial(
      notes,
      !!notesPermanentlyUnavailable,
      isStale,
      undefined,
    ),
    videoRecording: getMeetingMaterial(
      videoRecording,
      !!videoRecordingPermanentlyUnavailable,
      isStale,
      undefined,
    ),
    presentation: getMeetingMaterial(
      presentation,
      !!presentationPermanentlyUnavailable,
      isStale,
      undefined,
    ),
    meetingMaterials: getMeetingMaterial(
      (meetingMaterials ?? []).map(({ title, url }) => ({
        title: title ?? '',
        url: url ?? '',
      })),
      !!meetingMaterialsPermanentlyUnavailable,
      isStale,
      [],
    ),
    thumbnail,
    meetingLink,
    status: item.flatData.status,
    tags: item.flatData.tags ?? [],
    calendar,
    group,
  };
};
