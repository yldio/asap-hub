import {
  Rest,
  Entity,
  Graphql,
  GraphqlWithTypename,
  RestPayload,
} from '../common';
import { GraphqlUser } from './user';

export interface Team<T = string> {
  applicationNumber: string;
  displayName: string;
  active: boolean;
  projectSummary?: string;
  projectTitle: string;
  proposal?: T[];
  expertiseAndResourceTags: string[];
  outputs?: string[];
  tools?: {
    url: string;
    description?: string;
    name: string;
  }[];
}

export interface RestTeam extends Entity, Rest<Team> {}

export interface InputTeam extends Entity, RestPayload<Team> {}

export interface GraphqlTeamEntity
  extends Entity,
    Graphql<Team<{ id: string }>> {
  referencingUsersContents?: GraphqlUser[];
}

export type GraphqlTeam = GraphqlWithTypename<GraphqlTeamEntity, 'Teams'>;
