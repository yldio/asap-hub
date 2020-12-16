import {
  TeamRole,
  OrcidWork,
  UserDegree,
  UserSocialLinks,
  Role,
} from '@asap-hub/model';
import { Rest, Entity, Graphql } from './common';
import { GraphqlTeam } from './team';

export interface UserTeamConnection<T = string> {
  role: TeamRole;
  approach?: string | null;
  responsibilities?: string | null;
  id: T[];
}

type OrNull<T> = { [K in keyof T]: T[K] | null };

interface User<
  TAvatar = string,
  TConnection = string,
  TSocial = Omit<UserSocialLinks, 'orcid'>
> {
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
  social?: TSocial[];
}

export interface RestUser extends Entity, Rest<User> {}
export interface GraphqlUser
  extends Entity,
    Graphql<
      User<{ id: string }, GraphqlTeam, OrNull<Omit<UserSocialLinks, 'orcid'>>>
    > {}
