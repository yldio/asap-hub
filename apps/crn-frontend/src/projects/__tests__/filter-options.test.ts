import {
  STATUS_FILTER_OPTIONS,
  createDiscoveryThemeFilterOptions,
  createResourceTypeFilterOptions,
} from '../filter-options';
import {
  DISCOVERY_THEME_FILTER_PREFIX,
  PROJECT_STATUS_FILTER_PREFIX,
  PROJECT_STATUSES,
  RESOURCE_TYPE_FILTER_PREFIX,
} from '../utils';

describe('projects filter options', () => {
  it('exposes static status filters including header', () => {
    expect(STATUS_FILTER_OPTIONS[0]).toEqual({ title: 'PROJECT STATUS' });
    const labeledOptions = STATUS_FILTER_OPTIONS.slice(1).filter(
      (option): option is { label: string; value: string } =>
        'label' in option && 'value' in option,
    );
    expect(labeledOptions).toHaveLength(PROJECT_STATUSES.length);
    const labels = labeledOptions.map((option) => option.label);
    expect(labels).toEqual(PROJECT_STATUSES);
    const values = labeledOptions.map((option) => option.value);
    expect(values).toEqual(
      PROJECT_STATUSES.map(
        (status) => `${PROJECT_STATUS_FILTER_PREFIX}${status}`,
      ),
    );
  });

  it('returns an empty array when discovery facets are undefined', () => {
    expect(createDiscoveryThemeFilterOptions(undefined)).toEqual([]);
  });

  it('returns an empty array when discovery facets contain only blank names', () => {
    expect(
      createDiscoveryThemeFilterOptions({
        '': 3,
        '   ': 1,
      }),
    ).toEqual([]);
  });

  it('returns sorted discovery theme filter options with prefix', () => {
    const options = createDiscoveryThemeFilterOptions({
      Beta: 1,
      Alpha: 2,
    });

    expect(options).toEqual([
      { title: 'RESEARCH THEME' },
      { label: 'Alpha', value: `${DISCOVERY_THEME_FILTER_PREFIX}Alpha` },
      { label: 'Beta', value: `${DISCOVERY_THEME_FILTER_PREFIX}Beta` },
    ]);
  });

  it('returns sorted resource type options with prefix', () => {
    const options = createResourceTypeFilterOptions({
      Portal: 1,
      Dataset: 4,
    });

    expect(options).toEqual([
      { title: 'RESOURCE TYPE' },
      { label: 'Dataset', value: `${RESOURCE_TYPE_FILTER_PREFIX}Dataset` },
      { label: 'Portal', value: `${RESOURCE_TYPE_FILTER_PREFIX}Portal` },
    ]);
  });
});
