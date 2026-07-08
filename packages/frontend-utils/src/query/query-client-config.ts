import type { DefaultOptions } from '@tanstack/react-query';

// These defaults preserve Recoil's fetching behavior during the migration from Recoil to TanStack:
// atoms cached forever (until a refresh counter bumped or the RecoilRoot unmounted), never
// retried, and never refetched in the background. Once Recoil is fully removed, revisit these
// to take advantage of TanStack Query's cache invalidation and smart refetching capabilities.
export const queryClientDefaultOptions: DefaultOptions = {
  queries: {
    // recoil never went stale; invalidation is explicit
    staleTime: Infinity,
    // caches lived for the RecoilRoot lifetime
    gcTime: Infinity,
    // errors were cached as values and re-thrown to error boundaries, never retried
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
