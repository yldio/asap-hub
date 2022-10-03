import { CalendarController } from '../../src/controllers/calendars';

export const calendarControllerMock: jest.Mocked<CalendarController> = {
  fetch: jest.fn(),
  fetchById: jest.fn(),
  update: jest.fn(),
};
