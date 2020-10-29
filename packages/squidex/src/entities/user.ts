import { TeamRole } from '@asap-hub/model';
import { Rest, Entity, Graphql } from './common';
import { GraphqlTeam } from './team';

export interface UserTeamConnection<T = string> {
  role: TeamRole;
  approach?: string;
  responsibilities?: string;
  id: T[];
}

interface User<TAvatar = string, TConnection = string> {
  avatar: TAvatar[];
  biography?: string;
  connections: { code: string }[];
  degree?: 'BA' | 'BSc' | 'MSc' | 'PhD' | 'MD' | 'PhD, MD';
  displayName: string;
  email: string;
  firstName: string;
  institution?: string;
  jobTitle?: string;
  lastModifiedDate?: string;
  lastName: string;
  location?: string;
  orcid?: string;
  questions: { question: string }[];
  role: 'Staff' | 'Grantee' | 'Guest' | 'Hidden';
  skills: string[];
  responsibilities?: string;
  reachOut?: string;
  skillsDescription?: string;
  teams: UserTeamConnection<TConnection>[];
}

export interface RestUser extends Entity, Rest<User> {}
export interface GraphqlUser
  extends Entity,
    Graphql<User<{ id: string }, GraphqlTeam>> {}
