import { NotFoundError } from '@asap-hub/errors';
import { gp2 } from '@asap-hub/model';

const processEvent = (event: gp2.EventDataObject) => ({
  ...event,
  _tags: [
    ...(event.workingGroup ? [gp2.eventWorkingGroups] : []),
    ...(event.project ? [gp2.eventProjects] : []),
    ...(event.calendar.name === gp2.gp2CalendarName ? [gp2.eventGP2Hub] : []),
  ],
});
export default class EventController {
  constructor(private dataProvider: gp2.EventDataProvider) {}

  async fetch(options: gp2.FetchEventsOptions): Promise<gp2.ListEventResponse> {
    const events = await this.dataProvider.fetch(options);

    return {
      ...events,
      items: events.items.map(processEvent),
    };
  }

  async fetchById(eventId: string): Promise<gp2.EventResponse> {
    const event = await this.dataProvider.fetchById(eventId);
    if (!event) {
      throw new NotFoundError(undefined, `Event with id ${eventId} not found`);
    }
    return processEvent(event);
  }

  async create(event: gp2.EventCreateRequest): Promise<gp2.EventResponse> {
    const eventId = await this.dataProvider.create(event);
    return this.fetchById(eventId);
  }

  async update(
    eventId: string,
    event: gp2.EventUpdateRequest,
  ): Promise<gp2.EventResponse> {
    await this.dataProvider.update(eventId, event);
    return this.fetchById(eventId);
  }

  async fetchByGoogleId(googleId: string): Promise<gp2.EventResponse | null> {
    const events = await this.dataProvider.fetch({
      take: 1,
      filter: { googleId },
    });

    const [event] = events.items;
    return event ? processEvent(event) : null;
  }
}
