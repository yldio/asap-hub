/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  addLocaleToFields,
  createLink,
  Environment,
  EventsFilter,
  EventsOrder,
  FetchEventByIdQuery,
  FetchEventByIdQueryVariables,
  FetchEventsByExternalAuthorIdQuery,
  FetchEventsByExternalAuthorIdQueryVariables,
  FetchEventsByTeamIdQuery,
  FetchEventsByTeamIdQueryVariables,
  FetchEventsByUserIdQuery,
  FetchEventsByUserIdQueryVariables,
  FetchEventsQuery,
  FetchEventsQueryVariables,
  FetchInterestGroupCalendarQuery,
  FetchInterestGroupCalendarQueryVariables,
  FetchWorkingGroupCalendarQuery,
  FetchWorkingGroupCalendarQueryVariables,
  FETCH_EVENTS,
  FETCH_EVENTS_BY_EXTERNAL_AUTHOR_ID,
  FETCH_EVENTS_BY_TEAM_ID,
  FETCH_EVENTS_BY_USER_ID,
  FETCH_EVENT_BY_ID,
  FETCH_INTEREST_GROUP_CALENDAR,
  FETCH_WORKING_GROUP_CALENDAR,
  GraphQLClient,
  patchAndPublish,
  pollContentfulGql,
  RichTextFromQuery,
} from '@asap-hub/contentful';
import {
  EventCreateDataObject,
  EventDataObject,
  EventDataProvider,
  EventSpeaker,
  EventSpeakerExternalUserData,
  EventSpeakerUserData,
  EventUpdateDataObject,
  FetchEventsOptions,
  isEventStatus,
  ListEventDataObject,
} from '@asap-hub/model';
import { DateTime } from 'luxon';

import { parseCalendarDataObjectToResponse } from '../../controllers/calendar.controller';
import {
  getContentfulEventMaterial,
  MeetingMaterial,
  parseContentfulGraphqlCalendarPartialToDataObject,
} from '../transformers';

export type EventItem = NonNullable<
  NonNullable<FetchEventsQuery['eventsCollection']>['items'][number]
>;

type WorkingGroupItem = NonNullable<
  NonNullable<
    NonNullable<
      NonNullable<EventItem['calendar']>['linkedFrom']
    >['workingGroupsCollection']
  >['items'][number]
>;

type InterestGroupItem = NonNullable<
  NonNullable<
    NonNullable<
      NonNullable<EventItem['calendar']>['linkedFrom']
    >['interestGroupsCollection']
  >['items'][number]
>;

export class EventContentfulDataProvider implements EventDataProvider {
  constructor(
    private contentfulClient: GraphQLClient,
    private getRestClient: () => Promise<Environment>,
  ) {}

  private fetchEventById(id: string) {
    return this.contentfulClient.request<
      FetchEventByIdQuery,
      FetchEventByIdQueryVariables
    >(FETCH_EVENT_BY_ID, { id });
  }

  async fetchById(id: string): Promise<EventDataObject | null> {
    const { events } = await this.fetchEventById(id);

    if (!events) {
      return null;
    }

    return parseGraphQLEvent(events);
  }

  async fetch(options: FetchEventsOptions): Promise<ListEventDataObject> {
    const {
      take = 10,
      skip = 0,
      before,
      after,
      search,
      sortBy,
      sortOrder,
      filter,
    } = options;

    if (filter?.userId) {
      const { users } = await this.contentfulClient.request<
        FetchEventsByUserIdQuery,
        FetchEventsByUserIdQueryVariables
      >(FETCH_EVENTS_BY_USER_ID, {
        limit: take,
        skip,
        id: filter.userId,
      });

      const eventsCollection =
        users?.linkedFrom?.eventSpeakersCollection?.items[0]?.linkedFrom
          ?.eventsCollection;

      return getEventDataObject(eventsCollection);
    }

    if (filter?.externalAuthorId) {
      const { externalAuthors } = await this.contentfulClient.request<
        FetchEventsByExternalAuthorIdQuery,
        FetchEventsByExternalAuthorIdQueryVariables
      >(FETCH_EVENTS_BY_EXTERNAL_AUTHOR_ID, {
        limit: take,
        skip,
        id: filter.externalAuthorId,
      });

      const eventsCollection =
        externalAuthors?.linkedFrom?.eventSpeakersCollection?.items[0]
          ?.linkedFrom?.eventsCollection;

      return getEventDataObject(eventsCollection);
    }

    if (filter?.teamId) {
      const { teams } = await this.contentfulClient.request<
        FetchEventsByTeamIdQuery,
        FetchEventsByTeamIdQueryVariables
      >(FETCH_EVENTS_BY_TEAM_ID, {
        limit: take,
        skip,
        id: filter.teamId,
      });

      const eventsCollection =
        teams?.linkedFrom?.eventSpeakersCollection?.items[0]?.linkedFrom
          ?.eventsCollection;

      return getEventDataObject(eventsCollection);
    }

    const getOrderFilter = () => {
      if (sortBy === 'startDate') {
        if (sortOrder === 'asc') return EventsOrder.StartDateAsc;
        if (sortOrder === 'desc') return EventsOrder.StartDateDesc;
      }

      if (sortBy === 'endDate') {
        if (sortOrder === 'asc') return EventsOrder.EndDateAsc;
        if (sortOrder === 'desc') return EventsOrder.EndDateDesc;
      }

      return undefined;
    };

    const searchFilter = (search || '')
      .split(' ')
      .reduce(
        (
          acc: ({ title_contains: string } | { tags_contains_all: string[] })[],
          word,
        ) => {
          acc.push({ title_contains: word });
          acc.push({ tags_contains_all: [word] });
          return acc;
        },
        [],
      );

    let calendarFilter: EventsFilter = {};
    if (filter?.workingGroupId) {
      const { workingGroups } = await this.contentfulClient.request<
        FetchWorkingGroupCalendarQuery,
        FetchWorkingGroupCalendarQueryVariables
      >(FETCH_WORKING_GROUP_CALENDAR, {
        id: filter.workingGroupId,
      });

      if (workingGroups?.calendars) {
        calendarFilter = {
          calendar: { sys: { id: workingGroups.calendars.sys.id } },
        };
      }
    }

    if (filter?.groupId) {
      const { interestGroups } = await this.contentfulClient.request<
        FetchInterestGroupCalendarQuery,
        FetchInterestGroupCalendarQueryVariables
      >(FETCH_INTEREST_GROUP_CALENDAR, {
        id: filter.groupId,
      });

      if (interestGroups?.calendar) {
        calendarFilter = {
          calendar: { sys: { id: interestGroups.calendar.sys.id } },
        };
      }
    }
    const { eventsCollection } = await this.contentfulClient.request<
      FetchEventsQuery,
      FetchEventsQueryVariables
    >(FETCH_EVENTS, {
      limit: take ?? null,
      skip: skip ?? null,
      order: getOrderFilter(),
      where: {
        ...(filter?.hidden !== true ? { hidden_not: true } : {}),
        ...(filter?.googleId ? { googleId_contains: filter.googleId } : {}),
        ...(after ? { endDate_gt: after } : {}),
        ...(before ? { endDate_lt: before } : {}),
        ...(search ? { OR: searchFilter } : {}),
        ...calendarFilter,
      },
    });

    return getEventDataObject(eventsCollection);
  }

  async create(create: EventCreateDataObject): Promise<string> {
    const environment = await this.getRestClient();

    const { calendar, ...otherCreateFields } = create;
    const newEntry = await environment.createEntry('events', {
      fields: {
        ...addLocaleToFields(otherCreateFields),
        calendar: {
          'en-US': createLink(calendar),
        },
      },
    });

    await newEntry.publish();
    return newEntry.sys.id;
  }

  async update(id: string, update: EventUpdateDataObject): Promise<void> {
    const environment = await this.getRestClient();
    const event = await environment.getEntry(id);
    const { calendar, ...otherUpdateFields } = update;

    const updateWithCalendarLink = {
      ...(calendar ? { calendar: createLink(calendar) } : {}),
      ...otherUpdateFields,
    };

    const result = await patchAndPublish(event, updateWithCalendarLink);

    const fetchEventById = () => this.fetchEventById(id);

    await pollContentfulGql<FetchEventByIdQuery>(
      result.sys.publishedVersion || Infinity,
      fetchEventById,
      'events',
    );
  }
}

type SpeakerItem = NonNullable<
  NonNullable<EventItem['speakersCollection']>['items'][number]
>;

type UserSpeaker = Extract<SpeakerItem['user'], { __typename: 'Users' }>;

type ExternalAuthorSpeaker = Extract<
  SpeakerItem['user'],
  { __typename: 'ExternalAuthors' }
>;

export const parseEventSpeakerUser = (
  user: UserSpeaker,
): EventSpeakerUserData => ({
  id: user.sys.id,
  alumniSinceDate: user.alumniSinceDate ?? undefined,
  firstName: user.firstName ?? undefined,
  lastName: user.lastName ?? undefined,
  displayName: `${user.firstName} ${user.lastName}`,
  avatarUrl: user.avatar?.url ?? undefined,
});

export const parseEventSpeakerExternalUser = (
  user: ExternalAuthorSpeaker,
): EventSpeakerExternalUserData => ({
  name: user?.name || '',
  orcid: user?.orcid || '',
});

export const parseGraphQLSpeakers = (speakers: SpeakerItem[]): EventSpeaker[] =>
  (speakers || []).reduce((speakerList: EventSpeaker[], { team, user }) => {
    if (user?.__typename === 'ExternalAuthors') {
      speakerList.push({
        externalUser: parseEventSpeakerExternalUser(user),
      });
      return speakerList;
    }

    if (!team) {
      return speakerList;
    }

    if (!user) {
      speakerList.push({
        team: {
          id: team.sys.id,
          displayName: team.displayName ?? '',
          inactiveSince: team.inactiveSince ?? undefined,
        },
      });
      return speakerList;
    }

    if (user.__typename === 'Users') {
      const role =
        user?.teamsCollection?.items
          ?.filter((t) => t?.sys.id === team.sys.id)
          .filter((s) => s?.role)[0]?.role || undefined;

      if (!role || user.onboarded !== true) {
        speakerList.push({
          team: {
            id: team.sys.id,
            displayName: team.displayName ?? '',
            inactiveSince: team.inactiveSince ?? undefined,
          },
        });
        return speakerList;
      }

      speakerList.push({
        team: {
          id: team.sys.id,
          displayName: team.displayName ?? '',
          inactiveSince: team.inactiveSince ?? undefined,
        },
        user: parseEventSpeakerUser(user),
        role,
      });
    }
    return speakerList;
  }, []);

export const parseGraphQLEvent = (item: EventItem): EventDataObject => {
  if (!item.calendar) {
    throw new Error(`Event (${item.sys.id}) doesn't have a calendar"`);
  }

  if (item.status && !isEventStatus(item.status)) {
    throw new Error(`Invalid event (${item.sys.id}) status "${item.status}"`);
  }

  const calendar = parseCalendarDataObjectToResponse({
    ...parseContentfulGraphqlCalendarPartialToDataObject(item.calendar),
    groups: [],
    workingGroups: [],
  });

  const startDate = DateTime.fromISO(item.startDate);
  const endDate = DateTime.fromISO(item.endDate);
  const isStale = endDate.diffNow('days').get('days') < -14; // 14 days have passed after the event

  const {
    sys: { id, publishedAt },
    title,
    description,
    startDateTimeZone,
    endDateTimeZone,
    notesPermanentlyUnavailable,
    notes,
    notesUpdatedAt,
    videoRecordingPermanentlyUnavailable,
    videoRecording,
    videoRecordingUpdatedAt,
    presentationPermanentlyUnavailable,
    presentation,
    presentationUpdatedAt,
    meetingMaterialsPermanentlyUnavailable,
    meetingMaterials,
    meetingLink,
    thumbnail,
    hideMeetingLink,
    status,
    hidden,
    tags,
    speakersCollection,
  } = item;

  const group =
    item.calendar.linkedFrom?.interestGroupsCollection?.items
      .filter((x): x is InterestGroupItem => x !== null)
      .map((ig) => ({
        id: ig.sys.id,
        name: ig.name || '',
        active: !!ig.active,
        tools: {
          slack: ig.slack || undefined,
          googleDrive: ig.googleDrive ?? undefined,
        },
      }))[0] || undefined;

  const workingGroup =
    item.calendar.linkedFrom?.workingGroupsCollection?.items
      .filter((x): x is WorkingGroupItem => x !== null)
      .map((wg) => ({
        id: wg.sys.id,
        title: wg.title || '',
      }))[0] || undefined;

  const speakersItems = (speakersCollection?.items as SpeakerItem[]) ?? [];
  return {
    id,
    title: title!,
    description: description || '',
    startDate: startDate.toUTC().toString(),
    startDateTimeZone: startDateTimeZone!,
    startDateTimestamp: startDate.toSeconds(),
    endDate: endDate.toUTC().toString(),
    endDateTimeZone: endDateTimeZone!,
    endDateTimestamp: endDate.toSeconds(),
    lastModifiedDate: publishedAt,
    notes: getContentfulEventMaterial<string, undefined>(
      notes as RichTextFromQuery,
      !!notesPermanentlyUnavailable,
      isStale,
      undefined,
    ),
    ...(notesUpdatedAt && {
      notesUpdatedAt,
    }),
    videoRecording: getContentfulEventMaterial<string, undefined>(
      videoRecording as RichTextFromQuery,
      !!videoRecordingPermanentlyUnavailable,
      isStale,
      undefined,
    ),
    ...(videoRecordingUpdatedAt && {
      videoRecordingUpdatedAt,
    }),
    presentation: getContentfulEventMaterial<string, undefined>(
      presentation as RichTextFromQuery,
      !!presentationPermanentlyUnavailable,
      isStale,
      undefined,
    ),
    ...(presentationUpdatedAt && {
      presentationUpdatedAt,
    }),
    meetingMaterials: getContentfulEventMaterial<MeetingMaterial, []>(
      meetingMaterials,
      !!meetingMaterialsPermanentlyUnavailable,
      isStale,
      [],
    ),
    thumbnail: thumbnail?.url ?? undefined,
    meetingLink: meetingLink || undefined,
    hideMeetingLink: hideMeetingLink || false,
    status,
    hidden: hidden || false,
    tags: tags ?? [],

    calendar,
    speakers: parseGraphQLSpeakers(speakersItems),
    workingGroup,
    group,
  };
};

const getEventDataObject = (
  eventsCollection: FetchEventsQuery['eventsCollection'],
) => {
  if (!eventsCollection?.items) {
    return {
      total: 0,
      items: [],
    };
  }

  return {
    total: eventsCollection.total,
    items: eventsCollection.items
      .filter((x): x is EventItem => x !== null)
      .map(parseGraphQLEvent),
  };
};
