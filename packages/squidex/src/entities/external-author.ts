import { Entity, Graphql } from './common';

export interface ExternalAuthor {
  name: string;
  orcid?: string;
}

export interface GraphqlExternalAuthor
  extends Entity,
    Graphql<ExternalAuthor> {}
