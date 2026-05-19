import {
  STATUS_FILTER_OPTIONS,
  createResearchThemeFilterOptions,
  createResourceTypeFilterOptionsFromTypes,
} from '../filter-options';
import { PROJECT_STATUSES } from '../utils';

describe('projects filter options', () => {
  it('exposes static status filters including header', () => {
    expect(STATUS_FILTER_OPTIONS[0]).toEqual({ title: 'PROJECT STATUS' });
    const labeledOptions = STATUS_FILTER_OPTIONS.slice(1).filter(
      (
        option,
      ): option is {
        label: string;
        value: string;
        filterName?: string;
      } => 'label' in option && 'value' in option,
    );
    expect(labeledOptions).toHaveLength(PROJECT_STATUSES.length);
    const labels = labeledOptions.map((option) => option.label);
    expect(labels).toEqual(PROJECT_STATUSES);
    const values = labeledOptions.map((option) => option.value);
    expect(values).toEqual(PROJECT_STATUSES);
    labeledOptions.forEach((option) =>
      expect(option.filterName).toBe('status'),
    );
  });

  it('returns an empty array when themes array is empty', () => {
    expect(createResearchThemeFilterOptions([])).toEqual([]);
  });

  it('handles single theme correctly', () => {
    const themes = [{ id: 'theme-1', name: 'Single Theme' }];

    const options = createResearchThemeFilterOptions(themes);

    expect(options).toEqual([
      { title: 'RESEARCH THEME' },
      {
        label: 'Single Theme',
        value: 'Single Theme',
        filterName: 'researchTheme',
      },
    ]);
  });

  it('handles multiple themes correctly', () => {
    const themes = [
      { id: 'theme-1', name: 'Beta Theme' },
      { id: 'theme-2', name: 'Alpha Theme' },
    ];

    const options = createResearchThemeFilterOptions(themes);

    expect(options).toEqual([
      { title: 'RESEARCH THEME' },
      {
        label: 'Beta Theme',
        value: 'Beta Theme',
        filterName: 'researchTheme',
      },
      {
        label: 'Alpha Theme',
        value: 'Alpha Theme',
        filterName: 'researchTheme',
      },
    ]);
  });

  it('returns an empty array when resource types array is empty', () => {
    expect(createResourceTypeFilterOptionsFromTypes([])).toEqual([]);
  });

  it('returns resource type filter options from types', () => {
    const types = [
      { id: 'type-1', name: 'Database' },
      { id: 'type-2', name: 'Data Portal' },
      { id: 'type-3', name: 'Dataset' },
    ];

    const options = createResourceTypeFilterOptionsFromTypes(types);

    expect(options).toEqual([
      { title: 'RESOURCE TYPE' },
      {
        label: 'Database',
        value: 'Database',
        filterName: 'resourceType',
      },
      {
        label: 'Data Portal',
        value: 'Data Portal',
        filterName: 'resourceType',
      },
      {
        label: 'Dataset',
        value: 'Dataset',
        filterName: 'resourceType',
      },
    ]);
  });

  it('handles single resource type correctly', () => {
    const types = [{ id: 'type-1', name: 'Database' }];

    const options = createResourceTypeFilterOptionsFromTypes(types);

    expect(options).toEqual([
      { title: 'RESOURCE TYPE' },
      {
        label: 'Database',
        value: 'Database',
        filterName: 'resourceType',
      },
    ]);
  });
});
