import {
  DISCOVERY_THEME_FILTER_PREFIX,
  PROJECT_STATUS_FILTER_PREFIX,
  PROJECT_STATUSES,
  RESOURCE_TYPE_FILTER_PREFIX,
} from './utils';

export type FilterOption = { label: string; value: string } | { title: string };

export const STATUS_FILTER_OPTIONS: ReadonlyArray<FilterOption> = [
  { title: 'PROJECT STATUS' },
  ...PROJECT_STATUSES.map((status) => ({
    label: status,
    value: `${PROJECT_STATUS_FILTER_PREFIX}${status}`,
  })),
];

const createFacetFilterOptions = (
  title: string,
  prefix: string,
  facets?: Record<string, number>,
): ReadonlyArray<FilterOption> => {
  if (!facets) {
    return [];
  }
  const entries = Object.entries(facets).filter(([name]) => name.trim().length);
  if (!entries.length) {
    return [];
  }
  return [
    { title },
    ...entries
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name]) => ({
        label: name,
        value: `${prefix}${name}`,
      })),
  ];
};

export const createDiscoveryThemeFilterOptions = (
  facets?: Record<string, number>,
): ReadonlyArray<FilterOption> =>
  createFacetFilterOptions(
    'RESEARCH THEME',
    DISCOVERY_THEME_FILTER_PREFIX,
    facets,
  );

export const createDiscoveryThemeFilterOptionsFromThemes = (
  themes: ReadonlyArray<{ id: string; name: string }>,
): ReadonlyArray<FilterOption> => {
  if (!themes.length) {
    return [];
  }
  return [
    { title: 'RESEARCH THEME' },
    ...themes.map((theme) => ({
      label: theme.name,
      value: `${DISCOVERY_THEME_FILTER_PREFIX}${theme.name}`,
    })),
  ];
};

export const createResourceTypeFilterOptions = (
  facets?: Record<string, number>,
): ReadonlyArray<FilterOption> =>
  createFacetFilterOptions(
    'RESOURCE TYPE',
    RESOURCE_TYPE_FILTER_PREFIX,
    facets,
  );

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
      value: `${RESOURCE_TYPE_FILTER_PREFIX}${type.name}`,
    })),
  ];
};
