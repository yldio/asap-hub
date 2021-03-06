import { ListResponse } from './common';
import { TeamRole } from './team';

export type Role = 'Staff' | 'Grantee' | 'Guest' | 'Hidden';
export type UserDegree =
  | 'BA'
  | 'BSc'
  | 'MSc'
  | 'PhD'
  | 'MD'
  | 'MD, PhD'
  | 'MPH'
  | 'MA'
  | 'MBA';

export interface Invitee {
  email: string;
  firstName: string;
  lastName: string;
  biography?: string;
  jobTitle?: string;
  institution?: string;
  location?: string;
  country?: string;
  city?: string;
  avatarUrl?: string;
}

export interface OrcidWork {
  id: string;
  doi?: string;
  title?: string;
  type:
    | 'ANNOTATION'
    | 'ARTISTIC_PERFORMANCE'
    | 'BOOK_CHAPTER'
    | 'BOOK_REVIEW'
    | 'BOOK'
    | 'CONFERENCE_ABSTRACT'
    | 'CONFERENCE_PAPER'
    | 'CONFERENCE_POSTER'
    | 'DATA_SET'
    | 'DICTIONARY_ENTRY'
    | 'DISCLOSURE'
    | 'DISSERTATION'
    | 'EDITED_BOOK'
    | 'ENCYCLOPEDIA_ENTRY'
    | 'INVENTION'
    | 'JOURNAL_ARTICLE'
    | 'JOURNAL_ISSUE'
    | 'LECTURE_SPEECH'
    | 'LICENSE'
    | 'MAGAZINE_ARTICLE'
    | 'MANUAL'
    | 'NEWSLETTER_ARTICLE'
    | 'NEWSPAPER_ARTICLE'
    | 'ONLINE_RESOURCE'
    | 'OTHER'
    | 'PATENT'
    | 'PHYSICAL_OBJECT'
    | 'PREPRINT'
    | 'REGISTERED_COPYRIGHT'
    | 'REPORT'
    | 'RESEARCH_TECHNIQUE'
    | 'RESEARCH_TOOL'
    | 'SOFTWARE'
    | 'SPIN_OFF_COMPANY'
    | 'STANDARDS_AND_POLICY'
    | 'SUPERVISED_STUDENT_PUBLICATION'
    | 'TECHNICAL_STANDARD'
    | 'TEST'
    | 'TRADEMARK'
    | 'TRANSLATION'
    | 'WEBSITE'
    | 'WORKING_PAPER'
    | 'UNDEFINED';
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
  approach?: string;
  responsibilities?: string;
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

export interface UserResponse extends Invitee {
  id: string;
  onboarded: boolean;
  contactEmail?: string;
  displayName: string;
  lastModifiedDate: string;
  createdDate: string;
  teams: UserTeam[];
  degree?: UserDegree;
  skills: string[];
  skillsDescription?: string;
  questions: string[];
  biosketch?: string;
  orcid?: string;
  orcidLastModifiedDate?: string;
  orcidWorks?: OrcidWork[];
  reachOut?: string;
  responsibilities?: string;
  role: Role;
  social?: UserSocialLinks;
}

export interface UserPatchRequest {
  displayName?: string;
  contactEmail?: string;
  firstName?: string;
  lastName?: string;
  biography?: string;
  jobTitle?: string;
  orcid?: string;
  institution?: string;
  degree?: UserDegree;
  location?: string;
  country?: string;
  city?: string;
  skills?: string[];
  skillsDescription?: string;
  questions?: string[];
  teams?: Pick<UserTeam, 'id' | 'approach' | 'responsibilities'>[];
  social?: Omit<UserSocialLinks, 'orcid'>;
  onboarded?: boolean;
}

export interface UserAvatarPostRequest {
  avatar: string;
}

export type ListUserResponse = ListResponse<UserResponse>;
