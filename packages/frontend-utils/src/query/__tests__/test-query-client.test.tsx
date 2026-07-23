import { createTestQueryClient } from '../test-query-client';

describe('createTestQueryClient', () => {
  it('never retries, never goes stale, never garbage-collects', () => {
    expect(createTestQueryClient().getDefaultOptions()).toEqual({
      queries: { retry: false, staleTime: Infinity, gcTime: Infinity },
      mutations: { retry: false },
    });
  });
});
