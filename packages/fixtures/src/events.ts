import {
  EventResponse,
  EventSpeakerUser,
  ListEventResponse,
  EventSpeaker,
  TeamResponse,
} from '@asap-hub/model';
import { addHours, subHours } from 'date-fns';

import { createCalendarResponse } from './calendars';
import { createGroupResponse } from './groups';

export const createSpeakerUserResponse = (itemIndex = 0): EventSpeakerUser => ({
  id: `user-id-${itemIndex}`,
  firstName: 'John',
  lastName: 'Doe',
  displayName: `John Doe ${itemIndex}`,
});

export const createSpeakerTeamResponse = (
  itemIndex = 0,
): Pick<TeamResponse, 'displayName' | 'id'> => ({
  id: `team-id-${itemIndex}`,
  displayName: `The team ${itemIndex}`,
});

export const createSpeakersResponse = (itemIndex = 0): EventSpeaker => ({
  team: createSpeakerTeamResponse(itemIndex),
  user: createSpeakerUserResponse(itemIndex),
  role: `Genetics ${itemIndex}`,
});

const getSpeakers = (
  numberOfSpeakers: number,
  numberOfUnknownSpeakers: number,
): EventSpeaker[] => {
  const speakerList: EventSpeaker[] = [];

  for (let index = 0; index < numberOfSpeakers; index+=1) {
    speakerList.push(createSpeakersResponse(index));
  }

  for (let index = 0; index < numberOfUnknownSpeakers; index+=1) {
    speakerList.push({
      team: createSpeakerTeamResponse(index),
    });
  }

  return speakerList;
};

interface FixtureOptions {
  meetingMaterials?: number;
  numberOfSpeakers?: number;
  numberOfUnknownSpeakers?: number;
  isEventInThePast?: boolean;
}

export const createEventResponse = (
  {
    meetingMaterials = 1,
    numberOfSpeakers = 4,
    numberOfUnknownSpeakers = 1,
    isEventInThePast = false,
  }: FixtureOptions = {},
  itemIndex = 0,
): EventResponse => ({
  id: `event-${itemIndex}`,
  calendar: createCalendarResponse(itemIndex),
  startDate: new Date().toISOString(),
  startDateTimeZone: 'Europe/London',
  endDate: isEventInThePast
    ? subHours(new Date(), 2).toISOString()
    : addHours(new Date(), 1).toISOString(),
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
  speakers: getSpeakers(numberOfSpeakers, numberOfUnknownSpeakers),
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
