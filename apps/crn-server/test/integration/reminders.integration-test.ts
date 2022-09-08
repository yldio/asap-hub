import {
  InputUser,
  RestResearchOutput,
  RestTeam,
  RestUser,
  SquidexGraphql,
  SquidexRest,
  RestEvent,
  RestCalendar,
  InputCalendar,
  Calendar,
  Event,
} from '@asap-hub/squidex';
import { Chance } from 'chance';
import { appName, baseUrl } from '../../src/config';
import { ReminderSquidexDataProvider } from '../../src/data-providers/reminders.data-provider';
import { ResearchOutputSquidexDataProvider } from '../../src/data-providers/research-outputs.data-provider';
import { TeamSquidexDataProvider } from '../../src/data-providers/teams.data-provider';
import { UserSquidexDataProvider } from '../../src/data-providers/users.data-provider';
import { getAuthToken } from '../../src/utils/auth';
import { getResearchOutputCreateDataObject } from '../fixtures/research-output.fixtures';
import { getTeamCreateDataObject } from '../fixtures/teams.fixtures';
import { getUserCreateDataObject } from '../fixtures/users.fixtures';
import { createRandomOrcid } from '../helpers/users';
import {
  EventHappeningNowReminder,
  EventHappeningTodayReminder,
  FetchRemindersOptions,
  ResearchOutputCreateDataObject,
  ResearchOutputPublishedReminder,
  UserCreateDataObject,
} from '@asap-hub/model';
import Events from '../../src/controllers/events';
import { getEventRestResponse } from '../fixtures/events.fixtures';
import Calendars from '../../src/controllers/calendars';
import { getCalendarInput } from '../fixtures/calendars.fixtures';
import CalendarSquidexDataProvider from '../../src/data-providers/calendars.data-provider';

jest.setTimeout(30000);

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
    squidexGraphqlClient
  );
  const researchOutputDataProvider = new ResearchOutputSquidexDataProvider(
    squidexGraphqlClient,
    researchOutputRestClient,
    teamRestClient,
  );
  // @todo https://asaphub.atlassian.net/browse/CRN-937
  const eventController = new Events(squidexGraphqlClient, eventRestClient);
  // @todo https://asaphub.atlassian.net/browse/CRN-937
  const calendarController = new Calendars(calendarDataProvider);

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

      const reminders = await reminderDataProvider.fetch(fetchRemindersOptions);

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
      expect(reminders).toEqual({
        total: 1,
        items: [expectedReminder],
      });
    });

    test('Should not see the reminder when the research output was created recently but the user is NOT associated with the team that owns it', async () => {
      const teamCreateDataObject = getTeamCreateDataObject();
      teamCreateDataObject.applicationNumber = chance.name();
      const anotherTeamId = await teamDataProvider.create(teamCreateDataObject);

      const researchOutputInput = getResearchOutputInput(teamId, creatorId);
      researchOutputInput.teamIds = [anotherTeamId];

      await researchOutputDataProvider.create(researchOutputInput);

      const reminders = await reminderDataProvider.fetch(fetchRemindersOptions);

      expect(reminders).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should not see the reminder when the research output was created over 24 hours ago and the user is associated with the team that owns it', async () => {
      const researchOutputInput = getResearchOutputInput(teamId, creatorId);
      const timeOver24hago = new Date(
        new Date().getTime() - (24 * 60 * 60 * 1000 + 1000),
      );
      researchOutputInput.addedDate = timeOver24hago.toISOString();

      await researchOutputDataProvider.create(researchOutputInput);

      const reminders = await reminderDataProvider.fetch(fetchRemindersOptions);

      expect(reminders).toEqual({
        total: 0,
        items: [],
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

      const reminders = await reminderDataProvider.fetch(fetchRemindersOptions);
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

  describe('Event Happening Today Reminder', () => {
    let userId: string;
    let calendarId: string;
    let eventIdsForDeletion: string[] = [];
    let fetchRemindersOptions: FetchRemindersOptions;

    beforeAll(async () => {
      jest.useFakeTimers('modern');

      const teamCreateDataObject = getTeamCreateDataObject();
      teamCreateDataObject.applicationNumber = chance.name();
      const teamId = await teamDataProvider.create(teamCreateDataObject);

      const userCreateDataObject = getUserInput(teamId);
      userId = await userDataProvider.create(userCreateDataObject);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    beforeEach(async () => {
      const calendarInput = getCalendarInputForReminder();
      ({ id: calendarId } = await calendarController.create(calendarInput));

      const timezone = 'Europe/London';
      fetchRemindersOptions = { userId, timezone };
    });

    afterEach(async () => {
      await Promise.all(
        eventIdsForDeletion.map((id) => eventRestClient.delete(id)),
      );
      eventIdsForDeletion = [];
    });

    test('Should see the reminder when the event is starting after midnight today', async () => {
      // setting system time to 5AM in UTC
      jest.setSystemTime(new Date('2022-08-10T05:00:00.0Z'));

      const eventInput = getEventInput(calendarId);
      // the event happening at 3PM in UTC
      eventInput.startDate = new Date('2022-08-10T15:00:00.0Z').toISOString();

      const event = await eventController.create(eventInput);
      eventIdsForDeletion = [event.id];

      // requesting reminders for the user based in London where it is 6AM
      const reminders = await reminderDataProvider.fetch(fetchRemindersOptions);

      const expectedReminder: EventHappeningTodayReminder = {
        id: `event-happening-today-${event.id}`,
        entity: 'Event',
        type: 'Happening Today',
        data: {
          eventId: event.id,
          startDate: event.data.startDate.iv,
          title: event.data.title.iv,
        },
      };
      expect(reminders).toEqual({
        total: 1,
        items: [expectedReminder],
      });
    });

    test('Should not see the reminder if the event has already started', async () => {
      // setting system time to 3PM in UTC
      jest.setSystemTime(new Date('2022-08-10T15:00:00.0Z'));

      const eventInput = getEventInput(calendarId);
      // the event happening at 2PM in UTC
      eventInput.startDate = new Date('2022-08-10T14:00:00.0Z').toISOString();

      const event = await eventController.create(eventInput);
      eventIdsForDeletion = [event.id];

      const reminders = await reminderDataProvider.fetch(fetchRemindersOptions);

      expect(reminders).toEqual({
        total: 0,
        items: [],
      });
    });

    test("Should not see the reminder if the event is happening on the next day of the user's timezone", async () => {
      // setting system time to 5AM in UTC
      jest.setSystemTime(new Date('2022-08-10T05:00:00.0Z'));

      const eventInput = getEventInput(calendarId);
      // the event happening at 3PM in UTC
      eventInput.startDate = new Date('2022-08-10T16:00:00.0Z').toISOString();

      const event = await eventController.create(eventInput);
      eventIdsForDeletion = [event.id];

      // requesting reminders for the user based in LA where 5AM UTC is 10PM the previous day
      const timezone = 'America/Los_Angeles';
      const fetchRemindersOptions = { userId, timezone };
      const reminders = await reminderDataProvider.fetch(fetchRemindersOptions);

      expect(reminders).toEqual({
        total: 0,
        items: [],
      });
    });

    test('Should see two reminders for two events from two different calendars happening today', async () => {
      jest.setSystemTime(new Date('2022-08-10T05:00:00.0Z'));

      const eventInput1 = getEventInput(calendarId);
      eventInput1.startDate = new Date('2022-08-10T15:00:00.0Z').toISOString();
      const event1 = await eventController.create(eventInput1);

      const calendarInput2 = getCalendarInputForReminder();
      const { id: calendarId2 } = await calendarController.create(
        calendarInput2,
      );
      const eventInput2 = getEventInput(calendarId);
      eventInput2.calendar = [calendarId2];
      eventInput2.startDate = new Date('2022-08-10T17:00:00.0Z').toISOString();
      const event2 = await eventController.create(eventInput2);

      eventIdsForDeletion = [event1.id, event2.id];

      const reminders = await reminderDataProvider.fetch(fetchRemindersOptions);

      expect(reminders).toEqual({
        total: 2,
        items: [
          expect.objectContaining({ id: `event-happening-today-${event2.id}` }),
          expect.objectContaining({ id: `event-happening-today-${event1.id}` }),
        ],
      });
    });
  });

  describe('Event Happening Now Reminder', () => {
    let userId: string;
    let calendarId: string;
    let eventIdsForDeletion: string[] = [];
    let fetchRemindersOptions: FetchRemindersOptions;

    beforeAll(async () => {
      jest.useFakeTimers('modern');

      const teamCreateDataObject = getTeamCreateDataObject();
      teamCreateDataObject.applicationNumber = chance.name();
      const teamId = await teamDataProvider.create(teamCreateDataObject);

      const userCreateDataObject = getUserInput(teamId);
      userId = await userDataProvider.create(userCreateDataObject);
      fetchRemindersOptions = { userId, timezone: 'Europe/London' };
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    beforeEach(async () => {
      const calendarInput = getCalendarInputForReminder();
      ({ id: calendarId } = await calendarController.create(calendarInput));
    });

    afterEach(async () => {
      await Promise.all(
        eventIdsForDeletion.map((id) => eventRestClient.delete(id)),
      );
      eventIdsForDeletion = [];
    });

    test('Should see the reminder when the event has started but has not finished', async () => {
      // setting system time to 10:05AM in UTC
      jest.setSystemTime(new Date('2022-08-10T10:05:00.0Z'));

      const eventInput = getEventInput(calendarId);
      // the event starts at 10AM and ends at 11AM in UTC
      eventInput.startDate = new Date('2022-08-10T10:00:00.0Z').toISOString();
      eventInput.endDate = new Date('2022-08-10T11:00:00.0Z').toISOString();

      const event = await eventController.create(eventInput);
      eventIdsForDeletion = [event.id];

      const reminders = await reminderDataProvider.fetch(fetchRemindersOptions);

      const expectedReminder: EventHappeningNowReminder = {
        id: `event-happening-now-${event.id}`,
        entity: 'Event',
        type: 'Happening Now',
        data: {
          eventId: event.id,
          startDate: event.data.startDate.iv,
          endDate: event.data.endDate.iv,
          title: event.data.title.iv,
        },
      };

      expect(reminders).toEqual({
        total: 1,
        items: [expectedReminder],
      });
    });

    test('Should not see the reminder when the event has already ended', async () => {
      // setting system time to 11:05AM in UTC
      jest.setSystemTime(new Date('2022-08-10T11:05:00.0Z'));

      const eventInput = getEventInput(calendarId);
      // the event starts at 10AM and ends at 11AM in UTC
      eventInput.startDate = new Date('2022-08-10T10:00:00.0Z').toISOString();
      eventInput.endDate = new Date('2022-08-10T11:00:00.0Z').toISOString();

      const event = await eventController.create(eventInput);
      eventIdsForDeletion = [event.id];

      const reminders = await reminderDataProvider.fetch(fetchRemindersOptions);

      expect(reminders).toEqual({
        total: 0,
        items: [],
      });
    });
  });

  describe('Multiple reminders', () => {
    let teamId: string;
    let calendarId: string;
    let userId1: string;
    let creatorId: string;
    let eventIdsForDeletion: string[] = [];

    beforeAll(async () => {
      jest.useFakeTimers('modern');

      const teamCreateDataObject = getTeamCreateDataObject();
      teamCreateDataObject.applicationNumber = chance.name();
      teamId = await teamDataProvider.create(teamCreateDataObject);

      const userCreateDataObject2 = getUserInput(teamId);
      creatorId = await userDataProvider.create(userCreateDataObject2);

      const userCreateDataObject = getUserInput(teamId);
      userId1 = await userDataProvider.create(userCreateDataObject);

      const calendarInput = getCalendarInputForReminder();
      ({ id: calendarId } = await calendarController.create(calendarInput));
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    afterEach(async () => {
      await Promise.all(
        eventIdsForDeletion.map((id) => eventRestClient.delete(id)),
      );
      eventIdsForDeletion = [];
    });

    test('Should retrive multiple reminders and sort them by the date they refer to, in a ascending order (earliest first)', async () => {
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
      const { id: event1Id } = await eventController.create(eventInput1);
      const { id: event2Id } = await eventController.create(eventInput2);
      eventIdsForDeletion = [event1Id, event2Id];

      const reminders = await reminderDataProvider.fetch({
        userId: userId1,
        timezone: 'Europe/London',
      });

      expect(reminders).toEqual({
        total: 4,
        items: [
          expect.objectContaining({ id: `event-happening-today-${event1Id}` }),
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

  const getUserInput = (teamId: string): UserCreateDataObject => ({
    ...getUserCreateDataObject(),
    teams: [{ id: teamId, role: 'Key Personnel' }],
    labIds: [],
    email: chance.email(),
    orcid: createRandomOrcid(),
    avatar: undefined,
  });

  const getCalendarInputForReminder = (): Calendar => ({
    ...getCalendarInput(),
    resourceId: chance.string(),
    googleCalendarId: chance.email(),
  });

  const getEventInput = (calendarId: string): Event<string, string> => ({
    ...getEventRestResponse(),
    calendar: [calendarId],
    googleId: chance.string(),
  });

  const getResearchOutputInput = (
    teamId: string,
    creatorId: string,
  ): ResearchOutputCreateDataObject => ({
    ...getResearchOutputCreateDataObject(),
    teamIds: [teamId],
    createdBy: creatorId,
    subtypeId: undefined,
    link: chance.url(),
    environmentIds: [],
    organismIds: [],
    methodIds: [],
    labIds: [],
    authors: [],
    addedDate: new Date().toISOString(),
  });
});
