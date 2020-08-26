import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { authTestUtils } from '@asap-hub/react-components';

import { useFetchOptions } from '../util';

const interceptorArgs = {
  url: 'http://api/',
  path: 'http://api',
  route: '/',
};

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

it("fetches and don't sets authorization header when user isn't logged", async () => {
  const {
    result: { current },
  } = renderHook(useFetchOptions);
  const { headers } = await current.interceptors!.request!({
    options: current,
    ...interceptorArgs,
  });

  expect(new Headers(headers).get('authorization')).toBeNull();
});

it('allows overriding headers', async () => {
  const {
    result: { current },
  } = renderHook(
    () =>
      useFetchOptions({
        headers: { accept: 'application/xml', 'accept-charset': 'utf-8' },
      }),
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
      useFetchOptions({
        interceptors: {
          request: ({ options: { headers, ...options } }) => ({
            ...options,
            headers: { ...headers, accept: 'application/xml' },
          }),
        },
      }),
    { wrapper },
  );
  const { headers } = await current.interceptors!.request!({
    options: current,
    ...interceptorArgs,
  });
  expect(new Headers(headers).get('accept')).toContain('application/xml');
  expect(new Headers(headers).get('authorization')).toBe('Bearer token');
});
