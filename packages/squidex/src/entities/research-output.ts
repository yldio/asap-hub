import {
  ResearchOutputType,
  ResearchOutputSubtype,
  ResearchOutputSharingStatus,
  DecisionOption,
} from '@asap-hub/model';

import { Rest, Entity, Graphql, GraphqlWithTypename } from './common';
import { GraphqlExternalAuthor } from './external-author';
import { GraphqlTeam } from './team';
import { GraphqlUserAssoc } from './user';

export interface ResearchOutput<TAuthorConnection = string> {
  type: ResearchOutputType;
  title: string;
  description: string;
  link?: string;
  addedDate?: string;
  publishDate?: string;
  identifierDoi?: string;
  tags?: string[];
  accessInstructions?: string;
  adminNotes?: string;
  lastUpdatedPartial?: string;
  subtype?: ResearchOutputSubtype;
  sharingStatus: ResearchOutputSharingStatus;
  asapFunded: DecisionOption;
  usedInAPublication: DecisionOption;
  authors?: TAuthorConnection[];
  pmsEmails: string[];
}

export interface RestResearchOutput extends Entity, Rest<ResearchOutput> {}
export interface CreateResearchOutput
  extends Entity,
    Rest<Omit<ResearchOutput, 'pmsEmails'>> {}

export type GraphqlExternalAuthorAssoc = GraphqlWithTypename<
  GraphqlExternalAuthor,
  'ExternalAuthors'
>;

export type GraphqlResearchOutputAuthors =
  | GraphqlUserAssoc
  | GraphqlExternalAuthorAssoc;
export interface GraphqlResearchOutput
  extends Entity,
    Graphql<ResearchOutput<GraphqlResearchOutputAuthors>> {
  referencingTeamsContents?: GraphqlTeam[];
}
