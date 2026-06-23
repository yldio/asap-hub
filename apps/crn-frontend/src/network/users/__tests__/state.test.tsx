import { createUserResponse } from '@asap-hub/fixtures';
import { act, renderHook, waitFor } from '@testing-library/react';
import { ReactNode, Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';

import { deleteUserAvatar } from '../api';
import { useDeleteUserAvatarById } from '../state';

jest.mock('../api');

const mockDeleteUserAvatar = deleteUserAvatar as jest.MockedFunction<
  typeof deleteUserAvatar
>;

const id = '42';

const renderDeleteAvatarHook = (
  refreshUser = jest.fn().mockResolvedValue(undefined),
) => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{ id }} auth0Overrides={() => ({ refreshUser })}>
          <WhenReady>{children}</WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>
  );
  const { result } = renderHook(() => useDeleteUserAvatarById(id), { wrapper });
  return { result, refreshUser };
};

beforeEach(() => {
  jest.resetAllMocks();
  mockDeleteUserAvatar.mockResolvedValue({ ...createUserResponse(), id });
});

describe('useDeleteUserAvatarById', () => {
  it('refreshes the Auth0 user by default', async () => {
    const { result, refreshUser } = renderDeleteAvatarHook();
    await waitFor(() => expect(result.current).toBeDefined());

    await act(() => result.current());

    expect(mockDeleteUserAvatar).toHaveBeenCalledWith(id, expect.any(String));
    expect(refreshUser).toHaveBeenCalledTimes(1);
  });

  it('does not refresh the Auth0 user when refreshToken is false', async () => {
    const { result, refreshUser } = renderDeleteAvatarHook();
    await waitFor(() => expect(result.current).toBeDefined());

    await act(() => result.current({ refreshToken: false }));

    expect(mockDeleteUserAvatar).toHaveBeenCalledWith(id, expect.any(String));
    expect(refreshUser).not.toHaveBeenCalled();
  });
});
