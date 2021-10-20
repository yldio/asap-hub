import Boom from '@hapi/boom';
import Intercept from 'apr-intercept';
import { EventResponse, ListEventResponse } from '@asap-hub/model';
import { RestEvent, Event } from '@asap-hub/squidex';
import {
  InstrumentedSquidexGraphql,
  InstrumentedSquidex,
} from '../utils/instrumented-client';
import { parseGraphQLEvent } from '../entities/event';
import { AllOrNone, FetchOptions } from '../utils/types';

import { sanitiseForSquidex } from '../utils/squidex';
import {
  FETCH_EVENT,
  FETCH_EVENTS,
  FETCH_GROUP_CALENDAR,
} from '../queries/events.queries';
import {
  FetchEventQuery,
  FetchEventQueryVariables,
  FetchEventsQuery,
  FetchEventsQueryVariables,
  FetchGroupCalendarQuery,
  FetchGroupCalendarQueryVariables,
} from '../gql/graphql';
import logger from '../utils/logger';

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
      take = 10,
      skip = 0,
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

    filters.push('not(empty(data/calendar/iv))');
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
        FetchGroupCalendarQuery,
        FetchGroupCalendarQueryVariables
      >(FETCH_GROUP_CALENDAR, {
        id: groupId,
      });

      if (!findGroupsContent) {
        throw Boom.notFound();
      }

      const calendarIds = (findGroupsContent.flatData.calendars ?? []).map(
        ({ id }) => `'${id}'`,
      );

      filters.push(`data/calendar/iv in [${calendarIds.join(', ')}]`);
    }

    const { queryEventsContentsWithTotal } = await this.client.request<
      FetchEventsQuery,
      FetchEventsQueryVariables
    >(FETCH_EVENTS, {
      filter: filters.join(' and '),
      top: take,
      skip,
      order: orderby,
    });

    if (
      !queryEventsContentsWithTotal?.total ||
      !queryEventsContentsWithTotal?.items
    ) {
      logger.warn('queryEventsContentsWithTotal returned null');
      return {
        total: 0,
        items: [],
      };
    }

    return {
      total: queryEventsContentsWithTotal.total,
      items: queryEventsContentsWithTotal.items.map((item) =>
        parseGraphQLEvent(item),
      ),
    };
  }

  async fetchById(eventId: string): Promise<EventResponse> {
    const { findEventsContent: event } = await this.client.request<
      FetchEventQuery,
      FetchEventQueryVariables
    >(FETCH_EVENT, { id: eventId });

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
