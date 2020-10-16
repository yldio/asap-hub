import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { authTestUtils } from '@asap-hub/react-components';

import { useFetchOptions } from '../util';

describe('useFetchOptions', () => {
  const interceptorArgs = {
    url: 'http://api/',
    path: 'http://api',
    route: '/',
  };

  it('throws if the user is not authenticated', async () => {
    const {
      result: { current },
    } = renderHook(useFetchOptions);
    await expect(() =>
      current.interceptors!.request!({ options: current, ...interceptorArgs }),
    ).rejects.toThrow(/auth/i);
  });

  const wrapper: React.FC<{}> = ({ children }) => (
    <authTestUtils.LoggedIn user={undefined}>{children}</authTestUtils.LoggedIn>
  );

  it('sets the default headers', async () => {
    const {
      result: { current },
    } = renderHook(useFetchOptions, { wrapper });
    const { headers } = await current.interceptors!.request!({
      options: current,
      ...interceptorArgs,
    });
    expect(new Headers(headers).get('content-type')).toBe('application/json');
  });

  it('fetches and sets the authorization header', async () => {
    const {
      result: { current },
    } = renderHook(useFetchOptions, { wrapper });
    const { headers } = await current.interceptors!.request!({
      options: current,
      ...interceptorArgs,
    });
    expect(new Headers(headers).get('authorization')).toBe('Bearer token');
  });

  it('does not set the authorizaton header if skipped', async () => {
    const {
      result: { current },
    } = renderHook(() => useFetchOptions({ authenticated: false }));
    const { headers } = await current.interceptors!.request!({
      options: current,
      ...interceptorArgs,
    });
    expect(new Headers(headers).has('authorization')).toBe(false);
  });

  it('allows overriding headers', async () => {
    const {
      result: { current },
    } = renderHook(
      () =>
        useFetchOptions(
          {},
          {
            headers: { accept: 'application/xml', 'accept-charset': 'utf-8' },
          },
        ),
      { wrapper },
    );
    const { headers } = await current.interceptors!.request!({
      options: current,
      ...interceptorArgs,
    });
    expect(new Headers(headers).get('accept')).toContain('application/xml');
    expect(new Headers(headers).get('accept-charset')).toContain('utf-8');
  });

  it('allows adding a request interceptor', async () => {
    const {
      result: { current },
    } = renderHook(
      () =>
        useFetchOptions(
          {},
          {
            interceptors: {
              request: ({ options: { headers, ...options } }) => ({
                ...options,
                headers: { ...headers, accept: 'application/xml' },
              }),
            },
          },
        ),
      { wrapper },
    );
    const { headers } = await current.interceptors!.request!({
      options: current,
      ...interceptorArgs,
    });
    expect(new Headers(headers).get('accept')).toContain('application/xml');
    expect(new Headers(headers).get('authorization')).toBe('Bearer token');
  });
});
