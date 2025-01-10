import {
  EventsFilter,
  FETCH_REMINDERS,
  FETCH_TEAM_PROJECT_MANAGER,
  FetchRemindersQuery,
  FetchRemindersQueryVariables,
  FetchTeamProjectManagerQuery,
  FetchTeamProjectManagerQueryVariables,
  GraphQLClient,
  ResearchOutputsFilter,
  ResearchOutputVersionsFilter,
  ManuscriptsFilter,
} from '@asap-hub/contentful';
import {
  EventHappeningNowReminder,
  EventHappeningTodayReminder,
  EventNotesReminder,
  FetchRemindersOptions,
  isResearchOutputDocumentType,
  ListReminderDataObject,
  ManuscriptCreatedReminder,
  ManuscriptReminder,
  ManuscriptResubmittedReminder,
  ManuscriptStatus,
  ManuscriptStatusUpdatedReminder,
  PresentationUpdatedReminder,
  PublishMaterialReminder,
  ReminderDataObject,
  ResearchOutputDraftReminder,
  ResearchOutputInReviewReminder,
  ResearchOutputPublishedReminder,
  ResearchOutputSwitchToDraftReminder,
  ResearchOutputVersionPublishedReminder,
  Role,
  SharePresentationReminder,
  TeamRole,
  UploadPresentationReminder,
  VideoEventReminder,
} from '@asap-hub/model';
import {
  getReferenceDates,
  inLast24Hours,
  inLast7Days,
  getUserName,
} from '@asap-hub/server-common';
import { DateTime } from 'luxon';
import { isCMSAdministrator } from '@asap-hub/validation';
import { ReminderDataProvider } from '../types';
import { cleanArray } from '../../utils/clean-array';

type EventCollection = FetchRemindersQuery['eventsCollection'];
type EventItem = NonNullable<NonNullable<EventCollection>['items'][number]>;
type ManuscriptCollection = FetchRemindersQuery['manuscriptsCollection'];
type ManuscriptItem = NonNullable<
  NonNullable<ManuscriptCollection>['items'][number]
>;
type ResearchOutputCollection =
  FetchRemindersQuery['researchOutputsCollection'];
type ResearchOutputItem = NonNullable<
  NonNullable<ResearchOutputCollection>['items'][number]
>;
type ResearchOutputVersionCollection =
  FetchRemindersQuery['researchOutputVersionsCollection'];
type ResearchOutputVersionItem = NonNullable<
  NonNullable<ResearchOutputVersionCollection>['items'][number]
>;

type User = FetchRemindersQuery['users'];

export class ReminderContentfulDataProvider implements ReminderDataProvider {
  constructor(private contentfulClient: GraphQLClient) {}

  async fetchById(): Promise<null> {
    throw new Error('Method not implemented.');
  }

  async fetch(options: FetchRemindersOptions): Promise<ListReminderDataObject> {
    const { timezone, userId } = options;
    const eventFilter = getEventFilter(timezone);
    const researchOutputFilter = getResearchOutputFilter(timezone);
    const manuscriptFilter = getManuscriptFilter(timezone);
    const researchOutputVersionsFilter =
      getResearchOutputVersionsFilter(timezone);

    const {
      eventsCollection,
      researchOutputsCollection,
      users: user,
      researchOutputVersionsCollection,
      manuscriptsCollection,
    } = await this.contentfulClient.request<
      FetchRemindersQuery,
      FetchRemindersQueryVariables
    >(FETCH_REMINDERS, {
      userId,
      eventFilter,
      researchOutputFilter,
      researchOutputVersionsFilter,
      manuscriptFilter,
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

    const eventsCollectionItems = cleanArray(eventsCollection?.items);
    const researchOutputsCollectionItems = cleanArray(
      researchOutputsCollection?.items,
    );
    const researchOutputVersionCollectionItems = cleanArray(
      researchOutputVersionsCollection?.items,
    );
    const manuscriptsCollectionItems = cleanArray(manuscriptsCollection?.items);

    const publishedResearchOutputVersionReminders =
      getPublishedResearchOutputVersionRemindersFromQuery(
        researchOutputVersionCollectionItems,
        user,
        timezone,
      );

    const publishedResearchOutputReminders =
      getPublishedResearchOutputRemindersFromQuery(
        researchOutputsCollectionItems,
        user,
        timezone,
      );

    const draftResearchOutputReminders =
      getDraftResearchOutputRemindersFromQuery(
        researchOutputsCollectionItems,
        user,
        timezone,
      );

    const inReviewResearchOutputReminders =
      getInReviewResearchOutputRemindersFromQuery(
        researchOutputsCollectionItems,
        user,
      );

    const switchToDraftResearchOutputReminders =
      getSwitchToDraftResearchOutputRemindersFromQuery(
        researchOutputsCollectionItems,
        user,
        timezone,
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
        user,
        fetchTeamProjectManager,
      );

    const publishPresentationReminders = getPublishMaterialRemindersFromQuery(
      eventsEndedInLast72Hours,
      user,
    );

    const uploadPresentationReminders = getUploadPresentationRemindersFromQuery(
      eventsEndedInLast72Hours,
      user,
    );

    const eventMaterialsReminders = getEventMaterialsRemindersFromQuery(
      eventsCollectionItems,
      timezone,
    );

    const versionReminderIds = publishedResearchOutputVersionReminders.map(
      (reminder) => reminder.data.researchOutputId,
    );

    const manuscriptReminders = getManuscriptRemindersFromQuery(
      manuscriptsCollectionItems,
      user,
      userId,
      timezone,
    );

    const reminders = [
      ...publishedResearchOutputReminders.filter(
        (reminder) =>
          !versionReminderIds.includes(reminder.data.researchOutputId),
      ),
      ...draftResearchOutputReminders,
      ...inReviewResearchOutputReminders,
      ...switchToDraftResearchOutputReminders,
      ...publishedResearchOutputVersionReminders,
      ...eventHappeningNowOrTodayReminders,
      ...sharePresentationReminders,
      ...publishPresentationReminders,
      ...uploadPresentationReminders,
      ...eventMaterialsReminders,
      ...manuscriptReminders,
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

export const getSortDate = (reminder: ReminderDataObject): DateTime => {
  if (reminder.entity === 'Research Output') {
    if (reminder.type === 'Published') {
      return DateTime.fromISO(reminder.data.addedDate);
    }
    if (reminder.type === 'Switch To Draft') {
      return DateTime.fromISO(reminder.data.statusChangedAt);
    }

    return DateTime.fromISO(reminder.data.createdDate);
  }

  if (reminder.entity === 'Research Output Version') {
    return DateTime.fromISO(reminder.data.publishedAt);
  }

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

  if (reminder.type === 'Manuscript Created') {
    return DateTime.fromISO(reminder.data.publishedAt);
  }

  if (reminder.type === 'Manuscript Status Updated') {
    return DateTime.fromISO(reminder.data.updatedAt);
  }

  if (reminder.type === 'Manuscript Resubmitted') {
    return DateTime.fromISO(reminder.data.resubmittedAt);
  }

  return DateTime.fromISO(reminder.data.endDate);
};

export const getManuscriptFilter = (zone: string): ManuscriptsFilter => {
  const { last7DaysISO } = getReferenceDates(zone);
  return {
    OR: [
      { sys: { firstPublishedAt_gte: last7DaysISO } },
      { sys: { publishedAt_gte: last7DaysISO } },
      { statusUpdatedAt_gte: last7DaysISO },
    ],
  };
};

export const getResearchOutputFilter = (
  zone: string,
): ResearchOutputsFilter => {
  const { last24HoursISO } = getReferenceDates(zone);
  return {
    OR: [
      {
        AND: [
          { addedDate_gte: last24HoursISO },
          { sys: { publishedVersion_exists: true } },
        ],
      },
      {
        AND: [
          { createdDate_gte: last24HoursISO },
          { sys: { publishedVersion_exists: false } },
          { addedDate_exists: false },
          { isInReview: false },
        ],
      },
      {
        AND: [
          { sys: { publishedVersion_exists: false } },
          { addedDate_exists: false },
          { isInReview: true },
        ],
      },
      {
        AND: [
          { sys: { publishedVersion_exists: false } },
          { addedDate_exists: false },
          { statusChangedAt_gte: last24HoursISO },
          { isInReview: false },
        ],
      },
    ],
  };
};

export const getResearchOutputVersionsFilter = (
  zone: string,
): ResearchOutputVersionsFilter => {
  const { last24HoursISO } = getReferenceDates(zone);
  return { sys: { publishedAt_gte: last24HoursISO } };
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
    AND: [{ hidden: false, status_not: 'Cancelled' }],
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

  const reminderEvents = eventsEndedInLast72Hours.filter(
    (event) => eventIds?.includes(event.sys.id),
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

    const speakersTeamsIAmAProjectManager = speakerTeams?.filter(
      (value) => teamsIAmAProjectManager?.includes(value),
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

const getPublishedResearchOutputRemindersFromQuery = (
  researchOutputsCollectionItems: ResearchOutputItem[],
  user: User,
  zone: string,
): ResearchOutputPublishedReminder[] => {
  if (
    !user ||
    !user.teamsCollection?.items ||
    !researchOutputsCollectionItems.length
  ) {
    return [];
  }

  const userTeamIds = getUserTeamIds(user);
  const userWorkingGroupIds = getWorkingGroupIds(user);

  return researchOutputsCollectionItems.reduce<
    ResearchOutputPublishedReminder[]
  >((researchOutputReminders, researchOutput) => {
    const isPublished = !!researchOutput.sys.publishedAt;

    if (
      !researchOutput.title ||
      !researchOutput.documentType ||
      !isResearchOutputDocumentType(researchOutput.documentType) ||
      !isPublished ||
      !inLast24Hours(researchOutput.addedDate, zone)
    )
      return researchOutputReminders;

    const { associationName, associationType } =
      getAssociationNameAndType(researchOutput);
    const userName = getUserName(researchOutput);

    const researchOutputTeamIds = (researchOutput?.teamsCollection?.items || [])
      .filter((teamItem) => teamItem?.sys.id !== undefined)
      .map((teamItem) => teamItem?.sys.id as string);

    const researchOutputWorkingGroupId = researchOutput?.workingGroup?.sys.id;

    const isInTeam = researchOutputTeamIds.some((teamId) =>
      userTeamIds.includes(teamId),
    );

    const isInWorkingGroup = researchOutputWorkingGroupId
      ? userWorkingGroupIds.includes(researchOutputWorkingGroupId)
      : false;

    if (
      associationName &&
      associationType &&
      userName &&
      ((associationType === 'team' && isInTeam) ||
        (associationType === 'working group' && isInWorkingGroup))
    ) {
      const publishedBy = researchOutput.statusChangedBy
        ? `${researchOutput.statusChangedBy.firstName} ${researchOutput.statusChangedBy.lastName}`
        : userName;
      researchOutputReminders.push({
        id: `research-output-published-${researchOutput.sys.id}`,
        entity: 'Research Output',
        type: 'Published',
        data: {
          researchOutputId: researchOutput.sys.id,
          documentType: researchOutput.documentType,
          title: researchOutput.title,
          addedDate: researchOutput.addedDate,
          statusChangedBy: publishedBy,
          associationType,
          associationName,
        },
      });
    }

    return researchOutputReminders;
  }, []);
};

const getDraftResearchOutputRemindersFromQuery = (
  researchOutputsCollectionItems: ResearchOutputItem[],
  user: User,
  zone: string,
): ResearchOutputDraftReminder[] => {
  if (
    !user ||
    !user.teamsCollection?.items ||
    !researchOutputsCollectionItems.length
  ) {
    return [];
  }

  const userTeamIds = getUserTeamIds(user);
  const userWorkingGroupIds = getWorkingGroupIds(user);
  const isAsapStaff = user.role === 'Staff';

  return researchOutputsCollectionItems.reduce<ResearchOutputDraftReminder[]>(
    (researchOutputReminders, researchOutput) => {
      const userName = getUserName(researchOutput);
      const isPublished = !!researchOutput.sys.publishedAt;
      const isInReview = !!researchOutput.isInReview;
      const switchedToDraft = !!researchOutput.statusChangedBy;
      if (
        !researchOutput.title ||
        !researchOutput.documentType ||
        !isResearchOutputDocumentType(researchOutput.documentType) ||
        isPublished ||
        isInReview ||
        switchedToDraft ||
        !inLast24Hours(researchOutput.createdDate, zone)
      )
        return researchOutputReminders;

      const { associationName, associationType } =
        getAssociationNameAndType(researchOutput);

      const researchOutputTeamIds = (
        researchOutput?.teamsCollection?.items || []
      )
        .filter((teamItem) => teamItem?.sys.id !== undefined)
        .map((teamItem) => teamItem?.sys.id as string);

      const researchOutputWorkingGroupId = researchOutput?.workingGroup?.sys.id;

      const isInTeam = researchOutputTeamIds.some((teamId) =>
        userTeamIds.includes(teamId),
      );

      const isInWorkingGroup = researchOutputWorkingGroupId
        ? userWorkingGroupIds.includes(researchOutputWorkingGroupId)
        : false;

      if (
        associationName &&
        associationType &&
        userName &&
        ((associationType === 'team' && isInTeam) ||
          (associationType === 'working group' && isInWorkingGroup) ||
          isAsapStaff)
      ) {
        researchOutputReminders.push({
          id: `research-output-draft-${researchOutput.sys.id}`,
          entity: 'Research Output',
          type: 'Draft',
          data: {
            researchOutputId: researchOutput.sys.id,
            title: researchOutput.title,
            createdDate: researchOutput.createdDate,
            createdBy: userName,
            associationType,
            associationName,
          },
        });
      }

      return researchOutputReminders;
    },
    [],
  );
};

const getInReviewResearchOutputRemindersFromQuery = (
  researchOutputsCollectionItems: ResearchOutputItem[],
  user: User,
): ResearchOutputInReviewReminder[] => {
  if (
    !user ||
    !user.teamsCollection?.items ||
    !researchOutputsCollectionItems.length
  ) {
    return [];
  }

  const userProjectManagerTeamIds = getUserProjectManagerTeamIds(user);
  const userProjectManagerWorkingGroupIds =
    getUserProjectManagerWorkingGroupIds(user);
  const isAsapStaff = user.role === 'Staff';

  return researchOutputsCollectionItems.reduce<
    ResearchOutputInReviewReminder[]
  >((researchOutputReminders, researchOutput) => {
    const isPublished = !!researchOutput.sys.publishedAt;
    if (
      !researchOutput.title ||
      !researchOutput.documentType ||
      !isResearchOutputDocumentType(researchOutput.documentType) ||
      isPublished ||
      !researchOutput.isInReview ||
      !researchOutput.statusChangedBy
    )
      return researchOutputReminders;

    const { associationName, associationType } =
      getAssociationNameAndType(researchOutput);

    const researchOutputTeamIds = (researchOutput?.teamsCollection?.items || [])
      .filter((teamItem) => teamItem?.sys.id !== undefined)
      .map((teamItem) => teamItem?.sys.id as string);

    const researchOutputWorkingGroupId = researchOutput?.workingGroup?.sys.id;

    const isProjectManagerInTeam = researchOutputTeamIds.some((teamId) =>
      userProjectManagerTeamIds.includes(teamId),
    );

    const isProjectManagerInWorkingGroup = researchOutputWorkingGroupId
      ? userProjectManagerWorkingGroupIds.includes(researchOutputWorkingGroupId)
      : false;

    if (
      associationName &&
      associationType &&
      ((associationType === 'team' && isProjectManagerInTeam) ||
        (associationType === 'working group' &&
          isProjectManagerInWorkingGroup) ||
        isAsapStaff)
    ) {
      researchOutputReminders.push({
        id: `research-output-in-review-${researchOutput.sys.id}`,
        entity: 'Research Output',
        type: 'In Review',
        data: {
          researchOutputId: researchOutput.sys.id,
          title: researchOutput.title,
          createdDate: researchOutput.createdDate,
          documentType: researchOutput.documentType,
          statusChangedBy: `${researchOutput.statusChangedBy.firstName} ${researchOutput.statusChangedBy.lastName}`,
          associationType,
          associationName,
        },
      });
    }

    return researchOutputReminders;
  }, []);
};

const getSwitchToDraftResearchOutputRemindersFromQuery = (
  researchOutputsCollectionItems: ResearchOutputItem[],
  user: User,
  zone: string,
): ResearchOutputSwitchToDraftReminder[] => {
  if (
    !user ||
    !user.teamsCollection?.items ||
    !researchOutputsCollectionItems.length
  ) {
    return [];
  }

  const userTeamIds = getUserTeamIds(user);
  const userWorkingGroupIds = getWorkingGroupIds(user);
  const isAsapStaff = user.role === 'Staff';

  return researchOutputsCollectionItems.reduce<
    ResearchOutputSwitchToDraftReminder[]
  >((researchOutputReminders, researchOutput) => {
    const isPublished = !!researchOutput.sys.publishedAt;

    if (
      !researchOutput.title ||
      !researchOutput.documentType ||
      !isResearchOutputDocumentType(researchOutput.documentType) ||
      isPublished ||
      !inLast24Hours(researchOutput.statusChangedAt, zone) ||
      researchOutput.isInReview ||
      !researchOutput.statusChangedBy
    ) {
      return researchOutputReminders;
    }

    const researchOutputTeamIds = (researchOutput?.teamsCollection?.items || [])
      .filter((teamItem) => teamItem?.sys.id !== undefined)
      .map((teamItem) => teamItem?.sys.id as string);

    const researchOutputWorkingGroupId = researchOutput?.workingGroup?.sys.id;

    const isInTeam = researchOutputTeamIds.some((teamId) =>
      userTeamIds.includes(teamId),
    );

    const isInWorkingGroup = researchOutputWorkingGroupId
      ? userWorkingGroupIds.includes(researchOutputWorkingGroupId)
      : false;

    const { associationName, associationType } =
      getAssociationNameAndType(researchOutput);

    if (
      associationName &&
      associationType &&
      ((associationType === 'team' && isInTeam) ||
        (associationType === 'working group' && isInWorkingGroup) ||
        isAsapStaff)
    ) {
      const { firstName, lastName } = researchOutput.statusChangedBy;

      researchOutputReminders.push({
        id: `research-output-switch-to-draft-${researchOutput.sys.id}`,
        entity: 'Research Output',
        type: 'Switch To Draft',
        data: {
          researchOutputId: researchOutput.sys.id,
          title: researchOutput.title,
          statusChangedAt: researchOutput.statusChangedAt,
          documentType: researchOutput.documentType,
          statusChangedBy: `${firstName} ${lastName}`,
          associationType,
          associationName,
        },
      });
    }
    return researchOutputReminders;
  }, []);
};

const getPublishedResearchOutputVersionRemindersFromQuery = (
  items: ResearchOutputVersionItem[],
  user: User,
  zone: string,
): ResearchOutputVersionPublishedReminder[] => {
  if (!user || !user.teamsCollection?.items || !items.length) {
    return [];
  }

  items.sort((reminderA, reminderB) => {
    const aStartDate = DateTime.fromISO(reminderA.sys.publishedAt);
    const bStartDate = DateTime.fromISO(reminderB.sys.publishedAt);

    return bStartDate.diff(aStartDate).as('seconds');
  });

  const seenOutputList: string[] = [];

  const userTeamIds = getUserTeamIds(user);
  const userWorkingGroupIds = getWorkingGroupIds(user);

  return items.reduce<ResearchOutputVersionPublishedReminder[]>(
    (reminders, researchOutputVersion) => {
      const isPublished = !!researchOutputVersion.sys.publishedAt;
      const researchOutput = cleanArray(
        researchOutputVersion.linkedFrom?.researchOutputsCollection?.items,
      )[0];

      if (
        !researchOutput ||
        !researchOutput.title ||
        !researchOutput.documentType ||
        !isResearchOutputDocumentType(researchOutput.documentType) ||
        !isPublished ||
        !inLast24Hours(researchOutputVersion.sys.publishedAt, zone) ||
        seenOutputList.includes(researchOutput.sys.id)
      ) {
        return reminders;
      }

      const { associationName, associationType } =
        getAssociationNameAndType(researchOutput);

      const researchOutputTeamIds = (
        researchOutput.teamsCollection?.items || []
      )
        .filter((teamItem) => teamItem?.sys.id !== undefined)
        .map((teamItem) => teamItem?.sys.id as string);

      const researchOutputWorkingGroupId = researchOutput.workingGroup?.sys.id;

      const isInTeam = researchOutputTeamIds.some((teamId) =>
        userTeamIds.includes(teamId),
      );

      const isInWorkingGroup = researchOutputWorkingGroupId
        ? userWorkingGroupIds.includes(researchOutputWorkingGroupId)
        : false;

      if (
        associationName &&
        associationType &&
        ((associationType === 'team' && isInTeam) ||
          (associationType === 'working group' && isInWorkingGroup))
      ) {
        seenOutputList.push(researchOutput.sys.id);
        reminders.push({
          id: `research-output-version-published-${researchOutputVersion.sys.id}`,
          entity: 'Research Output Version',
          type: 'Published',
          data: {
            researchOutputId: researchOutput.sys.id,
            documentType: researchOutput.documentType,
            title: researchOutput.title,
            publishedAt: researchOutputVersion.sys.publishedAt,
            associationType,
            associationName,
          },
        });
      }

      return reminders;
    },
    [],
  );
};

type ValidManuscriptItem = ManuscriptItem & {
  teamsCollection: { items: { displayName: string }[] };
  versionsCollection: {
    items: { createdBy: { firstName: string; lastName: string } }[];
  };
};

const isValidManuscriptItem = (
  manuscript: ManuscriptItem,
): manuscript is ValidManuscriptItem =>
  !!manuscript.teamsCollection?.items &&
  manuscript.teamsCollection.items.length > 0 &&
  !!manuscript.teamsCollection.items[0]?.displayName &&
  !!manuscript.versionsCollection?.items &&
  manuscript.versionsCollection.items.length > 0 &&
  !!manuscript.versionsCollection.items[0]?.createdBy;

const getManuscriptRemindersFromQuery = (
  manuscriptsCollectionItems: ManuscriptItem[],
  user: User,
  userId: string,
  timezone: string,
): ManuscriptReminder[] => {
  if (!user || !manuscriptsCollectionItems.length) return [];

  const userProjectManagerOrLeadPITeamIds =
    getUserProjectManagerOrLeadPITeamIds(user);

  return manuscriptsCollectionItems.reduce<ManuscriptReminder[]>(
    (reminders, manuscript) => {
      if (!isValidManuscriptItem(manuscript)) return reminders;

      const manuscriptVersions = manuscript.versionsCollection.items;
      const isManuscriptResubmitted = manuscriptVersions.length > 1;
      const manuscriptFirstVersion = manuscriptVersions[0] as ManuscriptVersion;
      const manuscriptLastVersion = manuscriptVersions[
        manuscriptVersions.length - 1
      ] as ManuscriptVersion;

      if (isStaffAndMemberOfOpenScienceTeam(user)) {
        if (
          isManuscriptResubmitted &&
          inLast7Days(manuscript.sys.publishedAt, timezone) &&
          isReminderForDifferentUser(manuscriptLastVersion, userId)
        ) {
          reminders.push(createManuscriptResubmittedReminder(manuscript));
        } else if (
          inLast7Days(manuscript.sys.firstPublishedAt, timezone) &&
          isReminderForDifferentUser(manuscriptFirstVersion, userId)
        ) {
          reminders.push(createManuscriptCreatedReminder(manuscript));
        }

        return reminders;
      }

      if (
        isManuscriptResubmitted &&
        inLast7Days(manuscript.sys.publishedAt, timezone) &&
        (isManuscriptAuthor(manuscriptLastVersion, userId) ||
          isManuscriptProjectManagerOrLeadPI(
            manuscript,
            userProjectManagerOrLeadPITeamIds,
          )) &&
        isReminderForDifferentUser(manuscriptLastVersion, userId)
      ) {
        reminders.push(createManuscriptResubmittedReminder(manuscript));
      } else if (
        inLast7Days(manuscript.sys.firstPublishedAt, timezone) &&
        isReminderForDifferentUser(manuscriptFirstVersion, userId) &&
        (isManuscriptAuthor(manuscriptFirstVersion, userId) ||
          isManuscriptProjectManagerOrLeadPI(
            manuscript,
            userProjectManagerOrLeadPITeamIds,
          ))
      ) {
        reminders.push(createManuscriptCreatedReminder(manuscript));
      }

      if (
        inLast7Days(manuscript.statusUpdatedAt, timezone) &&
        isManuscriptStatusUpdatedByAnotherUser(manuscript, userId) &&
        (isManuscriptAuthor(manuscriptFirstVersion, userId) ||
          isManuscriptProjectManagerOrLeadPI(
            manuscript,
            userProjectManagerOrLeadPITeamIds,
          ))
      ) {
        reminders.push(createManuscriptStatusUpdatedReminder(manuscript));
      }

      return reminders;
    },
    [],
  );
};

type ManuscriptVersion = NonNullable<
  NonNullable<ManuscriptItem['versionsCollection']>['items'][0]
>;

const isReminderForDifferentUser = (
  manuscriptVersion: ManuscriptVersion,
  userId: string,
): boolean => manuscriptVersion.createdBy?.sys.id !== userId;

const isManuscriptStatusUpdatedByAnotherUser = (
  manuscript: ManuscriptItem,
  userId: string,
): boolean => manuscript.statusUpdatedBy?.sys.id !== userId;

export const getTeamNames = (manuscript: ValidManuscriptItem): string => {
  const teamNames = manuscript.teamsCollection.items
    .map((team) => team?.displayName)
    .filter((teamName): teamName is string => teamName !== undefined)
    .map((teamName) => `Team ${teamName}`);

  if (teamNames.length === 1 && teamNames[0]) return teamNames[0];
  if (teamNames.length === 2) return teamNames.join(' and ');

  return `${teamNames.slice(0, -1).join(', ')} and ${teamNames.slice(-1)}`;
};

const createManuscriptCreatedReminder = (
  manuscript: ValidManuscriptItem,
): ManuscriptCreatedReminder => ({
  id: `manuscript-created-${manuscript.sys.id}`,
  entity: 'Manuscript',
  type: 'Manuscript Created',
  data: {
    manuscriptId: manuscript.sys.id,
    title: manuscript.title || '',
    status: manuscript.status as ManuscriptStatus,
    teams: getTeamNames(manuscript),
    createdBy: `${manuscript.versionsCollection.items[0]?.createdBy?.firstName} ${manuscript.versionsCollection.items[0]?.createdBy?.lastName}`,
    publishedAt: manuscript.sys.firstPublishedAt,
  },
});

const createManuscriptResubmittedReminder = (
  manuscript: ValidManuscriptItem,
): ManuscriptResubmittedReminder => {
  const manuscriptVersions = manuscript.versionsCollection.items || [];

  const lastVersion = manuscriptVersions[manuscriptVersions.length - 1];

  return {
    id: `manuscript-resubmitted-${manuscript.sys.id}`,
    entity: 'Manuscript',
    type: 'Manuscript Resubmitted',
    data: {
      manuscriptId: manuscript.sys.id,
      title: manuscript.title || '',
      teams: getTeamNames(manuscript),
      resubmittedBy: `${lastVersion?.createdBy?.firstName} ${lastVersion?.createdBy?.lastName}`,
      resubmittedAt: manuscript.sys.publishedAt,
    },
  };
};

const createManuscriptStatusUpdatedReminder = (
  manuscript: ValidManuscriptItem,
): ManuscriptStatusUpdatedReminder => ({
  id: `manuscript-status-updated-${manuscript.sys.id}`,
  entity: 'Manuscript',
  type: 'Manuscript Status Updated',
  data: {
    manuscriptId: manuscript.sys.id,
    title: manuscript.title || '',
    status: manuscript.status as ManuscriptStatus,
    previousStatus: manuscript.previousStatus as ManuscriptStatus,
    updatedBy: `${manuscript.statusUpdatedBy?.firstName} ${manuscript.statusUpdatedBy?.lastName}`,
    updatedAt: manuscript.statusUpdatedAt,
  },
});

const isManuscriptAuthor = (
  manuscriptVersion: ManuscriptVersion,
  userId: string,
): boolean => {
  if (!manuscriptVersion) return false;
  const isFirstAuthor = manuscriptVersion?.firstAuthorsCollection?.items.some(
    (author) => author?.__typename === 'Users' && author?.sys?.id === userId,
  );

  const isAdditionalAuthor =
    !!manuscriptVersion?.additionalAuthorsCollection?.items.some(
      (author) => author?.__typename === 'Users' && author?.sys?.id === userId,
    );

  const isCorrespondingAuthor =
    !!manuscriptVersion?.correspondingAuthorCollection?.items.some(
      (author) => author?.__typename === 'Users' && author?.sys?.id === userId,
    );

  return isFirstAuthor || isAdditionalAuthor || isCorrespondingAuthor;
};

const isManuscriptProjectManagerOrLeadPI = (
  manuscript: ManuscriptItem,
  userProjectManagerOrLeadPITeamIds: string[],
): boolean =>
  !!manuscript?.teamsCollection?.items.some(
    (teamItem) =>
      teamItem?.sys.id &&
      userProjectManagerOrLeadPITeamIds.includes(teamItem.sys.id),
  );

const isStaffAndMemberOfOpenScienceTeam = (user: NonNullable<User>): boolean =>
  user.role === 'Staff' && !!user.openScienceTeamMember;

const getUserTeamIds = (user: NonNullable<User>): string[] => {
  if (!user.teamsCollection) return [];

  return user.teamsCollection.items
    .filter((teamItem) => teamItem?.team?.sys.id !== undefined)
    .map((teamItem) => teamItem?.team?.sys.id as string);
};

const getUserProjectManagerTeamIds = (user: NonNullable<User>): string[] => {
  if (!user.teamsCollection) return [];

  return user.teamsCollection.items
    .filter((teamItem) => teamItem?.role === 'Project Manager')
    .map((teamItem) => teamItem?.team?.sys.id as string);
};

const getUserProjectManagerOrLeadPITeamIds = (
  user: NonNullable<User>,
): string[] => {
  if (!user.teamsCollection) return [];

  return user.teamsCollection.items
    .filter(
      (teamItem) =>
        teamItem?.role === 'Project Manager' ||
        teamItem?.role === 'Lead PI (Core Leadership)',
    )
    .map((teamItem) => teamItem?.team?.sys.id as string);
};

type UserLinkedFrom = NonNullable<NonNullable<User>['linkedFrom']>;
type WorkingGroupMembersCollection =
  UserLinkedFrom['workingGroupMembersCollection'];
type WorkingGroupLeadersCollection =
  UserLinkedFrom['workingGroupLeadersCollection'];

const getIdsFromWorkingGroupCollection = (
  collection: WorkingGroupMembersCollection | WorkingGroupLeadersCollection,
): string[] =>
  collection?.items
    ? collection.items
        .filter(
          (item) =>
            item?.linkedFrom?.workingGroupsCollection?.items[0]?.sys.id !==
            undefined,
        )
        .map(
          (item) =>
            item?.linkedFrom?.workingGroupsCollection?.items[0]?.sys
              .id as string,
        )
    : [];

const getWorkingGroupIds = (user: User): string[] => {
  if (!user || !user.linkedFrom) return [];

  const workingGroupMembers = getIdsFromWorkingGroupCollection(
    user.linkedFrom?.workingGroupMembersCollection,
  );

  const workingGroupLeaders = getIdsFromWorkingGroupCollection(
    user.linkedFrom.workingGroupLeadersCollection,
  );

  return workingGroupMembers?.concat(workingGroupLeaders);
};

const getUserProjectManagerWorkingGroupIds = (user: User): string[] => {
  if (!user || !user.linkedFrom) return [];

  return user.linkedFrom.workingGroupLeadersCollection?.items
    ? user.linkedFrom.workingGroupLeadersCollection?.items
        .filter((item) => item?.role === 'Project Manager')
        .map(
          (item) =>
            item?.linkedFrom?.workingGroupsCollection?.items[0]?.sys
              .id as string,
        )
    : [];
};

const getAssociationNameAndType = (
  researchOutput: ResearchOutputItem,
): {
  associationType: 'team' | 'working group' | null;
  associationName: string | null;
} => {
  if (researchOutput.workingGroup && researchOutput.workingGroup.title) {
    return {
      associationType: 'working group',
      associationName: researchOutput.workingGroup.title,
    };
  }

  if (
    researchOutput.teamsCollection &&
    researchOutput.teamsCollection.items[0]?.displayName
  ) {
    return {
      associationType: 'team',
      associationName: researchOutput.teamsCollection.items[0].displayName,
    };
  }

  return {
    associationType: null,
    associationName: null,
  };
};
