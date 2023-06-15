/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  addLocaleToFields,
  Environment,
  GraphQLClient,
  patchAndPublish,
  pollContentfulGql,
  RichTextFromQuery,
  gp2,
  createLink,
} from '@asap-hub/contentful';
import { EventStatus, gp2 as gp2Model } from '@asap-hub/model';
import { DateTime } from 'luxon';

import {
  getContentfulEventMaterial,
  MeetingMaterial,
  parseContentfulGraphqlCalendarPartialToDataObject,
} from '../../entities';
import { parseCalendarDataObjectToResponse } from '../../controllers/calendar.controller';
import { parseContentfulWorkingGroupsProjects } from './utils';

export type EventItem = NonNullable<
  NonNullable<gp2.FetchEventsQuery['eventsCollection']>['items'][number]
>;

export class EventContentfulDataProvider implements gp2Model.EventDataProvider {
  constructor(
    private contentfulClient: GraphQLClient,
    private getRestClient: () => Promise<Environment>,
  ) {}

  private fetchEventById(id: string) {
    return this.contentfulClient.request<
      gp2.FetchEventByIdQuery,
      gp2.FetchEventByIdQueryVariables
    >(gp2.FETCH_EVENT_BY_ID, { id });
  }

  async fetchById(id: string): Promise<gp2Model.EventDataObject | null> {
    const { events } = await this.fetchEventById(id);

    if (!events) {
      return null;
    }

    return parseGraphQLEvent(events);
  }

  async fetch(
    options: gp2Model.FetchEventsOptions,
  ): Promise<gp2Model.ListEventDataObject> {
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

    let calendarId;

    if (filter?.workingGroupId) {
      const { workingGroups } = await this.contentfulClient.request<
        gp2.FetchWorkingGroupCalendarQuery,
        gp2.FetchWorkingGroupCalendarQueryVariables
      >(gp2.FETCH_WORKING_GROUP_CALENDAR, { id: filter.workingGroupId });

      calendarId = workingGroups?.calendar?.sys.id;
    }

    if (filter?.projectId) {
      const { projects } = await this.contentfulClient.request<
        gp2.FetchProjectCalendarQuery,
        gp2.FetchProjectCalendarQueryVariables
      >(gp2.FETCH_PROJECT_CALENDAR, { id: filter.projectId });

      calendarId = projects?.calendar?.sys.id;
    }

    if ((filter?.projectId || filter?.workingGroupId) && !calendarId) {
      return {
        total: 0,
        items: [],
      };
    }

    if (filter?.userId) {
      const { users } = await this.contentfulClient.request<
        gp2.FetchEventsByUserIdQuery,
        gp2.FetchEventsByUserIdQueryVariables
      >(gp2.FETCH_EVENTS_BY_USER_ID, {
        limit: take,
        skip,
        id: filter.userId,
      });

      const eventsCollection =
        users?.linkedFrom?.eventSpeakersCollection?.items[0]?.linkedFrom
          ?.eventsCollection;

      const eventsForUser = getEventDataObject(eventsCollection);
      if (before) {
        const previousEventsForUser = eventsForUser.items.filter(
          (item) => DateTime.fromISO(item.endDate) < DateTime.now(),
        );
        return {
          items: previousEventsForUser,
          total: previousEventsForUser.length,
        };
      }
      if (after) {
        const upcomingEventsForUser = eventsForUser.items.filter(
          (item) => DateTime.fromISO(item.endDate) >= DateTime.now(),
        );
        return {
          items: upcomingEventsForUser,
          total: upcomingEventsForUser.length,
        };
      }
      return getEventDataObject(eventsCollection);
    }

    if (filter?.externalUserId) {
      const { externalUsers } = await this.contentfulClient.request<
        gp2.FetchEventsByExternalUserIdQuery,
        gp2.FetchEventsByExternalUserIdQueryVariables
      >(gp2.FETCH_EVENTS_BY_EXTERNAL_USER_ID, {
        limit: take,
        skip,
        id: filter.externalUserId,
      });

      const eventsCollection =
        externalUsers?.linkedFrom?.eventSpeakersCollection?.items[0]?.linkedFrom
          ?.eventsCollection;

      return getEventDataObject(eventsCollection);
    }

    const getOrderFilter = () => {
      if (sortBy === 'startDate') {
        if (sortOrder === 'asc') return gp2.EventsOrder.StartDateAsc;
        if (sortOrder === 'desc') return gp2.EventsOrder.StartDateDesc;
      }

      if (sortBy === 'endDate') {
        if (sortOrder === 'asc') return gp2.EventsOrder.EndDateAsc;
        if (sortOrder === 'desc') return gp2.EventsOrder.EndDateDesc;
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

    const { eventsCollection } = await this.contentfulClient.request<
      gp2.FetchEventsQuery,
      gp2.FetchEventsQueryVariables
    >(gp2.FETCH_EVENTS, {
      limit: take ?? null,
      skip: skip ?? null,
      order: getOrderFilter(),
      where: {
        ...(calendarId ? { calendar: { sys: { id: calendarId } } } : {}),
        ...(filter?.hidden !== true ? { hidden_not: true } : {}),
        ...(filter?.googleId ? { googleId_contains: filter.googleId } : {}),
        ...(after ? { endDate_gt: after } : {}),
        ...(before ? { endDate_lt: before } : {}),
        ...(search ? { OR: searchFilter } : {}),
      },
    });

    return getEventDataObject(eventsCollection);
  }

  async create(create: gp2Model.EventCreateDataObject): Promise<string> {
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

  async update(
    id: string,
    update: gp2Model.EventUpdateDataObject,
  ): Promise<void> {
    const environment = await this.getRestClient();
    const event = await environment.getEntry(id);
    const { calendar, ...otherUpdateFields } = update;

    const updateWithCalendarLink = {
      ...(calendar ? { calendar: createLink(calendar) } : {}),
      ...otherUpdateFields,
    };

    const result = await patchAndPublish(event, updateWithCalendarLink);

    const fetchEventById = () => this.fetchEventById(id);

    await pollContentfulGql<gp2.FetchEventByIdQuery>(
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

type ExternalUserSpeaker = Extract<
  SpeakerItem['user'],
  { __typename: 'ExternalUsers' }
>;

export const parseEventSpeakerUser = (
  user: UserSpeaker,
): gp2Model.EventSpeakerUser => ({
  id: user.sys.id,
  firstName: user.firstName ?? undefined,
  lastName: user.lastName ?? undefined,
  displayName: `${user.firstName} ${user.lastName}`,
  avatarUrl: user.avatar?.url ?? undefined,
});

export const parseEventSpeakerExternalUser = (
  user: ExternalUserSpeaker,
): gp2Model.EventSpeakerExternalUser => ({
  name: user?.name || '',
  orcid: user?.orcid || '',
});

export const parseGraphQLSpeakers = (
  speakers: SpeakerItem[],
): gp2Model.EventSpeaker[] =>
  (speakers || []).reduce((speakerList: gp2Model.EventSpeaker[], speaker) => {
    if (!speaker) {
      return speakerList;
    }
    const { title, user } = speaker;
    if (user?.__typename === 'ExternalUsers') {
      speakerList.push({
        speaker: parseEventSpeakerExternalUser(user),
        topic: title || undefined,
      });
      return speakerList;
    }

    if (!user) {
      speakerList.push({
        speaker: undefined,
        topic: title || undefined,
      });
      return speakerList;
    }

    if (user.onboarded !== true) {
      return speakerList;
    }

    speakerList.push({
      speaker: parseEventSpeakerUser(user),
      topic: title || undefined,
    });
    return speakerList;
  }, []);

export const parseGraphQLEvent = (
  item: EventItem,
): gp2Model.EventDataObject | null => {
  if (!item.calendar) {
    return null;
  }

  const calendar = parseCalendarDataObjectToResponse({
    ...parseContentfulGraphqlCalendarPartialToDataObject(item.calendar),
    ...parseContentfulWorkingGroupsProjects(item.calendar),
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
    videoRecordingPermanentlyUnavailable,
    videoRecording,
    presentationPermanentlyUnavailable,
    presentation,
    meetingMaterialsPermanentlyUnavailable,
    meetingMaterials,
    meetingLink,
    thumbnail,
    hideMeetingLink,
    status,
    tags,
    speakersCollection,
  } = item;

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
    videoRecording: getContentfulEventMaterial<string, undefined>(
      videoRecording as RichTextFromQuery,
      !!videoRecordingPermanentlyUnavailable,
      isStale,
      undefined,
    ),
    presentation: getContentfulEventMaterial<string, undefined>(
      presentation as RichTextFromQuery,
      !!presentationPermanentlyUnavailable,
      isStale,
      undefined,
    ),
    meetingMaterials: getContentfulEventMaterial<MeetingMaterial[], []>(
      meetingMaterials,
      !!meetingMaterialsPermanentlyUnavailable,
      isStale,
      [],
    ),
    thumbnail: thumbnail?.url ?? undefined,
    meetingLink: meetingLink || undefined,
    hideMeetingLink: hideMeetingLink || false,
    status: status as EventStatus,
    tags: (tags as string[] | undefined | null) ?? [],
    calendar,
    speakers: parseGraphQLSpeakers(speakersItems),
    workingGroup: calendar.workingGroups?.[0],
    project: calendar.projects?.[0],
  };
};

const getEventDataObject = (
  eventsCollection: gp2.FetchEventsQuery['eventsCollection'],
) => {
  if (!eventsCollection?.items) {
    return {
      total: 0,
      items: [],
    };
  }

  const items = eventsCollection.items
    .filter((item: unknown): item is EventItem => item !== null)
    .map(parseGraphQLEvent)
    .filter((item): item is gp2Model.EventDataObject => item !== null);

  return {
    total: items.length,
    items,
  };
};
