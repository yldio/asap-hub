import { PROJECT_STATUSES } from './utils';

export type FilterOption =
  | { label: string; value: string; filterName?: string }
  | { title: string };

export const STATUS_FILTER_OPTIONS: ReadonlyArray<FilterOption> = [
  { title: 'PROJECT STATUS' },
  ...PROJECT_STATUSES.map((status) => ({
    label: status,
    value: status,
    filterName: 'status',
  })),
];

export const createResearchThemeFilterOptions = (
  themes: ReadonlyArray<{ id: string; name: string }>,
): ReadonlyArray<FilterOption> => {
  if (!themes.length) {
    return [];
  }
  return [
    { title: 'RESEARCH THEME' },
    ...themes.map((theme) => ({
      label: theme.name,
      value: theme.name,
      filterName: 'researchTheme',
    })),
  ];
};

export const createResourceTypeFilterOptionsFromTypes = (
  types: ReadonlyArray<{ id: string; name: string }>,
): ReadonlyArray<FilterOption> => {
  if (!types.length) {
    return [];
  }
  return [
    { title: 'RESOURCE TYPE' },
    ...types.map((type) => ({
      label: type.name,
      value: type.name,
      filterName: 'resourceType',
    })),
  ];
};
