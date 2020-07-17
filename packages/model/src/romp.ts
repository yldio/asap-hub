export type ResearchOutputType =
  | 'dataset'
  | 'code'
  | 'protocol'
  | 'resource'
  | 'preprint'
  | 'other';
export type ResearchOutputAccessLevel = 'private' | 'team' | 'public';

export interface ResearchOutputFormData {
  readonly url: string;
  readonly doi: string;

  readonly type: ResearchOutputType;
  readonly title: string;
  readonly description: string;
  readonly authors: ReadonlyArray<string>;
  readonly publishDate?: Date;

  readonly accessLevel: ResearchOutputAccessLevel;
}

export interface Romp {
  id: string;
  created: string;
  url: string;
  doi: string;
  outputType: string;
  title: string;
  description: string;
  authors: [
    {
      name: string;
      id: string;
    },
  ];
  publishDate: string;
  createdBy: string;
}
