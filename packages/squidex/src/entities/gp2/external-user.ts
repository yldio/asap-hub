import { Entity, Graphql, Rest } from '../common';

export interface ExternalUser {
  name: string;
  orcid?: string;
}

export interface RestExternalUser extends Entity, Rest<ExternalUser> {}
export interface GraphqlExternalUser
  extends Entity,
    Graphql<ExternalUser> {}
