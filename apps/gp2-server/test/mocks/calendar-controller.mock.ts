import { CalendarController } from '../../src/controllers/calendar.controller';

export const calendarControllerMock: jest.Mocked<CalendarController> = {
  fetch: jest.fn(),
  fetchById: jest.fn(),
  update: jest.fn(),
};
