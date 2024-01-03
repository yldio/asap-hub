import { FetchOptions, ListResponse } from './common';

export const researchTagCategories = [
  'Method',
  'Organism',
  'Environment',
  'Subtype',
  'Keyword',
] as const;
export type ResearchTagCategory = (typeof researchTagCategories)[number];

export type ResearchTagDataObject = {
  readonly id: string;
  readonly category?: ResearchTagCategory;
  readonly name: string;
  readonly types?: string[];
};

export type ListResearchTagDataObject = ListResponse<ResearchTagDataObject>;

export type ResearchTagResponse = ResearchTagDataObject;

export type ListResearchTagResponse = ListResponse<ResearchTagResponse>;

export const isResearchTagCategory = (
  category: string,
): category is ResearchTagCategory =>
  (researchTagCategories as ReadonlyArray<string>).includes(category);

export type FetchResearchTagsFilter = {
  type?: string;
};

export type FetchResearchTagsOptions = Omit<
  FetchOptions<FetchResearchTagsFilter>,
  'search'
>;
