import { UserResponse } from './user';

export type DiscoverMembers = Omit<UserResponse, 'fullDisplayName'>;

export type DiscoverDataObject = {
  aboutUs: string;
  members: DiscoverMembers[];
  membersTeamId?: string;
  scientificAdvisoryBoard: DiscoverMembers[];
};

export type DiscoverResponse = DiscoverDataObject;
