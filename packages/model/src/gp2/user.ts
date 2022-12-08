import { FetchOptions, ListResponse } from '../common';
import { Connection } from '../user';
import { Keyword } from './common';
import { ProjectDataObject, ProjectMember } from './project';
import { WorkingGroupDataObject, WorkingGroupMember } from './working-group';

export const userRoles = [
  'Working Group Participant',
  'Network Investigator',
  'Network Collaborator',
  'Administrator',
  'Trainee',
] as const;

export type UserRole = typeof userRoles[number];

export const userDegrees = [
  'AA',
  'AAS',
  'BA',
  'BSc',
  'MSc',
  'PhD',
  'MD',
  'MD, PhD',
  'MPH',
  'MA',
  'MBA',
  'PharmD',
  'MBBS',
] as const;
export type UserDegree = typeof userDegrees[number];

export const userRegions = [
  'Africa',
  'Asia',
  'Australia/Australiasia',
  'Europe',
  'North America',
  'Latin America',
  'South America',
] as const;

export type UserRegion = typeof userRegions[number];

export type UserPosition = {
  role: string;
  department: string;
  institution: string;
};

type UserProjectMember = Pick<ProjectMember, 'userId' | 'role'>;
type UserProject = Pick<ProjectDataObject, 'id' | 'title' | 'status'> & {
  members: UserProjectMember[];
};
type UserWorkingGroupMember = Pick<WorkingGroupMember, 'userId' | 'role'>;
type UserWorkingGroup = Pick<WorkingGroupDataObject, 'id' | 'title'> & {
  members: UserWorkingGroupMember[];
};

type Telephone = { countryCode?: string; number?: string };

export type UserDataObject = {
  avatarUrl?: string;
  city?: string;
  connections?: Connection[];
  country: string;
  createdDate: string;
  degrees?: UserDegree[];
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  onboarded: boolean;
  positions: UserPosition[];
  region: UserRegion;
  role: UserRole;
  projects: UserProject[];
  workingGroups: UserWorkingGroup[];
  fundingStreams?: string;
  contributingCohorts: unknown[];
  secondaryEmail?: string;
  telephone?: Telephone;
  keywords: Keyword[];
  biography?: string;
};

export type UserCreateDataObject = Omit<
  UserDataObject,
  'id' | 'createdDate' | 'projects' | 'workingGroups' | 'contributingCohorts'
>;

export type UserUpdateDataObject = Partial<UserCreateDataObject>;
export type UserPatchRequest = Omit<
  UserUpdateDataObject,
  'avatarUrl' | 'connections' | 'email' | 'role'
>;

export type ListUserDataObject = ListResponse<UserDataObject>;

export interface UserResponse extends Omit<UserDataObject, 'connections'> {
  displayName: string;
}
export type ListUserResponse = ListResponse<UserResponse>;
export type UserUpdateRequest = UserUpdateDataObject;

export type FetchUsersFilter = {
  regions?: UserRegion[];
  keywords?: Keyword[];
  code?: string;
  onlyOnboarded?: boolean;
  projects?: string[];
  workingGroups?: string[];
};

export type FetchUsersOptions = FetchOptions<FetchUsersFilter>;
