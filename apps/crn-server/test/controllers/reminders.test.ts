import {
  EventHappeningNowReminder,
  EventHappeningTodayReminder,
  FetchRemindersOptions,
  ResearchOutputPublishedReminder,
} from '@asap-hub/model';
import Reminders from '../../src/controllers/reminders';
import {
  getResearchOutputPublishedReminder,
  getReminderResponse,
  getEventHappeningTodayReminder,
  getEventHappeningNowReminder,
} from '../fixtures/reminders.fixtures';
import { reminderDataProviderMock } from '../mocks/reminder-data-provider.mock';

describe('Reminder Controller', () => {
  const reminderController = new Reminders(reminderDataProviderMock);

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch method', () => {
    const userId = 'some-user-id';
    const timezone = 'Europe/London';
    const options: FetchRemindersOptions = { userId, timezone };

    test('Should return the reminders', async () => {
      reminderDataProviderMock.fetch.mockResolvedValueOnce({
        total: 1,
        items: [getResearchOutputPublishedReminder()],
      });

      const result = await reminderController.fetch(options);

      expect(result).toEqual({ items: [getReminderResponse()], total: 1 });
    });

    test('Should return an empty list when there are no reminders', async () => {
      reminderDataProviderMock.fetch.mockResolvedValueOnce({
        total: 0,
        items: [],
      });
      const result = await reminderController.fetch(options);

      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should call the data provider with correct parameters', async () => {
      reminderDataProviderMock.fetch.mockResolvedValueOnce({
        total: 1,
        items: [getResearchOutputPublishedReminder()],
      });

      await reminderController.fetch(options);

      expect(reminderDataProviderMock.fetch).toBeCalledWith(options);
    });

    describe('Description and href', () => {
      test('Should return the correct description and href for the research-output-published reminder', async () => {
        const reminderDataObject: ResearchOutputPublishedReminder = {
          ...getResearchOutputPublishedReminder(),
          entity: 'Research Output',
          type: 'Published',
          data: {
            documentType: 'Presentation',
            title: 'Some Test title',
            researchOutputId: 'some-research-output-id',
            addedDate: '2021-01-01',
          },
        };

        reminderDataProviderMock.fetch.mockResolvedValueOnce({
          total: 1,
          items: [reminderDataObject],
        });

        const { items } = await reminderController.fetch(options);

        expect(items[0]).toMatchObject({
          description: `Some Test title Presentation from your ASAP Team is now published on the Hub. If there are errors, please let your PM know.`,
          href: `/shared-research/some-research-output-id`,
        });
      });

      test('Should return the correct description and href for the event-happening-today reminder', async () => {
        const reminderDataObject: EventHappeningTodayReminder = {
          ...getEventHappeningTodayReminder(),
          data: {
            startDate: '2022-02-28T17:00:00.000Z',
            eventId: 'some-event-id',
            title: 'Some Test Event Title',
          },
        };

        reminderDataProviderMock.fetch.mockResolvedValueOnce({
          total: 1,
          items: [reminderDataObject],
        });

        const { items } = await reminderController.fetch(options);

        expect(items[0]).toMatchObject({
          description: `Today there is the Some Test Event Title event happening at 5.00 PM.`,
          href: `/events/some-event-id`,
        });
      });

      test('Should return the event-happening-today description with the time formatted for the desired timezone', async () => {
        const reminderDataObject: EventHappeningTodayReminder = {
          ...getEventHappeningTodayReminder(),
          data: {
            startDate: '2022-02-28T17:00:00.000Z',
            eventId: 'some-event-id',
            title: 'Some Test Event Title',
          },
        };

        reminderDataProviderMock.fetch.mockResolvedValueOnce({
          total: 1,
          items: [reminderDataObject],
        });

        const timezone = 'America/New_York';
        const { items } = await reminderController.fetch({
          userId,
          timezone,
        });

        expect(items[0]).toMatchObject({
          description: `Today there is the Some Test Event Title event happening at 12.00 PM.`,
          href: `/events/some-event-id`,
        });
      });

      test('Should return the correct description and href for the event-happening-now online event reminder', async () => {
        const reminderDataObject: EventHappeningNowReminder =
          getEventHappeningNowReminder();
        reminderDataObject.data.title = 'Some Test Event Title';
        reminderDataObject.data.eventId = 'some-event-id';

        reminderDataProviderMock.fetch.mockResolvedValueOnce({
          total: 1,
          items: [reminderDataObject],
        });

        const { items } = await reminderController.fetch(options);

        expect(items[0]).toMatchObject({
          description: `Some Test Event Title event is happening now! Click here to join the meeting!`,
          href: `/events/some-event-id`,
        });
      });
    });
  });
});
