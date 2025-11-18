import { FetchOptions, ListResponse } from './common';

export type ResearchThemeDataObject = {
  readonly id: string;
  readonly name: string;
};

export type ListResearchThemeDataObject = ListResponse<ResearchThemeDataObject>;

export type ResearchThemeResponse = ResearchThemeDataObject;

export type ListResearchThemeResponse = ListResponse<ResearchThemeResponse>;

export type FetchResearchThemesOptions = FetchOptions;
