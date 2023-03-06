import { NotFoundError } from '@asap-hub/errors';
import {
  EventController,
  EventCreateRequest,
  EventDataProvider,
  EventResponse,
  EventUpdateRequest,
  FetchEventsOptions,
  ListEventResponse,
} from '@asap-hub/model';

export default class Events implements EventController {
  constructor(private dataProvider: EventDataProvider) {}

  async fetch(options: FetchEventsOptions): Promise<ListEventResponse> {
    return this.dataProvider.fetch(options);
  }

  async fetchById(eventId: string): Promise<EventResponse> {
    const event = await this.dataProvider.fetchById(eventId);
    if (!event) {
      throw new NotFoundError(undefined, `Event with id ${eventId} not found`);
    }
    return event;
  }

  async create(event: EventCreateRequest): Promise<EventResponse> {
    const eventId = await this.dataProvider.create(event);
    return this.fetchById(eventId);
  }

  async update(
    eventId: string,
    event: EventUpdateRequest,
  ): Promise<EventResponse> {
    await this.dataProvider.update(eventId, event);
    return this.fetchById(eventId);
  }

  async fetchByGoogleId(googleId: string): Promise<EventResponse | null> {
    const events = await this.dataProvider.fetch({
      take: 1,
      filter: { googleId, hidden: true },
    });

    const [event] = events.items;
    return event || null;
  }
}
