import CalendarController from '../../src/controllers/calendar.controller';

export const calendarControllerMock = {
  fetch: jest.fn(),
  fetchById: jest.fn(),
  update: jest.fn(),
} as unknown as jest.Mocked<CalendarController>;
