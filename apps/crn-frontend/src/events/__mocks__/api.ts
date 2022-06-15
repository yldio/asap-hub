import { EventResponse, ListEventResponse } from '@asap-hub/model';
import {
  createEventResponse,
  createListEventResponse,
} from '@asap-hub/fixtures';

export const getEvent = jest.fn(
  async (id: string): Promise<EventResponse> => ({
    ...createEventResponse(),
    id,
  }),
);

export const getEvents = jest.fn(
  async (): Promise<ListEventResponse> => ({
    ...createListEventResponse(2),
  }),
);
