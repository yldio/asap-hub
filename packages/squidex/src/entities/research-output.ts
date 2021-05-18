import {
  ResearchOutputType,
  ResearchOutputSubtype,
  ResearchOutputSharingStatus,
  DecisionOption,
} from '@asap-hub/model';

import { Rest, Entity, Graphql } from './common';
import { GraphqlTeam } from './team';
import { GraphqlUser } from './user';

export interface ResearchOutput<TAuthorConnection = string> {
  type: ResearchOutputType;
  title: string;
  description: string;
  link?: string;
  addedDate?: string;
  publishDate?: string;
  tags?: string[];
  accessInstructions?: string;
  adminNotes?: string;
  lastUpdatedPartial?: string;
  subtype?: ResearchOutputSubtype;
  sharingStatus: ResearchOutputSharingStatus;
  asapFunded: DecisionOption;
  usedInAPublication: DecisionOption;
  externalAuthors?: {
    name: string;
    orcid?: string;
  }[];
  authors?: TAuthorConnection[];
}

export interface RestResearchOutput extends Entity, Rest<ResearchOutput> {}
export interface GraphqlResearchOutput
  extends Entity,
    Graphql<ResearchOutput<GraphqlUser>> {
  referencingTeamsContents?: GraphqlTeam[];
}
