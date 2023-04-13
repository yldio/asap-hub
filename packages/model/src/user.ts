import { FetchOptions, ListResponse } from './common';
import { LabResponse } from './lab';
import { TeamRole } from './team';
import { WorkingGroupMembership } from './working-group';

export const userRole = ['Staff', 'Grantee', 'Guest', 'Hidden'] as const;
export type Role = (typeof userRole)[number];

export const activeUserTag = 'CRN Member';
export const inactiveUserTag = 'Alumni Member';
export const userTags = [activeUserTag, inactiveUserTag] as const;
export type UserTag = (typeof userTags)[number];

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
}

export const orcidWorkType = [
  'ANNOTATION',
  'ARTISTIC_PERFORMANCE',
  'BOOK_CHAPTER',
  'BOOK_REVIEW',
  'BOOK',
  'CONFERENCE_ABSTRACT',
  'CONFERENCE_PAPER',
  'CONFERENCE_POSTER',
  'DATA_SET',
  'DICTIONARY_ENTRY',
  'DISCLOSURE',
  'DISSERTATION',
  'EDITED_BOOK',
  'ENCYCLOPEDIA_ENTRY',
  'INVENTION',
  'JOURNAL_ARTICLE',
  'JOURNAL_ISSUE',
  'LECTURE_SPEECH',
  'LICENSE',
  'MAGAZINE_ARTICLE',
  'MANUAL',
  'NEWSLETTER_ARTICLE',
  'NEWSPAPER_ARTICLE',
  'ONLINE_RESOURCE',
  'OTHER',
  'PATENT',
  'PHYSICAL_OBJECT',
  'PREPRINT',
  'REGISTERED_COPYRIGHT',
  'REPORT',
  'RESEARCH_TECHNIQUE',
  'RESEARCH_TOOL',
  'SOFTWARE',
  'SPIN_OFF_COMPANY',
  'STANDARDS_AND_POLICY',
  'SUPERVISED_STUDENT_PUBLICATION',
  'TECHNICAL_STANDARD',
  'TEST',
  'TRADEMARK',
  'TRANSLATION',
  'WEBSITE',
  'WORKING_PAPER',
  'UNDEFINED',
] as const;
export type OrcidWorkType = (typeof orcidWorkType)[number];

export interface OrcidWork {
  id: string;
  doi?: string;
  title?: string;
  type: OrcidWorkType;
  publicationDate: {
    year?: string;
    month?: string;
    day?: string;
  };
  lastModifiedDate: string;
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
  _tags?: UserTag[];
  alumniLocation?: string;
  alumniSinceDate?: string;
  connections?: Connection[];
  contactEmail?: string;
  createdDate: string;
  degree?: UserDegree;
  dismissedGettingStarted?: boolean;
  expertiseAndResourceDescription?: string;
  expertiseAndResourceTags: string[];
  id: string;
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
  teams: UserTeam[];
  workingGroups: WorkingGroupMembership[];
}
export type ListUserDataObject = ListResponse<UserDataObject>;
export interface UserResponse
  extends Omit<UserDataObject, 'onboarded' | 'connections'> {
  onboarded: boolean;
  displayName: string;
}

export type UserMetadataResponse = Omit<UserResponse, 'labs'> & {
  algoliaApiKey: string;
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
  expertiseAndResourceTags?: string[];
  firstName: string;
  institution?: string;
  jobTitle?: string;
  labIds: string[];
  lastName: string;
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
  teams?: Pick<UserTeam, 'id' | 'role' | 'inactiveSinceDate'>[];
};

export type UserUpdateDataObject = Partial<UserCreateDataObject>;

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
>;

export interface UserAvatarPostRequest {
  avatar: string;
}

export type ListUserResponse = ListResponse<UserResponse>;

export type FetchUsersFilter =
  | {
      labId?: never;
      role?: never;
      teamId?: never;
      code?: string;
      hidden?: boolean;
      onboarded?: boolean;
      orcid?: string;
    }
  | {
      labId?: string;
      role?: never;
      teamId?: never;
      code?: never;
      hidden?: never;
      onboarded?: never;
      orcid?: never;
    }
  | {
      labId?: never;
      role?: string[];
      teamId?: string;
      code?: never;
      hidden?: never;
      onboarded?: never;
      orcid?: never;
    };

export type FetchUsersOptions = Omit<FetchOptions<FetchUsersFilter>, 'search'>;


export type UserRole = 'Staff' | 'Member' | 'None';
