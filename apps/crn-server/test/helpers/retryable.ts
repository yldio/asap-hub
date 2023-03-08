type Options = {
  retries?: number;
  delay?: number;
};

export const retryable = async (
  fn: () => Promise<void> | undefined,
  options: Options = {},
  attempt: number = 1,
): Promise<void> => {
  const opts = {
    delay: 2000,
    retries: 3,
    ...options,
  };
  try {
    await fn();
    return;
  } catch (err) {
    if (attempt === opts.retries) {
      throw err;
    }
  }
  await new Promise((resolve) => setTimeout(resolve, opts.delay));
  await retryable(fn, opts, attempt + 1);
};
