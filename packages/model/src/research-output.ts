export type ResearchOutputType =
  | 'dataset'
  | 'code'
  | 'protocol'
  | 'resource'
  | 'preprint'
  | 'other';
export type ResearchOutputAccessLevel = 'private' | 'team' | 'public';
export type ResearchOutputAuthor =
  | { readonly displayName: string }
  | { readonly id: string };

export type ResearchOutputFormData = {
  readonly url: string;
  readonly doi?: string;

  readonly type: ResearchOutputType;
  readonly title: string;
  readonly description: string;
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
export type ResearchOutputResponse = ResearchOutputCreationRequest & {
  readonly id: string;
  readonly created: string;
  readonly createdBy: ResearchOutputAuthor;
};
