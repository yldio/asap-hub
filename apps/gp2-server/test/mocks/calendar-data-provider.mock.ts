import { CalendarDataProvider } from '../../src/data-providers/calendar.data-provider';

export const calendarDataProviderMock: jest.Mocked<CalendarDataProvider> = {
  create: jest.fn(),
  update: jest.fn(),
  fetch: jest.fn(),
  fetchById: jest.fn(),
};
