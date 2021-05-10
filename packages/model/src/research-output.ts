import { TeamResponse } from './team';
import { ListResponse } from './common';

export type ResearchOutputType =
  | 'Proposal'
  | 'Presentation'
  | 'Dataset'
  | 'Bioinformatics'
  | 'Protocol'
  | 'Lab Resource'
  | 'Article';

export type ResearchOutputAccessLevel = 'private' | 'team' | 'public';
export type ResearchOutputAuthor =
  | { readonly displayName: string }
  | { readonly id: string };

export type ResearchOutputFormData = {
  readonly link: string;
  readonly type: ResearchOutputType;
  readonly title: string;
  readonly description: string;
  readonly publishDate?: Date;
};

export type ResearchOutputCreationRequest = Omit<
  ResearchOutputFormData,
  'publishDate'
> & {
  readonly publishDate?: string;
};

export type ResearchOutputResponse = Omit<
  ResearchOutputCreationRequest,
  'link'
> & {
  readonly id: string;
  readonly link?: string;
  readonly created: string;
  /**
   * @deprecated in favour of teams
   */
  readonly team?: Pick<TeamResponse, 'id' | 'displayName'>;
  readonly teams: ReadonlyArray<Pick<TeamResponse, 'id' | 'displayName'>>;
  readonly tags: string[];
  readonly addedDate?: string;
  readonly lastModifiedDate?: string;
  readonly lastUpdatedPartial: string;
};

export const researchOutputLabels: Record<ResearchOutputType, string> = {
  Proposal: 'Open External Link',
  Presentation: 'View on Google',
  Dataset: 'Open External Link',
  Bioinformatics: 'Open External Link',
  Protocol: 'View on Protocols.io',
  'Lab Resource': 'Open External Link',
  Article: 'Open External Link',
};

export type ListResearchOutputResponse = ListResponse<ResearchOutputResponse>;
