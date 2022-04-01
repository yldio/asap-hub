import { configureScope } from '@sentry/react';

export type GetListOptions = {
  searchQuery: string;
  filters: Set<string>;
  currentPage: number | null;
  pageSize: number | null;
};

export const createSentryHeaders = () => {
  const transactionId = Math.random().toString(36).substr(2, 9);
  configureScope((scope) => {
    scope.setTag('transaction_id', transactionId);
  });
  return {
    'X-Transaction-Id': transactionId,
  };
};
