import { createTestQueryClient } from '@asap-hub/frontend-utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { ReactNode, Suspense } from 'react';

import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { useAlgolia } from '../../hooks/algolia';
import { getEvents } from '../api';
import { useEvents } from '../state';

jest.mock('../api');
jest.mock('../../hooks/algolia', () => ({
  useAlgolia: jest.fn(() => ({ client: {} })),
}));

const createWrapper =
  (queryClient: QueryClient) =>
  ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback="loading">
        <Auth0Provider user={{ id: 'user-id' }}>
          <WhenReady>{children}</WhenReady>
        </Auth0Provider>
      </Suspense>
    </QueryClientProvider>
  );

const renderStateHook = <T,>(hook: () => T) => {
  const queryClient = createTestQueryClient();
  const utils = renderHook(hook, { wrapper: createWrapper(queryClient) });
  return { ...utils, queryClient };
};

const options = {
  currentPage: 0,
  pageSize: 10,
} as unknown as Parameters<typeof useEvents>[0];

beforeEach(() => {
  jest.clearAllMocks();
  (useAlgolia as jest.Mock).mockReturnValue({ client: {} });
});

describe('useEvents', () => {
  it('maps a non-Error rejection to an empty list', async () => {
    (getEvents as jest.Mock).mockRejectedValue('string rejection');

    const { result } = renderStateHook(() => useEvents(options));

    await waitFor(() =>
      expect(result.current).toEqual({ total: 0, items: [] }),
    );
  });
});
