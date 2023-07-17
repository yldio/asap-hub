import { gp2 as gp2Contentful } from '@asap-hub/contentful';
import { EventStatus, gp2 as gp2Model } from '@asap-hub/model';

export const getContentfulGraphql = () => ({
  Events: () => getContentfulGraphqlEvent(),
  ProjectsCollection: () => getContentfulProjectsCollection(),
  WorkingGroupsCollection: () => getContentfulWorkingGroupsCollection(),
});

export const getContentfulGraphqlEvent = (): NonNullable<
  NonNullable<
    gp2Contentful.FetchEventsQuery['eventsCollection']
  >['items'][number]
> => ({
  sys: {
    id: 'ec3086d4-aa64-4f30-a0f7-5c5b95ffbcca',
    publishedAt: '2021-05-14T14:48:46.000Z',
  },
  description: 'This event is awesome',
  endDate: '2009-12-24T16:30:54.000Z',
  endDateTimeZone: 'UTC',
  startDate: '2009-12-24T16:20:14.000Z',
  startDateTimeZone: 'UTC',
  meetingLink: 'https://zoom.com/room/123',
  hideMeetingLink: false,
  eventLink: 'https://zoom.com/room/123',
  status: 'Confirmed',
  hidden: false,
  tags: [],
  title: 'Example Event',
  notesPermanentlyUnavailable: false,
  notes: {
    json: {
      data: {},
      content: [
        {
          data: {},
          content: [
            {
              data: {},
              marks: [],
              value: 'These are the notes from the meeting',
              nodeType: 'text',
            },
          ],
          nodeType: 'paragraph',
        },
      ],
      nodeType: 'document',
    },
    links: {
      entries: {
        inline: [],
      },
      assets: {
        block: [],
      },
    },
  },
  notesUpdatedAt: '2010-10-01T08:00:04.000Z',
  videoRecordingPermanentlyUnavailable: false,
  videoRecording: {
    json: {
      nodeType: 'document',
      data: {},
      content: [
        {
          nodeType: 'paragraph',
          data: {},
          content: [
            {
              nodeType: 'text',
              value: '',
              marks: [],
              data: {},
            },
            {
              nodeType: 'embedded-entry-inline',
              data: {
                target: {
                  sys: {
                    id: 'video-id',
                    type: 'Link',
                    linkType: 'Entry',
                  },
                },
              },
              content: [],
            },
            {
              nodeType: 'text',
              value: '',
              marks: [],
              data: {},
            },
          ],
        },
      ],
    },
    links: {
      entries: {
        inline: [
          {
            sys: {
              id: 'video-id',
            },
            __typename: 'Media',
            url: 'https://player.vimeo.com/video/493052720',
          },
        ],
      },
      assets: {
        block: [],
      },
    },
  },
  videoRecordingUpdatedAt: '2010-08-01T08:00:04.000Z',
  presentationPermanentlyUnavailable: false,
  presentation: {
    json: {
      nodeType: 'document',
      data: {},
      content: [
        {
          nodeType: 'paragraph',
          data: {},
          content: [
            {
              nodeType: 'text',
              value: '',
              marks: [],
              data: {},
            },
            {
              nodeType: 'embedded-entry-inline',
              data: {
                target: {
                  sys: {
                    id: 'presentation-id',
                    type: 'Link',
                    linkType: 'Entry',
                  },
                },
              },
              content: [],
            },
            {
              nodeType: 'text',
              value: '',
              marks: [],
              data: {},
            },
          ],
        },
      ],
    },
    links: {
      entries: {
        inline: [
          {
            sys: {
              id: 'presentation-id',
            },
            __typename: 'Media',
            url: 'https://example.com',
          },
        ],
      },
      assets: {
        block: [],
      },
    },
  },
  presentationUpdatedAt: '2010-09-01T08:00:04.000Z',
  meetingMaterialsPermanentlyUnavailable: false,
  meetingMaterials: [
    {
      title: 'My additional link',
      url: 'https://link.pt/additional-material',
    },
  ],
  calendar: {
    googleCalendarId: 'c_t92qa82jd702q1fkreoi0hf4hk@group.calendar.google.com',
    color: '#125A12' as const,
    name: 'Tech 1 - Sequencing/omics',
    linkedFrom: {
      projectsCollection: {
        items: getContentfulProjectsCollection().items,
      },
      workingGroupsCollection: {
        items: getContentfulWorkingGroupsCollection().items,
      },
    },
  },
  thumbnail: {
    url: 'https://example.com',
  },
  speakersCollection: {
    items: [
      {
        title: 'Some Topic',
        user: {
          __typename: 'Users',
          sys: {
            id: 'user-id-3',
          },
          firstName: 'Adam',
          lastName: 'Brown',
          onboarded: true,
          avatar: null,
        },
      },
    ],
  },
});

export const getContentfulProjectsCollection = () => ({
  total: 1,
  items: [
    {
      sys: { id: '7' },
      title: 'a project title',
    },
  ],
});

export const getContentfulWorkingGroupsCollection = () => ({
  total: 1,
  items: [
    {
      sys: { id: '11' },
      title: 'a working group title',
    },
  ],
});

export const getContentfulGraphqlEventsResponse =
  (): gp2Contentful.FetchEventsQuery => ({
    eventsCollection: {
      total: 1,
      items: [getContentfulGraphqlEvent()],
    },
  });

export const getEventsByUserIdGraphqlResponse =
  (): gp2Contentful.FetchEventsByUserIdQuery => ({
    users: {
      linkedFrom: {
        eventSpeakersCollection: {
          items: [
            {
              linkedFrom: {
                eventsCollection: {
                  total: 1,
                  items: [getContentfulGraphqlEvent()],
                },
              },
            },
          ],
        },
      },
    },
  });

export const getEventsByExternalUserIdGraphqlResponse =
  (): gp2Contentful.FetchEventsByExternalUserIdQuery => ({
    externalUsers: {
      linkedFrom: {
        eventSpeakersCollection: {
          items: [
            {
              linkedFrom: {
                eventsCollection: {
                  total: 1,
                  items: [getContentfulGraphqlEvent()],
                },
              },
            },
          ],
        },
      },
    },
  });

export const getEventSpeakerUser = (): gp2Model.EventSpeakerUser => ({
  id: 'user-id-3',
  firstName: 'Adam',
  lastName: 'Brown',
  displayName: 'Adam Brown',
  avatarUrl: undefined,
});

export const getContentfulEventDataObject = (): gp2Model.EventDataObject => ({
  ...getEventDataObject(),
  notes: '<p>These are the notes from the meeting</p>',
  presentation: '<p><iframe src="https://example.com"/></p>',
  videoRecording:
    '<p><iframe src="https://player.vimeo.com/video/493052720"/></p>',
  thumbnail: 'https://example.com',
  calendar: {
    ...getEventDataObject().calendar,
    projects: [
      {
        id: '7',
        title: 'a project title',
      },
    ],
    workingGroups: [
      {
        id: '11',
        title: 'a working group title',
      },
    ],
  },
});

export const getContentfulEventResponse = (): gp2Model.EventResponse =>
  getEventDataObject();

export const getContentfulListEventDataObject =
  (): gp2Model.ListEventDataObject => ({
    total: 1,
    items: [getContentfulEventDataObject()],
  });

export const getContentfulListEventResponse = (): gp2Model.ListEventResponse =>
  getContentfulListEventDataObject();

export const getEventSpeaker = (): gp2Model.EventSpeaker => ({
  speaker: getEventSpeakerUser(),
  topic: 'Some Topic',
});

export const getEventExternalUser = (): gp2Model.EventSpeakerExternalUser => ({
  name: 'Adam Brown',
  orcid: '1234-1234-1234',
});

export const getEventExternalSpeaker = (): gp2Model.EventSpeaker => ({
  speaker: getEventExternalUser(),
  topic: 'Some Topic',
});

export const getEventSpeakerToBeAnnounced = (): gp2Model.EventSpeaker => ({
  speaker: undefined,
  topic: undefined,
});

export const getEventDataObject = (): gp2Model.EventDataObject => ({
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
  calendar: {
    color: '#125A12',
    id: 'c_t92qa82jd702q1fkreoi0hf4hk@group.calendar.google.com',
    name: 'Tech 1 - Sequencing/omics',
    projects: [],
    workingGroups: [],
  },
  speakers: [getEventSpeaker()],
  workingGroup: { id: '11', title: 'a working group title' },
  project: { id: '7', title: 'a project title' },
});

export const getListEventDataObject = (): gp2Model.ListEventDataObject => ({
  total: 1,
  items: [getEventDataObject()],
});
export const getEventResponse = (): gp2Model.EventResponse =>
  getEventDataObject();
export const getListEventResponse = (): gp2Model.ListEventResponse =>
  getListEventDataObject();

export const getEventCreateDataObject = (): gp2Model.EventCreateDataObject => ({
  googleId: 'google-event-id',
  title: 'Event Tittle',
  description: 'This event will be good',
  startDate: '2021-02-23T19:32:00Z',
  startDateTimeZone: 'Europe/Lisbon',
  endDate: '2021-02-23T19:32:00Z',
  endDateTimeZone: 'Europe/Lisbon',
  calendar: 'calendar-id',
  status: 'Confirmed' as EventStatus,
  tags: [],
  hidden: false,
  meetingLink: 'https://zweem.com',
  hideMeetingLink: false,
});
