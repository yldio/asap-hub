import { FetchOptions, ListResponse, OrcidWork } from '../common';
import { Connection, UserSocialLinks } from '../user';
import { TagDataObject } from './tag';
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

export type UserRole = (typeof userRoles)[number];

export const userDegrees = [
  'AA',
  'AAS',
  'BA',
  'BSc',
  'DO',
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
export type UserDegree = (typeof userDegrees)[number];

export const userRegions = [
  'Africa',
  'Asia',
  'Australia/Australasia',
  'Europe',
  'Latin America',
  'North America',
  'South America',
] as const;

export type UserRegion = (typeof userRegions)[number];

export type UserPosition = {
  role: string;
  department: string;
  institution: string;
};

type UserProjectMember = Pick<ProjectMember, 'userId' | 'role'>;
export type UserProject = Pick<ProjectDataObject, 'id' | 'title' | 'status'> & {
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
  (typeof userContributingCohortRole)[number];

export type UserContributingCohort = {
  role: UserContributingCohortRole;
  studyUrl?: string;
  name: string;
  contributingCohortId: string;
};

export interface UserSocial
  extends Omit<UserSocialLinks, 'website1' | 'website2'> {
  blog?: string;
}

export type UserDataObject = {
  id: string;
  activatedDate?: string;
  lastModifiedDate: string;
  alternativeEmail?: string;
  avatarUrl?: string;
  biography?: string;
  city?: string;
  connections?: Connection[];
  contributingCohorts: UserContributingCohort[];
  country: string;
  createdDate: string;
  degrees: UserDegree[];
  email: string;
  firstName: string;
  fundingStreams?: string;
  tags: TagDataObject[];
  lastName: string;
  onboarded: boolean;
  orcid?: string;
  orcidLastModifiedDate?: string;
  orcidLastSyncDate?: string;
  orcidWorks?: OrcidWork[];
  positions: UserPosition[];
  projects: UserProject[];
  questions: string[];
  region: UserRegion;
  role: UserRole;
  social?: UserSocial;
  telephone?: Telephone;
  workingGroups: UserWorkingGroup[];
};

export type UserCreateDataObject = Omit<
  UserDataObject,
  | 'id'
  | 'createdDate'
  | 'lastModifiedDate'
  | 'avatarUrl'
  | 'projects'
  | 'workingGroups'
  | 'contributingCohorts'
  | 'connections'
  | 'tags'
  | 'social'
> & {
  contributingCohorts: Omit<UserContributingCohort, 'name'>[];
  avatar?: string;
  tags?: Omit<TagDataObject, 'name'>[];
  social?: Omit<UserSocialLinks, 'orcid' | 'website1' | 'website2'>;
};

export type UserUpdateDataObject = Partial<
  Omit<UserCreateDataObject, 'alternativeEmail' | 'tags'>
> &
  Partial<Pick<UserDataObject, 'connections'>> & {
    alternativeEmail?: string | null;
    tags?: Omit<TagDataObject, 'name'>[];
  };
export type UserPatchRequest = Omit<
  UserUpdateDataObject,
  | 'avatar'
  | 'connections'
  | 'email'
  | 'role'
  | 'createdDate'
  | 'activatedDate'
  | 'orcidLastModifiedDate'
  | 'orcidLastSyncDate'
  | 'orcidWorks'
>;

export type UserAvatarPostRequest = {
  avatar: string;
};

export type ListUserDataObject = ListResponse<UserDataObject>;

export interface UserResponse
  extends Omit<UserDataObject, 'connections' | 'lastModifiedDate'> {
  displayName: string;
  projectIds: string[];
  workingGroupIds: string[];
  tagIds: string[];
}
export type ListUserResponse = ListResponse<UserResponse>;
export type UserMetadataResponse = UserResponse & {
  algoliaApiKey: string | null;
};
export type UserUpdateRequest = UserUpdateDataObject;

export type FetchUsersSearchFilter = {
  projects?: string[];
  workingGroups?: string[];
  regions?: UserRegion[];
  tags?: string[];
};
export type FetchUsersFilter = FetchUsersSearchFilter & {
  code?: string;
  onlyOnboarded?: boolean;
  hidden?: boolean;
  userIds?: string[];
  orcid?: string;
  orcidLastSyncDate?: string;
};

export type FetchUsersOptions = FetchOptions<FetchUsersFilter>;
export type FetchUsersApiOptions = FetchOptions<
  Omit<FetchUsersFilter, 'orcid' | 'orcidLastSyncDate'>
>;
