import { Rest, Entity, Graphql } from './common';
import { GraphqlResearchOutput } from './research-output';

interface Team<T = string> {
  applicationNumber: string;
  displayName: string;
  projectSummary?: string;
  projectTitle: string;
  proposal?: T[];
  skills: string[];
  tools?: {
    url: string;
    description?: string;
    name: string;
  }[];
  outputs: T[];
}

export interface RestTeam extends Entity, Rest<Team> {}
// TODO: REMOVE old proposal type
export interface GraphqlTeam
  extends Entity,
    Graphql<Team<GraphqlResearchOutput | { id: string }>> {}
