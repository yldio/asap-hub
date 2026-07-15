import { GetListOptions, normalizeListOptions } from '../../index';
import { createListQueryKeys, createQueryKeys } from '../query-keys';

// The hand-written factory that createQueryKeys replaces, kept here to prove
// the generated keys serialize identically.
const legacyKeys = {
  all: ['news'] as const,
  lists: () => [...legacyKeys.all, 'list'] as const,
  list: (options: GetListOptions) =>
    [...legacyKeys.lists(), normalizeListOptions(options)] as const,
  details: () => [...legacyKeys.all, 'detail'] as const,
  detail: (id: string) => [...legacyKeys.details(), id] as const,
};

describe('createQueryKeys', () => {
  const keys = createQueryKeys<GetListOptions>('news');
  const options: GetListOptions = {
    searchQuery: 'q',
    filters: new Set(['a']),
    currentPage: 1,
    pageSize: 10,
  };

  it('serializes every shape identically to the hand-written factory', () => {
    expect(keys.all).toEqual(legacyKeys.all);
    expect(keys.lists()).toEqual(legacyKeys.lists());
    expect(keys.list(options)).toEqual(legacyKeys.list(options));
    expect(keys.details()).toEqual(legacyKeys.details());
    expect(keys.detail('id-1')).toEqual(legacyKeys.detail('id-1'));
  });

  it('normalizes list options into the key', () => {
    expect(keys.list(options)).toEqual([
      'news',
      'list',
      normalizeListOptions(options),
    ]);
  });

  describe('createListQueryKeys', () => {
    const listKeys = createListQueryKeys<GetListOptions>('news');

    it('serializes identically to the hand-written factory', () => {
      expect(listKeys.all).toEqual(legacyKeys.all);
      expect(listKeys.lists()).toEqual(legacyKeys.lists());
      expect(listKeys.list(options)).toEqual(legacyKeys.list(options));
    });

    it('only exposes the list shapes', () => {
      expect(Object.keys(listKeys)).toEqual(['all', 'lists', 'list']);
    });
  });
});
