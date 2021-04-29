import Boom from '@hapi/boom';
import Intercept from 'apr-intercept';
import { EventResponse, ListEventResponse } from '@asap-hub/model';
import { GraphqlEvent, RestEvent, Event } from '@asap-hub/squidex';
import {
  InstrumentedSquidexGraphql,
  InstrumentedSquidex,
} from '../utils/instrumented-client';
import { FetchOptions, AllOrNone } from '../utils/types';
import { parseGraphQLEvent } from '../entities/event';
import { ResponseFetchGroup, GraphQLQueryGroup } from './groups';
import { sanitiseForSquidex } from '../utils/squidex';

export interface EventController {
  fetch: (options: FetchEventsOptions) => Promise<ListEventResponse>;
  fetchById: (eventId: string) => Promise<EventResponse>;
  create: (event: Event) => Promise<RestEvent>;
  fetchByGoogleId: (googleId: string) => Promise<RestEvent | null>;
  update: (eventId: string, data: Partial<Event>) => Promise<RestEvent>;
}

export default class Events implements EventController {
  client: InstrumentedSquidexGraphql;

  events: InstrumentedSquidex<RestEvent>;

  constructor() {
    this.client = new InstrumentedSquidexGraphql();
    this.events = new InstrumentedSquidex('events');
  }

  async fetch(options: FetchEventsOptions): Promise<ListEventResponse> {
    const {
      take,
      skip,
      before,
      after,
      groupId,
      search,
      sortBy,
      sortOrder,
    } = options;

    const filters = (search || '')
      .split(' ')
      .filter(Boolean)
      .map(sanitiseForSquidex)
      .reduce(
        (acc: string[], word: string) =>
          acc.concat(
            `(${[
              [`contains(data/title/iv, '${word}')`],
              [`contains(data/tags/iv, '${word}')`],
            ].join(' or ')})`,
          ),
        [],
      );

    filters.push('data/hidden/iv ne true');

    if (after) {
      filters.push(`data/endDate/iv gt ${after}`);
    }

    if (before) {
      filters.push(`data/endDate/iv lt ${before}`);
    }

    let orderby = '';

    if (sortBy && sortOrder) {
      orderby = `data/${sortBy}/iv ${sortOrder}`;
    }

    if (groupId) {
      const { findGroupsContent } = await this.client.request<
        ResponseFetchGroup,
        unknown
      >(buildGraphQLQueryFetchGroup(groupId));

      if (!findGroupsContent) {
        throw Boom.notFound();
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const calendarIds = findGroupsContent.flatData!.calendars!.map(
        (calendar) => `'${calendar.id}'`,
      );

      filters.push(`data/calendar/iv in [${calendarIds.join(', ')}]`);
    }

    const query = buildGraphQLQueryFetchEvents(
      filters.join(' and '),
      take,
      skip,
      orderby,
    );

    const { queryEventsContentsWithTotal } = await this.client.request<
      ResponseFetchEvents,
      unknown
    >(query);

    const { total, items: events } = queryEventsContentsWithTotal;

    const items = events.map((item) => parseGraphQLEvent(item));

    return {
      total,
      items,
    };
  }

  async fetchById(eventId: string): Promise<EventResponse> {
    const query = buildGraphQLQueryFetchEvent(eventId);
    const { findEventsContent: event } = await this.client.request<
      ResponseFetchEvent,
      unknown
    >(query);

    if (!event) {
      throw Boom.notFound();
    }

    return parseGraphQLEvent(event);
  }

  // This functions are used by the sync google events script
  // and return RestEvents for the sake of simplicity
  async create(event: Event): Promise<RestEvent> {
    return this.events.create(toEventData(event));
  }

  async update(eventId: string, event: Partial<Event>): Promise<RestEvent> {
    return this.events.patch(eventId, toEventData(event));
  }

  async fetchByGoogleId(googleId: string): Promise<RestEvent | null> {
    const [err, res] = await Intercept(
      this.events.client
        .get('events', {
          searchParams: {
            $top: 1,
            $filter: `data/googleId/iv eq '${googleId}'`,
          },
        })
        .json() as Promise<{ items: RestEvent[] }>,
    );

    if (err) {
      throw err;
    }

    const [event] = res.items;
    return event || null;
  }
}

const toEventData = (data: Partial<Event>): RestEvent['data'] =>
  Object.entries(data).reduce((acc, [key, value]) => {
    acc[key] = { iv: value };
    return acc;
  }, {} as { [key: string]: { iv: unknown } }) as RestEvent['data'];

export const GraphQLQueryEvent = `
id
lastModified
created
flatData{
  description
  endDate
  endDateTimeZone
  startDate
  startDateTimeZone
  meetingLink
  eventLink
  status
  tags
  title
  notesPermanentlyUnavailable
  notes
  videoRecordingPermanentlyUnavailable
  videoRecording
  presentationPermanentlyUnavailable
  presentation
  meetingMaterialsPermanentlyUnavailable
  meetingMaterials {
    url
    title
  }
  calendar {
    flatData {
      id
      color
      name
    }
    referencingGroupsContents {
      ${GraphQLQueryGroup}
    }
  }
  thumbnail {
    id
  }
}`;

export const buildGraphQLQueryFetchEvents = (
  filter: string,
  top = 10,
  skip = 0,
  orderby = '',
): string =>
  `{
  queryEventsContentsWithTotal(top: ${top}, skip: ${skip}, filter: "${filter}", orderby: "${orderby}"){
    total,
    items{
      ${GraphQLQueryEvent}
    }
  }
}`;

export const buildGraphQLQueryFetchEvent = (eventId: string): string => `
  {
    findEventsContent(id: "${eventId}") {
        ${GraphQLQueryEvent}
    }
  }
`;

export const buildGraphQLQueryFetchGroup = (groupId: string): string => `
  {
    findGroupsContent(id: "${groupId}") {
      flatData {
        calendars {
          id
        }
      }
    }
  }
`;

export interface ResponseFetchEvents {
  queryEventsContentsWithTotal: {
    total: number;
    items: GraphqlEvent[];
  };
}

export interface ResponseFetchEvent {
  findEventsContent: GraphqlEvent;
}

export type FetchEventsOptions = (
  | {
      before: string;
      after?: string;
    }
  | {
      after: string;
      before?: string;
    }
) & { groupId?: string } & SortOptions &
  FetchOptions;

type SortOptions = AllOrNone<{
  sortBy: 'startDate' | 'endDate';
  sortOrder: 'asc' | 'desc';
}>;
