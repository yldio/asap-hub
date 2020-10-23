import { TeamResponse } from './team';
import { ListResponse } from './common';

export type ResearchOutputType =
  | 'proposal'
  | 'Dataset'
  | 'Software'
  | 'Protocol'
  | 'Lab Resource'
  | 'Preprint'
  | 'Article'
  | 'Other';

export type ResearchOutputAccessLevel = 'private' | 'team' | 'public';
export type ResearchOutputAuthor =
  | { readonly displayName: string }
  | { readonly id: string };

export type ResearchOutputFormData = {
  readonly url: string;
  readonly doi?: string;

  readonly type: ResearchOutputType;
  readonly title: string;
  readonly text: string;
  readonly authors: ReadonlyArray<string>;
  readonly publishDate?: Date;

  readonly accessLevel: ResearchOutputAccessLevel;
};

export type ResearchOutputCreationRequest = Omit<
  ResearchOutputFormData,
  'publishDate' | 'authors'
> & {
  readonly publishDate?: string;
  readonly authors: ReadonlyArray<ResearchOutputAuthor>;
};

export type ResearchOutputResponse = Omit<
  ResearchOutputCreationRequest,
  'accessLevel' | 'authors' | 'url'
> & {
  readonly id: string;
  readonly url?: string;
  readonly created: string;
  readonly team?: Pick<TeamResponse, 'id' | 'displayName'>;
};

export type ListResearchOutputResponse = ListResponse<ResearchOutputResponse>;
