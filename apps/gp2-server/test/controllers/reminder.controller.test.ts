import { FetchRemindersOptions } from '@asap-hub/model';
import ReminderController from '../../src/controllers/reminder.controller';
import {
  getOutputPublishedReminder,
  getReminderResponse,
} from '../fixtures/reminder.fixtures';
import { reminderDataProviderMock } from '../mocks/reminder.data-provider.mock';

describe('Reminder Controller', () => {
  const reminderController = new ReminderController(reminderDataProviderMock);
  beforeEach(jest.resetAllMocks);

  describe('Fetch method', () => {
    const userId = 'some-user-id';
    const timezone = 'Europe/London';
    const options: FetchRemindersOptions = { userId, timezone };

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
        items: [getOutputPublishedReminder()],
      });

      await reminderController.fetch(options);

      expect(reminderDataProviderMock.fetch).toHaveBeenCalledWith(options);
    });

    test('Should return the reminders', async () => {
      reminderDataProviderMock.fetch.mockResolvedValueOnce({
        total: 1,
        items: [getOutputPublishedReminder()],
      });

      const result = await reminderController.fetch(options);

      expect(result).toEqual({ items: [getReminderResponse()], total: 1 });
    });
  });
});
