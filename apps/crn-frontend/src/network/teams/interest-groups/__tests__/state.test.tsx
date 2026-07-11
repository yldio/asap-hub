import { createTestQueryClient } from '@asap-hub/frontend-utils';
import { ListInterestGroupResponse } from '@asap-hub/model';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, renderHook, waitFor } from '@testing-library/react';
import { Component, ReactNode, Suspense } from 'react';

import { Auth0Provider, WhenReady } from '../../../../auth/test-utils';
import { interestGroupQueryKeys } from '../../../interest-groups/state';
import { getTeamInterestGroups } from '../api';
import { useTeamInterestGroupsById } from '../state';

jest.mock('../api');

const mockGetTeamInterestGroups =
  getTeamInterestGroups as jest.MockedFunction<typeof getTeamInterestGroups>;

const mockAuthorization = 'Bearer access_token';
const teamId = 'team-id-0';

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
  items: [{ id: 'group-1', name: 'Updated Group' }],
} as unknown as ListInterestGroupResponse;

afterEach(() => {
  jest.clearAllMocks();
});

describe('useTeamInterestGroupsById', () => {
  it('returns the fetched interest groups and writes them through the shared list cache', async () => {
    mockGetTeamInterestGroups.mockResolvedValue(interestGroups);

    const queryClient = createTestQueryClient();
    queryClient.setQueryData(interestGroupQueryKeys.lists(), {
      total: 2,
      items: [
        { id: 'group-1', name: 'Stale Group' },
        { id: 'group-untouched', name: 'Untouched Group' },
      ],
    });

    const { result } = renderStateHook(
      () => useTeamInterestGroupsById(teamId),
      queryClient,
    );

    await waitFor(() => expect(result.current).toEqual(interestGroups));
    expect(mockGetTeamInterestGroups).toHaveBeenCalledWith(
      teamId,
      mockAuthorization,
    );
    expect(
      queryClient.getQueryData<ListInterestGroupResponse>(
        interestGroupQueryKeys.lists(),
      )?.items[0]?.name,
    ).toBe('Updated Group');
    expect(
      queryClient.getQueryData<ListInterestGroupResponse>(
        interestGroupQueryKeys.lists(),
      )?.items[1]?.name,
    ).toBe('Untouched Group');
  });

  it('returns "noSuchTeam" when the team does not exist', async () => {
    mockGetTeamInterestGroups.mockResolvedValue(
      undefined as unknown as ListInterestGroupResponse,
    );

    const { result } = renderStateHook(() => useTeamInterestGroupsById(teamId));

    await waitFor(() => expect(result.current).toBe('noSuchTeam'));
  });

  it('maps a non-Error rejection to an empty list', async () => {
    mockGetTeamInterestGroups.mockRejectedValue('nope');

    const { result } = renderStateHook(() => useTeamInterestGroupsById(teamId));

    await waitFor(() =>
      expect(result.current).toEqual({ total: 0, items: [] }),
    );
  });

  it('re-throws Error rejections to the error boundary', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    mockGetTeamInterestGroups.mockRejectedValue(new Error('boom'));

    const Probe = () => {
      useTeamInterestGroupsById(teamId);
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
