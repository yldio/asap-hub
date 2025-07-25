import { FetchOptions, ListResponse, OrcidWork } from '../common';
import { Connection, UserSocialLinks } from '../user';
import { TagDataObject } from './tag';
import { ProjectDataObject, ProjectMember } from './project';
import { WorkingGroupDataObject, WorkingGroupMember } from './working-group';
import { OutputResponse } from './output';
import { WorkingGroupResponse } from '../working-group';

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

export type UserOutput = Pick<
  OutputResponse,
  'id' | 'title' | 'shortDescription' | 'gp2Supported' | 'sharingStatus'
>;

export type UserRegion = (typeof userRegions)[number];

export type UserPosition = {
  role: string;
  department: string;
  institution: string;
};

export type UserProjectMember = Pick<ProjectMember, 'userId' | 'role'>;
export type UserProject = Pick<ProjectDataObject, 'id' | 'title' | 'status'> & {
  members: UserProjectMember[];
};
export type UserWorkingGroupMember = Pick<
  WorkingGroupMember,
  'userId' | 'role'
>;
export type UserWorkingGroup = Pick<WorkingGroupDataObject, 'id' | 'title'> & {
  members: UserWorkingGroupMember[];
  role: UserWorkingGroupMember['role'];
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
  blueSky?: string;
  threads?: string;
}

export type UserDataObject = {
  activatedDate?: string;
  activeCampaignId?: string;
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
  id: string;
  lastModifiedDate: string;
  lastName: string;
  middleName?: string;
  nickname?: string;
  onboarded: boolean;
  orcid?: string;
  orcidLastModifiedDate?: string;
  orcidLastSyncDate?: string;
  orcidWorks?: OrcidWork[];
  outputs: UserOutput[];
  positions: UserPosition[];
  projects: UserProject[];
  questions: string[];
  region: UserRegion;
  role: UserRole;
  social?: UserSocial;
  stateOrProvince: string;
  systemPublishedVersion?: number;
  tags: TagDataObject[];
  telephone?: Telephone;
  workingGroups: UserWorkingGroup[];
};

export type UserCreateDataObject = Omit<
  UserDataObject,
  | 'id'
  | 'createdDate'
  | 'lastModifiedDate'
  | 'avatarUrl'
  | 'outputs'
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
  social?: Omit<UserSocial, 'orcid'>;
};

export type UserUpdateDataObject = Partial<
  Omit<UserCreateDataObject, 'alternativeEmail' | 'tags'>
> &
  Partial<Pick<UserDataObject, 'connections'>> & {
    alternativeEmail?: string | null;
    tags?: Omit<TagDataObject, 'name'>[];
  } & {
    activeCampaignCreatedAt?: Date;
    activeCampaignId?: string;
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
  | 'activeCampaignCreatedAt'
  | 'activeCampaignId'
  | 'systemPublishedVersion'
>;

export type UserAvatarPostRequest = {
  avatar: string;
};

export type ListUserDataObject = ListResponse<UserDataObject>;

export interface UserResponse extends Omit<UserDataObject, 'connections'> {
  displayName: string;
  fullDisplayName: string;
  projectIds: string[];
  workingGroupIds: string[];
  tagIds: string[];
}

export type PublicUserResponse = Pick<
  UserResponse,
  | 'avatarUrl'
  | 'biography'
  | 'city'
  | 'country'
  | 'region'
  | 'stateOrProvince'
  | 'degrees'
  | 'displayName'
  | 'firstName'
  | 'id'
  | 'lastModifiedDate'
  | 'lastName'
  | 'middleName'
  | 'outputs'
  | 'systemPublishedVersion'
> & {
  title?: string;
  institution?: string;
  publishDate: string;
  workingGroups: Array<
    Pick<WorkingGroupResponse, 'id' | 'title'> & {
      role: UserWorkingGroupMember['role'];
    }
  >;
  tags: string[];
};
export type ListUserResponse = ListResponse<UserResponse>;
export type ListPublicUserResponse = ListResponse<PublicUserResponse>;

export type UserMetadataResponse = Omit<
  UserResponse,
  'fullDisplayName' | 'lastModifiedDate'
> & {
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
  email?: string;
};

export type FetchUsersOptions = FetchOptions<FetchUsersFilter>;
export type FetchUsersApiOptions = FetchOptions<
  Omit<FetchUsersFilter, 'orcid' | 'orcidLastSyncDate'>
>;
