import { ResearchOutputType } from '@asap-hub/model';

import { Rest, Entity, Graphql } from './common';
import { GraphqlTeam } from './team';

export interface ResearchOutput {
  type: ResearchOutputType;
  title: string;
  description: string;
  link?: string;
  addedDate?: string;
  publishDate?: string;
  tags?: string[];
  adminNotes?: string;
}

export interface RestResearchOutput extends Entity, Rest<ResearchOutput> {}
export interface GraphqlResearchOutput extends Entity, Graphql<ResearchOutput> {
  referencingTeamsContents?: GraphqlTeam[];
}
