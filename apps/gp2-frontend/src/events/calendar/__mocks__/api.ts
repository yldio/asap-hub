import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 as gp2Model } from '@asap-hub/model';

export const getCalendars = jest.fn(
  async (): Promise<gp2Model.ListCalendarResponse> => ({
    ...gp2Fixtures.createListCalendarResponse(),
  }),
);
