import { gp2 as gp2Contentful } from '@asap-hub/contentful';
import { CalendarCreateDataObject, gp2 } from '@asap-hub/model';

export const getContentfulGraphql = () => ({
  Calendars: () => getContentfulGraphqlCalendar(),
  ProjectsCollection: () => getContentfulProjectsCollection(),
  WorkingGroupsCollection: () => getContentfulWorkingGroupsCollection(),
});

export const getContentfulGraphqlCalendar = (): NonNullable<
  NonNullable<
    gp2Contentful.FetchCalendarsQuery['calendarsCollection']
  >['items'][number]
> => ({
  sys: {
    id: 'ec3086d4-aa64-4f30-a0f7-5c5b95ffbcca',
    firstPublishedAt: '2020-09-23T16:34:26.842Z',
    publishedAt: '2021-05-14T14:48:46Z',
    publishedVersion: 42,
  },
  googleCalendarId: '3@group.calendar.google.com',
  color: '#2952A3',
  name: 'Tech 4a - iPSCs - 3D & Co-cultures',
  googleApiMetadata: {
    resourceId: 'resource-id',
    syncToken: 'sync-token',
    expirationDate: 1617196357000,
  },
  linkedFrom: {
    projectsCollection: {
      items: getContentfulProjectsCollection().items,
    },
    workingGroupsCollection: {
      items: getContentfulWorkingGroupsCollection().items,
    },
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

export const getContentfulCalendarsGraphqlResponse =
  (): gp2Contentful.FetchCalendarsQuery => ({
    calendarsCollection: {
      total: 1,
      items: [getContentfulGraphqlCalendar()],
    },
  });

export const getCalendarDataObject = (): gp2.CalendarDataObject => ({
  id: 'ec3086d4-aa64-4f30-a0f7-5c5b95ffbcca',
  color: '#2952A3',
  name: 'Tech 4a - iPSCs - 3D & Co-cultures',
  syncToken: 'sync-token',
  resourceId: 'resource-id',
  expirationDate: 1617196357000,
  googleCalendarId: '3@group.calendar.google.com',
  version: 42,
  projects: [{ id: '7', title: 'a project title' }],
  workingGroups: [{ id: '11', title: 'a working group title' }],
});

export const getCalendarCreateDataObject = (): CalendarCreateDataObject => {
  const {
    id: _,
    version: __,
    projects: ___,
    workingGroups: ____,
    ...data
  } = getCalendarDataObject();
  return data;
};

export const getListCalendarDataObject = (): gp2.ListCalendarDataObject => ({
  total: 1,
  items: [getCalendarDataObject()],
});

export const getCalendarResponse = (): gp2.CalendarResponse => ({
  id: '3@group.calendar.google.com',
  color: '#2952A3',
  name: 'Tech 4a - iPSCs - 3D & Co-cultures',
  projects: [{ id: '7', title: 'a project title' }],
  workingGroups: [{ id: '11', title: 'a working group title' }],
});

export const getListCalendarResponse = (): gp2.ListCalendarResponse => ({
  items: [getCalendarResponse()],
  total: 1,
});

export const calendarsListRestResponse = () => [
  {
    id: 'cms-calendar-id-1',
    googleCalendarId: 'calendar-id-1',
    color: '#4E5D6C',
    name: 'Kubernetes Meetups',
    resourceId: 'resource-id',
    syncToken: 'sync-token',
    expirationDate: 1614697798681,
    version: 42,
  },
  {
    id: 'cms-calendar-id-2',
    googleCalendarId: 'calendar-id-2',
    color: '#B1365F',
    name: 'Service Mesh Conferences',
    resourceId: 'resource-id-2',
    syncToken: 'sync-token-2',
    expirationDate: 1614697798681,
    version: 42,
  },
];
