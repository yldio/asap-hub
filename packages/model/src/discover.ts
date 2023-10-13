import { UserResponse } from './user';

export type DiscoverDataObject = {
  aboutUs: string;
  members: UserResponse[];
  membersTeamId?: string;
  scientificAdvisoryBoard: UserResponse[];
};

export type DiscoverResponse = DiscoverDataObject;
