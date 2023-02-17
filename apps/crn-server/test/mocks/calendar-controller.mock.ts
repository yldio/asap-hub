import { CalendarController } from '@asap-hub/server-common';

export const calendarControllerMock: jest.Mocked<CalendarController> = {
  fetch: jest.fn(),
  fetchById: jest.fn(),
  update: jest.fn(),
};
