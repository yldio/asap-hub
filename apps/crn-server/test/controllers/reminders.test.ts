import Reminders from '../../src/controllers/reminders';
import {
  getReminderDataObject,
  getReminderResponse,
} from '../fixtures/reminders.fixtures';
import { reminderDataProviderMock } from '../mocks/reminder-data-provider.mock';

describe('Reminder Controller', () => {
  const reminderController = new Reminders(reminderDataProviderMock);

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Fetch method', () => {
    const userId = 'some-user-id';

    test('Should return the reminders', async () => {
      reminderDataProviderMock.fetch.mockResolvedValueOnce({
        total: 1,
        items: [getReminderDataObject()],
      });

      const result = await reminderController.fetch({ userId });

      expect(result).toEqual({ items: [getReminderResponse()], total: 1 });
    });

    test('Should return an empty list when there are no reminders', async () => {
      reminderDataProviderMock.fetch.mockResolvedValueOnce({
        total: 0,
        items: [],
      });
      const result = await reminderController.fetch({ userId });

      expect(result).toEqual({ items: [], total: 0 });
    });

    test('Should call the data provider with correct parameters', async () => {
      reminderDataProviderMock.fetch.mockResolvedValueOnce({
        total: 1,
        items: [getReminderDataObject()],
      });

      await reminderController.fetch({ userId });

      expect(reminderDataProviderMock.fetch).toBeCalledWith({
        userId,
      });
    });

    test('Should throw an error when the reminder is not supported', async () => {
      const reminderDataObject = getReminderDataObject();
      reminderDataObject.entity = 'Research Output';
      reminderDataObject.type = 'some-type' as any;

      reminderDataProviderMock.fetch.mockResolvedValueOnce({
        total: 1,
        items: [reminderDataObject],
      });

      await expect(reminderController.fetch({ userId })).rejects.toThrow(
        "Reminder type 'some-type' for entity 'Research Output' is not supported",
      );
    });
  });
});
