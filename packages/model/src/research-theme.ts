import { FetchOptions, ListResponse } from './common';

export const researchThemeTypes = ['Discovery', 'Resource'] as const;

export type ResearchThemeType = (typeof researchThemeTypes)[number];

export const DISCOVERY_THEME_TYPES = ['Discovery' as const];

export const RESOURCE_THEME_TYPES = ['Resource' as const];

export const isResearchThemeType = (
  value: unknown,
): value is ResearchThemeType =>
  (researchThemeTypes as readonly string[]).includes(value as string);

export type ResearchThemeDataObject = {
  readonly id: string;
  readonly name: string;
  readonly types: ReadonlyArray<ResearchThemeType>;
};

export type ListResearchThemeDataObject = ListResponse<ResearchThemeDataObject>;

export type ResearchThemeResponse = ResearchThemeDataObject;

export type ListResearchThemeResponse = ListResponse<ResearchThemeResponse>;

export type ResearchThemeFilter = {
  readonly types?: ReadonlyArray<ResearchThemeType>;
};

export type FetchResearchThemesOptions = FetchOptions<ResearchThemeFilter>;
