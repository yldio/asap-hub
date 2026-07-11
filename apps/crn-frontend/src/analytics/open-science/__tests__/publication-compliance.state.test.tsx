import { createTestQueryClient } from '@asap-hub/frontend-utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, renderHook, waitFor } from '@testing-library/react';
import { Component, ReactNode, Suspense } from 'react';

import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import { useAnalyticsOpensearch } from '../../../hooks/opensearch';
import { getPublicationCompliance } from '../api';
import { useAnalyticsPublicationCompliance } from '../state/publication-compliance.state';

jest.mock('../api');
jest.mock('../../../hooks/opensearch', () => ({
  useAnalyticsOpensearch: jest.fn(),
}));

const mockUseAnalyticsOpensearch =
  useAnalyticsOpensearch as jest.MockedFunction<typeof useAnalyticsOpensearch>;

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

const options = {
  currentPage: 0,
  pageSize: 10,
  tags: [],
  timeRange: 'all',
  sort: 'team_asc',
} as unknown as Parameters<typeof useAnalyticsPublicationCompliance>[0];

beforeEach(() => {
  jest.clearAllMocks();
  mockUseAnalyticsOpensearch.mockReturnValue({ client: {} } as ReturnType<
    typeof useAnalyticsOpensearch
  >);
});

describe('useAnalyticsPublicationCompliance', () => {
  it('maps a non-Error rejection to an empty list', async () => {
    (getPublicationCompliance as jest.Mock).mockRejectedValue('nope');

    const { result } = renderStateHook(() =>
      useAnalyticsPublicationCompliance(options),
    );

    await waitFor(() =>
      expect(result.current).toEqual({ total: 0, items: [] }),
    );
  });

  it('maps an undefined result to null via the ?? null branch', async () => {
    (getPublicationCompliance as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderStateHook(() =>
      useAnalyticsPublicationCompliance(options),
    );

    await waitFor(() => expect(getPublicationCompliance).toHaveBeenCalled());
    expect(result.current).toBeNull();
  });

  it('defaults a missing timeRange to "all"', async () => {
    (getPublicationCompliance as jest.Mock).mockResolvedValue({
      total: 0,
      items: [],
    });

    const { result } = renderStateHook(() =>
      useAnalyticsPublicationCompliance({
        ...options,
        timeRange: undefined,
      } as unknown as Parameters<typeof useAnalyticsPublicationCompliance>[0]),
    );

    await waitFor(() =>
      expect(result.current).toEqual({ total: 0, items: [] }),
    );
  });

  it('re-throws Error rejections to the error boundary', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    (getPublicationCompliance as jest.Mock).mockRejectedValue(
      new Error('boom'),
    );

    const Probe = () => {
      useAnalyticsPublicationCompliance(options);
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
