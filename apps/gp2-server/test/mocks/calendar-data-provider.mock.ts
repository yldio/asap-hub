import { gp2 } from '@asap-hub/model';
import { CalendarDataProvider } from '@asap-hub/server-common';

export const calendarDataProviderMock: jest.Mocked<
  CalendarDataProvider<gp2.CalendarDataObject, gp2.ListCalendarDataObject>
> = {
  create: jest.fn(),
  update: jest.fn(),
  fetch: jest.fn(),
  fetchById: jest.fn(),
};
