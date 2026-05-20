/**
 * Centralised query-key factory. Grouping keys here keeps invalidation
 * predictable: callers invalidate `tags.all` rather than guessing string
 * tuples. Add a domain by appending a const object below.
 */
export const queryKeys = {
  tags: {
    all: ['tags'] as const,
    search: (params: Readonly<Record<string, unknown>>) =>
      ['tags', 'search', params] as const,
  },
} as const;

export type QueryKeys = typeof queryKeys;
