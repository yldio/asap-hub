import { createTestQueryClient } from '@asap-hub/frontend-utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, renderHook, waitFor } from '@testing-library/react';
import { Component, ReactNode, Suspense } from 'react';

import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import { getWorkingGroup, getWorkingGroups } from '../api';
import {
  useWorkingGroupById,
  useWorkingGroups,
  workingGroupQueryKeys,
} from '../state';

jest.mock('../api');
jest.mock('../../../hooks/algolia', () => ({
  useAlgolia: jest.fn(() => ({ client: {} })),
}));

const mockGetWorkingGroup =
  getWorkingGroup as jest.MockedFunction<typeof getWorkingGroup>;
const mockGetWorkingGroups =
  getWorkingGroups as jest.MockedFunction<typeof getWorkingGroups>;

const listOptions = {
  searchQuery: '',
  currentPage: 0,
  pageSize: 10,
  filters: new Set<string>(),
} as unknown as Parameters<typeof useWorkingGroups>[0];

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

describe('useWorkingGroupById', () => {
  it('maps a 404 (undefined) to undefined and caches null', async () => {
    mockGetWorkingGroup.mockResolvedValue(undefined);

    const { result, queryClient } = renderStateHook(() =>
      useWorkingGroupById('missing-wg'),
    );

    await waitFor(() => expect(mockGetWorkingGroup).toHaveBeenCalled());
    await waitFor(() =>
      expect(
        queryClient.getQueryData(workingGroupQueryKeys.detail('missing-wg')),
      ).toBeNull(),
    );
    expect(result.current).toBeUndefined();
  });
});

describe('useWorkingGroups', () => {
  it('maps a non-Error rejection to an empty list', async () => {
    mockGetWorkingGroups.mockRejectedValue('nope');

    const { result } = renderStateHook(() => useWorkingGroups(listOptions));

    await waitFor(() =>
      expect(result.current).toEqual({ total: 0, items: [] }),
    );
  });

  it('re-throws Error rejections to the error boundary', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    mockGetWorkingGroups.mockRejectedValue(new Error('boom'));

    const Probe = () => {
      useWorkingGroups(listOptions);
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
