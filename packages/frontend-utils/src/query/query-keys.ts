import { normalizeListOptions } from './normalize-list-options';

/**
 * Builds the standard `all`/`lists`/`list`/`details`/`detail` query-key
 * factory for a `scope`. Keys serialize identically to a hand-written factory;
 * modules that need extra keys spread the result and add their own.
 */
export const createQueryKeys = <Options extends object>(scope: string) => ({
  all: [scope] as const,
  lists: () => [scope, 'list'] as const,
  list: (options: Options) =>
    [scope, 'list', normalizeListOptions(options)] as const,
  details: () => [scope, 'detail'] as const,
  detail: (id: string) => [scope, 'detail', id] as const,
});
