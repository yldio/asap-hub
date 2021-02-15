import Boom from '@hapi/boom';
import { ListResponse, EventResponse } from '@asap-hub/model';
import { GraphqlEvent } from '@asap-hub/squidex';
import { FetchPaginationOptions } from '../utils/types';
import { InstrumentedSquidexGraphql } from '../utils/instrumented-client';
import { parseGraphQLEvent } from '../entities/event';
import { ResponseFetchGroup } from './groups';

export interface EventController {
  fetch: (options: FetchEventsOptions) => Promise<ListEventBaseResponse>;
  fetchById: (eventId: string) => Promise<EventBaseResponse>;
}

export type EventBaseResponse = Omit<EventResponse, 'groups'>;
export type ListEventBaseResponse = ListResponse<EventBaseResponse>;

export default class Events implements EventController {
  client: InstrumentedSquidexGraphql;

  constructor() {
    this.client = new InstrumentedSquidexGraphql();
  }

  async fetch(options: FetchEventsOptions): Promise<ListEventBaseResponse> {
    const { take, skip, before, after, groupId } = options;

    const filters = [];

    if (after) {
      filters.push(`data/endDate/iv gt ${after}`);
    }

    if (before) {
      filters.push(`data/startDate/iv lt ${before}`);
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

  async fetchById(eventId: string): Promise<EventBaseResponse> {
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
}

export const GraphQLQueryEvent = `
id
lastModified
created
flatData{
  description
  endDate
  startDate
  meetingLink
  eventLink
  status
  tags
  title
  calendar{
    flatData{
      id
      color
      name
    }
  }
}`;

export const buildGraphQLQueryFetchEvents = (
  filter: string,
  top = 10,
  skip = 0,
): string =>
  `{
  queryEventsContentsWithTotal(top: ${top}, skip: ${skip}, filter: "${filter}"){
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
) & { groupId?: string } & FetchPaginationOptions;
