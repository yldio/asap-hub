import { createTestQueryClient } from '@asap-hub/frontend-utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, renderHook, waitFor } from '@testing-library/react';
import { Component, ReactNode, Suspense } from 'react';

import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import { useAnalyticsOpensearch } from '../../../hooks/opensearch';
import {
  getPreliminaryDataSharing,
  getTeamCollaboration,
  getUserCollaboration,
} from '../api';
import {
  useAnalyticsSharingPrelimFindings,
  useAnalyticsTeamCollaboration,
  useAnalyticsUserCollaboration,
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
} as unknown as Parameters<typeof useAnalyticsUserCollaboration>[0];

beforeEach(() => {
  jest.clearAllMocks();
  mockUseAnalyticsOpensearch.mockReturnValue({ client: {} } as ReturnType<
    typeof useAnalyticsOpensearch
  >);
});

describe('useAnalyticsUserCollaboration', () => {
  it('maps a non-Error rejection to an empty list', async () => {
    (getUserCollaboration as jest.Mock).mockRejectedValue('nope');

    const { result } = renderStateHook(() =>
      useAnalyticsUserCollaboration(options),
    );

    await waitFor(() =>
      expect(result.current).toEqual({ total: 0, items: [] }),
    );
  });
});

describe('useAnalyticsTeamCollaboration', () => {
  it('maps a non-Error rejection to an empty list', async () => {
    (getTeamCollaboration as jest.Mock).mockRejectedValue('nope');

    const { result } = renderStateHook(() =>
      useAnalyticsTeamCollaboration(
        options as Parameters<typeof useAnalyticsTeamCollaboration>[0],
      ),
    );

    await waitFor(() =>
      expect(result.current).toEqual({ total: 0, items: [] }),
    );
  });
});

describe('useAnalyticsSharingPrelimFindings', () => {
  it('maps a non-Error rejection to an empty list', async () => {
    (getPreliminaryDataSharing as jest.Mock).mockRejectedValue('nope');

    const { result } = renderStateHook(() =>
      useAnalyticsSharingPrelimFindings(
        options as Parameters<typeof useAnalyticsSharingPrelimFindings>[0],
      ),
    );

    await waitFor(() =>
      expect(result.current).toEqual({ total: 0, items: [] }),
    );
  });
});

describe('Error rejections propagate to the error boundary', () => {
  it.each([
    ['user', getUserCollaboration, useAnalyticsUserCollaboration],
    ['team', getTeamCollaboration, useAnalyticsTeamCollaboration],
    ['prelim', getPreliminaryDataSharing, useAnalyticsSharingPrelimFindings],
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
