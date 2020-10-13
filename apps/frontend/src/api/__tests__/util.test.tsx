import React from 'react';
import {
  renderHook,
  RenderHookResult,
  act,
} from '@testing-library/react-hooks';
import { authTestUtils } from '@asap-hub/react-components';
import nock from 'nock';
import { waitFor } from '@testing-library/dom';
import { UseFetch } from 'use-http';
import { ClientRequest } from 'http';

import { useFetchOptions, createListApiUrl, useGetList } from '../util';

jest.mock('../../config');

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
});

describe('createListApiUrl', () => {
  it('handles requests without parameters ', async () => {
    expect(createListApiUrl('test').toString()).toMatch(/\/test$/);
  });
  it('handles requests with a search query ', async () => {
    expect(
      createListApiUrl('test', { searchQuery: 'test123' }).toString(),
    ).toContain('test?search=test123');
  });
  it('handles requests with filters ', async () => {
    expect(
      createListApiUrl('test', { filters: ['123', '456'] }).toString(),
    ).toContain('test?filter=123&filter=456');
  });
});

describe('useGetList', () => {
  const wrapper: React.FC = ({ children }) => (
    <authTestUtils.Auth0Provider>
      <authTestUtils.WhenReady>
        <authTestUtils.LoggedIn user={undefined}>
          {children}
        </authTestUtils.LoggedIn>
      </authTestUtils.WhenReady>
    </authTestUtils.Auth0Provider>
  );
  const renderUseGetList = async <P extends {}>(
    hookFn: (props: P) => UseFetch<string[]>,
  ) => {
    let renderedHook!: RenderHookResult<P, UseFetch<string[]>>;
    await act(async () => {
      renderedHook = renderHook(hookFn, {
        wrapper,
      });
      await waitFor(() =>
        expect(renderedHook.result.current.loading).toBe(false),
      );
    });
    return renderedHook;
  };

  let req: ClientRequest | undefined;
  beforeEach(() => {
    req = undefined;
    nock('http://api')
      .get('/users')
      .query(true)
      .reply(200, function handleRequest(url, body, cb) {
        req = this.req;
        cb(null, []);
      })
      .persist();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it('requests from given URL', async () => {
    const {
      result: { current },
    } = await renderUseGetList(() => useGetList('users'));
    expect(current.data).toEqual([]);
  });

  it('uses the given filter and search', async () => {
    await renderUseGetList(() =>
      useGetList('users', {
        filters: ['admin', 'superuser'],
        searchQuery: 'john',
      }),
    );
    const { searchParams } = new URL(req!.path, 'http://api');
    expect(searchParams.getAll('filter')).toEqual(['admin', 'superuser']);
    expect(searchParams.get('search')).toEqual('john');
  });

  it('re-fetches when the search query changes', async () => {
    const {
      rerender,
    } = await renderUseGetList(
      ({ searchQuery }: { searchQuery?: string } = {}) =>
        useGetList('users', { searchQuery }),
    );

    let { searchParams } = new URL(req!.path, 'http://api');
    expect(searchParams.has('search')).toBe(false);

    await act(async () => {
      rerender({ searchQuery: 'john' });
      await waitFor(() => {
        ({ searchParams } = new URL(req!.path, 'http://api'));
        expect(searchParams.get('search')).toBe('john');
      });
    });
  });
});
