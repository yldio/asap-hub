export type ResearchOutputType =
  | 'dataset'
  | 'code'
  | 'protocol'
  | 'resource'
  | 'preprint'
  | 'other';
export type ResearchOutputAccessLevel = 'private' | 'team' | 'public';
export type ResearchOutputAuthor = { displayName: string } | { id: string };

export type ResearchOutputFormData = {
  readonly url: string;
  readonly doi: string;

  readonly type: ResearchOutputType;
  readonly title: string;
  readonly description: string;
  readonly authors: ReadonlyArray<string>;
  readonly publishDate?: Date;

  readonly accessLevel: ResearchOutputAccessLevel;
};

export type ResearchOutputCreationRequest = Exclude<
  ResearchOutputFormData,
  'publishDate' | 'authors'
> & {
  publishDate?: string;
  authors: ReadonlyArray<ResearchOutputAuthor>;
};
export type ResearchOutputResponse = ResearchOutputCreationRequest & {
  id: string;
  created: string;
  createdBy: ResearchOutputAuthor;
};
