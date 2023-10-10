import { PageResponse } from './page';
import { UserResponse } from './user';

export type DiscoverDataObject = {
  aboutUs: string;
  members: UserResponse[];
  membersTeamId?: string;
  scientificAdvisoryBoard: UserResponse[];
  pages: PageResponse[];
};

export type DiscoverResponse = DiscoverDataObject;
