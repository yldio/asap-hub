import { FetchOptions, ListResponse } from './common';
import { LabResponse } from './lab';
import { TeamRole } from './team';

export const userRole = ['Staff', 'Grantee', 'Guest', 'Hidden'] as const;

export type Role = typeof userRole[number];

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
export type UserDegree = typeof userDegree[number];

export interface Invitee {
  email: string;
  firstName: string;
  lastName: string;
  biography?: string;
  jobTitle?: string;
  institution?: string;
  country?: string;
  city?: string;
  avatarUrl?: string;
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
export type OrcidWorkType = typeof orcidWorkType[number];

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
  proposal?: string;
  role: TeamRole;
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

interface Connection {
  code: string;
}

export interface UserDataObject extends Invitee {
  id: string;
  onboarded?: boolean | null;
  contactEmail?: string;
  lastModifiedDate: string;
  createdDate: string;
  teams: UserTeam[];
  degree?: UserDegree;
  expertiseAndResourceTags: string[];
  expertiseAndResourceDescription?: string;
  questions: string[];
  biosketch?: string;
  orcid?: string;
  orcidLastModifiedDate?: string;
  orcidLastSyncDate?: string;
  orcidWorks?: OrcidWork[];
  reachOut?: string;
  responsibilities?: string;
  researchInterests?: string;
  role: Role;
  social?: UserSocialLinks;
  labs: LabResponse[];
  connections?: Connection[];
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
  contactEmail?: string;
  firstName: string;
  lastName: string;
  biography?: string;
  jobTitle?: string;
  institution?: string;
  degree?: UserDegree | '';
  country?: string;
  city?: string;
  expertiseAndResourceTags?: string[];
  expertiseAndResourceDescription?: string;
  responsibilities?: string;
  reachOut?: string;
  researchInterests?: string;
  questions?: string[];
  teams?: Pick<UserTeam, 'id' | 'role'>[];
  social?: Omit<UserSocialLinks, 'orcid'>;
  onboarded?: boolean;
  avatar?: string;
  connections?: Connection[];
  email: string;
  orcid?: string;
  orcidLastModifiedDate?: string;
  orcidLastSyncDate?: string;
  orcidWorks?: OrcidWork[];
  labIds: string[];
  role: Role;
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

export type FetchUsersFilter = {
  role?: string[];
  labId?: string[];
  teamId?: string[];
  code?: string;
  hidden?: boolean;
  onboarded?: boolean;
  orcid?: string;
};

export type FetchUsersOptions = FetchOptions<FetchUsersFilter>;
