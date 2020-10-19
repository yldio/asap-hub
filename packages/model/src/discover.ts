import { PageResponse } from './page';
import { UserResponse } from './user';

export interface DiscoverResponse {
  pages: ReadonlyArray<PageResponse>;
  members: ReadonlyArray<UserResponse>;
  aboutUs: string;
}
