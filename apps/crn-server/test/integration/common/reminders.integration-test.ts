import supertest from 'supertest';
import { Express } from 'express';
import {
  ListReminderResponse,
  UserCreateDataObject,
  UserResponse,
} from '@asap-hub/model';

import { appFactory } from '../../../src/app';
import { retryable } from '../../helpers/retryable';
import {
  FixtureFactory,
  getUserFixture,
  UserFixture,
  getEventFixture,
  getTeamFixture,
  TeamFixture,
  EventCreateDataObject,
  EventFixture,
} from '../fixtures';
import { getCalendarFixture } from '../fixtures/calendar';

jest.mock('../../../src/config', () => ({
  ...jest.requireActual('../../../src/config'),
  isContentfulEnabledV2:
    process.env.INTEGRATION_TEST_CMS === 'contentful' ? 'true' : undefined,
  logLevel: 'silent',
}));

jest.setTimeout(120000);

const fixtures = FixtureFactory(process.env.INTEGRATION_TEST_CMS);

type AppResponse<T> = {
  status: number;
  body: T;
};

describe('Reminders', () => {
  let app: Express;
  let loggedInUser: UserFixture;
  let notLoggedInUser: UserFixture;
  let team: TeamFixture;

  beforeAll(async () => {
    await fixtures.clearAllPreviousEvents();
    team = await fixtures.createTeam(getTeamFixture());
    loggedInUser = await fixtures.createUser(
      getUserFixture({
        firstName: 'LoggedIn',
        email: 'loggedIn@user.com',
        teams: [
          {
            id: team.id,
            role: 'Co-PI (Core Leadership)',
          },
        ],
      }),
    );
    notLoggedInUser = await fixtures.createUser(
      getUserFixture({
        firstName: 'NotLoggedIn',
        email: 'notloggedIn@user.com',
        teams: [
          {
            id: team.id,
            role: 'Collaborating PI',
          },
        ],
      }),
    );
    app = appFactory({
      authHandler: (req, _res, next) => {
        req.loggedInUser = loggedInUser as UserResponse;
        next();
      },
    });
  });

  beforeEach(async () => {
    jest.useFakeTimers();
  });

  afterAll(async () => {
    jest.useRealTimers();
  });

  describe('Multiple reminders', () => {
    // TODO: add research output reminders here
    test('Should retrieve multiple reminders and sort them by the date they refer to', async () => {
      // setting system time to 9:00AM in UTC
      const now = new Date('2022-08-10T09:00:00.0Z');

      jest.setSystemTime(now);
      const eventHappeningToday = await createEvent({
        startDate: new Date('2022-08-10T12:00:00.0Z').toISOString(),
        endDate: new Date('2022-08-10T18:00:00.0Z').toISOString(),
      });
      const eventHappeningNow = await createEvent({
        startDate: new Date('2022-08-10T08:00:00.0Z').toISOString(),
        endDate: new Date('2022-08-10T10:00:00.0Z').toISOString(),
      });
      const endedEventWithLoggedInUserSpeaker = await createEvent({
        startDate: new Date('2022-08-10T05:00:00.0Z').toISOString(),
        endDate: new Date('2022-08-10T06:00:00.0Z').toISOString(),
        speakers: [{ user: [loggedInUser.id], team: [team.id] }],
      });

      await retryable(async () => {
        const response: AppResponse<ListReminderResponse> = await supertest(app)
          .get(`/reminders?timezone=Europe/London`)
          .expect(200);

        expect(response.body.items).toEqual([
          expect.objectContaining({
            id: `event-happening-today-${eventHappeningToday.id}`,
          }),
          expect.objectContaining({
            id: `event-happening-now-${eventHappeningNow.id}`,
          }),
          expect.objectContaining({
            id: `share-presentation-${endedEventWithLoggedInUserSpeaker.id}`,
          }),
        ]);
      });
      await fixtures.deleteEvents([
        eventHappeningToday.id,
        eventHappeningNow.id,
        endedEventWithLoggedInUserSpeaker.id,
      ]);
    }, 300000);
  });

  describe('Event Happening Today Reminder', () => {
    let event: EventFixture;

    beforeAll(async () => {
      event = await createEvent({
        startDate: new Date('2022-08-10T16:00:00.0Z').toISOString(),
        endDate: new Date('2022-08-11T16:00:00.0Z').toISOString(),
      });
    });

    afterAll(async () => {
      await fixtures.deleteEvents([event.id]);
    });

    test('Should see the reminder when the event starts today', async () => {
      // setting system time to 5AM in UTC, event happening at 4PM in UTC
      jest.setSystemTime(new Date('2022-08-10T05:00:00.0Z'));
      await expectReminderWithId(`event-happening-today-${event.id}`);
    });

    test('Should not see the reminder if the event has already started', async () => {
      // setting system time to 5PM in UTC, event happening at 4PM in UTC
      jest.setSystemTime(new Date('2022-08-10T17:00:00.0Z'));
      await expectNotToContainingReminderWithId(
        `event-happening-today-${event.id}`,
      );
    });

    test("Should not see the reminder if the event is happening on the next day of the user's timezone", async () => {
      // setting system time to 5AM in UTC, event happening at 4PM in UTC
      jest.setSystemTime(new Date('2022-08-10T05:00:00.0Z'));

      // requesting reminders for the user based in LA where 5AM UTC is 10PM the previous day
      const timezone = 'America/Los_Angeles';

      await expectNotToContainingReminderWithId(
        `event-happening-today-${event.id}`,
        app,
        timezone,
      );
    });
  });

  describe('Event Happening Now Reminder', () => {
    let event: EventFixture;

    beforeAll(async () => {
      event = await createEvent({
        startDate: new Date('2022-08-10T10:00:00.0Z').toISOString(),
        endDate: new Date('2022-08-10T11:00:00.0Z').toISOString(),
      });
    });

    afterAll(async () => {
      await fixtures.deleteEvents([event.id]);
    });

    test('Should see the reminder when the event has started but has not finished', async () => {
      // setting system time to 10:05AM in UTC
      // event happening at 10PM in UTC and ending at 11AM UTC
      jest.setSystemTime(new Date('2022-08-10T10:05:00.0Z'));
      await expectReminderWithId(`event-happening-now-${event.id}`);
    });

    test('Should not see the reminder when the event has already ended', async () => {
      // setting system time to 11:05AM in UTC
      // event happening at 10PM in UTC and ending at 11AM UTC
      jest.setSystemTime(new Date('2022-08-10T11:05:00.0Z'));
      await expectNotToContainingReminderWithId(
        `event-happening-now-${event.id}`,
      );
    });

    test('Should not see the reminder when the event is happening but its status is Draft', async () => {
      // setting system time to 10:05AM in UTC
      // event happening at 10PM in UTC and ending at 11AM UTC
      jest.setSystemTime(new Date('2022-08-10T10:05:00.0Z'));
      await fixtures.publishEvent(event.id, 'Draft');
      await delay(30000);
      await expectNotToContainingReminderWithId(
        `event-happening-now-${event.id}`,
      );
    }, 300000);
  });

  describe('Share Presentation Reminder', () => {
    let eventUserIsSpeaker: EventFixture;
    let eventUserIsNotSpeaker: EventFixture;

    beforeAll(async () => {
      const startDate = new Date('2022-08-10T10:00:00.0Z').toISOString();
      const endDate = new Date('2022-08-10T11:00:00.0Z').toISOString();

      eventUserIsSpeaker = await createEvent({
        startDate,
        endDate,
        speakers: [
          {
            user: [loggedInUser.id],
            team: [team.id],
          },
        ],
      });

      eventUserIsNotSpeaker = await createEvent({
        startDate,
        endDate,
        speakers: [
          {
            user: [notLoggedInUser.id],
            team: [team.id],
          },
        ],
      });
    });

    afterAll(async () => {
      await fixtures.deleteEvents([
        eventUserIsSpeaker.id,
        eventUserIsNotSpeaker.id,
      ]);
    });

    test('Should see the reminder when the event has finished and user is a speaker', async () => {
      // setting system time to 11:05AM in UTC
      // event happening at 10PM in UTC and ending at 11AM UTC
      jest.setSystemTime(new Date('2022-08-10T11:05:00.0Z'));

      await expectReminderWithId(`share-presentation-${eventUserIsSpeaker.id}`);
      await expectNotToContainingReminderWithId(
        `share-presentation-${eventUserIsNotSpeaker.id}`,
      );
    });

    test('Should not see the reminder when the event has finished, user is a speaker but it is also a PM', async () => {
      // setting system time to 11:05AM in UTC
      // event happening at 10PM in UTC and ending at 11AM UTC
      const now = new Date('2022-08-10T11:05:00.0Z');
      const startDate = new Date('2022-08-10T10:00:00.0Z').toISOString();
      const endDate = new Date('2022-08-10T11:00:00.0Z').toISOString();

      jest.setSystemTime(now);

      const { app: appWithPMLoggedUser, loggedInUser: pmLoggedInUser } =
        await createLoggedInUserAndGetApp({
          teams: [
            {
              id: team.id,
              role: 'Project Manager',
            },
          ],
        });

      const event = await createEvent({
        startDate,
        endDate,
        speakers: [
          {
            user: [pmLoggedInUser.id],
            team: [team.id],
          },
        ],
      });

      await expectNotToContainingReminderWithId(
        `share-presentation-${event.id}`,
        appWithPMLoggedUser,
      );
      await fixtures.deleteEvents([event.id]);
    });

    test('Should not see the reminder when the event has not finished', async () => {
      // setting system time to 10:59AM in UTC
      // event happening at 10PM in UTC and ending at 11AM UTC
      jest.setSystemTime(new Date('2022-08-10T10:59:00.0Z'));
      await expectNotToContainingReminderWithId(
        `share-presentation-${eventUserIsSpeaker.id}`,
      );
    });

    test('Should not see the reminder when the event is a future event', async () => {
      // setting system time to 07:00AM in UTC
      // event happening at 10PM in UTC and ending at 11AM UTC
      jest.setSystemTime(new Date('2022-08-10T07:00:00.0Z'));
      await expectNotToContainingReminderWithId(
        `share-presentation-${eventUserIsSpeaker.id}`,
      );
    });
  });

  describe('Publish Material Reminder', () => {
    let appWithStaffLoggedUser: Express;
    let event: EventFixture;

    beforeAll(async () => {
      const appAndLoggedInUser = await createLoggedInUserAndGetApp({
        role: 'Staff',
      });
      appWithStaffLoggedUser = appAndLoggedInUser.app;
      const startDate = new Date('2022-08-10T10:00:00.0Z').toISOString();
      const endDate = new Date('2022-08-10T11:00:00.0Z').toISOString();
      event = await createEvent({ startDate, endDate });
    });

    test('Should see the reminder when the event has finished and logged in user is staff', async () => {
      // setting system time to 11:05AM in UTC
      // event happening at 10PM in UTC and ending at 11AM UTC
      jest.setSystemTime(new Date('2022-08-10T11:05:00.0Z'));
      await expectReminderWithId(
        `publish-material-${event.id}`,
        appWithStaffLoggedUser,
      );
    });

    test('Should not see the reminder when the event has finished and logged in user is not a staff', async () => {
      // setting system time to 11:05AM in UTC
      // event happening at 10PM in UTC and ending at 11AM UTC
      jest.setSystemTime(new Date('2022-08-10T11:05:00.0Z'));
      const { app: appWithGranteeLoggedUser } =
        await createLoggedInUserAndGetApp({
          role: 'Grantee',
        });
      await expectNotToContainingReminderWithId(
        `publish-material-${event.id}`,
        appWithGranteeLoggedUser,
      );
    });

    test('Should not see the reminder when the event has not finished', async () => {
      // setting system time to 10:59AM in UTC
      // event happening at 10PM in UTC and ending at 11AM UTC
      jest.setSystemTime(new Date('2022-08-10T10:59:00.0Z'));
      await expectNotToContainingReminderWithId(
        `publish-material-${event.id}`,
        appWithStaffLoggedUser,
      );
    });

    test('Should not see the reminder when the event is a future event', async () => {
      // setting system time to 07:00AM in UTC
      // event happening at 10PM in UTC and ending at 11AM UTC
      jest.setSystemTime(new Date('2022-08-10T07:00:00.0Z'));
      await expectNotToContainingReminderWithId(
        `publish-material-${event.id}`,
        appWithStaffLoggedUser,
      );
    });
  });

  describe('Upload Presentation Reminder', () => {
    let appWithPMFromSpeakersTeamLoggedInUser: Express;
    let event: EventFixture;

    beforeAll(async () => {
      const appAndLoggedInUser = await createLoggedInUserAndGetApp({
        teams: [
          {
            id: team.id,
            role: 'Project Manager',
          },
        ],
      });
      appWithPMFromSpeakersTeamLoggedInUser = appAndLoggedInUser.app;
      const startDate = new Date('2022-08-10T10:00:00.0Z').toISOString();
      const endDate = new Date('2022-08-10T11:00:00.0Z').toISOString();
      event = await createEvent({
        startDate,
        endDate,
        speakers: [
          {
            user: [notLoggedInUser.id],
            team: [team.id],
          },
        ],
      });
    });

    afterAll(async () => {
      await fixtures.deleteEvents([event.id]);
    });
    test('Should see the reminder when the event has finished and logged in user is a PM of one of the speaker teams', async () => {
      // setting system time to 11:05AM in UTC
      // event happening at 10PM in UTC and ending at 11AM UTC
      jest.setSystemTime(new Date('2022-08-10T11:05:00.0Z'));
      await expectReminderWithId(
        `upload-presentation-${event.id}`,
        appWithPMFromSpeakersTeamLoggedInUser,
      );
    });

    test('Should not see the reminder when the event has finished and logged in user is not a PM of one of the speaker teams', async () => {
      // setting system time to 11:05AM in UTC
      // event happening at 10PM in UTC and ending at 11AM UTC
      jest.setSystemTime(new Date('2022-08-10T11:05:00.0Z'));
      const notSpeakerTeam = await fixtures.createTeam(getTeamFixture());

      const { app: appWithPMFromAnotherTeamLoggedInUser } =
        await createLoggedInUserAndGetApp({
          teams: [
            {
              id: notSpeakerTeam.id,
              role: 'Project Manager',
            },
          ],
        });

      const event = await createEvent({
        startDate: new Date('2022-08-10T10:00:00.0Z').toISOString(),
        endDate: new Date('2022-08-10T11:00:00.0Z').toISOString(),
        speakers: [
          {
            user: [notLoggedInUser.id],
            team: [team.id],
          },
        ],
      });

      await expectNotToContainingReminderWithId(
        `upload-presentation-${event.id}`,
        appWithPMFromAnotherTeamLoggedInUser,
      );
      await fixtures.deleteEvents([event.id]);
    });

    test('Should not see the reminder when the event has not finished', async () => {
      // setting system time to 10:59AM in UTC
      // event happening at 10PM in UTC and ending at 11AM UTC
      jest.setSystemTime(new Date('2022-08-10T10:59:00.0Z'));
      await expectNotToContainingReminderWithId(
        `upload-presentation-${event.id}`,
        appWithPMFromSpeakersTeamLoggedInUser,
      );
    });

    test('Should not see the reminder when the event is a future event', async () => {
      // setting system time to 07:00AM in UTC
      // event happening at 10PM in UTC and ending at 11AM UTC
      jest.setSystemTime(new Date('2022-08-10T07:00:00.0Z'));
      await expectNotToContainingReminderWithId(
        `upload-presentation-${event.id}`,
        appWithPMFromSpeakersTeamLoggedInUser,
      );
    });
  });

  describe.each`
    material          | materialUpdatedAtName
    ${'Video'}        | ${'videoRecordingUpdatedAt'}
    ${'Presentation'} | ${'presentationUpdatedAt'}
    ${'Notes'}        | ${'notesUpdatedAt'}
  `(
    '$material Updated Reminder',
    ({
      material,
      materialUpdatedAtName,
    }: {
      material: 'Video' | 'Presentation' | 'Notes';
      materialUpdatedAtName:
        | 'videoRecordingUpdatedAt'
        | 'presentationUpdatedAt'
        | 'notesUpdatedAt';
    }) => {
      let event: EventFixture;

      beforeAll(async () => {
        event = await createEvent({
          title: `${material} Updated`,
          [materialUpdatedAtName]: new Date(
            '2022-08-10T10:00:00.0Z',
          ).toISOString(),
        });
      });

      afterAll(async () => {
        await fixtures.deleteEvents([event.id]);
      });

      test(`Should see the reminder when a ${material} was updated in the last 24 hours`, async () => {
        // setting system time to 09:50AM in UTC from the next day, material updated at 10AM in UTC
        jest.setSystemTime(new Date('2022-08-11T09:50:00.0Z'));
        await expectReminderWithId(
          `${material.toLowerCase()}-event-updated-${event.id}`,
        );
      });

      test(`Should not see the reminder when a ${material} was updated in an event more than 24 hours ago`, async () => {
        // setting system time to 10:05AM in UTC from the next day, material updated at 10AM in UTC
        jest.setSystemTime(new Date('2022-08-11T10:05:00.0Z'));
        await expectNotToContainingReminderWithId(
          `${material.toLowerCase()}-event-updated-${event.id}`,
        );
      });
    },
  );

  const createEvent = async (props: Partial<EventCreateDataObject> = {}) => {
    const calendar = await fixtures.createCalendar(getCalendarFixture());
    return await fixtures.createEvent(
      getEventFixture({
        calendar: calendar.id,
        ...props,
      }),
    );
  };

  const createLoggedInUserAndGetApp = async (
    props: Partial<UserCreateDataObject> = {},
  ) => {
    const loggedInUser = await fixtures.createUser(getUserFixture(props));
    app = appFactory({
      authHandler: (req, _res, next) => {
        req.loggedInUser = loggedInUser as UserResponse;
        next();
      },
    });
    return { loggedInUser, app };
  };

  const expectReminderWithId = async (
    id: string,
    expressApp: Express = app,
    timezone: string = 'Europe/London',
  ) => {
    await retryable(async () => {
      const response: AppResponse<ListReminderResponse> = await supertest(
        expressApp,
      )
        .get(`/reminders?timezone=${timezone}`)
        .expect(200);

      expect(response.body.items.map((reminder) => reminder.id)).toContain(id);
    });
  };

  const expectNotToContainingReminderWithId = async (
    id: string,
    expressApp: Express = app,
    timezone: string = 'Europe/London',
  ) => {
    await retryable(async () => {
      const response: AppResponse<ListReminderResponse> = await supertest(
        expressApp,
      )
        .get(`/reminders?timezone=${timezone}`)
        .expect(200);
      expect(response.body.items.map((reminder) => reminder.id)).not.toContain(
        id,
      );
    });
  };
});

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
