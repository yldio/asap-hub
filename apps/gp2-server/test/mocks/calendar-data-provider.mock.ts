import { gp2 } from '@asap-hub/model';

export const calendarDataProviderMock: jest.Mocked<gp2.CalendarDataProvider> = {
  create: jest.fn(),
  update: jest.fn(),
  fetch: jest.fn(),
  fetchById: jest.fn(),
};
