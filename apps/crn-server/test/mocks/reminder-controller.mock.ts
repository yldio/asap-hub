import { ReminderController } from '../../src/controllers/reminders';

export const reminderControllerMock: jest.Mocked<ReminderController> = {
  fetch: jest.fn(),
};
