import { PageResponse } from './page';
import { UserResponse } from './user';
import { NewsResponse } from './news';
import { TutorialsResponse } from './tutorials';

export interface DiscoverResponse {
  aboutUs: string;
  members: ReadonlyArray<UserResponse>;
  membersTeamId?: string;
  scientificAdvisoryBoard: ReadonlyArray<UserResponse>;
  pages: ReadonlyArray<PageResponse>;
  training: ReadonlyArray<TutorialsResponse>;
  workingGroups: ReadonlyArray<NewsResponse>;
}
