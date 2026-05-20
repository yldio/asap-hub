import { queryKeys } from '../query-keys';

describe('queryKeys', () => {
  it('exposes a stable root key per domain', () => {
    expect(queryKeys.tags.all).toEqual(['tags']);
  });

  it('builds search keys deterministically from params', () => {
    const params = { searchQuery: 'foo', tags: ['a'] };
    expect(queryKeys.tags.search(params)).toEqual(['tags', 'search', params]);
  });
});
