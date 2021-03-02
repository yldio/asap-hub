import { CalendarController } from '../../src/controllers/calendars';

export const calendarControllerMock: jest.Mocked<CalendarController> = {
  fetch: jest.fn(),
  fetchRaw: jest.fn(),
  fetchByResouceId: jest.fn(),
  getSyncToken: jest.fn(),
  update: jest.fn(),
};
