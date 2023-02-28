import {
  EventResponse,
  FetchEventsOptions,
  ListEventResponse,
} from '@asap-hub/model';
import { Event, RestEvent } from '@asap-hub/squidex';

export interface EventController {
  fetch: (options: FetchEventsOptions) => Promise<ListEventResponse>;
  fetchById: (eventId: string) => Promise<EventResponse>;
  create: (event: Event) => Promise<RestEvent>;
  fetchByGoogleId: (googleId: string) => Promise<RestEvent | null>;
  update: (eventId: string, data: Partial<Event>) => Promise<RestEvent>;
}
