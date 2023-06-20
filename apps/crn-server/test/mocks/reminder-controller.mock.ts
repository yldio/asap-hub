import { ReminderController } from '../../src/controllers/reminders.controller';

export const reminderControllerMock: jest.Mocked<ReminderController> = {
  fetch: jest.fn(),
};
