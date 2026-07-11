import { createTestQueryClient } from '@asap-hub/frontend-utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, renderHook, waitFor } from '@testing-library/react';
import { Component, ReactNode, Suspense } from 'react';

import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import { getInterestGroup, getInterestGroups } from '../api';
import {
  interestGroupQueryKeys,
  useInterestGroupById,
  useInterestGroups,
} from '../state';

jest.mock('../api');

const mockGetInterestGroups =
  getInterestGroups as jest.MockedFunction<typeof getInterestGroups>;
const mockGetInterestGroup =
  getInterestGroup as jest.MockedFunction<typeof getInterestGroup>;

const listOptions = {
  searchQuery: '',
  currentPage: 0,
  pageSize: 10,
  filters: new Set<string>(),
} as unknown as Parameters<typeof useInterestGroups>[0];

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

afterEach(() => {
  jest.clearAllMocks();
});

describe('useInterestGroups', () => {
  it('maps a non-Error rejection to an empty list', async () => {
    mockGetInterestGroups.mockRejectedValue('nope');

    const { result } = renderStateHook(() => useInterestGroups(listOptions));

    await waitFor(() =>
      expect(result.current).toEqual({ total: 0, items: [] }),
    );
  });

  it('re-throws Error rejections to the error boundary', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    mockGetInterestGroups.mockRejectedValue(new Error('boom'));

    const Probe = () => {
      useInterestGroups(listOptions);
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

describe('useInterestGroupById', () => {
  it('maps a 404 (undefined) to undefined and caches null', async () => {
    mockGetInterestGroup.mockResolvedValue(undefined);

    const { result, queryClient } = renderStateHook(() =>
      useInterestGroupById('missing-group'),
    );

    await waitFor(() => expect(mockGetInterestGroup).toHaveBeenCalled());
    await waitFor(() =>
      expect(
        queryClient.getQueryData(interestGroupQueryKeys.detail('missing-group')),
      ).toBeNull(),
    );
    expect(result.current).toBeUndefined();
  });
});
