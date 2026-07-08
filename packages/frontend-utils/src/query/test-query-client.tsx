import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

// Test defaults mirror the app defaults (see query-client-config.ts):
// staleTime/gcTime Infinity so caches seeded via setQueryData cannot go stale
// and refetch mid-test, and no retries so errors surface immediately.
// Always create a fresh client per test — never share one at module level.
export const createTestQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity, gcTime: Infinity },
      mutations: { retry: false },
    },
  });

export type TestQueryClientWrapperProps = {
  children: ReactNode;
  client?: QueryClient;
};

export const TestQueryClientWrapper = ({
  children,
  client,
}: TestQueryClientWrapperProps): JSX.Element => (
  <QueryClientProvider client={client ?? createTestQueryClient()}>
    {children}
  </QueryClientProvider>
);
