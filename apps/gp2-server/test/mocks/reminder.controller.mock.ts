import ReminderController from '../../src/controllers/reminder.controller';

export const reminderControllerMock = {
  fetch: jest.fn(),
} as unknown as jest.Mocked<ReminderController>;
