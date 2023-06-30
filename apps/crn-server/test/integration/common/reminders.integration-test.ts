import supertest from 'supertest';
import { Express } from 'express';
import {
  EventCreateDataObject,
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
} from '../fixtures';
import { getCalendarFixture } from '../fixtures/calendar';

jest.mock('../../../src/config', () => ({
  ...jest.requireActual('../../../src/config'),
  isContentfulEnabledV2:
    process.env.INTEGRATION_TEST_CMS === 'contentful' ? 'true' : undefined,
  logLevel: 'silent',
}));

jest.setTimeout(120000);

// THIS WILL BE CHANGED AFTER ADDING CONTENTFUL REMINDER DATA PROVIDER
const fixtures = FixtureFactory('squidex');

type AppResponse<T> = {
  status: number;
  body: T;
};

describe('Reminders', () => {
  let app: Express;
  let loggedInUser: UserFixture;
  let notLoggedInUser: UserFixture;
  let team: TeamFixture;

  beforeEach(async () => {
    jest.useFakeTimers();
    team = await fixtures.createTeam(getTeamFixture());
    loggedInUser = await fixtures.createUser(
      getUserFixture({
        teams: [
          {
            id: team.id,
            role: 'Collaborating PI',
          },
        ],
      }),
    );
    notLoggedInUser = await fixtures.createUser(
      getUserFixture({
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

  afterEach(async () => {
    await fixtures.teardown();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('Event Happening Today Reminder', () => {
    test('Should see the reminder when the event starts today', async () => {
      const now = new Date('2022-08-10T05:00:00.0Z');
      const startDate = new Date('2022-08-10T15:00:00.0Z').toISOString();

      jest.setSystemTime(now);
      const event = await createEvent({ startDate });
      await expectReminderWithId(`event-happening-today-${event.id}`);
    });

    test('Should not see the reminder if the event has already started', async () => {
      const now = new Date('2022-08-10T05:00:00.0Z');
      const startDate = new Date('2022-08-10T04:00:00.0Z').toISOString();

      jest.setSystemTime(now);
      const event = await createEvent({ startDate });
      await expectNotToContainingReminderWithId(
        `event-happening-today-${event.id}`,
      );
    });

    test("Should not see the reminder if the event is happening on the next day of the user's timezone", async () => {
      // setting system time to 5AM in UTC
      const now = new Date('2022-08-10T05:00:00.0Z');
      // the event happening at 4PM in UTC
      const startDate = new Date('2022-08-10T16:00:00.0Z').toISOString();

      // requesting reminders for the user based in LA where 5AM UTC is 10PM the previous day
      const timezone = 'America/Los_Angeles';

      jest.setSystemTime(now);
      const event = await createEvent({ startDate });
      await expectNotToContainingReminderWithId(
        `event-happening-today-${event.id}`,
        app,
        timezone,
      );
    });

    test('Should see two reminders for two events from two different calendars happening today', async () => {
      const now = new Date('2022-08-10T05:00:00.0Z');
      const startDate1 = new Date('2022-08-10T18:00:00.0Z').toISOString();
      const startDate2 = new Date('2022-08-10T16:00:00.0Z').toISOString();

      jest.setSystemTime(now);
      const event1 = await createEvent({ startDate: startDate1 });
      const event2 = await createEvent({ startDate: startDate2 });
      await retryable(async () => {
        const response = await supertest(app)
          .get(`/reminders?timezone=Europe/London`)
          .expect(200);
        expect(response.body.total).toEqual(2);
        expect(response.body.items).toEqual([
          expect.objectContaining({
            id: `event-happening-today-${event1.id}`,
          }),
          expect.objectContaining({
            id: `event-happening-today-${event2.id}`,
          }),
        ]);
      });
    });
  });

  describe('Event Happening Now Reminder', () => {
    test('Should see the reminder when the event has started but has not finished', async () => {
      const now = new Date('2022-08-10T10:05:00.0Z');
      const startDate = new Date('2022-08-10T10:00:00.0Z').toISOString();
      const endDate = new Date('2022-08-10T11:00:00.0Z').toISOString();

      jest.setSystemTime(now);
      const event = await createEvent({ startDate, endDate });
      await expectReminderWithId(`event-happening-now-${event.id}`);
    });

    test('Should not see the reminder when the event is happening but its status is Draft', async () => {
      const now = new Date('2022-08-10T10:05:00.0Z');
      const startDate = new Date('2022-08-10T10:00:00.0Z').toISOString();
      const endDate = new Date('2022-08-10T11:00:00.0Z').toISOString();
      jest.setSystemTime(now);
      const event = await createEvent({ startDate, endDate });
      await fixtures.publishEvent(event.id, 'Draft');
      await expectNotToContainingReminderWithId(
        `event-happening-now-${event.id}`,
      );
    });

    test('Should not see the reminder when the event has already ended', async () => {
      const now = new Date('2022-08-10T11:05:00.0Z');
      const startDate = new Date('2022-08-10T10:00:00.0Z').toISOString();
      const endDate = new Date('2022-08-10T11:00:00.0Z').toISOString();

      jest.setSystemTime(now);
      const event = await createEvent({ startDate, endDate });
      await expectNotToContainingReminderWithId(
        `event-happening-now-${event.id}`,
      );
    });
  });

  describe('Share Presentation Reminder', () => {
    test('Should see the reminder when the event has finished and user is a speaker', async () => {
      const now = new Date('2022-08-10T11:05:00.0Z');
      const startDate = new Date('2022-08-10T10:00:00.0Z').toISOString();
      const endDate = new Date('2022-08-10T11:00:00.0Z').toISOString();

      jest.setSystemTime(now);
      const event = await createEvent({
        startDate,
        endDate,
        speakers: [
          {
            user: [loggedInUser.id],
            team: [team.id],
          },
        ],
      });
      await expectReminderWithId(`share-presentation-${event.id}`);
    });

    test('Should not see the reminder when the event has finished and user is not a speaker', async () => {
      const now = new Date('2022-08-10T11:05:00.0Z');
      const startDate = new Date('2022-08-10T10:00:00.0Z').toISOString();
      const endDate = new Date('2022-08-10T11:00:00.0Z').toISOString();

      jest.setSystemTime(now);
      const event = await createEvent({
        startDate,
        endDate,
        speakers: [
          {
            user: [notLoggedInUser.id],
            team: [team.id],
          },
        ],
      });

      await expectNotToContainingReminderWithId(
        `share-presentation-${event.id}`,
      );
    });

    test('Should not see the reminder when the event has finished, user is a speaker but it is also a PM', async () => {
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
    });

    test('Should not see the reminder when the event has not finished', async () => {
      const now = new Date('2022-08-10T10:59:00.0Z');
      const startDate = new Date('2022-08-10T10:00:00.0Z').toISOString();
      const endDate = new Date('2022-08-10T11:00:00.0Z').toISOString();

      jest.setSystemTime(now);
      const event = await createEvent({
        startDate,
        endDate,
        speakers: [
          {
            user: [loggedInUser.id],
            team: [team.id],
          },
        ],
      });
      await expectNotToContainingReminderWithId(
        `share-presentation-${event.id}`,
      );
    });

    test('Should not see the reminder when the event is a future event', async () => {
      const now = new Date('2022-08-10T07:00:00.0Z');
      const startDate = new Date('2022-08-10T10:00:00.0Z').toISOString();
      const endDate = new Date('2022-08-10T11:00:00.0Z').toISOString();

      jest.setSystemTime(now);
      const event = await createEvent({
        startDate,
        endDate,
        speakers: [
          {
            user: [loggedInUser.id],
            team: [team.id],
          },
        ],
      });
      await expectNotToContainingReminderWithId(
        `share-presentation-${event.id}`,
      );
    });
  });

  describe('Publish Material Reminder', () => {
    test('Should see the reminder when the event has finished and logged in user is staff', async () => {
      const now = new Date('2022-08-10T11:05:00.0Z');
      const startDate = new Date('2022-08-10T10:00:00.0Z').toISOString();
      const endDate = new Date('2022-08-10T11:00:00.0Z').toISOString();

      jest.setSystemTime(now);
      const { app: appWithStaffLoggedUser } = await createLoggedInUserAndGetApp(
        {
          role: 'Staff',
        },
      );
      const event = await createEvent({ startDate, endDate });
      await expectReminderWithId(
        `publish-material-${event.id}`,
        appWithStaffLoggedUser,
      );
    });

    test('Should not see the reminder when the event has finished and logged in user is not a staff', async () => {
      const now = new Date('2022-08-10T11:05:00.0Z');
      const startDate = new Date('2022-08-10T10:00:00.0Z').toISOString();
      const endDate = new Date('2022-08-10T11:00:00.0Z').toISOString();

      jest.setSystemTime(now);
      const { app: appWithGranteeLoggedUser } =
        await createLoggedInUserAndGetApp({
          role: 'Grantee',
        });
      const event = await createEvent({ startDate, endDate });
      await expectNotToContainingReminderWithId(
        `publish-material-${event.id}`,
        appWithGranteeLoggedUser,
      );
    });

    test('Should not see the reminder when the event has not finished', async () => {
      const now = new Date('2022-08-10T10:59:00.0Z');
      const startDate = new Date('2022-08-10T10:00:00.0Z').toISOString();
      const endDate = new Date('2022-08-10T11:00:00.0Z').toISOString();

      jest.setSystemTime(now);
      const { app: appWithStaffLoggedUser } = await createLoggedInUserAndGetApp(
        {
          role: 'Staff',
        },
      );
      const event = await createEvent({ startDate, endDate });
      await expectNotToContainingReminderWithId(
        `publish-material-${event.id}`,
        appWithStaffLoggedUser,
      );
    });

    test('Should not see the reminder when the event is a future event', async () => {
      const now = new Date('2022-08-10T07:00:00.0Z');
      const startDate = new Date('2022-08-10T10:00:00.0Z').toISOString();
      const endDate = new Date('2022-08-10T11:00:00.0Z').toISOString();

      jest.setSystemTime(now);
      const { app: appWithStaffLoggedUser } = await createLoggedInUserAndGetApp(
        {
          role: 'Staff',
        },
      );
      const event = await createEvent({ startDate, endDate });
      await expectNotToContainingReminderWithId(
        `publish-material-${event.id}`,
        appWithStaffLoggedUser,
      );
    });
  });

  describe('Upload Presentation Reminder', () => {
    test('Should see the reminder when the event has finished and logged in user is a PM of one of the speaker teams', async () => {
      const now = new Date('2022-08-10T11:05:00.0Z');
      const startDate = new Date('2022-08-10T10:00:00.0Z').toISOString();
      const endDate = new Date('2022-08-10T11:00:00.0Z').toISOString();

      jest.setSystemTime(now);
      const { app: appWithPMLoggedInUser } = await createLoggedInUserAndGetApp({
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
            user: [notLoggedInUser.id],
            team: [team.id],
          },
        ],
      });

      await expectReminderWithId(
        `upload-presentation-${event.id}`,
        appWithPMLoggedInUser,
      );
    });

    test('Should not see the reminder when the event has finished and logged in user is not a PM of one of the speaker teams', async () => {
      const now = new Date('2022-08-10T11:05:00.0Z');
      const startDate = new Date('2022-08-10T10:00:00.0Z').toISOString();
      const endDate = new Date('2022-08-10T11:00:00.0Z').toISOString();

      jest.setSystemTime(now);
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
        startDate,
        endDate,
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
    });

    test('Should not see the reminder when the event has not finished', async () => {
      const now = new Date('2022-08-10T10:59:00.0Z');
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
        `upload-presentation-${event.id}`,
        appWithPMLoggedUser,
      );
    });

    test('Should not see the reminder when the event is a future event', async () => {
      const now = new Date('2022-08-10T07:00:00.0Z');
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
        `upload-presentation-${event.id}`,
        appWithPMLoggedUser,
      );
    });
  });

  describe('Materials Reminder', () => {
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
      '$material Updated Reminder',
      ({ material, materialUpdatedAtName, materialContentName }: TestProps) => {
        test(`Should see the reminder when a ${material} was updated in the last 24 hours`, async () => {
          const now = new Date('2022-08-10T23:59:00.0Z');
          const updatedAt = new Date('2022-08-10T00:01:00.0Z').toISOString();

          jest.setSystemTime(now);
          const event = await createEvent({
            [materialUpdatedAtName]: updatedAt,
          });
          await expectReminderWithId(
            `${material.toLowerCase()}-event-updated-${event.id}`,
          );
        });

        test(`Should not see the reminder when a ${material} was updated in an event more than 24 hours ago`, async () => {
          const now = new Date('2022-08-10T23:59:00.0Z');
          const updatedAt = new Date('2022-08-09T23:00:00.0Z').toISOString();

          jest.setSystemTime(now);
          const event = await createEvent({
            [materialUpdatedAtName]: updatedAt,
          });
          await expectNotToContainingReminderWithId(
            `${material.toLowerCase()}-event-updated-${event.id}`,
          );
        });

        test(`Should not see the reminder when ${material} was erased in an event`, async () => {
          jest.useRealTimers();

          const event = await createEvent();
          await expectNotToContainingReminderWithId(
            `${material.toLowerCase()}-event-updated-${event.id}`,
          );

          const updatedEventWithMaterial = await fixtures.updateEvent(
            event.id,
            {
              [materialContentName]: 'I am a material',
            },
          );
          await expectReminderWithId(
            `${material.toLowerCase()}-event-updated-${
              updatedEventWithMaterial.id
            }`,
          );

          // user erases material
          const updatedEventWithoutMaterial = await fixtures.updateEvent(
            event.id,
            {
              [materialContentName]: '',
            },
          );
          await expectNotToContainingReminderWithId(
            `${material.toLowerCase()}-event-updated-${
              updatedEventWithoutMaterial.id
            }`,
          );
        });
      },
    );
  });

  describe('Multiple reminders', () => {
    // TODO: add research output reminders here
    test('Should retrieve multiple reminders and sort them by the date they refer to', async () => {
      // setting system time to 9:00AM in UTC
      const now = new Date('2022-08-10T09:00:00.0Z');

      jest.setSystemTime(now);
      const eventHappeningToday = await createEvent({
        startDate: new Date('2022-08-10T12:00:00.0Z').toISOString(),
      });
      const eventHappeningNow = await createEvent({
        startDate: new Date('2022-08-10T08:00:00.0Z').toISOString(),
        endDate: new Date('2022-08-10T10:00:00.0Z').toISOString(),
      });
      const endedEventWithLoggedInUserSpeaker = await createEvent({
        endDate: new Date('2022-08-10T06:00:00.0Z').toISOString(),
        speakers: [{ user: [loggedInUser.id], team: [team.id] }],
      });

      await retryable(async () => {
        const response = await supertest(app)
          .get(`/reminders?timezone=Europe/London`)
          .expect(200);
        console.log('response', response.body);
        expect(response.body.total).toEqual(3);
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
    });
  });

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
