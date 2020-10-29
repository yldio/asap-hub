import { ListResponse } from './common';
import { TeamRole } from './team';

export interface Invitee {
  displayName: string;
  email: string;
  firstName?: string;
  lastName?: string;
  biography?: string;
  jobTitle?: string;
  orcid?: string;
  department?: string;
  institution?: string;
  location?: string;
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
    year: string;
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

export interface UserResponse extends Invitee {
  id: string;
  lastModifiedDate: string;
  createdDate: string;
  teams: UserTeam[];
  degree?: string;
  skills: string[];
  skillsDescription?: string;
  questions: string[];
  biosketch?: string;
  orcidLastModifiedDate?: string;
  orcidWorks?: OrcidWork[];
  role: 'Staff' | 'Grantee' | 'Guest';
}

export type ListUserResponse = ListResponse<UserResponse>;
