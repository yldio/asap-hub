import type { DefaultOptions } from '@tanstack/react-query';

// Conservative defaults: cache forever with explicit invalidation, never
// retry, and never refetch in the background. Revisit these to take advantage
// of TanStack Query's cache invalidation and smart refetching capabilities.
export const queryClientDefaultOptions: DefaultOptions = {
  queries: {
    // data never goes stale; invalidation is explicit
    staleTime: Infinity,
    // caches live for the QueryClient's lifetime
    gcTime: Infinity,
    // errors are re-thrown to error boundaries, never retried
    retry: false,
    // no refetch on window focus
    refetchOnWindowFocus: false,
    // no refetch on reconnect
    refetchOnReconnect: false,
  },
  mutations: {
    // mutations were plain async calls, never retried
    retry: false,
  },
};
