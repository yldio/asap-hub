import { FetchOptions, ListResponse } from '../common';
import { Connection, UserSocialLinks } from '../user';
import { Keyword } from './common';
import { ProjectDataObject, ProjectMember } from './project';
import { WorkingGroupDataObject, WorkingGroupMember } from './working-group';

export const userRoles = [
  'Administrator',
  'Hidden',
  'Network Collaborator',
  'Network Investigator',
  'Trainee',
  'Working Group Participant',
] as const;

export type UserRole = typeof userRoles[number];

export const userDegrees = [
  'AA',
  'AAS',
  'BA',
  'BSc',
  'MA',
  'MBA',
  'MBBS',
  'MD',
  'MD, PhD',
  'MPH',
  'MSc',
  'PhD',
  'PharmD',
] as const;
export type UserDegree = typeof userDegrees[number];

export const userRegions = [
  'Africa',
  'Asia',
  'Australia/Australiasia',
  'Europe',
  'Latin America',
  'North America',
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
export type UserWorkingGroupMember = Pick<
  WorkingGroupMember,
  'userId' | 'role'
>;
type UserWorkingGroup = Pick<WorkingGroupDataObject, 'id' | 'title'> & {
  members: UserWorkingGroupMember[];
};

type Telephone = { countryCode?: string; number?: string };

export const userContributingCohortRole = [
  'Investigator',
  'Lead Investigator',
  'Co-Investigator',
] as const;
export type UserContributingCohortRole =
  typeof userContributingCohortRole[number];
export type UserContributingCohort = {
  role: UserContributingCohortRole;
  studyUrl?: string;
  name: string;
  contributingCohortId: string;
};

export interface UserSocial
  extends Omit<
    UserSocialLinks,
    'website1' | 'website2' | 'researchGate' | 'researcherId'
  > {
  blog?: string;
}

export type UserDataObject = {
  avatarUrl?: string;
  city?: string;
  connections?: Connection[];
  country: string;
  createdDate: string;
  degrees: UserDegree[];
  email: string;
  firstName: string;
  id: string;
  lastName: string;
  onboarded: boolean;
  positions: UserPosition[];
  region: UserRegion;
  role: UserRole;
  projects: UserProject[];
  questions: string[];
  workingGroups: UserWorkingGroup[];
  fundingStreams?: string;
  contributingCohorts: UserContributingCohort[];
  secondaryEmail?: string;
  telephone?: Telephone;
  social?: UserSocial;
  keywords: Keyword[];
  biography?: string;
  activatedDate?: string;
};

export type UserCreateDataObject = Omit<
  UserDataObject,
  'id' | 'createdDate' | 'projects' | 'workingGroups'
>;

export type UserUpdateDataObject = Partial<UserCreateDataObject>;
export type UserPatchRequest = Omit<
  UserUpdateDataObject,
  | 'avatarUrl'
  | 'connections'
  | 'email'
  | 'role'
  | 'createdDate'
  | 'activatedDate'
>;

export type UserAvatarPostRequest = {
  avatar: string;
};

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
  hidden?: boolean;
};

export type FetchUsersOptions = FetchOptions<FetchUsersFilter>;
