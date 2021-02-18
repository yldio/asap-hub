import { CalendarController } from '../../src/controllers/calendars';

export const calendarControllerMock: jest.Mocked<CalendarController> = {
  fetch: jest.fn(),
  getSyncToken: jest.fn(),
  update: jest.fn(),
};
