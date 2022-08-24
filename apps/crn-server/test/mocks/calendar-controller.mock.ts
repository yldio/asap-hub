import { CalendarController } from '../../src/controllers/calendars';

export const calendarControllerMock: jest.Mocked<CalendarController> = {
  fetch: jest.fn(),
  fetchRaw: jest.fn(),
  fetchByResourceId: jest.fn(),
  fetchById: jest.fn(),
  getSyncToken: jest.fn(),
  update: jest.fn(),
  create: jest.fn(),
};
