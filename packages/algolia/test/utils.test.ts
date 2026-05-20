import { buildAlgoliaFilters } from '../src/utils';

describe('buildAlgoliaFilters', () => {
  test('returns undefined when filter values are undefined', () => {
    expect(buildAlgoliaFilters('researchTheme', undefined)).toBeUndefined();
  });

  test('returns undefined when filter values are empty', () => {
    expect(buildAlgoliaFilters('researchTheme', [])).toBeUndefined();
  });

  test('returns a single filter when one value is provided', () => {
    expect(buildAlgoliaFilters('researchTheme', ['Theme A'])).toEqual(
      'researchTheme:"Theme A"',
    );
  });

  test('returns OR-joined filters when multiple values are provided', () => {
    expect(buildAlgoliaFilters('resourceType', ['Type A', 'Type B'])).toEqual(
      'resourceType:"Type A" OR resourceType:"Type B"',
    );
  });
});
