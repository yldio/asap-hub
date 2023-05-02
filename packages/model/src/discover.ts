import { PageResponse } from './page';
import { UserResponse } from './user';
import { TutorialsResponse } from './tutorials';

export type DiscoverDataObject = {
  aboutUs: string;
  members: UserResponse[];
  membersTeamId?: string;
  scientificAdvisoryBoard: UserResponse[];
  pages: PageResponse[];
  training: TutorialsResponse[];
};

export type DiscoverResponse = DiscoverDataObject;
