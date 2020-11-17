import { TeamRole, OrcidWork, UserDegree, Role } from '@asap-hub/model';
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
  degree?: UserDegree;
  email: string;
  contactEmail?: string;
  firstName: string;
  lastName: string;
  institution?: string;
  jobTitle?: string;
  lastModifiedDate?: string;
  location?: string;
  orcid?: string;
  orcidWorks?: OrcidWork[];
  questions: { question: string }[];
  role: Role;
  skills: string[];
  department?: string;
  responsibilities?: string;
  reachOut?: string;
  skillsDescription?: string;
  teams: UserTeamConnection<TConnection>[];
}

export interface RestUser extends Entity, Rest<User> {}
export interface GraphqlUser
  extends Entity,
    Graphql<User<{ id: string }, GraphqlTeam>> {}
