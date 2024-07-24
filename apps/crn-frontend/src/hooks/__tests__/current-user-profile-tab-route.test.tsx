import React from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import { User } from '@asap-hub/auth';
import { networkRoutes } from '@asap-hub/routing';
import { MemoryRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { waitFor } from '@testing-library/dom';

import { Auth0Provider } from '../../auth/test-utils';
import { useCurrentUserProfileTabRoute } from '../current-user-profile-tab-route';
import { refreshUserState } from '../../network/users/state';

it('returns undefined when not logged in', () => {
  const { result } = renderHook(() => useCurrentUserProfileTabRoute(), {
    wrapper: MemoryRouter,
  });
  expect(result.current).toBe(undefined);
});
const wrapper =
  ({
    currentRoute,
    user,
  }: {
    currentRoute: string;
    user?: Partial<User>;
  }): React.FC<React.PropsWithChildren<unknown>> =>
  ({ children }) => (
    <RecoilRoot
      initializeState={({ set }) => {
        user?.id && set(refreshUserState(user.id), Math.random());
      }}
    >
      <Auth0Provider user={user}>
        <MemoryRouter initialEntries={[currentRoute]}>{children}</MemoryRouter>
      </Auth0Provider>
    </RecoilRoot>
  );
it('returns undefined when on different user profile', async () => {
  const userId = 'test123';
  const route = networkRoutes.DEFAULT.USERS.DETAILS.RESEARCH.buildPath({
    id: 'someone-else',
  });

  const { result } = renderHook(() => useCurrentUserProfileTabRoute(), {
    wrapper: wrapper({ currentRoute: route, user: { id: userId } }),
  });
  await act(async () => {
    await waitFor(() => expect(result.current).toBeUndefined());
  });
});
describe('match logged in user on their own profile tab', () => {
  it('returns route when on about', async () => {
    const userId = 'test123';
    const route = networkRoutes.DEFAULT.USERS.DETAILS.ABOUT.buildPath({
      id: userId,
    });
    const { result } = renderHook(() => useCurrentUserProfileTabRoute(), {
      wrapper: wrapper({ currentRoute: route, user: { id: userId } }),
    });
    await act(async () => {
      await waitFor(() => expect(result.current).toEqual(route));
    });
  });

  it('returns route when on outputs', async () => {
    const userId = 'test123';
    const route = networkRoutes.DEFAULT.USERS.DETAILS.OUTPUTS.buildPath({
      id: userId,
    });

    const { result } = renderHook(() => useCurrentUserProfileTabRoute(), {
      wrapper: wrapper({ currentRoute: route, user: { id: userId } }),
    });
    await act(async () => {
      await waitFor(() => expect(result.current).toEqual(route));
    });
  });

  it('returns route when on research', async () => {
    const userId = 'test123';
    const route = networkRoutes.DEFAULT.USERS.DETAILS.RESEARCH.buildPath({
      id: userId,
    });

    const { result } = renderHook(() => useCurrentUserProfileTabRoute(), {
      wrapper: wrapper({ currentRoute: route, user: { id: userId } }),
    });
    await act(async () => {
      await waitFor(() => expect(result.current).toEqual(route));
    });
  });
});
