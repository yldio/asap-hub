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
  readonly team?: Pick<TeamResponse, 'id' | 'displayName'>;
  readonly tags: string[];
  readonly addedDate?: string;
};

export type ListResearchOutputResponse = ListResponse<ResearchOutputResponse>;
