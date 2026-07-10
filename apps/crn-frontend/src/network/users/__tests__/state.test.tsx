import { createUserResponse } from '@asap-hub/fixtures';
import { createTestQueryClient } from '@asap-hub/frontend-utils';
import { QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { ReactNode, Suspense } from 'react';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';

import { deleteUserAvatar, postUserAvatar } from '../api';
import { useDeleteUserAvatarById, usePatchUserAvatarById } from '../state';

jest.mock('../api');

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
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={createTestQueryClient()}>
      <Suspense fallback="loading">
        <Auth0Provider user={{ id }} auth0Overrides={() => ({ refreshUser })}>
          <WhenReady>{children}</WhenReady>
        </Auth0Provider>
      </Suspense>
    </QueryClientProvider>
  );
  const { result } = renderHook(useHook, { wrapper });
  return { result, refreshUser };
};

beforeEach(() => {
  jest.resetAllMocks();
  mockDeleteUserAvatar.mockResolvedValue({ ...createUserResponse(), id });
  mockPostUserAvatar.mockResolvedValue({ ...createUserResponse(), id });
});

describe('usePatchUserAvatarById', () => {
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
