import { TeamRole } from '@asap-hub/model';
import { Rest, Entity, Graphql } from './common';
import { GraphqlTeam } from './team';

export interface UserTeamConnection<T> {
  role: TeamRole;
  approach: string;
  responsibilities: string;
  id: T[];
}

interface User<T = string> {
  avatar: string[];
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
  role: 'Staff' | 'Grantee' | 'Guest';
  skills: string[];
  skillsDescription?: string;
  teams: UserTeamConnection<T>[];
}

export interface RestUser extends Entity, Rest<User> {}
export interface GraphqlUser extends Entity, Graphql<User<GraphqlTeam>> {}
