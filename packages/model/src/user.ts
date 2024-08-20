import { FetchOptions, ListResponse, OrcidWork } from './common';
import { InterestGroupMembership } from './interest-group';
import { LabResponse } from './lab';
import { ResearchTagDataObject } from './research-tag';
import { TeamRole } from './team';
import { WorkingGroupMembership } from './working-group';

export const userRole = ['Staff', 'Grantee', 'Guest', 'Hidden'] as const;
export type Role = (typeof userRole)[number];

export const activeUserMembershipStatus = 'CRN Member';
export const inactiveUserMembershipStatus = 'Alumni Member';
export const userMembershipStatus = [
  activeUserMembershipStatus,
  inactiveUserMembershipStatus,
] as const;
export type UserMembershipStatus = (typeof userMembershipStatus)[number];

export const userDegree = [
  'BA',
  'BSc',
  'MSc',
  'PhD',
  'MD',
  'MD, PhD',
  'MPH',
  'MA',
  'MBA',
] as const;
export type UserDegree = (typeof userDegree)[number];

export const isUserRole = (data: string): data is Role =>
  (userRole as ReadonlyArray<string>).includes(data);

export const isUserDegree = (data: string): data is UserDegree =>
  (userDegree as ReadonlyArray<string>).includes(data);
export interface Invitee {
  avatarUrl?: string;
  biography?: string;
  city?: string;
  country?: string;
  email: string;
  firstName: string;
  institution?: string;
  jobTitle?: string;
  lastName: string;
  middleName?: string;
  nickname?: string;
}

export interface UserTeam {
  id: string;
  displayName?: string;
  teamInactiveSince?: string;
  proposal?: string;
  role: TeamRole;
  inactiveSinceDate?: string;
}

export interface UserSocialLinks {
  website1?: string;
  website2?: string;
  linkedIn?: string;
  orcid?: string;
  researcherId?: string;
  twitter?: string;
  github?: string;
  googleScholar?: string;
  researchGate?: string;
}

export interface Connection {
  code: string;
}

export interface UserDataObject extends Invitee {
  activeCampaignId?: string;
  membershipStatus?: UserMembershipStatus[];
  alumniLocation?: string;
  alumniSinceDate?: string;
  connections?: Connection[];
  contactEmail?: string;
  createdDate: string;
  degree?: UserDegree;
  dismissedGettingStarted?: boolean;
  expertiseAndResourceDescription?: string;
  id: string;
  inactiveSinceDate?: string;
  labs: LabResponse[];
  lastModifiedDate: string;
  onboarded?: boolean | null;
  orcid?: string;
  orcidLastModifiedDate?: string;
  orcidLastSyncDate?: string;
  orcidWorks?: OrcidWork[];
  questions: string[];
  reachOut?: string;
  researchInterests?: string;
  responsibilities?: string;
  role: Role;
  social?: UserSocialLinks;
  stateOrProvince?: string;
  teams: UserTeam[];
  workingGroups: WorkingGroupMembership[];
  interestGroups: InterestGroupMembership[];
  tags?: Pick<ResearchTagDataObject, 'id' | 'name'>[];
  researchTheme?: string[];
}

export interface UserResponse
  extends Omit<UserDataObject, 'onboarded' | 'connections'> {
  onboarded: boolean;
  displayName: string;
  fullDisplayName: string;
}

export type UserListItemTeam = Pick<UserTeam, 'id' | 'displayName' | 'role'>;
export type UserListItemDataObject = Pick<
  UserDataObject,
  | 'alumniSinceDate'
  | 'avatarUrl'
  | 'city'
  | 'stateOrProvince'
  | 'country'
  | 'createdDate'
  | 'degree'
  | 'dismissedGettingStarted'
  | 'email'
  | 'firstName'
  | 'id'
  | 'institution'
  | 'jobTitle'
  | 'labs'
  | 'lastName'
  | 'membershipStatus'
  | 'middleName'
  | 'nickname'
  | 'onboarded'
  | 'role'
  | 'tags'
> & {
  _tags: string[];
  teams: UserListItemTeam[];
};
export type ListUserDataObject = ListResponse<UserListItemDataObject>;

export type UserListItemResponse = UserListItemDataObject & {
  displayName: string;
  fullDisplayName: string;
  onboarded: boolean;
};

export type UserMetadataResponse = Omit<
  UserResponse,
  'labs' | 'fullDisplayName'
> & {
  algoliaApiKey: string | null;
};

export type UserCreateDataObject = {
  avatar?: string;
  biography?: string;
  city?: string;
  connections?: Connection[];
  contactEmail?: string;
  country?: string;
  degree?: UserDegree | '';
  dismissedGettingStarted?: boolean;
  email: string;
  expertiseAndResourceDescription?: string;
  firstName: string;
  institution?: string;
  jobTitle?: string;
  labIds: string[];
  lastName: string;
  middleName?: string;
  nickname?: string;
  onboarded?: boolean;
  orcid?: string;
  orcidLastModifiedDate?: string;
  orcidLastSyncDate?: string;
  orcidWorks?: OrcidWork[];
  questions?: string[];
  reachOut?: string;
  researchInterests?: string;
  responsibilities?: string;
  role: Role;
  social?: Omit<UserSocialLinks, 'orcid'>;
  stateOrProvince?: string;
  teams?: Pick<UserTeam, 'id' | 'role' | 'inactiveSinceDate'>[];
  tagIds?: string[];
};

export type UserUpdateDataObject = Partial<UserCreateDataObject> & {
  activeCampaignCreatedAt?: Date;
  activeCampaignId?: string;
};

export type UserUpdateRequest = UserUpdateDataObject;
export type UserPatchRequest = Omit<
  UserUpdateDataObject,
  | 'avatar'
  | 'connections'
  | 'orcidLastModifiedDate'
  | 'email'
  | 'labIds'
  | 'orcid'
  | 'orcidLastSyncDate'
  | 'orcidWorks'
  | 'role'
  | 'activeCampaignCreatedAt'
  | 'activeCampaignId'
>;

export interface UserAvatarPostRequest {
  avatar: string;
}

export type ListUserResponse = ListResponse<UserListItemResponse>;

export type FetchUsersFilter =
  | {
      labId?: never;
      role?: never;
      teamId?: never;
      code?: string;
      hidden?: boolean;
      onboarded?: boolean;
      orcid?: string;
      orcidLastSyncDate?: string;
    }
  | {
      labId?: string;
      role?: never;
      teamId?: never;
      code?: never;
      hidden?: never;
      onboarded?: never;
      orcid?: never;
      orcidLastSyncDate?: string;
    }
  | {
      labId?: never;
      role?: string[];
      teamId?: string;
      code?: never;
      hidden?: never;
      onboarded?: never;
      orcid?: never;
      orcidLastSyncDate?: string;
    };

export type FetchUsersOptions = FetchOptions<FetchUsersFilter>;

export type UserRole = 'Staff' | 'Member' | 'None';

export const toUserListItem = (user: UserResponse): UserListItemResponse => {
  const {
    alumniSinceDate,
    avatarUrl,
    city,
    stateOrProvince,
    country,
    createdDate,
    degree,
    dismissedGettingStarted,
    displayName,
    fullDisplayName,
    email,
    tags,
    firstName,
    id,
    institution,
    jobTitle,
    labs,
    lastName,
    membershipStatus,
    middleName,
    nickname,
    onboarded,
    role,
    teams,
  } = user;

  return {
    alumniSinceDate,
    avatarUrl,
    city,
    stateOrProvince,
    country,
    createdDate,
    degree,
    dismissedGettingStarted,
    displayName,
    fullDisplayName,
    email,
    tags,
    firstName,
    id,
    institution,
    jobTitle,
    labs,
    lastName,
    membershipStatus,
    middleName,
    nickname,
    onboarded,
    role,
    teams: teams.map((teamItem) => ({
      id: teamItem.id,
      role: teamItem.role,
      displayName: teamItem.displayName,
    })),
    _tags: tags?.map(({ name }) => name) || [],
  };
};
