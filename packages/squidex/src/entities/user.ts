import {
  TeamRole,
  OrcidWork,
  UserDegree,
  UserSocialLinks,
  Role,
} from '@asap-hub/model';
import { Rest, Entity, Graphql, GraphqlWithTypename } from './common';
import { GraphqlTeam } from './team';

export type UserTeamConnection<T = string> = T extends string
  ? {
      approach?: string;
      responsibilities?: string;
      role: TeamRole;
      id: T[];
    }
  : {
      approach?: string | null;
      responsibilities?: string | null;
      role: TeamRole;
      id: T[];
    };

type OrNull<T> = { [K in keyof T]: T[K] | null };

export interface User<
  TAvatar = string,
  TConnection = UserTeamConnection,
  TSocial = Omit<UserSocialLinks, 'orcid'>,
> {
  onboarded: boolean;
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
  country?: string;
  city?: string;
  orcid?: string;
  orcidWorks?: OrcidWork[];
  orcidLastSyncDate?: string;
  orcidLastModifiedDate?: string;
  questions: { question: string }[];
  role: Role;
  skills: string[];
  responsibilities?: string;
  reachOut?: string;
  skillsDescription?: string;
  teams: TConnection[];
  social?: TSocial[];
}

export interface RestUser extends Entity, Rest<User> {}
export interface GraphqlUser
  extends Entity,
    Graphql<
      User<
        { id: string },
        UserTeamConnection<GraphqlTeam>,
        OrNull<Omit<UserSocialLinks, 'orcid'>>
      >
    > {}

export type GraphqlUserAssoc = GraphqlWithTypename<GraphqlUser, 'Users'>;
