import ReminderController from '../../src/controllers/reminders.controller';

export const reminderControllerMock = {
  fetch: jest.fn(),
} as unknown as jest.Mocked<ReminderController>;
