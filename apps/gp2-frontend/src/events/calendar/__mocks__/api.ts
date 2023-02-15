import { createListCalendarResponse } from '@asap-hub/fixtures';
import { ListCalendarResponse } from '@asap-hub/model';

export const getCalendars = jest.fn(
  async (): Promise<ListCalendarResponse> => ({
    ...createListCalendarResponse(),
  }),
);
