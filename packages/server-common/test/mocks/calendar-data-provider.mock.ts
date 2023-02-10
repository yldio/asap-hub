import { CalendarDataProvider } from '../../src';

export const calendarDataProviderMock: jest.Mocked<CalendarDataProvider> = {
  create: jest.fn(),
  update: jest.fn(),
  fetch: jest.fn(),
  fetchById: jest.fn(),
};
