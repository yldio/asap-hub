import { PageResponse } from './page';
import { UserResponse } from './user';
import { NewsResponse } from './news';

export interface DiscoverResponse {
  aboutUs: string;
  members: ReadonlyArray<UserResponse>;
  membersTeamId?: string;
  scientificAdvisoryBoard: ReadonlyArray<UserResponse>;
  pages: ReadonlyArray<PageResponse>;
  training: ReadonlyArray<NewsResponse>;
  workingGroups: ReadonlyArray<NewsResponse>;
}
