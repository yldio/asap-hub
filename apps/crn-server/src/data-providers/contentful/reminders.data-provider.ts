import {
  EventsFilter,
  FETCH_REMINDERS,
  FETCH_TEAM_PROJECT_MANAGER,
  FetchRemindersQuery,
  FetchRemindersQueryVariables,
  FetchTeamProjectManagerQuery,
  FetchTeamProjectManagerQueryVariables,
  GraphQLClient,
} from '@asap-hub/contentful';
import {
  EventHappeningNowReminder,
  EventHappeningTodayReminder,
  EventNotesReminder,
  FetchRemindersOptions,
  ListReminderDataObject,
  PresentationUpdatedReminder,
  PublishMaterialReminder,
  ReminderDataObject,
  ResearchOutputDraftReminder,
  ResearchOutputInReviewReminder,
  ResearchOutputPublishedReminder,
  Role,
  SharePresentationReminder,
  TeamRole,
  UploadPresentationReminder,
  VideoEventReminder,
} from '@asap-hub/model';
import { DateTime } from 'luxon';
import { isCMSAdministrator } from '@asap-hub/validation';
import { ReminderDataProvider } from '../types';

type EventCollection = FetchRemindersQuery['eventsCollection'];
type EventItem = NonNullable<NonNullable<EventCollection>['items'][number]>;

type User = FetchRemindersQuery['users'];

export class ReminderContentfulDataProvider implements ReminderDataProvider {
  constructor(private contentfulClient: GraphQLClient) {}

  async fetchById(): Promise<null> {
    throw new Error('Method not implemented.');
  }

  async fetch(options: FetchRemindersOptions): Promise<ListReminderDataObject> {
    const { timezone, userId } = options;
    const eventFilter = getEventFilter(timezone);

    const { eventsCollection, users } = await this.contentfulClient.request<
      FetchRemindersQuery,
      FetchRemindersQueryVariables
    >(FETCH_REMINDERS, {
      userId,
      eventFilter,
    });

    const fetchTeamProjectManager = async (
      teamId: string,
    ): Promise<FetchTeamProjectManagerQuery['teamMembershipCollection']> => {
      const { teamMembershipCollection } = await this.contentfulClient.request<
        FetchTeamProjectManagerQuery,
        FetchTeamProjectManagerQueryVariables
      >(FETCH_TEAM_PROJECT_MANAGER, { id: teamId });

      return teamMembershipCollection;
    };

    const eventsCollectionItems = (eventsCollection?.items || []).filter(
      (x): x is EventItem => x !== null,
    );

    const eventHappeningNowOrTodayReminders =
      getEventHappeningNowOrTodayRemindersFromQuery(
        eventsCollectionItems,
        timezone,
      );

    const eventsEndedInLast72Hours = eventsCollectionItems.filter((event) =>
      hasEventEndedInLast72hours(event, timezone),
    );

    const sharePresentationReminders =
      await getSharePresentationRemindersFromQuery(
        eventsEndedInLast72Hours,
        users,
        fetchTeamProjectManager,
      );

    const publishPresentationReminders = getPublishMaterialRemindersFromQuery(
      eventsEndedInLast72Hours,
      users,
    );

    const uploadPresentationReminders = getUploadPresentationRemindersFromQuery(
      eventsEndedInLast72Hours,
      users,
    );

    const eventMaterialsReminders = getEventMaterialsRemindersFromQuery(
      eventsCollectionItems,
      timezone,
    );

    const reminders = [
      ...eventHappeningNowOrTodayReminders,
      ...sharePresentationReminders,
      ...publishPresentationReminders,
      ...uploadPresentationReminders,
      ...eventMaterialsReminders,
    ];

    const sortedReminders = reminders.sort((reminderA, reminderB) => {
      const aStartDate = getSortDate(reminderA);
      const bStartDate = getSortDate(reminderB);

      return bStartDate.diff(aStartDate).as('seconds');
    });

    return {
      total: sortedReminders.length,
      items: sortedReminders,
    };
  }
}

const getSortDate = (
  reminder: Exclude<
    ReminderDataObject,
    // TODO: add these types back when implementing RO reminders
    | ResearchOutputPublishedReminder
    | ResearchOutputDraftReminder
    | ResearchOutputInReviewReminder
  >,
): DateTime => {
  if (reminder.type === 'Happening Today') {
    return DateTime.fromISO(reminder.data.startDate);
  }

  if (reminder.type === 'Video Updated') {
    return DateTime.fromISO(reminder.data.videoRecordingUpdatedAt);
  }

  if (reminder.type === 'Presentation Updated') {
    return DateTime.fromISO(reminder.data.presentationUpdatedAt);
  }

  if (reminder.type === 'Notes Updated') {
    return DateTime.fromISO(reminder.data.notesUpdatedAt);
  }

  return DateTime.fromISO(reminder.data.endDate);
};

export const getReferenceDates = (zone: string) => {
  const lastMidnightISO = DateTime.fromObject({
    zone,
  })
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    .toUTC();

  const todayMidnightISO = DateTime.fromObject({
    zone,
  })
    .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    .plus({ day: 1 })
    .toUTC();

  const last24HoursISO = DateTime.fromObject({
    zone,
  })
    .minus({ hours: 24 })
    .toUTC();

  const last72HoursISO = DateTime.fromObject({
    zone,
  })
    .minus({ hours: 72 })
    .toUTC();

  const now = DateTime.fromObject({
    zone,
  }).toUTC();

  return {
    lastMidnightISO,
    todayMidnightISO,
    last24HoursISO,
    last72HoursISO,
    now,
  };
};

export const getEventFilter = (zone: string): EventsFilter => {
  const {
    lastMidnightISO,
    todayMidnightISO,
    last24HoursISO,
    last72HoursISO,
    now,
  } = getReferenceDates(zone);
  return {
    OR: [
      { videoRecordingUpdatedAt_gte: last24HoursISO },
      { presentationUpdatedAt_gte: last24HoursISO },
      { notesUpdatedAt_gte: last24HoursISO },
      {
        AND: [
          { startDate_gte: lastMidnightISO },
          { startDate_lte: todayMidnightISO },
        ],
      },
      {
        AND: [{ endDate_gte: last72HoursISO }, { endDate_lte: now }],
      },
    ],
  };
};

const convertEventDate = (date: string, zone: string) =>
  DateTime.fromISO(date, { zone }).toUTC();

const hasEventEndedInLast72hours = (event: EventItem, zone: string) => {
  const eventEndDate = convertEventDate(event.endDate, zone);
  const { last72HoursISO, now } = getReferenceDates(zone);

  const eventHasEnded = eventEndDate < now;
  const endedInLast72Hours = eventEndDate >= last72HoursISO;

  return eventHasEnded && endedInLast72Hours;
};

const inLast24Hours = (date: string, zone: string) => {
  const convertedDate = convertEventDate(date, zone);
  const { last24HoursISO, now } = getReferenceDates(zone);

  return convertedDate >= last24HoursISO && convertedDate <= now;
};

const getEventHappeningNowOrTodayRemindersFromQuery = (
  eventsCollection: EventItem[],
  zone: string,
): (EventHappeningTodayReminder | EventHappeningNowReminder)[] => {
  const { lastMidnightISO, now, todayMidnightISO } = getReferenceDates(zone);

  const eventReminders = eventsCollection.reduce<
    (EventHappeningTodayReminder | EventHappeningNowReminder)[]
  >((events, event) => {
    const startDate = convertEventDate(event.startDate, zone);
    const endDate = convertEventDate(event.endDate, zone);

    if (startDate < now && now < endDate) {
      return [
        ...events,
        {
          id: `event-happening-now-${event.sys.id}`,
          entity: 'Event',
          type: 'Happening Now',
          data: {
            eventId: event.sys.id,
            title: event.title || '',
            startDate: event.startDate,
            endDate: event.endDate,
          },
        },
      ];
    }

    if (
      startDate > lastMidnightISO &&
      startDate < todayMidnightISO &&
      now < endDate
    ) {
      return [
        ...events,
        {
          id: `event-happening-today-${event.sys.id}`,
          entity: 'Event',
          type: 'Happening Today',
          data: {
            eventId: event.sys.id,
            title: event.title || '',
            startDate: event.startDate,
          },
        },
      ];
    }

    return events;
  }, []);

  return eventReminders;
};

const getSharePresentationRemindersFromQuery = async (
  eventsEndedInLast72Hours: EventItem[],
  users: User,
  fetchTeamProjectManager: (
    teamId: string,
  ) => Promise<FetchTeamProjectManagerQuery['teamMembershipCollection']>,
): Promise<SharePresentationReminder[]> => {
  const sharePresentationReminders: SharePresentationReminder[] = [];

  const eventsIAmASpeaker = users?.linkedFrom?.eventSpeakersCollection?.items
    .map((event) => ({
      eventId: event?.linkedFrom?.eventsCollection?.items[0]?.sys.id,
      teamId: event?.team?.sys.id,
    }))
    .filter((eventData) => !!eventData.eventId && !!eventData.teamId);

  const eventIds = eventsIAmASpeaker?.map((e) => e.eventId);

  const reminderEvents = eventsEndedInLast72Hours.filter((event) =>
    eventIds?.includes(event.sys.id),
  );

  for (let i = 0; i < reminderEvents.length; i += 1) {
    const event = reminderEvents[i];
    if (event) {
      const teamId = eventsIAmASpeaker?.filter(
        (e) => e.eventId === event.sys.id,
      )[0]?.teamId;

      const teamRole = users?.teamsCollection?.items.find(
        (t) => t?.team?.sys.id === teamId,
      )?.role;

      const isAdmin =
        isCMSAdministrator(users?.role as Role, teamRole as TeamRole) ||
        teamRole === 'Project Manager';

      if (!isAdmin && teamId) {
        const teamMembershipCollection = await fetchTeamProjectManager(teamId);
        const firstProjectManager = teamMembershipCollection?.items.find(
          (t) => t?.linkedFrom?.usersCollection?.total !== 0,
        );
        const projectManagerId =
          firstProjectManager?.linkedFrom?.usersCollection?.items[0]?.sys.id;

        sharePresentationReminders.push({
          id: `share-presentation-${event.sys.id}`,
          entity: 'Event',
          type: 'Share Presentation',
          data: {
            pmId: projectManagerId,
            eventId: event.sys.id,
            title: event.title || '',
            endDate: event.endDate,
          },
        });
      }
    }
  }
  return sharePresentationReminders;
};

const getPublishMaterialRemindersFromQuery = (
  eventsEndedInLast72Hours: EventItem[],
  users: User,
): PublishMaterialReminder[] =>
  isCMSAdministrator(users?.role as Role)
    ? eventsEndedInLast72Hours.map((event) => ({
        id: `publish-material-${event.sys.id}`,
        entity: 'Event',
        type: 'Publish Material',
        data: {
          eventId: event.sys.id,
          title: event.title || '',
          endDate: event.endDate,
        },
      }))
    : [];

const getUploadPresentationRemindersFromQuery = (
  eventsEndedInLast72Hours: EventItem[],
  user: User,
): UploadPresentationReminder[] => {
  const uploadPresentationReminders: UploadPresentationReminder[] = [];

  if (isCMSAdministrator(user?.role as Role))
    return uploadPresentationReminders;

  const teamsIAmAProjectManager = user?.teamsCollection?.items
    .map((item) => {
      if (item?.role === 'Project Manager') {
        return item.team?.sys.id;
      }
      return null;
    })
    .filter(Boolean);

  eventsEndedInLast72Hours.forEach((event) => {
    const speakerTeams = event.speakersCollection?.items.map(
      (speaker) => speaker?.team?.sys.id,
    );

    const speakersTeamsIAmAProjectManager = speakerTeams?.filter((value) =>
      teamsIAmAProjectManager?.includes(value),
    );

    if (speakersTeamsIAmAProjectManager?.length) {
      uploadPresentationReminders.push({
        id: `upload-presentation-${event.sys.id}`,
        entity: 'Event',
        type: 'Upload Presentation',
        data: {
          eventId: event.sys.id,
          title: event.title || '',
          endDate: event.endDate,
        },
      });
    }
  });

  return uploadPresentationReminders;
};

const getEventMaterialsRemindersFromQuery = (
  eventsCollection: EventItem[],
  zone: string,
): (
  | VideoEventReminder
  | PresentationUpdatedReminder
  | EventNotesReminder
)[] => {
  const eventReminders = eventsCollection.reduce<
    (VideoEventReminder | PresentationUpdatedReminder | EventNotesReminder)[]
  >((events, event) => {
    const {
      sys: { id: eventId },
      title,
      videoRecordingUpdatedAt,
      presentationUpdatedAt,
      notesUpdatedAt,
    } = event;

    if (inLast24Hours(videoRecordingUpdatedAt, zone)) {
      events.push({
        id: `video-event-updated-${eventId}`,
        entity: 'Event',
        type: 'Video Updated',
        data: { eventId, title: title || '', videoRecordingUpdatedAt },
      });
    }

    if (inLast24Hours(presentationUpdatedAt, zone)) {
      events.push({
        id: `presentation-event-updated-${eventId}`,
        entity: 'Event',
        type: 'Presentation Updated',
        data: { eventId, title: title || '', presentationUpdatedAt },
      });
    }

    if (inLast24Hours(notesUpdatedAt, zone)) {
      events.push({
        id: `notes-event-updated-${eventId}`,
        entity: 'Event',
        type: 'Notes Updated',
        data: { eventId, title: title || '', notesUpdatedAt },
      });
    }

    return events;
  }, []);

  return eventReminders;
};
