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
  hideMeetingLink: false,
  notes: 'Meeting notes go here',
  presentation: 'Presentation',
  videoRecording: 'Video Recording',
  meetingMaterials: Array.from({ length: meetingMaterials }).map((_, i) => ({
    title: `Material ${i + 1}`,
    url: `https://example.com/materials/${i}`,
  })),
  speakers: [
    {
      team: {
        id: 'team-id-1',
        displayName: 'The team one',
      },
    },
    {
      team: {
        id: 'team-id-2',
        displayName: 'The team two',
      },
      user: {
        id: 'user-id-2',
        firstName: 'Johny',
        lastName: 'Sims',
        displayName: 'Johny Sims',
      },
    },
    {
      team: {
        id: 'team-id-3',
        displayName: 'The team three',
      },
      user: {
        id: 'user-id-3',
        firstName: 'Adam',
        lastName: 'Brown',
        displayName: 'Adam Brown',
      },
      role: 'Lead PI (Core Leadership)',
    },
  ],
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
