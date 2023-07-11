import { gp2 } from '@asap-hub/model';

export const calendarControllerMock: jest.Mocked<gp2.CalendarController> = {
  fetch: jest.fn(),
  fetchById: jest.fn(),
  update: jest.fn(),
};
