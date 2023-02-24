import { gp2 as gp2Model } from '@asap-hub/model';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';

export const getEvent = jest.fn(
  async (id: string): Promise<gp2Model.EventResponse> => ({
    ...gp2Fixtures.createEventResponse(),
    id,
  }),
);

export const getEvents = jest.fn(
  async (): Promise<gp2Model.ListEventResponse> => ({
    ...gp2Fixtures.createListEventResponse(2),
  }),
);
