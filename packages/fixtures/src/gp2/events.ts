import { gp2 } from '@asap-hub/model';
import { addHours, subHours } from 'date-fns';
import { createCalendarResponse } from './calendars';

export const createSpeakersResponse = (
  itemIndex = 0,
): gp2.EventSpeakerUser => ({
  id: `user-id-${itemIndex}`,
  firstName: 'John',
  lastName: 'Doe',
  displayName: `John Doe ${itemIndex}`,
});

const getSpeakers = (numberOfSpeakers: number): gp2.EventSpeaker[] => {
  const speakerList: gp2.EventSpeaker[] = [];

  for (let index = 0; index < numberOfSpeakers; index += 1) {
    speakerList.push(createSpeakersResponse(index));
  }

  return speakerList;
};

interface FixtureOptions {
  meetingMaterials?: number;
  numberOfSpeakers?: number;
  isEventInThePast?: boolean;
  customTitle?: string;
}

export const createEventResponse = (
  {
    meetingMaterials = 1,
    numberOfSpeakers = 4,
    isEventInThePast = false,
    customTitle = 'Event',
  }: FixtureOptions = {},
  itemIndex = 0,
): gp2.EventResponse => ({
  id: `event-${itemIndex}`,
  calendar: createCalendarResponse(itemIndex),
  startDate: new Date().toISOString(),
  startDateTimeZone: 'Europe/London',
  startDateTimestamp: new Date().getTime(),
  endDate: isEventInThePast
    ? subHours(new Date(), 2).toISOString()
    : addHours(new Date(), 1).toISOString(),
  endDateTimeZone: 'Europe/London',
  endDateTimestamp: isEventInThePast
    ? subHours(new Date(), 2).getTime()
    : addHours(new Date(), 1).getTime(),
  description: `Event ${itemIndex} description`,
  status: 'Confirmed',
  tags: [],
  title: `${customTitle} ${itemIndex}`,
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
  speakers: getSpeakers(numberOfSpeakers),
});

export const createListEventResponse = (
  items: number,
  options: FixtureOptions = {},
): gp2.ListEventResponse => ({
  total: items,
  items: Array.from({ length: items }, (_, itemIndex) =>
    createEventResponse(options, itemIndex),
  ),
});

export default createListEventResponse;
