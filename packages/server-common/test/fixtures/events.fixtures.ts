import {
  EventResponse,
  EventSpeakerUser,
  EventStatus,
  gp2 as gp2Model,
} from '@asap-hub/model';
import { RestEvent } from '@asap-hub/squidex';

export const getEventSpeakerUser = (): EventSpeakerUser => ({
  team: {
    id: 'team-id-3',
    displayName: 'The team three',
    inactiveSince: '2022-10-24T11:00:00Z',
  },
  user: {
    id: 'user-id-3',
    firstName: 'Adam',
    lastName: 'Brown',
    displayName: 'Adam Brown',
    alumniSinceDate: undefined,
    avatarUrl: undefined,
  },
  role: 'Lead PI (Core Leadership)',
});
export const getEventResponse = ({
  baseUrl = 'http://a-base.url',
  appName = 'the-app',
} = {}): EventResponse => ({
  id: 'ec3086d4-aa64-4f30-a0f7-5c5b95ffbcca',
  description: 'This event is awesome',
  lastModifiedDate: '2021-05-14T14:48:46.000Z',
  endDate: '2009-12-24T16:30:54.000Z',
  endDateTimestamp: 1261672254,
  startDate: '2009-12-24T16:20:14.000Z',
  startDateTimestamp: 1261671614,
  meetingLink: 'https://zoom.com/room/123',
  hideMeetingLink: false,
  status: 'Confirmed',
  tags: [],
  title: 'Example Event',
  startDateTimeZone: 'UTC',
  endDateTimeZone: 'UTC',
  notes: 'These are the notes from the meeting',
  videoRecording: '<embeded>video</embeded>',
  presentation: '<embeded>presentation</embeded>',
  meetingMaterials: [
    {
      title: 'My additional link',
      url: 'https://link.pt/additional-material',
    },
  ],
  thumbnail: `${baseUrl}/api/assets/${appName}/uuid-thumbnail-2`,
  calendar: {
    color: '#125A12',
    id: 'c_t92qa82jd702q1fkreoi0hf4hk@group.calendar.google.com',
    name: 'Tech 1 - Sequencing/omics',
    groups: [],
    workingGroups: [],
  },
  speakers: [getEventSpeakerUser()],
});

export const getListEventResponse = () => ({
  total: 1,
  items: [getEventResponse()],
});

export const getRestEvent = (): RestEvent => ({
  id: 'squidex-event-id',
  created: '2021-02-23T19:32:00Z',
  lastModified: '2021-02-23T19:32:00Z',
  version: 42,
  data: getEventInput(),
});

export const getEventInput = () => ({
  googleId: { iv: 'google-event-id' },
  title: { iv: 'Event Tittle' },
  description: { iv: 'This event will be good' },
  startDate: { iv: '2021-02-23T19:32:00Z' },
  startDateTimeZone: { iv: 'Europe/Lisbon' },
  endDate: { iv: '2021-02-23T19:32:00Z' },
  endDateTimeZone: { iv: 'Europe/Lisbon' },
  calendar: { iv: ['squidex-calendar-id'] },
  status: { iv: 'Confirmed' as EventStatus },
  tags: { iv: [] },
  hidden: { iv: false },
  meetingLink: { iv: 'https://zweem.com' },
  hideMeetingLink: { iv: false },
});
