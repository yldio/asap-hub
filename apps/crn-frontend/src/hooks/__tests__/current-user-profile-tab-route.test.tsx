import React from 'react';
import { act, renderHook } from '@testing-library/react-hooks/server';
import { User } from '@asap-hub/auth';
import { network } from '@asap-hub/routing';
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
  }): React.FC =>
  ({ children }) =>
    (
      <RecoilRoot
        initializeState={({ set }) => {
          user?.id && set(refreshUserState(user.id), Math.random());
        }}
      >
        <Auth0Provider user={user}>
          <MemoryRouter initialEntries={[currentRoute]}>
            {children}
          </MemoryRouter>
        </Auth0Provider>
      </RecoilRoot>
    );
it('returns undefined when on different user profile', async () => {
  const userId = 'test123';
  const route = network({})
    .users({})
    .user({
      userId: 'someone-else',
    })
    .research({});
  const { result } = renderHook(() => useCurrentUserProfileTabRoute(), {
    wrapper: wrapper({ currentRoute: route.$, user: { id: userId } }),
  });
  await act(async () => {
    await waitFor(() => expect(result.current).toBeUndefined());
  });
});
describe('match logged in user on their own profile tab', () => {
  it('returns route when on about', async () => {
    const userId = 'test123';
    const route = network({}).users({}).user({ userId }).about({});
    const { result } = renderHook(() => useCurrentUserProfileTabRoute(), {
      wrapper: wrapper({ currentRoute: route.$, user: { id: userId } }),
    });
    await act(async () => {
      await waitFor(() =>
        expect(result.current && result.current({}).$).toEqual(route.$),
      );
    });
  });

  it('returns route when on outputs', async () => {
    const userId = 'test123';
    const route = network({}).users({}).user({ userId }).outputs({});
    const { result } = renderHook(() => useCurrentUserProfileTabRoute(), {
      wrapper: wrapper({ currentRoute: route.$, user: { id: userId } }),
    });
    await act(async () => {
      await waitFor(() =>
        expect(result.current && result.current({}).$).toEqual(route.$),
      );
    });
  });

  it('returns route when on research', async () => {
    const userId = 'test123';
    const route = network({}).users({}).user({ userId }).research({});
    const { result } = renderHook(() => useCurrentUserProfileTabRoute(), {
      wrapper: wrapper({ currentRoute: route.$, user: { id: userId } }),
    });
    await act(async () => {
      await waitFor(() =>
        expect(result.current && result.current({}).$).toEqual(route.$),
      );
    });
  });
});
