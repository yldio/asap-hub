import { normalizeListOptions } from './normalize-list-options';

/**
 * Builds the list-only `all`/`lists`/`list` query-key factory for a `scope`.
 * Keys serialize identically to a hand-written factory; modules that need
 * extra keys spread the result and add their own.
 */
export const createListQueryKeys = <Options extends object>(scope: string) => ({
  all: [scope] as const,
  lists: () => [scope, 'list'] as const,
  list: (options: Options) =>
    [scope, 'list', normalizeListOptions(options)] as const,
});

/**
 * Builds the standard `all`/`lists`/`list`/`details`/`detail` query-key
 * factory for a `scope`.
 */
export const createQueryKeys = <Options extends object>(scope: string) => ({
  ...createListQueryKeys<Options>(scope),
  details: () => [scope, 'detail'] as const,
  detail: (id: string) => [scope, 'detail', id] as const,
});
