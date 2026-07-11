import { createTestQueryClient } from '@asap-hub/frontend-utils';
import { ListInterestGroupResponse } from '@asap-hub/model';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, renderHook, waitFor } from '@testing-library/react';
import { Component, ReactNode, Suspense } from 'react';

import { Auth0Provider, WhenReady } from '../../../../auth/test-utils';
import { interestGroupQueryKeys } from '../../../interest-groups/state';
import { getUserInterestGroups } from '../api';
import { useUserInterestGroupsById } from '../state';

jest.mock('../api');

const mockGetUserInterestGroups =
  getUserInterestGroups as jest.MockedFunction<typeof getUserInterestGroups>;

const mockAuthorization = 'Bearer access_token';
const userId = 'user-id-0';

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

const renderStateHook = <T,>(hook: () => T, queryClient = createTestQueryClient()) => {
  const utils = renderHook(hook, { wrapper: createWrapper(queryClient) });
  return { ...utils, queryClient };
};

const interestGroups = {
  total: 1,
  items: [{ id: 'group-1', name: 'Group One' }],
} as unknown as ListInterestGroupResponse;

afterEach(() => {
  jest.clearAllMocks();
});

describe('useUserInterestGroupsById', () => {
  it('returns the fetched interest groups and seeds each detail cache', async () => {
    mockGetUserInterestGroups.mockResolvedValue(interestGroups);

    const { result, queryClient } = renderStateHook(() =>
      useUserInterestGroupsById(userId),
    );

    await waitFor(() => expect(result.current).toEqual(interestGroups));
    expect(mockGetUserInterestGroups).toHaveBeenCalledWith(
      userId,
      mockAuthorization,
    );
    expect(
      queryClient.getQueryData(interestGroupQueryKeys.detail('group-1')),
    ).toEqual({ id: 'group-1', name: 'Group One' });
  });

  it('returns "noSuchUser" when the user does not exist', async () => {
    mockGetUserInterestGroups.mockResolvedValue(
      undefined as unknown as ListInterestGroupResponse,
    );

    const { result } = renderStateHook(() => useUserInterestGroupsById(userId));

    await waitFor(() => expect(result.current).toBe('noSuchUser'));
  });

  it('maps a non-Error rejection to an empty list', async () => {
    mockGetUserInterestGroups.mockRejectedValue('nope');

    const { result } = renderStateHook(() => useUserInterestGroupsById(userId));

    await waitFor(() =>
      expect(result.current).toEqual({ total: 0, items: [] }),
    );
  });

  it('re-throws Error rejections to the error boundary', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    mockGetUserInterestGroups.mockRejectedValue(new Error('boom'));

    const Probe = () => {
      useUserInterestGroupsById(userId);
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
