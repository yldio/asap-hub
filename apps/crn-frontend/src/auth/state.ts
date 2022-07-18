import { atom, selector } from 'recoil';
import { Auth0 } from '@asap-hub/auth';

export const auth0State = atom<Auth0 | undefined>({
  key: 'auth0',
  default: undefined,
});

export const authorizationState = selector<string>({
  key: 'authorization',
  get: async ({ get }) => {
    const auth0 = get(auth0State);
    if (!auth0) {
      throw new Error('Auth0 not available');
    }
    const accessToken = await auth0.getTokenSilently();
    return `Bearer ${accessToken}`;
  },
});
