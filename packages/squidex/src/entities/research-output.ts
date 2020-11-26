import { ResearchOutputType } from '@asap-hub/model';

import { Rest, Entity, Graphql } from './common';

interface ResearchOutput {
  type: ResearchOutputType;
  title: string;
  shortText: string;
  text: string;
  link?: string;
  publishDate?: string;
}

export interface RestResearchOutput extends Entity, Rest<ResearchOutput> {}
export interface GraphqlResearchOutput
  extends Entity,
    Graphql<ResearchOutput> {}
