import {
  CalendarCreateDataObject,
  DraftResearchOutputCreateDataObject,
  EventCreateDataObject,
  EventHappeningNowReminder,
  EventHappeningTodayReminder,
  EventStatus,
  FetchRemindersOptions,
  PublishedResearchOutputCreateDataObject,
  PublishMaterialReminder,
  ResearchOutputDraftReminder,
  ResearchOutputInReviewReminder,
  ResearchOutputPublishedReminder,
  SharePresentationReminder,
  TeamRole,
  UploadPresentationReminder,
  UserCreateDataObject,
} from '@asap-hub/model';
import {
  InputCalendar,
  InputUser,
  InputWorkingGroup,
  RestCalendar,
  RestEvent,
  RestResearchOutput,
  RestTeam,
  RestUser,
  SquidexGraphql,
  SquidexRest,
} from '@asap-hub/squidex';
import { Chance } from 'chance';
import { appName, baseUrl } from '../../../src/config';
import { CalendarSquidexDataProvider } from '../../../src/data-providers/calendars.data-provider';
import { EventSquidexDataProvider } from '../../../src/data-providers/event.data-provider';
import { ReminderSquidexDataProvider } from '../../../src/data-providers/reminders.data-provider';
import { ResearchOutputSquidexDataProvider } from '../../../src/data-providers/research-outputs.data-provider';
import { TeamSquidexDataProvider } from '../../../src/data-providers/teams.data-provider';
import { UserSquidexDataProvider } from '../../../src/data-providers/users.data-provider';
import { getAuthToken } from '../../../src/utils/auth';
import { getCalendarCreateDataObject } from '../../fixtures/calendars.fixtures';
import { getResearchOutputCreateDataObject } from '../../fixtures/research-output.fixtures';
import { getTeamCreateDataObject } from '../../fixtures/teams.fixtures';
import { getUserCreateDataObject } from '../../fixtures/users.fixtures';
import { createRandomOrcid } from '../../helpers/users';
import { teardownHelper } from '../../helpers/teardown';
import { retryable } from '../../helpers/retryable';

jest.setTimeout(120000);

describe('Reminders', () => {
  const chance = new Chance();
  const squidexGraphqlClient = new SquidexGraphql(getAuthToken, {
    appName,
    baseUrl,
  });
  const researchOutputRestClient = new SquidexRest<RestResearchOutput>(
    getAuthToken,
    'research-outputs',
    { appName, baseUrl },
  );

  const workingGroupRestClient = new SquidexRest<InputWorkingGroup>(
    getAuthToken,
    'working-groups',
    { appName, baseUrl },
  );
  const teamRestClient = new SquidexRest<RestTeam>(getAuthToken, 'teams', {
    appName,
    baseUrl,
  });
  const userRestClient = new SquidexRest<RestUser, InputUser>(
    getAuthToken,
    'users',
    {
      appName,
      baseUrl,
    },
  );
  const userDataProvider = new UserSquidexDataProvider(
    squidexGraphqlClient,
    userRestClient,
  );
  const reminderDataProvider = new ReminderSquidexDataProvider(
    squidexGraphqlClient,
  );
  const teamDataProvider = new TeamSquidexDataProvider(
    squidexGraphqlClient,
    teamRestClient,
  );
  const eventRestClient = new SquidexRest<RestEvent>(getAuthToken, 'events', {
    appName,
    baseUrl,
  });
  const calendarRestClient = new SquidexRest<RestCalendar, InputCalendar>(
    getAuthToken,
    'calendars',
    { appName, baseUrl },
  );
  const calendarDataProvider = new CalendarSquidexDataProvider(
    calendarRestClient,
    squidexGraphqlClient,
  );
  const researchOutputDataProvider = new ResearchOutputSquidexDataProvider(
    squidexGraphqlClient,
    researchOutputRestClient,
  );
  const eventDataProvider = new EventSquidexDataProvider(
    eventRestClient,
    squidexGraphqlClient,
  );

  const teardown = teardownHelper([
    userRestClient,
    teamRestClient,
    researchOutputRestClient,
    eventRestClient,
    calendarRestClient,
    workingGroupRestClient,
  ]);

  afterEach(async () => {
    await teardown();
  });

  describe('Research Output Published Reminder', () => {
    let creatorId: string;
    let teamId: string;
    let fetchRemindersOptions: FetchRemindersOptions;

    beforeEach(async () => {
      const teamCreateDataObject = getTeamCreateDataObject();
      teamCreateDataObject.applicationNumber = chance.name();
      teamId = await teamDataProvider.create(teamCreateDataObject);

      const userCreateDataObject2 = getUserInput(teamId);
      creatorId = await userDataProvider.create(userCreateDataObject2);

      const userCreateDataObject = getUserInput(teamId);
      const userId1 = await userDataProvider.create(userCreateDataObject);

      const timezone = 'Europe/London';
      fetchRemindersOptions = { userId: userId1, timezone };
    });

    test('Should see the reminder when the research output was created recently and the user is associated with the team that owns it', async () => {
      const researchOutputInput = getResearchOutputInput(teamId, creatorId);

      const researchOutputId = await researchOutputDataProvider.create(
        researchOutputInput,
      );

      const expectedReminder: ResearchOutputPublishedReminder = {
        id: `research-output-published-${researchOutputId}`,
        entity: 'Research Output',
        type: 'Published',
        data: {
          researchOutputId,
          documentType: researchOutputInput.documentType,
          title: researchOutputInput.title,
          addedDate: researchOutputInput.addedDate,
        },
      };
      await retryable(async () => {
        const reminders = await reminderDataProvider.fetch(
          fetchRemindersOptions,
        );
        expect(reminders).toEqual({
          total: 1,
          items: [expectedReminder],
        });
      });
    });

    test('Should not see the reminder when the research output was created recently and the status is changed to Draft in squidex', async () => {
      const researchOutputInput = getResearchOutputInput(teamId, creatorId);

      const researchOutputId = await researchOutputDataProvider.create(
        researchOutputInput,
      );

      await researchOutputRestClient.publish(researchOutputId, 'Draft');

      await retryable(async () => {
        const reminders = await reminderDataProvider.fetch(
          fetchRemindersOptions,
        );
        expect(reminders).toEqual({
          total: 0,
          items: [],
        });
      });
    });

    test('Should not see the reminder when the research output was created recently but the user is NOT associated with the team that owns it', async () => {
      const teamCreateDataObject = getTeamCreateDataObject();
      teamCreateDataObject.applicationNumber = chance.name();
      const anotherTeamId = await teamDataProvider.create(teamCreateDataObject);

      const researchOutputInput = getResearchOutputInput(teamId, creatorId);
      researchOutputInput.teamIds = [anotherTeamId];

      await researchOutputDataProvider.create(researchOutputInput);

      await retryable(async () => {
        const reminders = await reminderDataProvider.fetch(
          fetchRemindersOptions,
        );
        expect(reminders).toEqual({
          total: 0,
          items: [],
        });
      });
    });

    test('Should not see the reminder when the research output was created over 24 hours ago and the user is associated with the team that owns it', async () => {
      const researchOutputInput = getResearchOutputInput(teamId, creatorId);
      const timeOver24hago = new Date(
        new Date().getTime() - (24 * 60 * 60 * 1000 + 1000),
      );
      researchOutputInput.addedDate = timeOver24hago.toISOString();

      await researchOutputDataProvider.create(researchOutputInput);

      await retryable(async () => {
        const reminders = await reminderDataProvider.fetch(
          fetchRemindersOptions,
        );
        expect(reminders).toEqual({
          total: 0,
          items: [],
        });
      });
    });

    test('Should sort the research-output-published reminders by added-date in descending order (newest first)', async () => {
      const time3HoursAgo = new Date(new Date().getTime() - 3 * 60 * 60 * 1000);
      const researchOutputInput1 = getResearchOutputInput(teamId, creatorId);
      researchOutputInput1.addedDate = time3HoursAgo.toISOString();

      const time1HourAgo = new Date(new Date().getTime() - 1 * 60 * 60 * 1000);
      const researchOutputInput2 = getResearchOutputInput(teamId, creatorId);
      researchOutputInput2.addedDate = time1HourAgo.toISOString();

      const time2HoursAgo = new Date(new Date().getTime() - 2 * 60 * 60 * 1000);
      const researchOutputInput3 = getResearchOutputInput(teamId, creatorId);
      researchOutputInput3.addedDate = time2HoursAgo.toISOString();

      const researchOutputId1 = await researchOutputDataProvider.create(
        researchOutputInput1,
      );
      const researchOutputId2 = await researchOutputDataProvider.create(
        researchOutputInput2,
      );
      const researchOutputId3 = await researchOutputDataProvider.create(
        researchOutputInput3,
      );

      await retryable(async () => {
        const reminders = await reminderDataProvider.fetch(
          fetchRemindersOptions,
        );
        const reminderIds = reminders.items.map(
          (item) =>
            (item as ResearchOutputPublishedReminder).data.researchOutputId,
        );

        expect(reminderIds).toEqual([
          researchOutputId2,
          researchOutputId3,
          researchOutputId1,
        ]);
      });
    });
  });

  describe('Research Output Draft Reminder', () => {
    let creatorId: string;
    let notCreatorId: string;
    let creatorUsername: string;
    let teamId: string;
    let fetchRemindersOptions: FetchRemindersOptions;

    beforeEach(async () => {
      const teamCreateDataObject = getTeamCreateDataObject();
      teamCreateDataObject.applicationNumber = chance.name();
      teamId = await teamDataProvider.create(teamCreateDataObject);

      const userCreateDataObject2 = getUserInput(teamId);

      creatorId = await userDataProvider.create(userCreateDataObject2);
      let creator = await userDataProvider.fetchById(creatorId);
      creatorUsername = creator?.firstName + ' ' + creator?.lastName;

      const userCreateDataObject = getUserInput(teamId);
      const userId1 = await userDataProvider.create(userCreateDataObject);
      notCreatorId = userId1;

      const timezone = 'Europe/London';
      fetchRemindersOptions = { userId: userId1, timezone };
    });

    test('Should see the reminder when the research output was created recently and the user is associated with the team that owns it', async () => {
      const researchOutputInput = {
        ...getResearchOutputInputDraft(teamId, creatorId),
        addedDate: undefined,
      };
      const researchOutputId = await researchOutputDataProvider.create(
        researchOutputInput,
        { publish: false },
      );

      await retryable(async () => {
        const researchOutput = await researchOutputDataProvider.fetchById(
          researchOutputId,
        );

        const expectedReminder: ResearchOutputDraftReminder = {
          id: `research-output-draft-${researchOutputId}`,
          entity: 'Research Output',
          type: 'Draft',
          data: {
            researchOutputId,
            associationName: getTeamCreateDataObject().displayName,
            associationType: 'team',
            createdBy: creatorUsername,
            title: researchOutputInput.title,
            addedDate: researchOutput?.created.slice(0, -5) + 'Z' || '',
          },
        };
        const reminders = await reminderDataProvider.fetch(
          fetchRemindersOptions,
        );
        expect(reminders).toEqual({
          total: 1,
          items: [expectedReminder],
        });
      });
    });

    test('Should see the reminder when the research output was created recently and the user is associated with the working group that owns it', async () => {
      const wgData = createWorkingGroup(creatorId);

      const workingGroup = await workingGroupRestClient.create(
        wgData as any,
        true,
      );
      const workingGroupId = workingGroup.id;

      const researchOutputInput = {
        ...getResearchOutputInputDraft(teamId, creatorId, workingGroupId),
        addedDate: undefined,
      };

      const researchOutputId = await researchOutputDataProvider.create(
        researchOutputInput,
        { publish: false },
      );

      await retryable(async () => {
        const researchOutput = await researchOutputDataProvider.fetchById(
          researchOutputId,
        );

        const expectedReminder: ResearchOutputDraftReminder = {
          id: `research-output-draft-${researchOutputId}`,
          entity: 'Research Output',
          type: 'Draft',
          data: {
            researchOutputId,
            associationName: workingGroup.data.title.iv,
            associationType: 'working group',
            createdBy: creatorUsername,
            title: researchOutputInput.title,
            addedDate: researchOutput?.created.slice(0, -5) + 'Z' || '',
          },
        };
        const reminders = await reminderDataProvider.fetch({
          ...fetchRemindersOptions,
          userId: creatorId,
        });
        expect(reminders).toEqual({
          total: 1,
          items: [expectedReminder],
        });
      });
    });

    test('Should not see the reminder when the research output was created recently and the user is not associated with the working group that owns it', async () => {
      const wgData = createWorkingGroup(creatorId);

      const workingGroup = await workingGroupRestClient.create(
        wgData as any,
        true,
      );
      const workingGroupId = workingGroup.id;

      const researchOutputInput = getResearchOutputInputDraft(
        teamId,
        creatorId,
        workingGroupId,
      );

      await researchOutputDataProvider.create(researchOutputInput, {
        publish: false,
      });

      await retryable(async () => {
        const reminders = await reminderDataProvider.fetch({
          ...fetchRemindersOptions,
          userId: notCreatorId,
        });
        expect(reminders).toEqual({
          total: 0,
          items: [],
        });
      });
    });

    test('Should not see the reminder when the research output was created recently but the user is NOT associated with the team that owns it', async () => {
      const teamCreateDataObject = getTeamCreateDataObject();
      teamCreateDataObject.applicationNumber = chance.name();
      const anotherTeamId = await teamDataProvider.create(teamCreateDataObject);

      const researchOutputInput = getResearchOutputInputDraft(
        teamId,
        creatorId,
      );
      researchOutputInput.teamIds = [anotherTeamId];

      await researchOutputDataProvider.create(researchOutputInput, {
        publish: false,
      });

      await retryable(async () => {
        const reminders = await reminderDataProvider.fetch(
          fetchRemindersOptions,
        );
        expect(reminders).toEqual({
          total: 0,
          items: [],
        });
      });
    });

    test('Should see the reminder when the research output was created recently but the user is NOT associated with the team that owns it but is ASAP staff', async () => {
      const teamCreateDataObject = getTeamCreateDataObject();
      teamCreateDataObject.applicationNumber = chance.name();
      const anotherTeamId = await teamDataProvider.create(teamCreateDataObject);

      const researchOutputInput = {
        ...getResearchOutputInputDraft(teamId, creatorId),
        addedDate: undefined,
      };
      researchOutputInput.teamIds = [anotherTeamId];

      await userDataProvider.update(creatorId, {
        role: 'Staff',
      });

      const researchOutputId = await researchOutputDataProvider.create(
        researchOutputInput,
        { publish: false },
      );

      await retryable(async () => {
        const researchOutput = await researchOutputDataProvider.fetchById(
          researchOutputId,
        );

        const expectedReminder: ResearchOutputDraftReminder = {
          id: `research-output-draft-${researchOutputId}`,
          entity: 'Research Output',
          type: 'Draft',
          data: {
            researchOutputId,
            associationName: getTeamCreateDataObject().displayName,
            associationType: 'team',
            createdBy: creatorUsername,
            title: researchOutputInput.title,
            addedDate: researchOutput?.created.slice(0, -5) + 'Z' || '',
          },
        };
        const reminders = await reminderDataProvider.fetch({
          ...fetchRemindersOptions,
          userId: creatorId,
        });
        expect(reminders).toEqual({
          total: 1,
          items: [expectedReminder],
        });
      });
    });

    test('Should not see the reminder when the research output was created over 24 hours ago and the user is associated with the team that owns it', async () => {
      jest.useFakeTimers();

      const researchOutputInput = getResearchOutputInputDraft(
        teamId,
        creatorId,
      );
      await researchOutputDataProvider.create(researchOutputInput, {
        publish: false,
      });

      const timeAfter24h = new Date(
        new Date().getTime() + (24 * 60 * 60 * 1000 + 1000),
      );
      jest.setSystemTime(timeAfter24h);
      await retryable(async () => {
        const reminders = await reminderDataProvider.fetch(
          fetchRemindersOptions,
        );
        expect(reminders).toEqual({
          total: 0,
          items: [],
        });
      });
      jest.useRealTimers();
    });
  });

  describe('Research Output In Review Reminder', () => {
    let creatorId: string;
    let projectManager: string;
    let creatorUsername: string;
    let teamId: string;
    let fetchRemindersOptions: FetchRemindersOptions;

    beforeEach(async () => {
      const teamCreateDataObject = getTeamCreateDataObject();
      teamCreateDataObject.applicationNumber = chance.name();
      teamId = await teamDataProvider.create(teamCreateDataObject);

      const userCreateDataObject2 = getUserInput(teamId);

      creatorId = await userDataProvider.create(userCreateDataObject2);
      let creator = await userDataProvider.fetchById(creatorId);
      creatorUsername = creator?.firstName + ' ' + creator?.lastName;

      const userCreateDataObject = getUserInput(teamId, 'Project Manager');
      const userId1 = await userDataProvider.create(userCreateDataObject);
      projectManager = userId1;

      const timezone = 'Europe/London';
      fetchRemindersOptions = { userId: userId1, timezone };
    });

    test.only('Should see the reminder when the user is PM within the team that owns the RO', async () => {
      const researchOutputInput = {
        ...getResearchOutputInputDraft(teamId, creatorId),
        addedDate: undefined,
      };
      const researchOutputId = await researchOutputDataProvider.create(
        researchOutputInput,
        { publish: false },
      );

      await researchOutputDataProvider.update(researchOutputId, {
        reviewRequestedById: creatorId,
        documentType: researchOutputInput.documentType,
        sharingStatus: researchOutputInput.sharingStatus,
        title: researchOutputInput.title,
        authors: researchOutputInput.authors,
        environmentIds: researchOutputInput.environmentIds,
        labIds: researchOutputInput.labIds,
        methodIds: researchOutputInput.methodIds,
        organismIds: researchOutputInput.organismIds,
        keywordIds: researchOutputInput.keywordIds,
        teamIds: researchOutputInput.teamIds,
        updatedBy: creatorId,
        workingGroups: researchOutputInput.workingGroups || [],
      });

      await retryable(async () => {
        const researchOutput = await researchOutputDataProvider.fetchById(
          researchOutputId,
        );

        const expectedReminder: ResearchOutputInReviewReminder = {
          id: `research-output-in-review-${researchOutputId}`,
          entity: 'Research Output',
          type: 'In Review',
          data: {
            researchOutputId,
            associationName: getTeamCreateDataObject().displayName,
            associationType: 'team',
            title: researchOutputInput.title,
            addedDate: researchOutput?.created.slice(0, -5) + 'Z' || '',
            documentType: researchOutputInput.documentType,
            reviewRequestedBy: creatorUsername,
          },
        };
        const reminders = await reminderDataProvider.fetch(
          fetchRemindersOptions,
        );
        expect(reminders).toEqual({
          total: 1,
          items: [expectedReminder],
        });
      });
    });

    test('Should see the reminder when the user is PM within the working group that owns the RO', async () => {
      const wgData = createWorkingGroup(projectManager);

      const workingGroup = await workingGroupRestClient.create(
        wgData as any,
        true,
      );
      const workingGroupId = workingGroup.id;

      const researchOutputInput = {
        ...getResearchOutputInputDraft(teamId, creatorId, workingGroupId),
        addedDate: undefined,
      };

      const researchOutputId = await researchOutputDataProvider.create(
        researchOutputInput,
        { publish: false },
      );

      await researchOutputDataProvider.update(researchOutputId, {
        reviewRequestedById: creatorId,
        documentType: researchOutputInput.documentType,
        sharingStatus: researchOutputInput.sharingStatus,
        title: researchOutputInput.title,
        authors: researchOutputInput.authors,
        environmentIds: researchOutputInput.environmentIds,
        labIds: researchOutputInput.labIds,
        methodIds: researchOutputInput.methodIds,
        organismIds: researchOutputInput.organismIds,
        keywordIds: researchOutputInput.keywordIds,
        teamIds: researchOutputInput.teamIds,
        updatedBy: creatorId,
        workingGroups: researchOutputInput.workingGroups || [],
      });

      await retryable(async () => {
        const researchOutput = await researchOutputDataProvider.fetchById(
          researchOutputId,
        );

        const expectedReminder: ResearchOutputInReviewReminder = {
          id: `research-output-in-review-${researchOutputId}`,
          entity: 'Research Output',
          type: 'In Review',
          data: {
            researchOutputId,
            associationName: workingGroup.data.title.iv,
            associationType: 'working group',
            title: researchOutputInput.title,
            addedDate: researchOutput?.created.slice(0, -5) + 'Z' || '',
            documentType: researchOutputInput.documentType,
            reviewRequestedBy: creatorUsername,
          },
        };
        const reminders = await reminderDataProvider.fetch(
          fetchRemindersOptions,
        );

        expect(reminders).toEqual({
          total: 1,
          items: [expectedReminder],
        });
      });
    });

    test('Should not see the reminder when the user is not PM within the working group that owns the RO', async () => {
      const wgData = createWorkingGroup(creatorId);

      const workingGroup = await workingGroupRestClient.create(
        wgData as any,
        true,
      );
      const workingGroupId = workingGroup.id;

      const researchOutputInput = getResearchOutputInputDraft(
        teamId,
        creatorId,
        workingGroupId,
      );

      const researchOutputId = await researchOutputDataProvider.create(
        researchOutputInput,
        {
          publish: false,
        },
      );

      await researchOutputDataProvider.update(researchOutputId, {
        reviewRequestedById: creatorId,
        documentType: researchOutputInput.documentType,
        sharingStatus: researchOutputInput.sharingStatus,
        title: researchOutputInput.title,
        authors: researchOutputInput.authors,
        environmentIds: researchOutputInput.environmentIds,
        labIds: researchOutputInput.labIds,
        methodIds: researchOutputInput.methodIds,
        organismIds: researchOutputInput.organismIds,
        keywordIds: researchOutputInput.keywordIds,
        teamIds: researchOutputInput.teamIds,
        updatedBy: creatorId,
        workingGroups: researchOutputInput.workingGroups || [],
      });

      await retryable(async () => {
        const reminders = await reminderDataProvider.fetch({
          ...fetchRemindersOptions,
          userId: projectManager,
        });
        expect(reminders).toEqual({
          total: 0,
          items: [],
        });
      });
    });

    test('Should not see the reminder when the user is not PM within the team that owns the RO', async () => {
      const teamCreateDataObject = getTeamCreateDataObject();
      teamCreateDataObject.applicationNumber = chance.name();
      const anotherTeamId = await teamDataProvider.create(teamCreateDataObject);

      const researchOutputInput = getResearchOutputInputDraft(
        teamId,
        creatorId,
      );
      researchOutputInput.teamIds = [anotherTeamId];

      const researchOutputId = await researchOutputDataProvider.create(
        researchOutputInput,
        {
          publish: false,
        },
      );

      await researchOutputDataProvider.update(researchOutputId, {
        reviewRequestedById: creatorId,
        documentType: researchOutputInput.documentType,
        sharingStatus: researchOutputInput.sharingStatus,
        title: researchOutputInput.title,
        authors: researchOutputInput.authors,
        environmentIds: researchOutputInput.environmentIds,
        labIds: researchOutputInput.labIds,
        methodIds: researchOutputInput.methodIds,
        organismIds: researchOutputInput.organismIds,
        keywordIds: researchOutputInput.keywordIds,
        teamIds: researchOutputInput.teamIds,
        updatedBy: creatorId,
        workingGroups: researchOutputInput.workingGroups || [],
      });

      await retryable(async () => {
        const reminders = await reminderDataProvider.fetch(
          fetchRemindersOptions,
        );
        expect(reminders).toEqual({
          total: 0,
          items: [],
        });
      });
    });

    test.only('Should see the reminder when the user is ASAP staff', async () => {
      const teamCreateDataObject = getTeamCreateDataObject();
      teamCreateDataObject.applicationNumber = chance.name();
      const anotherTeamId = await teamDataProvider.create(teamCreateDataObject);

      const researchOutputInput = {
        ...getResearchOutputInputDraft(teamId, creatorId),
        addedDate: undefined,
      };
      researchOutputInput.teamIds = [anotherTeamId];

      await userDataProvider.update(creatorId, {
        role: 'Staff',
      });

      const researchOutputId = await researchOutputDataProvider.create(
        researchOutputInput,
        { publish: false },
      );

      await researchOutputDataProvider.update(researchOutputId, {
        reviewRequestedById: creatorId,
        documentType: researchOutputInput.documentType,
        sharingStatus: researchOutputInput.sharingStatus,
        title: researchOutputInput.title,
        authors: researchOutputInput.authors,
        environmentIds: researchOutputInput.environmentIds,
        labIds: researchOutputInput.labIds,
        methodIds: researchOutputInput.methodIds,
        organismIds: researchOutputInput.organismIds,
        keywordIds: researchOutputInput.keywordIds,
        teamIds: researchOutputInput.teamIds,
        updatedBy: creatorId,
        workingGroups: researchOutputInput.workingGroups || [],
      });

      await retryable(async () => {
        const researchOutput = await researchOutputDataProvider.fetchById(
          researchOutputId,
        );

        const expectedReminder: ResearchOutputInReviewReminder = {
          id: `research-output-in-review-${researchOutputId}`,
          entity: 'Research Output',
          type: 'In Review',
          data: {
            researchOutputId,
            associationName: getTeamCreateDataObject().displayName,
            associationType: 'team',
            title: researchOutputInput.title,
            addedDate: researchOutput?.created.slice(0, -5) + 'Z' || '',
            documentType: researchOutputInput.documentType,
            reviewRequestedBy: creatorUsername,
          },
        };
        const reminders = await reminderDataProvider.fetch({
          ...fetchRemindersOptions,
          userId: creatorId,
        });
        expect(reminders).toEqual({
          total: 1,
          items: [expectedReminder],
        });
      });
    });
  });

  describe('Event Happening Today Reminder', () => {
    let userId: string;
    let teamId: string;
    let calendarId: string;
    let fetchRemindersOptions: FetchRemindersOptions;

    beforeAll(() => {
      jest.useFakeTimers();
    });

    beforeEach(async () => {
      const teamCreateDataObject = getTeamCreateDataObject();
      teamCreateDataObject.applicationNumber = chance.name();
      teamId = await teamDataProvider.create(teamCreateDataObject);

      const userCreateDataObject = getUserInput(teamId);
      userId = await userDataProvider.create(userCreateDataObject);

      const calendarInput = getCalendarInputForReminder();
      calendarId = await calendarDataProvider.create(calendarInput);

      const timezone = 'Europe/London';
      fetchRemindersOptions = { userId, timezone };
    });

    afterAll(async () => {
      jest.useRealTimers();
    });

    test('Should see the reminder when the event is starting after midnight today', async () => {
      // setting system time to 5AM in UTC
      jest.setSystemTime(new Date('2022-08-10T05:00:00.0Z'));

      const eventInput = getEventInput(calendarId);
      // the event happening at 3PM in UTC
      eventInput.startDate = new Date('2022-08-10T15:00:00.0Z').toISOString();

      const eventId = await eventDataProvider.create(eventInput);

      await retryable(async () => {
        const event = await eventDataProvider.fetchById(eventId);

        const expectedReminder: EventHappeningTodayReminder = {
          id: `event-happening-today-${eventId}`,
          entity: 'Event',
          type: 'Happening Today',
          data: {
            eventId: event!.id,
            startDate: event!.startDate,
            title: event!.title,
          },
        };
        // requesting reminders for the user based in London where it is 6AM
        const reminders = await reminderDataProvider.fetch(
          fetchRemindersOptions,
        );
        expect(reminders).toEqual({
          total: 1,
          items: [expectedReminder],
        });
      });
    });

    test('Should not see the reminder if the event has already started', async () => {
      // setting system time to 3PM in UTC
      jest.setSystemTime(new Date('2022-08-10T15:00:00.0Z'));

      const eventInput = getEventInput(calendarId);
      // the event happening at 2PM in UTC
      eventInput.startDate = new Date('2022-08-10T14:00:00.0Z').toISOString();

      await eventDataProvider.create(eventInput);

      await retryable(async () => {
        const reminders = await reminderDataProvider.fetch(
          fetchRemindersOptions,
        );
        expect(reminders).toEqual({
          total: 0,
          items: [],
        });
      });
    });

    test("Should not see the reminder if the event is happening on the next day of the user's timezone", async () => {
      // setting system time to 5AM in UTC
      jest.setSystemTime(new Date('2022-08-10T05:00:00.0Z'));

      const eventInput = getEventInput(calendarId);
      // the event happening at 3PM in UTC
      eventInput.startDate = new Date('2022-08-10T16:00:00.0Z').toISOString();

      await eventDataProvider.create(eventInput);

      // requesting reminders for the user based in LA where 5AM UTC is 10PM the previous day
      const timezone = 'America/Los_Angeles';
      const fetchRemindersOpts = { userId, timezone };

      await retryable(async () => {
        const reminders = await reminderDataProvider.fetch(fetchRemindersOpts);
        expect(reminders).toEqual({
          total: 0,
          items: [],
        });
      });
    });

    test('Should see two reminders for two events from two different calendars happening today', async () => {
      jest.setSystemTime(new Date('2022-08-10T05:00:00.0Z'));

      const eventInput1 = getEventInput(calendarId);
      eventInput1.startDate = new Date('2022-08-10T15:00:00.0Z').toISOString();
      const event1Id = await eventDataProvider.create(eventInput1);

      const calendarInput2 = getCalendarInputForReminder();
      const calendarId2 = await calendarDataProvider.create(calendarInput2);
      const eventInput2 = getEventInput(calendarId);
      eventInput2.calendar = calendarId2;
      eventInput2.startDate = new Date('2022-08-10T17:00:00.0Z').toISOString();
      const event2Id = await eventDataProvider.create(eventInput2);

      await retryable(async () => {
        const reminders = await reminderDataProvider.fetch(
          fetchRemindersOptions,
        );
        expect(reminders).toEqual({
          total: 2,
          items: [
            expect.objectContaining({
              id: `event-happening-today-${event2Id}`,
            }),
            expect.objectContaining({
              id: `event-happening-today-${event1Id}`,
            }),
          ],
        });
      });
    });
  });

  describe('Event Happening Now Reminder', () => {
    let userId: string;
    let teamId: string;
    let calendarId: string;
    let fetchRemindersOptions: FetchRemindersOptions;

    beforeAll(() => {
      jest.useFakeTimers();
    });

    beforeEach(async () => {
      const teamCreateDataObject = getTeamCreateDataObject();
      teamCreateDataObject.applicationNumber = chance.name();
      teamId = await teamDataProvider.create(teamCreateDataObject);

      const userCreateDataObject = getUserInput(teamId);
      userId = await userDataProvider.create(userCreateDataObject);
      fetchRemindersOptions = { userId, timezone: 'Europe/London' };
      const calendarInput = getCalendarInputForReminder();
      calendarId = await calendarDataProvider.create(calendarInput);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    test('Should see the reminder when the event has started but has not finished', async () => {
      // setting system time to 10:05AM in UTC
      jest.setSystemTime(new Date('2022-08-10T10:05:00.0Z'));

      const eventInput = getEventInput(calendarId);
      // the event starts at 10AM and ends at 11AM in UTC
      eventInput.startDate = new Date('2022-08-10T10:00:00.0Z').toISOString();
      eventInput.endDate = new Date('2022-08-10T11:00:00.0Z').toISOString();

      const eventId = await eventDataProvider.create(eventInput);

      await retryable(async () => {
        const event = await eventDataProvider.fetchById(eventId);

        const expectedReminder: EventHappeningNowReminder = {
          id: `event-happening-now-${eventId}`,
          entity: 'Event',
          type: 'Happening Now',
          data: {
            eventId: event!.id,
            startDate: event!.startDate,
            endDate: event!.endDate,
            title: event!.title,
          },
        };
        const reminders = await reminderDataProvider.fetch(
          fetchRemindersOptions,
        );
        expect(reminders).toEqual({
          total: 1,
          items: [expectedReminder],
        });
      });
    });

    test('Should not see the reminder when the event has started but has not finished if it was made Draft in squidex', async () => {
      // setting system time to 10:05AM in UTC
      jest.setSystemTime(new Date('2022-08-10T10:05:00.0Z'));

      const eventInput = getEventInput(calendarId);
      // the event starts at 10AM and ends at 11AM in UTC
      eventInput.startDate = new Date('2022-08-10T10:00:00.0Z').toISOString();
      eventInput.endDate = new Date('2022-08-10T11:00:00.0Z').toISOString();

      const eventId = await eventDataProvider.create(eventInput);

      await eventRestClient.publish(eventId, 'Draft');

      await retryable(async () => {
        const reminders = await reminderDataProvider.fetch(
          fetchRemindersOptions,
        );
        expect(reminders).toEqual({
          total: 0,
          items: [],
        });
      });
    });

    test('Should not see the reminder when the event has already ended', async () => {
      // setting system time to 11:05AM in UTC
      jest.setSystemTime(new Date('2022-08-10T11:05:00.0Z'));

      const eventInput = getEventInput(calendarId);
      // the event starts at 10AM and ends at 11AM in UTC
      eventInput.startDate = new Date('2022-08-10T10:00:00.0Z').toISOString();
      eventInput.endDate = new Date('2022-08-10T11:00:00.0Z').toISOString();

      await eventDataProvider.create(eventInput);

      await retryable(async () => {
        const reminders = await reminderDataProvider.fetch(
          fetchRemindersOptions,
        );
        expect(reminders).toEqual({
          total: 0,
          items: [],
        });
      });
    });
  });

  describe('Share Presentation Reminder', () => {
    let userId: string;
    let teamId: string;
    let calendarId: string;
    let fetchRemindersOptions: FetchRemindersOptions;

    beforeAll(() => {
      jest.useFakeTimers();
    });

    beforeEach(async () => {
      const teamCreateDataObject = getTeamCreateDataObject();
      teamCreateDataObject.applicationNumber = chance.name();
      teamId = await teamDataProvider.create(teamCreateDataObject);

      const userCreateDataObject = getUserInput(teamId);
      userId = await userDataProvider.create(userCreateDataObject);
      fetchRemindersOptions = { userId, timezone: 'Europe/London' };
      const calendarInput = getCalendarInputForReminder();
      calendarId = await calendarDataProvider.create(calendarInput);
    });

    afterAll(async () => {
      jest.useRealTimers();
    });

    test('Should see the reminder when the event has finished and user is speaker', async () => {
      // setting system time to 10:05AM in UTC
      jest.setSystemTime(new Date('2022-08-10T11:05:00.0Z'));

      const pmUserCreateDataObject = getUserInput(teamId, 'Project Manager');
      const pmUserId = await userDataProvider.create(pmUserCreateDataObject);

      const eventInput = getEventInput(calendarId);
      // the event starts at 10AM and ends at 11AM in UTC
      eventInput.startDate = new Date('2022-08-10T10:00:00.0Z').toISOString();
      eventInput.endDate = new Date('2022-08-10T11:00:00.0Z').toISOString();
      eventInput.speakers = [
        {
          user: [userId],
          team: [teamId],
        },
      ];
      const eventId = await eventDataProvider.create(eventInput);
      const event = await eventDataProvider.fetchById(eventId);

      const expectedReminder: SharePresentationReminder = {
        id: `share-presentation-${eventId}`,
        entity: 'Event',
        type: 'Share Presentation',
        data: {
          pmId: pmUserId,
          eventId,
          endDate: event!.endDate,
          title: event!.title,
        },
      };

      await retryable(async () => {
        const reminders = await reminderDataProvider.fetch(
          fetchRemindersOptions,
        );
        expect(reminders).toEqual({
          total: 1,
          items: [expectedReminder],
        });
      });
    });

    test('Should not see the reminder when the event has finished and user is not a speaker', async () => {
      // setting system time to 10:05AM in UTC
      jest.setSystemTime(new Date('2022-08-10T11:05:00.0Z'));

      const eventInput = getEventInput(calendarId);
      // the event starts at 10AM and ends at 11AM in UTC
      eventInput.startDate = new Date('2022-08-10T10:00:00.0Z').toISOString();
      eventInput.endDate = new Date('2022-08-10T11:00:00.0Z').toISOString();
      eventInput.speakers = [];
      await eventDataProvider.create(eventInput);

      await retryable(async () => {
        const reminders = await reminderDataProvider.fetch(
          fetchRemindersOptions,
        );
        expect(reminders).toEqual({
          total: 0,
          items: [],
        });
      });
    });

    test('Should not see the reminder when the event has not finished', async () => {
      jest.setSystemTime(new Date('2022-08-10T10:59:00.0Z'));

      const eventInput = getEventInput(calendarId);
      // the event starts at 10AM and ends at 11AM in UTC
      eventInput.startDate = new Date('2022-08-10T10:00:00.0Z').toISOString();
      eventInput.endDate = new Date('2022-08-10T11:00:00.0Z').toISOString();
      eventInput.speakers = [
        {
          user: [userId],
          team: [teamId],
        },
      ];
      await eventDataProvider.create(eventInput);

      await retryable(async () => {
        const reminders = await reminderDataProvider.fetch(
          fetchRemindersOptions,
        );
        expect(reminders.items.map((reminder) => reminder.type)).toEqual([
          'Happening Now',
        ]);
      });
    });

    test('Should not see the reminder when the event is a future event', async () => {
      jest.setSystemTime(new Date('2022-08-10T10:59:00.0Z'));

      const eventInput = getEventInput(calendarId);
      eventInput.startDate = new Date('2023-08-10T10:00:00.0Z').toISOString();
      eventInput.endDate = new Date('2023-08-10T11:00:00.0Z').toISOString();

      eventInput.speakers = [
        {
          user: [userId],
          team: [teamId],
        },
      ];
      await eventDataProvider.create(eventInput);

      await retryable(async () => {
        const reminders = await reminderDataProvider.fetch(
          fetchRemindersOptions,
        );
        expect(reminders).toEqual({
          total: 0,
          items: [],
        });
      });
    });
  });

  describe('Publish Material Reminder', () => {
    let teamId: string;
    let calendarId: string;
    let fetchRemindersOptions: FetchRemindersOptions;

    beforeAll(() => {
      jest.useFakeTimers();
    });

    beforeEach(async () => {
      const teamCreateDataObject = getTeamCreateDataObject();
      teamCreateDataObject.applicationNumber = chance.name();
      teamId = await teamDataProvider.create(teamCreateDataObject);
      const calendarInput = getCalendarInputForReminder();
      calendarId = await calendarDataProvider.create(calendarInput);
    });

    afterAll(async () => {
      jest.useRealTimers();
    });

    test('Should see the reminder when the event has finished and user is staff', async () => {
      jest.setSystemTime(new Date('2022-08-10T11:05:00.0Z'));

      const userCreateDataObject = getUserInput(teamId);
      const userId = await userDataProvider.create({
        ...userCreateDataObject,
        role: 'Staff',
      });
      fetchRemindersOptions = { userId, timezone: 'Europe/London' };

      const eventInput = getEventInput(calendarId);
      // the event starts at 10AM and ends at 11AM in UTC
      eventInput.startDate = new Date('2022-08-10T10:00:00.0Z').toISOString();
      eventInput.endDate = new Date('2022-08-10T11:00:00.0Z').toISOString();
      const eventId = await eventDataProvider.create(eventInput);

      await retryable(async () => {
        const event = await eventDataProvider.fetchById(eventId);

        const expectedReminder: PublishMaterialReminder = {
          id: `publish-material-${eventId}`,
          entity: 'Event',
          type: 'Publish Material',
          data: {
            eventId,
            endDate: event!.endDate,
            title: event!.title,
          },
        };

        const reminders = await reminderDataProvider.fetch(
          fetchRemindersOptions,
        );
        expect(reminders).toEqual({
          total: 1,
          items: [expectedReminder],
        });
      });
    });

    test('Should not see the reminder when the event has finished and user is staff if the event as made Draft in squidex', async () => {
      jest.setSystemTime(new Date('2022-08-10T11:05:00.0Z'));

      const userCreateDataObject = getUserInput(teamId);
      const userId = await userDataProvider.create({
        ...userCreateDataObject,
        role: 'Staff',
      });
      fetchRemindersOptions = { userId, timezone: 'Europe/London' };

      const eventInput = getEventInput(calendarId);
      // the event starts at 10AM and ends at 11AM in UTC
      eventInput.startDate = new Date('2022-08-10T10:00:00.0Z').toISOString();
      eventInput.endDate = new Date('2022-08-10T11:00:00.0Z').toISOString();
      const eventId = await eventDataProvider.create(eventInput);

      await eventRestClient.publish(eventId, 'Draft');

      await retryable(async () => {
        const reminders = await reminderDataProvider.fetch(
          fetchRemindersOptions,
        );
        expect(reminders).toEqual({
          total: 0,
          items: [],
        });
      });
    });

    test('Should not see the reminder when the event has finished and user is not a staff', async () => {
      jest.setSystemTime(new Date('2022-08-10T11:05:00.0Z'));

      const userCreateDataObject = getUserInput(teamId);
      const userId = await userDataProvider.create({
        ...userCreateDataObject,
        role: 'Grantee',
      });
      fetchRemindersOptions = { userId, timezone: 'Europe/London' };

      const eventInput = getEventInput(calendarId);
      // the event starts at 10AM and ends at 11AM in UTC
      eventInput.startDate = new Date('2022-08-10T10:00:00.0Z').toISOString();
      eventInput.endDate = new Date('2022-08-10T11:00:00.0Z').toISOString();

      await eventDataProvider.create(eventInput);

      await retryable(async () => {
        const reminders = await reminderDataProvider.fetch(
          fetchRemindersOptions,
        );
        expect(reminders).toEqual({
          total: 0,
          items: [],
        });
      });
    });

    test('Should not see the reminder when the event has not finished', async () => {
      jest.setSystemTime(new Date('2022-08-10T10:59:00.0Z'));

      const eventInput = getEventInput(calendarId);
      // the event starts at 10AM and ends at 11AM in UTC
      eventInput.startDate = new Date('2022-08-10T10:00:00.0Z').toISOString();
      eventInput.endDate = new Date('2022-08-10T11:00:00.0Z').toISOString();

      const userCreateDataObject = getUserInput(teamId);
      const userId = await userDataProvider.create({
        ...userCreateDataObject,
        role: 'Staff',
      });
      fetchRemindersOptions = { userId, timezone: 'Europe/London' };

      await eventDataProvider.create(eventInput);

      await retryable(async () => {
        const reminders = await reminderDataProvider.fetch(
          fetchRemindersOptions,
        );
        expect(reminders.items.map((reminder) => reminder.type)).toEqual([
          'Happening Now',
        ]);
      });
    });

    test('Should not see the reminder when the event is a future event', async () => {
      jest.setSystemTime(new Date('2022-08-10T10:59:00.0Z'));

      const eventInput = getEventInput(calendarId);
      eventInput.startDate = new Date('2023-08-10T10:00:00.0Z').toISOString();
      eventInput.endDate = new Date('2023-08-10T11:00:00.0Z').toISOString();

      const userCreateDataObject = getUserInput(teamId);
      const userId = await userDataProvider.create({
        ...userCreateDataObject,
        role: 'Staff',
      });
      fetchRemindersOptions = { userId, timezone: 'Europe/London' };

      await eventDataProvider.create(eventInput);

      await retryable(async () => {
        const reminders = await reminderDataProvider.fetch(
          fetchRemindersOptions,
        );
        expect(reminders).toEqual({
          total: 0,
          items: [],
        });
      });
    });
  });

  describe('Upload Presentation Reminder', () => {
    let userId: string;
    let teamId: string;
    let calendarId: string;
    let fetchRemindersOptions: FetchRemindersOptions;

    beforeAll(() => {
      jest.useFakeTimers();
    });

    beforeEach(async () => {
      const teamCreateDataObject = getTeamCreateDataObject();
      teamCreateDataObject.applicationNumber = chance.name();
      teamId = await teamDataProvider.create(teamCreateDataObject);

      const userCreateDataObject = getUserInput(teamId, 'Project Manager');
      userId = await userDataProvider.create(userCreateDataObject);
      fetchRemindersOptions = { userId, timezone: 'Europe/London' };
      const calendarInput = getCalendarInputForReminder();
      calendarId = await calendarDataProvider.create(calendarInput);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    test('Should see the reminder when the event has finished and user is a PM of one of the speaker teams', async () => {
      // setting system time to 10:05AM in UTC
      jest.setSystemTime(new Date('2022-08-10T11:05:00.0Z'));

      const eventInput = getEventInput(calendarId);
      // the event starts at 10AM and ends at 11AM in UTC
      eventInput.startDate = new Date('2022-08-10T10:00:00.0Z').toISOString();
      eventInput.endDate = new Date('2022-08-10T11:00:00.0Z').toISOString();
      eventInput.speakers = [
        {
          user: [userId],
          team: [teamId],
        },
      ];
      const eventId = await eventDataProvider.create(eventInput);

      await retryable(async () => {
        const event = await eventDataProvider.fetchById(eventId);

        const expectedReminder: UploadPresentationReminder = {
          id: `upload-presentation-${eventId}`,
          entity: 'Event',
          type: 'Upload Presentation',
          data: {
            eventId,
            endDate: event!.endDate,
            title: event!.title,
          },
        };

        const reminders = await reminderDataProvider.fetch(
          fetchRemindersOptions,
        );
        expect(reminders).toEqual({
          total: 1,
          items: [expectedReminder],
        });
      });
    });

    test('Should not see the reminder when the event has finished and user is a PM of one of the speaker teams if the event was changed to Draft in squidex', async () => {
      // setting system time to 10:05AM in UTC
      jest.setSystemTime(new Date('2022-08-10T11:05:00.0Z'));

      const eventInput = getEventInput(calendarId);
      // the event starts at 10AM and ends at 11AM in UTC
      eventInput.startDate = new Date('2022-08-10T10:00:00.0Z').toISOString();
      eventInput.endDate = new Date('2022-08-10T11:00:00.0Z').toISOString();
      eventInput.speakers = [
        {
          user: [userId],
          team: [teamId],
        },
      ];
      const eventId = await eventDataProvider.create(eventInput);

      await eventRestClient.publish(eventId, 'Draft');

      await retryable(async () => {
        const reminders = await reminderDataProvider.fetch(
          fetchRemindersOptions,
        );
        expect(reminders).toEqual({
          total: 0,
          items: [],
        });
      });
    });

    test('Should not see the reminder when the event has finished and user is not a PM of one of the speaker teams', async () => {
      // setting system time to 10:05AM in UTC
      jest.setSystemTime(new Date('2022-08-10T11:05:00.0Z'));

      let anotherTeamId;
      let speakerUserId;

      const anotherTeamCreateDataObject = getTeamCreateDataObject();
      anotherTeamCreateDataObject.applicationNumber = chance.name();
      anotherTeamId = await teamDataProvider.create(
        anotherTeamCreateDataObject,
      );

      const speakerUserCreateDataObject = getUserInput(
        anotherTeamId,
        'Project Manager',
      );
      speakerUserId = await userDataProvider.create(
        speakerUserCreateDataObject,
      );

      const eventInput = getEventInput(calendarId);
      // the event starts at 10AM and ends at 11AM in UTC
      eventInput.startDate = new Date('2022-08-10T10:00:00.0Z').toISOString();
      eventInput.endDate = new Date('2022-08-10T11:00:00.0Z').toISOString();
      eventInput.speakers = [
        {
          user: [speakerUserId],
          team: [anotherTeamId],
        },
      ];

      await eventDataProvider.create(eventInput);

      await retryable(async () => {
        const reminders = await reminderDataProvider.fetch(
          fetchRemindersOptions,
        );
        expect(reminders).toEqual({
          total: 0,
          items: [],
        });
      });
    });

    test('Should not see the reminder when the event has not finished', async () => {
      jest.setSystemTime(new Date('2022-08-10T10:59:00.0Z'));

      const eventInput = getEventInput(calendarId);
      // the event starts at 10AM and ends at 11AM in UTC
      eventInput.startDate = new Date('2022-08-10T10:00:00.0Z').toISOString();
      eventInput.endDate = new Date('2022-08-10T11:00:00.0Z').toISOString();
      eventInput.speakers = [
        {
          user: [userId],
          team: [teamId],
        },
      ];
      await eventDataProvider.create(eventInput);

      await retryable(async () => {
        const reminders = await reminderDataProvider.fetch(
          fetchRemindersOptions,
        );
        expect(reminders.items.map((reminder) => reminder.type)).toEqual([
          'Happening Now',
        ]);
      });
    });

    test('Should not see the reminder when the event is a future event', async () => {
      jest.setSystemTime(new Date('2022-08-10T10:59:00.0Z'));

      const eventInput = getEventInput(calendarId);
      eventInput.startDate = new Date('2023-08-10T10:00:00.0Z').toISOString();
      eventInput.endDate = new Date('2023-08-10T11:00:00.0Z').toISOString();

      eventInput.speakers = [
        {
          user: [userId],
          team: [teamId],
        },
      ];
      await eventDataProvider.create(eventInput);

      await retryable(async () => {
        const reminders = await reminderDataProvider.fetch(
          fetchRemindersOptions,
        );
        expect(reminders).toEqual({
          total: 0,
          items: [],
        });
      });
    });
  });

  interface TestProps {
    material: 'Video' | 'Presentation';
    materialUpdatedAtName:
      | 'videoRecordingUpdatedAt'
      | 'presentationUpdatedAt'
      | 'notesUpdatedAt';
    materialContentName: 'videoRecording' | 'presentation';
  }

  describe.each`
    material          | materialUpdatedAtName        | materialContentName
    ${'Video'}        | ${'videoRecordingUpdatedAt'} | ${'videoRecording'}
    ${'Presentation'} | ${'presentationUpdatedAt'}   | ${'presentation'}
    ${'Notes'}        | ${'notesUpdatedAt'}          | ${'notes'}
  `(
    'Event - $material Updated Reminder',
    ({ material, materialUpdatedAtName, materialContentName }: TestProps) => {
      let userId: string;
      let calendarId: string;
      let fetchRemindersOptions: FetchRemindersOptions;

      beforeAll(() => {
        jest.useFakeTimers();
      });

      beforeEach(async () => {
        const teamCreateDataObject = getTeamCreateDataObject();
        teamCreateDataObject.applicationNumber = chance.name();
        const teamId = await teamDataProvider.create(teamCreateDataObject);

        const userCreateDataObject = getUserInput(teamId);
        userId = await userDataProvider.create(userCreateDataObject);
        fetchRemindersOptions = { userId, timezone: 'Europe/London' };
        const calendarInput = getCalendarInputForReminder();
        calendarId = await calendarDataProvider.create(calendarInput);
      });

      afterAll(() => {
        jest.useRealTimers();
      });

      test(`Should see the reminder when a ${material} was updated in an event between now and 24 hours ago`, async () => {
        // setting system time to 10:05AM in UTC
        jest.setSystemTime(new Date('2022-09-26T10:05:00.0Z'));

        const eventInput = getEventInput(calendarId);

        const eventId = await eventDataProvider.create({
          ...eventInput,
          [materialUpdatedAtName]: new Date(
            '2022-09-26T08:00:00.0Z',
          ).toISOString(),
        });

        await retryable(async () => {
          const event = await eventDataProvider.fetchById(eventId);

          const expectedReminder = {
            id: `${material.toLowerCase()}-event-updated-${eventId}`,
            entity: 'Event',
            type: `${material} Updated`,
            data: {
              eventId,
              title: event!.title,
              [materialUpdatedAtName]: event![materialUpdatedAtName],
            },
          };
          const reminders = await reminderDataProvider.fetch(
            fetchRemindersOptions,
          );
          expect(reminders).toEqual({
            total: 1,
            items: [expectedReminder],
          });
        });
      });

      test(`Should not see the reminder when a ${material} was updated in an event more than 24 hours ago`, async () => {
        // setting system time to 10:05AM in UTC
        jest.setSystemTime(new Date('2022-09-26T10:05:00.0Z'));

        const eventInput = getEventInput(calendarId);

        await eventDataProvider.create({
          ...eventInput,
          [materialUpdatedAtName]: new Date(
            '2022-09-22T08:00:00.0Z',
          ).toISOString(),
        });

        await retryable(async () => {
          const reminders = await reminderDataProvider.fetch(
            fetchRemindersOptions,
          );
          expect(reminders).toEqual({
            total: 0,
            items: [],
          });
        });
      });

      test(`Should not see the reminder when a ${material} in an event was updated after the current time`, async () => {
        // setting system time to 10:05AM in UTC
        jest.setSystemTime(new Date('2022-09-26T10:05:00.0Z'));

        const eventInput = getEventInput(calendarId);

        await eventDataProvider.create({
          ...eventInput,
          [materialUpdatedAtName]: new Date(
            '2022-09-27T08:00:00.0Z',
          ).toISOString(),
        });

        await retryable(async () => {
          const reminders = await reminderDataProvider.fetch(
            fetchRemindersOptions,
          );
          expect(reminders).toEqual({
            total: 0,
            items: [],
          });
        });
      });

      test(`Should not see the reminder when a ${material} was never updated in an event`, async () => {
        // setting system time to 10:05AM in UTC
        jest.setSystemTime(new Date('2022-09-26T10:05:00.0Z'));

        const eventInput = getEventInput(calendarId);

        await eventDataProvider.create(eventInput);

        await retryable(async () => {
          const reminders = await reminderDataProvider.fetch(
            fetchRemindersOptions,
          );
          expect(reminders).toEqual({
            total: 0,
            items: [],
          });
        });
      });

      test(`Should not see the reminder when ${material} was erased in an event`, async () => {
        jest.useRealTimers();

        const eventInput = getEventInput(calendarId);

        const eventId = await eventDataProvider.create(eventInput);

        // user updates material
        await eventDataProvider.update(eventId, {
          [materialContentName]: 'I am a material',
        });

        const event = await eventDataProvider.fetchById(eventId);
        const expectedReminder = {
          id: `${material.toLowerCase()}-event-updated-${eventId}`,
          entity: 'Event',
          type: `${material} Updated`,
          data: {
            eventId,
            title: event!.title,
            [materialUpdatedAtName]: expect.any(String),
          },
        };

        await retryable(async () => {
          const reminders = await reminderDataProvider.fetch(
            fetchRemindersOptions,
          );
          expect(reminders).toEqual({
            total: 1,
            items: [expectedReminder],
          });
        });

        // user erases material
        await eventDataProvider.update(eventId, {
          [materialContentName]: '',
        });

        await retryable(async () => {
          const remindersAfterUpdate = await reminderDataProvider.fetch(
            fetchRemindersOptions,
          );
          expect(remindersAfterUpdate).toEqual({
            total: 0,
            items: [],
          });
        });
      });
    },
  );

  describe('Multiple reminders', () => {
    let teamId: string;
    let calendarId: string;
    let userId1: string;
    let creatorId: string;

    beforeAll(() => {
      jest.useFakeTimers();
    });

    beforeEach(async () => {
      const teamCreateDataObject = getTeamCreateDataObject();
      teamCreateDataObject.applicationNumber = chance.name();
      teamId = await teamDataProvider.create(teamCreateDataObject);

      const userCreateDataObject2 = getUserInput(teamId);
      creatorId = await userDataProvider.create(userCreateDataObject2);

      const userCreateDataObject = getUserInput(teamId);
      userId1 = await userDataProvider.create(userCreateDataObject);

      const calendarInput = getCalendarInputForReminder();
      calendarId = await calendarDataProvider.create(calendarInput);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    test('Should retrieve multiple reminders and sort them by the date they refer to, in a ascending order (earliest first)', async () => {
      // setting system time to 9:00AM in UTC
      jest.setSystemTime(new Date('2022-08-10T09:00:00.0Z'));

      const researchOutputInput1 = getResearchOutputInput(teamId, creatorId);
      // Research Output added at 05:00AM today
      researchOutputInput1.addedDate = new Date(
        '2022-08-10T05:00:00.0Z',
      ).toISOString();
      const researchOutputInput2 = getResearchOutputInput(teamId, creatorId);
      // Research Output added at 03:00AM today
      researchOutputInput2.addedDate = new Date(
        '2022-08-10T03:00:00.0Z',
      ).toISOString();

      const eventInput1 = getEventInput(calendarId);
      // the event happening at 12:00AM today
      eventInput1.startDate = new Date('2022-08-10T12:00:00.0Z').toISOString();

      const eventInput2 = getEventInput(calendarId);
      // the event starting at 8AM and ending at 10AM today
      eventInput2.startDate = new Date('2022-08-10T08:00:00.0Z').toISOString();
      eventInput2.endDate = new Date('2022-08-10T10:00:00.0Z').toISOString();

      const researchOutputId1 = await researchOutputDataProvider.create(
        researchOutputInput1,
      );
      const researchOutputId2 = await researchOutputDataProvider.create(
        researchOutputInput2,
      );
      const event1Id = await eventDataProvider.create(eventInput1);
      const event2Id = await eventDataProvider.create(eventInput2);

      await retryable(async () => {
        const reminders = await reminderDataProvider.fetch({
          userId: userId1,
          timezone: 'Europe/London',
        });
        expect(reminders).toEqual({
          total: 4,
          items: [
            expect.objectContaining({
              id: `event-happening-today-${event1Id}`,
            }),
            expect.objectContaining({ id: `event-happening-now-${event2Id}` }),
            expect.objectContaining({
              id: `research-output-published-${researchOutputId1}`,
            }),
            expect.objectContaining({
              id: `research-output-published-${researchOutputId2}`,
            }),
          ],
        });
      });
    });
  });

  const getUserInput = (
    teamId: string,
    role = 'Key Personnel' as TeamRole,
  ): UserCreateDataObject => ({
    ...getUserCreateDataObject(),
    teams: [{ id: teamId, role }],
    labIds: [],
    email: chance.email(),
    orcid: createRandomOrcid(),
    avatar: undefined,
  });

  const getCalendarInputForReminder = (): CalendarCreateDataObject => ({
    ...getCalendarCreateDataObject(),
    resourceId: chance.string(),
    googleCalendarId: chance.email(),
  });

  const getEventInput = (calendarId: string): EventCreateDataObject => ({
    title: 'Event Tittle',
    description: 'This event will be good',
    startDate: '2021-02-23T19:32:00Z',
    startDateTimeZone: 'Europe/Lisbon',
    endDate: '2021-02-23T19:32:00Z',
    endDateTimeZone: 'Europe/Lisbon',
    status: 'Confirmed' as EventStatus,
    hidden: false,
    hideMeetingLink: false,
    calendar: calendarId,
    googleId: chance.string(),
    tags: [],
  });

  const getResearchOutputInput = (
    teamId: string,
    creatorId: string,
  ): PublishedResearchOutputCreateDataObject => ({
    ...getResearchOutputCreateDataObject(),
    teamIds: [teamId],
    createdBy: creatorId,
    subtypeId: undefined,
    link: chance.url(),
    environmentIds: [],
    organismIds: [],
    methodIds: [],
    keywordIds: [],
    labIds: [],
    authors: [],
    relatedResearchIds: [],
    addedDate: new Date().toISOString(),
  });

  const getResearchOutputInputDraft = (
    teamId: string,
    creatorId: string,
    workingGroupId: string = '',
  ): DraftResearchOutputCreateDataObject => ({
    ...getResearchOutputCreateDataObject(),
    teamIds: [teamId],
    workingGroups: workingGroupId ? [workingGroupId] : [],
    createdBy: creatorId,
    subtypeId: undefined,
    link: chance.url(),
    environmentIds: [],
    organismIds: [],
    methodIds: [],
    keywordIds: [],
    labIds: [],
    authors: [],
    relatedResearchIds: [],
  });
});

const createWorkingGroup = (creatorId: string) => {
  return {
    title: {
      iv: 'Created via test',
    },
    complete: {
      iv: false,
    },
    description: {
      iv: 'a short description',
    },
    shortText: {
      iv: 'just a short text>',
    },
    calendars: {},
    'external-link': {
      iv: 'https://google.com',
    },
    deliverables: {
      iv: [
        {
          description: '<string>',
          status: 'In Progress',
        },
      ],
    },
    leaders: {
      iv: [
        {
          user: [creatorId],
          role: 'Project Manager',
          workstreamRole: 'Test',
        },
      ],
    },
    members: {},
  };
};
