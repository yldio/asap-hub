import { CalendarController } from '@asap-hub/model';

export const calendarControllerMock: jest.Mocked<CalendarController> = {
  fetch: jest.fn(),
  fetchById: jest.fn(),
  update: jest.fn(),
};
