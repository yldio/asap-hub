import { Rest, Entity, Graphql } from './common';
import { GraphqlResearchOutput } from './research-output';
import { GraphqlUser } from './user';

export interface Team<T = string> {
  applicationNumber: string;
  displayName: string;
  projectSummary?: string;
  projectTitle: string;
  proposal?: T[];
  expertiseAndResourceTags: string[];
  tools?: {
    url: string;
    description?: string;
    name: string;
  }[];
}

export interface RestTeam extends Entity, Rest<Team> {}
// TODO: REMOVE old proposal type
export interface GraphqlTeam
  extends Entity,
    Graphql<Team<GraphqlResearchOutput | { id: string }>> {
  referencingUsersContents?: GraphqlUser[];
}
