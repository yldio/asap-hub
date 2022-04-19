import {
  ResearchOutputDocumentType,
  ResearchOutputType,
  ResearchOutputSharingStatus,
  DecisionOption,
} from '@asap-hub/model';

import { Rest, Entity, Graphql, GraphqlWithTypename } from './common';
import { GraphqlExternalAuthor } from './external-author';
import { GraphqlTeam } from './team';
import { GraphqlUserAssoc } from './user';

export interface ResearchOutput<TAuthorConnection = string> {
  documentType: ResearchOutputDocumentType;
  title: string;
  description: string;
  link?: string;
  addedDate: string;
  publishDate?: string;
  doi?: string;
  labCatalogNumber?: string;
  tags?: string[];
  accessInstructions?: string;
  adminNotes?: string;
  lastUpdatedPartial?: string;
  type?: ResearchOutputType;
  sharingStatus: ResearchOutputSharingStatus;
  asapFunded: DecisionOption;
  usedInAPublication: DecisionOption;
  authors?: TAuthorConnection[];
  contactEmails: string[];
  rrid?: string;
  accession?: string;
}

export interface RestResearchOutput extends Entity, Rest<ResearchOutput> {}
export interface CreateResearchOutput
  extends Entity,
    Rest<Omit<ResearchOutput, 'contactEmails'>> {}

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
