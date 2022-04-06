import { Entity, Graphql, Rest } from './common';

export interface ExternalAuthor {
  name: string;
  orcid?: string;
}

export interface RestExternalAuthor extends Entity, Rest<ExternalAuthor> {}
export interface GraphqlExternalAuthor
  extends Entity,
    Graphql<ExternalAuthor> {}
