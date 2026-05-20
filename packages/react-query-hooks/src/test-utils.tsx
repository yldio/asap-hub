import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
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
}: TestQueryClientWrapperProps) => (
  <QueryClientProvider client={client ?? createTestQueryClient()}>
    {children}
  </QueryClientProvider>
);
