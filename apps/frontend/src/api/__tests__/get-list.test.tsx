import React from 'react';
import { authTestUtils } from '@asap-hub/react-components';
import { waitFor } from '@testing-library/dom';
import {
  RenderHookResult,
  renderHook,
  act,
} from '@testing-library/react-hooks';
import { ClientRequest } from 'http';
import nock from 'nock';

import { createListApiUrl, useGetList, ListResult } from '../get-list';
import { API_BASE_URL } from '../../config';

jest.mock('../../config');

describe('createListApiUrl', () => {
  it('handles requests without parameters ', async () => {
    expect(
      createListApiUrl('test', {
        pageSize: null,
        currentPage: null,
      }).toString(),
    ).toMatch(/\/test$/);
  });

  it('sets default page and size', async () => {
    const url = createListApiUrl('test');
    expect(url.searchParams.get('take')).toEqual('10');
    expect(url.searchParams.get('skip')).toEqual('0');
  });

  it('calculates take and skip from params', async () => {
    const url = createListApiUrl('test', { currentPage: 2, pageSize: 10 });
    expect(url.searchParams.get('take')).toEqual('10');
    expect(url.searchParams.get('skip')).toEqual('20');
  });

  it('handles requests with a search query ', async () => {
    expect(
      createListApiUrl('test', { searchQuery: 'test123' }).toString(),
    ).toContain('search=test123');
  });
  it('handles requests with filters ', async () => {
    expect(
      createListApiUrl('test', { filters: ['123', '456'] }).toString(),
    ).toContain('filter=123&filter=456');
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
    hookFn: (props: P) => ListResult<string[]>,
  ) => {
    let renderedHook!: RenderHookResult<P, ListResult<string[]>>;
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
    nock(API_BASE_URL)
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
    const { searchParams } = new URL(req!.path, API_BASE_URL);
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

    let { searchParams } = new URL(req!.path, API_BASE_URL);
    expect(searchParams.has('search')).toBe(false);

    await act(async () => {
      rerender({ searchQuery: 'john' });
      await waitFor(() => {
        ({ searchParams } = new URL(req!.path, API_BASE_URL));
        expect(searchParams.get('search')).toBe('john');
      });
    });
  });

  it('throws if the request errors', async () => {
    nock.cleanAll();
    nock(API_BASE_URL).get('/users').query(true).reply(500, 'nope');
    await expect(renderUseGetList(() => useGetList('users'))).rejects.toThrow(
      /500/,
    );
  });
});
