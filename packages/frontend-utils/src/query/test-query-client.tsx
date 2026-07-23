import { QueryClient } from '@tanstack/react-query';

// Test defaults mirror the app defaults (see query-client-config.ts):
// staleTime/gcTime Infinity so caches seeded via setQueryData cannot go stale
// and refetch mid-test, and no retries so errors surface immediately.
// Always create a fresh client per test — never share one at module level.
export const createTestQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity, gcTime: Infinity },
      mutations: { retry: false },
    },
  });
