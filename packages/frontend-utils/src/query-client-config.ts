// These defaults preserve Recoil's fetching behavior during the migration from Recoil to TanStack:
// Once Recoil is fully removed, revisit these to take advantage of TanStack Query's cache
// invalidation and smart refetching capabilities.
export const queryClientDefaultOptions = {
  queries: {
    // data stays fresh indefinitely (no background refetches),
    staleTime: Infinity,
    // no refetch on window focus
    refetchOnWindowFocus: false,
    // single retry on failure
    retry: 1,
  },
};
