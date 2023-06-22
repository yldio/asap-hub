import CalendarController from '../../src/controllers/calendars.controller';

export const calendarControllerMock = {
  fetch: jest.fn(),
  fetchById: jest.fn(),
  update: jest.fn(),
} as unknown as jest.Mocked<CalendarController>;
