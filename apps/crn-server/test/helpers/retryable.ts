import retry from 'async-retry';

export const retryable = async (
  fn: () => Promise<void> | undefined,
  opts: {} = {},
): Promise<void> => {
  await retry(fn, { retries: 3, ...opts });
};
