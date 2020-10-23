import { PageResponse } from './page';
import { UserResponse } from './user';
import { NewsAndEventsResponse } from './news-and-events';

export interface DiscoverResponse {
  aboutUs: string;
  members: ReadonlyArray<UserResponse>;
  pages: ReadonlyArray<PageResponse>;
  training: ReadonlyArray<NewsAndEventsResponse>;
}
