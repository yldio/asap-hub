import { createTestQueryClient } from '@asap-hub/frontend-utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, renderHook, waitFor } from '@testing-library/react';
import { Component, ReactNode, Suspense } from 'react';

import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getResearchOutput, getResearchOutputs } from '../api';
import {
  researchOutputQueryKeys,
  useResearchOutputById,
  useResearchOutputs,
} from '../state';

jest.mock('../api', () => ({
  getResearchOutput: jest.fn(),
  getResearchOutputs: jest.fn(),
  getDraftResearchOutputs: jest.fn(),
}));

jest.mock('../../hooks/algolia', () => ({
  useAlgolia: jest.fn(() => ({ client: {} })),
}));

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    return this.state.hasError ? 'errored' : this.props.children;
  }
}

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

const listOptions = {
  searchQuery: '',
  currentPage: 0,
  pageSize: 10,
  filters: new Set<string>(),
} as unknown as Parameters<typeof useResearchOutputs>[0];

afterEach(() => {
  jest.clearAllMocks();
});

describe('useResearchOutputById', () => {
  it('maps a 404 (undefined) to undefined and caches null', async () => {
    (getResearchOutput as jest.Mock).mockResolvedValue(undefined);

    const { result, queryClient } = renderStateHook(() =>
      useResearchOutputById('missing'),
    );

    await waitFor(() => expect(getResearchOutput).toHaveBeenCalled());
    await waitFor(() =>
      expect(
        queryClient.getQueryData(researchOutputQueryKeys.detail('missing')),
      ).toBeNull(),
    );
    expect(result.current).toBeUndefined();
  });
});

describe('useResearchOutputs', () => {
  it('maps a non-Error rejection to an empty list', async () => {
    (getResearchOutputs as jest.Mock).mockRejectedValue('nope');

    const { result } = renderStateHook(() => useResearchOutputs(listOptions));

    await waitFor(() =>
      expect(result.current).toEqual({ total: 0, items: [] }),
    );
  });

  it('re-throws Error rejections to the error boundary', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    (getResearchOutputs as jest.Mock).mockRejectedValue(new Error('boom'));

    const Probe = () => {
      useResearchOutputs(listOptions);
      return <>rendered</>;
    };
    const { getByText } = render(
      <QueryClientProvider client={createTestQueryClient()}>
        <ErrorBoundary>
          <Suspense fallback="loading">
            <Auth0Provider user={{ id: 'user-id' }}>
              <WhenReady>
                <Probe />
              </WhenReady>
            </Auth0Provider>
          </Suspense>
        </ErrorBoundary>
      </QueryClientProvider>,
    );

    await waitFor(() => expect(getByText('errored')).toBeInTheDocument());
    consoleErrorSpy.mockRestore();
  });
});
