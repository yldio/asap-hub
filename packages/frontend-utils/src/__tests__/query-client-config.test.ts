import { queryClientDefaultOptions } from '../query-client-config';

describe('queryClientDefaultOptions', () => {
  it('sets staleTime to Infinity to prevent background refetches', () => {
    expect(queryClientDefaultOptions.queries.staleTime).toBe(Infinity);
  });

  it('disables refetch on window focus', () => {
    expect(queryClientDefaultOptions.queries.refetchOnWindowFocus).toBe(false);
  });

  it('sets retry to 1', () => {
    expect(queryClientDefaultOptions.queries.retry).toBe(1);
  });
});
