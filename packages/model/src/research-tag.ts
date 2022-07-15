import { FetchOptions, ListResponse } from './common';

export const researchTagEntities = ['Research Output', 'User'] as const;
export type ResearchTagEntity = typeof researchTagEntities[number];

export const researchTagCategories = [
  'Method',
  'Organism',
  'Environment',
  'Subtype',
] as const;
export type ResearchTagCategory = typeof researchTagCategories[number];

export type ResearchTagResponse = {
  readonly id: string;

  readonly category?: ResearchTagCategory;
  readonly entities?: ResearchTagEntity[];
  readonly name: string;
  readonly types?: string[];
};

export type ListResearchTagResponse = ListResponse<ResearchTagResponse>;

export const isResearchTagEntity = (
  entity: string,
): entity is ResearchTagEntity =>
  (researchTagEntities as ReadonlyArray<string>).includes(entity);

export const isResearchTagCategory = (
  category: string,
): category is ResearchTagCategory =>
  (researchTagCategories as ReadonlyArray<string>).includes(category);

export type FetchResearchTagsFilter = {
  type?: string;
  entity?: ResearchTagEntity;
};

export type FetchResearchTagsOptions = Omit<
  FetchOptions<FetchResearchTagsFilter>,
  'search'
>;
