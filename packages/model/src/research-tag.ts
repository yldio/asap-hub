import { ListResponse } from './common';

export type ResearchTagResponse = {
  readonly id: string;

  readonly category?: string;
  readonly entities?: string[];
  readonly name: string;
  readonly types?: string[];
};

export type ListResearchTagResponse = ListResponse<ResearchTagResponse>;
