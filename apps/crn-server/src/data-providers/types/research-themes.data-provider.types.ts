import {
  FetchResearchThemesOptions,
  ListResearchThemeDataObject,
} from '@asap-hub/model';

export type ResearchThemeDataProvider = {
  fetch: (
    options: FetchResearchThemesOptions,
  ) => Promise<ListResearchThemeDataObject>;
};
