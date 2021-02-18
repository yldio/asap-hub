import { EventResponse } from '@asap-hub/model';
import { createEventResponse } from '@asap-hub/fixtures';

export const getEvent = jest.fn(
  async (id: string): Promise<EventResponse> => ({
    ...createEventResponse(),
    id,
  }),
);
