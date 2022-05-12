import {
  ResearchOutputDocumentType,
  ResearchOutputType,
  ResearchOutputSharingStatus,
  DecisionOption,
} from '@asap-hub/model';

import {
  Rest,
  Entity,
  Graphql,
  GraphqlWithTypename,
  RestPayload,
} from './common';
import { GraphqlExternalAuthor } from './external-author';
import { GraphqlTeam } from './team';
import { GraphqlUserAssoc } from './user';

export interface ResearchOutput<
  TAuthorConnection = string,
  TLabConnection = string,
  TUserConnection = string,
> {
  accessInstructions?: string;
  accession?: string;
  addedDate: string;
  adminNotes?: string;
  asapFunded: DecisionOption;
  authors?: TAuthorConnection[];
  contactEmails: string[];
  createdBy?: TUserConnection[];
  description: string;
  documentType: ResearchOutputDocumentType;
  doi?: string;
  environments: string[];
  labCatalogNumber?: string;
  labs: TLabConnection[];
  lastUpdatedPartial?: string;
  link?: string;
  methods: string[];
  organisms: string[];
  publishDate?: string;
  rrid?: string;
  sharingStatus: ResearchOutputSharingStatus;
  subtype: string[];
  tags?: string[];
  title: string;
  type?: ResearchOutputType;
  updatedBy?: TUserConnection[];
  usedInAPublication: DecisionOption;
}

export interface RestResearchOutput extends Entity, Rest<ResearchOutput> {}
export interface InputResearchOutput
  extends Entity,
    RestPayload<Omit<ResearchOutput, 'contactEmails'>> {}

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

export type ResearchOutputLabConnection = { id: string } & Graphql<{
  name: string;
}>;
