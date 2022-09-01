import {
  TeamRole,
  OrcidWork,
  UserDegree,
  UserSocialLinks,
  Role,
} from '@asap-hub/model';
import {
  Rest,
  Entity,
  Graphql,
  GraphqlWithTypename,
  RestPayload,
} from '../common';
import { GraphqlTeam } from './team';

export type UserTeamConnection<T = string> = T extends string
  ? {
      role: TeamRole;
      id: T[];
    }
  : {
      role: TeamRole;
      id: T[];
    };

export type UserLabConnection = { id: string } & Graphql<{
  name: string;
}>;

type OrNull<T> = { [K in keyof T]: T[K] | null };

export interface User<
  TAvatar = string,
  TConnection = UserTeamConnection,
  TSocial = Omit<UserSocialLinks, 'orcid'>,
  TLabConnection = UserLabConnection,
> {
  onboarded: boolean;
  dismissedGettingStarted: boolean;
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
  country?: string;
  city?: string;
  orcid?: string;
  orcidWorks?: OrcidWork[];
  orcidLastSyncDate?: string;
  orcidLastModifiedDate?: string;
  questions: { question: string }[];
  role: Role;
  responsibilities?: string;
  researchInterests?: string;
  reachOut?: string;
  teams: TConnection[];
  social?: TSocial[];
  labs: TLabConnection[];
  expertiseAndResourceTags?: string[];
  expertiseAndResourceDescription?: string;
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

export interface InputUser
  extends Entity,
    RestPayload<
      User<string, UserTeamConnection, Omit<UserSocialLinks, 'orcid'>, string>
    > {}
