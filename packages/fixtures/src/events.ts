import { EventResponse, ListEventResponse } from '@asap-hub/model';
import { createCalendarResponse } from './calendars';
import { createGroupResponse } from './groups';

interface FixtureOptions {
  groupCount?: number;
}

export const createEventResponse = (
  { groupCount = 1 }: FixtureOptions = {},
  itemIndex = 0,
): EventResponse => ({
  id: `event-${itemIndex}`,
  calendar: createCalendarResponse(itemIndex),
  startDate: new Date().toISOString(),
  endDate: new Date().toISOString(),
  groups: Array.from({ length: groupCount }).map((_, index) =>
    createGroupResponse({}, index),
  ),
  description: '',
  status: 'Confirmed',
  tags: [],
  title: `Event ${itemIndex}`,
  lastModifiedDate: new Date().toISOString(),
  meetingLink: '',
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
