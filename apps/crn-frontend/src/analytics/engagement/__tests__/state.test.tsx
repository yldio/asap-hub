import { createTestQueryClient } from '@asap-hub/frontend-utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, renderHook, waitFor } from '@testing-library/react';
import { Component, ReactNode, Suspense } from 'react';

import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import { useAnalyticsOpensearch } from '../../../hooks/opensearch';
import { getEngagement, getMeetingRepAttendance } from '../api';
import {
  useAnalyticsEngagement,
  useAnalyticsMeetingRepAttendance,
} from '../state';

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
} as unknown as Parameters<typeof useAnalyticsEngagement>[0];

beforeEach(() => {
  jest.clearAllMocks();
  mockUseAnalyticsOpensearch.mockReturnValue({ client: {} } as ReturnType<
    typeof useAnalyticsOpensearch
  >);
});

describe('useAnalyticsEngagement', () => {
  it('maps a non-Error rejection to an empty list', async () => {
    (getEngagement as jest.Mock).mockRejectedValue('nope');

    const { result } = renderStateHook(() => useAnalyticsEngagement(options));

    await waitFor(() =>
      expect(result.current).toEqual({ total: 0, items: [] }),
    );
  });
});

describe('useAnalyticsMeetingRepAttendance', () => {
  it('maps a non-Error rejection to an empty list', async () => {
    (getMeetingRepAttendance as jest.Mock).mockRejectedValue('nope');

    const { result } = renderStateHook(() =>
      useAnalyticsMeetingRepAttendance(
        options as Parameters<typeof useAnalyticsMeetingRepAttendance>[0],
      ),
    );

    await waitFor(() =>
      expect(result.current).toEqual({ total: 0, items: [] }),
    );
  });

  it('maps an undefined result to null via the ?? null branch', async () => {
    (getMeetingRepAttendance as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderStateHook(() =>
      useAnalyticsMeetingRepAttendance(
        options as Parameters<typeof useAnalyticsMeetingRepAttendance>[0],
      ),
    );

    await waitFor(() => expect(getMeetingRepAttendance).toHaveBeenCalled());
    expect(result.current).toBeNull();
  });
});

describe('Error rejections propagate to the error boundary', () => {
  it.each([
    ['engagement', getEngagement, useAnalyticsEngagement],
    ['attendance', getMeetingRepAttendance, useAnalyticsMeetingRepAttendance],
  ])('re-throws Error rejections for %s', async (_name, getter, hook) => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    (getter as jest.Mock).mockRejectedValue(new Error('boom'));

    const Probe = () => {
      (hook as (o: typeof options) => unknown)(options);
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
