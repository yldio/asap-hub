import { EventResponse, ListEventResponse } from '@asap-hub/model';
import { addHours } from 'date-fns';

import { createCalendarResponse } from './calendars';
import { createGroupResponse } from './groups';

interface FixtureOptions {
  meetingMaterials?: number;
}

export const createEventResponse = (
  { meetingMaterials = 1 }: FixtureOptions = {},
  itemIndex = 0,
): EventResponse => ({
  id: `event-${itemIndex}`,
  calendar: createCalendarResponse(itemIndex),
  startDate: new Date().toISOString(),
  startDateTimeZone: 'Europe/London',
  endDate: addHours(new Date(), 1).toISOString(),
  endDateTimeZone: 'Europe/London',
  group: createGroupResponse(),
  description: `Event ${itemIndex} description`,
  status: 'Confirmed',
  tags: [],
  title: `Event ${itemIndex}`,
  lastModifiedDate: new Date().toISOString(),
  meetingLink: 'https://example.com/meeting',
  notes: 'Meeting notes go here',
  presentation: 'Presentation',
  videoRecording: 'Video Recording',
  meetingMaterials: Array.from({ length: meetingMaterials }).map((_, i) => ({
    title: `Material ${i + 1}`,
    url: `https://example.com/materials/${i}`,
  })),
});

export const createListEventResponse = (
  items: number,
  options: FixtureOptions = {},
): ListEventResponse => ({
  total: items,
  items: Array.from({ length: items }, (_, itemIndex) =>
    createEventResponse(options, itemIndex),
  ),
});

export default createListEventResponse;
