import { normalizeListOptions } from '../normalize-list-options';

describe('normalizeListOptions', () => {
  it('passes primitive properties through unchanged', () => {
    expect(
      normalizeListOptions({
        searchQuery: 'query',
        currentPage: 2,
        pageSize: 10,
        active: true,
        nothing: null,
      }),
    ).toEqual({
      searchQuery: 'query',
      currentPage: 2,
      pageSize: 10,
      active: true,
      nothing: null,
    });
  });

  it('converts Sets to sorted arrays', () => {
    expect(normalizeListOptions({ filters: new Set(['b', 'c', 'a']) })).toEqual(
      { filters: ['a', 'b', 'c'] },
    );
  });

  it('converts empty Sets to empty arrays', () => {
    expect(normalizeListOptions({ filters: new Set() })).toEqual({
      filters: [],
    });
  });

  it('drops undefined properties', () => {
    expect(
      normalizeListOptions({ searchQuery: undefined, currentPage: 1 }),
    ).toEqual({ currentPage: 1 });
  });

  it('drops undefined entries inside Sets', () => {
    expect(
      normalizeListOptions({ filters: new Set(['a', undefined, 'b']) }),
    ).toEqual({ filters: ['a', 'b'] });
  });

  it('normalizes nested objects and arrays recursively', () => {
    expect(
      normalizeListOptions({
        nested: {
          filters: new Set(['z', 'y']),
          skip: undefined,
          list: [{ tags: new Set(['2', '1']) }],
        },
      }),
    ).toEqual({
      nested: {
        filters: ['y', 'z'],
        list: [{ tags: ['1', '2'] }],
      },
    });
  });

  it('preserves array order (arrays are ordered, only Sets are sorted)', () => {
    expect(normalizeListOptions({ tags: ['b', 'a'] })).toEqual({
      tags: ['b', 'a'],
    });
  });

  it('produces a stable result regardless of key insertion order', () => {
    const a = normalizeListOptions({
      searchQuery: 'query',
      filters: new Set(['b', 'a']),
    });
    const b = normalizeListOptions({
      filters: new Set(['a', 'b']),
      searchQuery: 'query',
    });
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it('makes options with Sets JSON-serializable (Sets stringify to {})', () => {
    const options = { filters: new Set(['a']) };
    expect(JSON.stringify(options)).toBe('{"filters":{}}');
    expect(JSON.stringify(normalizeListOptions(options))).toBe(
      '{"filters":["a"]}',
    );
  });
});
