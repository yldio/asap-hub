import { Rest, Entity, Graphql } from './common';

interface Team<T = string> {
  applicationNumber: string;
  displayName: string;
  projectSummary?: string;
  projectTitle: string;
  proposal?: T[];
  skills: string[];
}

export interface RestTeam extends Entity, Rest<Team> {}
export interface GraphqlTeam extends Entity, Graphql<Team<never>> {}
