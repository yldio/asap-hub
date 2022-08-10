import { ReminderDataProvider } from '../../src/data-providers/reminders.data-provider';

export const reminderDataProviderMock: jest.Mocked<ReminderDataProvider> = {
  fetch: jest.fn(),
};
