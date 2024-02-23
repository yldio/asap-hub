import { retryable } from './retryable';

export const beforeAllWithRetry = (callback: () => Promise<void>): void => {
  beforeAll(async () => {
    await retryable(async () => {
      await callback();
    });
  });
};

export const beforeEachWithRetry = (callback: () => Promise<void>): void => {
  beforeEach(async () => {
    await retryable(async () => {
      await callback();
    });
  });
};

export const afterEachWithRetry = (callback: () => Promise<void>): void => {
  afterEach(async () => {
    await retryable(async () => {
      await callback();
    });
  });
};

export const afterAllWithRetry = (callback: () => Promise<void>): void => {
  afterEach(async () => {
    await retryable(async () => {
      await callback();
    });
  });
};
