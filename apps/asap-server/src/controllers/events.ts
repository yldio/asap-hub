import { ListEventResponse } from '@asap-hub/model';
import { GraphqlEvent } from '@asap-hub/squidex';
import { FetchPaginationOptions } from '../utils/types';

export const GraphQLQueryEvent = `
id
created flatData{
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
  filter = '',
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

export interface ResponseFetchEvents {
  queryEventsContentsWithTotal: {
    total: number;
    items: GraphqlEvent[];
  };
}

export type FetchEventsOptions = {
  before?: string;
  after?: string;
} & FetchPaginationOptions;

export interface EventController {
  fetch: (options: FetchEventsOptions) => Promise<ListEventResponse>;
}

export default class Events implements EventController {
  // eslint-disable-next-line class-methods-use-this
  async fetch(): Promise<ListEventResponse> {
    return {
      total: 0,
      items: [],
    };
  }
}
