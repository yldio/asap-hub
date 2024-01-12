import { ReminderDataProvider } from '../../src/data-providers/types';

export const reminderDataProviderMock: jest.Mocked<ReminderDataProvider> = {
  fetch: jest.fn(),
  fetchById: jest.fn(),
};
