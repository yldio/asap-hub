import { renderHook, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import { RecoilRoot } from 'recoil';

import { Auth0Provider, WhenReady } from '../test-utils';
import { useAuthorization } from '../useAuthorization';

describe('useAuthorization', () => {
  it('returns a Bearer authorization header once auth0 is ready', async () => {
    const { result } = renderHook(() => useAuthorization(), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <RecoilRoot>
          <Auth0Provider user={{}}>
            <WhenReady>{children}</WhenReady>
          </Auth0Provider>
        </RecoilRoot>
      ),
    });

    await waitFor(async () => {
      await expect(result.current()).resolves.toBe('Bearer access_token');
    });
  });

  it('rejects when called before the Auth0 context is ready', async () => {
    const { result } = renderHook(() => useAuthorization());

    await expect(result.current()).rejects.toThrow(
      'Auth0 is not ready; cannot get an authorization token yet',
    );
  });
});
