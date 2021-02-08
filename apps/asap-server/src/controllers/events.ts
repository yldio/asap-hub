import { ListEventResponse } from '@asap-hub/model';
import { FetchPaginationOptions } from '../utils/types';

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
