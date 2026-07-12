import { createUserResponse } from '@asap-hub/fixtures';
import { createTestQueryClient } from '@asap-hub/frontend-utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, renderHook, waitFor } from '@testing-library/react';
import { Component, ReactNode, Suspense } from 'react';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';

import { projectQueryKeys } from '../../../projects/state';
import { manuscriptQueryKeys } from '../../teams/state';
import { deleteUserAvatar, getUser, getUsers, postUserAvatar } from '../api';
import {
  useDeleteUserAvatarById,
  usePatchUserAvatarById,
  userQueryKeys,
  useUserById,
  useUsers,
} from '../state';

jest.mock('../api');

jest.mock('../../../hooks/algolia', () => ({
  useAlgolia: jest.fn(() => ({ client: {} })),
}));

const mockGetUsers = getUsers as jest.MockedFunction<typeof getUsers>;
const mockGetUser = getUser as jest.MockedFunction<typeof getUser>;

const mockDeleteUserAvatar = deleteUserAvatar as jest.MockedFunction<
  typeof deleteUserAvatar
>;
const mockPostUserAvatar = postUserAvatar as jest.MockedFunction<
  typeof postUserAvatar
>;

const id = '42';

const renderAvatarHook = <T,>(
  useHook: () => T,
  refreshUser = jest.fn().mockResolvedValue(undefined),
) => {
  const queryClient = createTestQueryClient();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback="loading">
        <Auth0Provider user={{ id }} auth0Overrides={() => ({ refreshUser })}>
          <WhenReady>{children}</WhenReady>
        </Auth0Provider>
      </Suspense>
    </QueryClientProvider>
  );
  const { result } = renderHook(useHook, { wrapper });
  return { result, refreshUser, queryClient };
};

const { useAlgolia } = jest.requireMock('../../../hooks/algolia') as {
  useAlgolia: jest.Mock;
};

beforeEach(() => {
  jest.resetAllMocks();
  mockDeleteUserAvatar.mockResolvedValue({ ...createUserResponse(), id });
  mockPostUserAvatar.mockResolvedValue({ ...createUserResponse(), id });
  (useAlgolia as jest.Mock).mockReturnValue({ client: {} });
});

describe('usePatchUserAvatarById', () => {
  it('resolves and keeps the saved user cached when the auth0 session refresh fails', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const getTokenSilently = jest.fn((options?: { ignoreCache?: boolean }) =>
      options?.ignoreCache
        ? Promise.reject(new Error('Consent required'))
        : Promise.resolve('token'),
    );
    const queryClient = createTestQueryClient();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <Suspense fallback="loading">
          <Auth0Provider
            user={{ id }}
            auth0Overrides={() => ({ getTokenSilently })}
          >
            <WhenReady>{children}</WhenReady>
          </Auth0Provider>
        </Suspense>
      </QueryClientProvider>
    );
    const { result } = renderHook(() => usePatchUserAvatarById(id), {
      wrapper,
    });
    await waitFor(() => expect(typeof result.current).toBe('function'));

    await act(() => result.current('data:image/jpeg;base64,abc'));

    expect(queryClient.getQueryData(userQueryKeys.detail(id))).toBeDefined();
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('refreshes the Auth0 user by default', async () => {
    const { result, refreshUser } = renderAvatarHook(() =>
      usePatchUserAvatarById(id),
    );
    await waitFor(() => expect(typeof result.current).toBe('function'));

    await act(() => result.current('data:image/jpeg;base64,abc'));

    expect(mockPostUserAvatar).toHaveBeenCalledWith(
      id,
      { avatar: 'data:image/jpeg;base64,abc' },
      expect.any(String),
    );
    expect(refreshUser).toHaveBeenCalledTimes(1);
  });

  it('does not refresh the Auth0 user when refreshToken is false', async () => {
    const { result, refreshUser } = renderAvatarHook(() =>
      usePatchUserAvatarById(id),
    );
    await waitFor(() => expect(typeof result.current).toBe('function'));

    await act(() =>
      result.current('data:image/jpeg;base64,abc', { refreshToken: false }),
    );

    expect(mockPostUserAvatar).toHaveBeenCalled();
    expect(refreshUser).not.toHaveBeenCalled();
  });

  it('invalidates other caches after the user refresh but keeps overlay caches fresh', async () => {
    const { result, queryClient } = renderAvatarHook(() =>
      usePatchUserAvatarById(id),
    );
    await waitFor(() => expect(typeof result.current).toBe('function'));

    queryClient.setQueryData(userQueryKeys.list(listOptions), {
      total: 0,
      items: [],
    });
    queryClient.setQueryData(userQueryKeys.detail('someone-else'), null);
    queryClient.setQueryData(manuscriptQueryKeys.detail('m-1'), {
      id: 'm-1',
    });
    queryClient.setQueryData(projectQueryKeys.detail('p-1'), { id: 'p-1' });

    await act(() => result.current('data:image/jpeg;base64,abc'));

    const isInvalidated = (queryKey: readonly unknown[]) =>
      queryClient.getQueryState(queryKey)?.isInvalidated;
    expect(isInvalidated(userQueryKeys.list(listOptions))).toBe(true);
    expect(isInvalidated(userQueryKeys.detail('someone-else'))).toBe(true);
    expect(isInvalidated(userQueryKeys.detail(id))).toBe(false);
    expect(isInvalidated(manuscriptQueryKeys.detail('m-1'))).toBe(false);
    expect(isInvalidated(projectQueryKeys.detail('p-1'))).toBe(false);
  });
});

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
        <Auth0Provider user={{ id }}>
          <WhenReady>{children}</WhenReady>
        </Auth0Provider>
      </Suspense>
    </QueryClientProvider>
  );

const listOptions = {
  searchQuery: '',
  currentPage: 0,
  pageSize: 10,
  filters: new Set<string>(),
} as unknown as Parameters<typeof useUsers>[0];

describe('useUserById', () => {
  it('maps a 404 (undefined) to undefined and caches null', async () => {
    mockGetUser.mockResolvedValue(undefined);

    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useUserById('missing'), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => expect(mockGetUser).toHaveBeenCalled());
    await waitFor(() =>
      expect(
        queryClient.getQueryData(userQueryKeys.detail('missing')),
      ).toBeNull(),
    );
    expect(result.current).toBeUndefined();
  });
});

describe('useUsers', () => {
  it('maps a non-Error rejection to an empty list', async () => {
    mockGetUsers.mockRejectedValue('nope');

    const { result } = renderHook(() => useUsers(listOptions), {
      wrapper: createWrapper(createTestQueryClient()),
    });

    await waitFor(() =>
      expect(result.current).toEqual({ total: 0, items: [] }),
    );
  });

  it('re-throws Error rejections to the error boundary', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    mockGetUsers.mockRejectedValue(new Error('boom'));

    const Probe = () => {
      useUsers(listOptions);
      return <>rendered</>;
    };
    const { getByText } = render(
      <QueryClientProvider client={createTestQueryClient()}>
        <ErrorBoundary>
          <Suspense fallback="loading">
            <Auth0Provider user={{ id }}>
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

describe('useDeleteUserAvatarById', () => {
  it('refreshes the Auth0 user by default', async () => {
    const { result, refreshUser } = renderAvatarHook(() =>
      useDeleteUserAvatarById(id),
    );
    await waitFor(() => expect(typeof result.current).toBe('function'));

    await act(() => result.current());

    expect(mockDeleteUserAvatar).toHaveBeenCalledWith(id, expect.any(String));
    expect(refreshUser).toHaveBeenCalledTimes(1);
  });

  it('does not refresh the Auth0 user when refreshToken is false', async () => {
    const { result, refreshUser } = renderAvatarHook(() =>
      useDeleteUserAvatarById(id),
    );
    await waitFor(() => expect(typeof result.current).toBe('function'));

    await act(() => result.current({ refreshToken: false }));

    expect(mockDeleteUserAvatar).toHaveBeenCalledWith(id, expect.any(String));
    expect(refreshUser).not.toHaveBeenCalled();
  });
});
