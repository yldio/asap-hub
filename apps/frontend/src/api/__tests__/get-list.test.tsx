import React from 'react';
import { authTestUtils } from '@asap-hub/react-components';
import { waitFor } from '@testing-library/dom';
import { renderHook, act } from '@testing-library/react-hooks';
import { ClientRequest } from 'http';
import nock from 'nock';

import { useGetList, ListResult } from '../get-list';
import { GetListOptions } from '../../api-util';
import { API_BASE_URL } from '../../config';
import { DEFAULT_PAGE_SIZE } from '../../hooks';

jest.mock('../../config');

const helperToExtractReturnType = () =>
  renderHook<Partial<GetListOptions>, ListResult<string[]>>(() =>
    useGetList('/endpoint', {
      currentPage: 0,
      pageSize: DEFAULT_PAGE_SIZE,
      filters: new Set(),
      searchQuery: '',
    }),
  );
type RenderUseGetListResult = ReturnType<typeof helperToExtractReturnType>;

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
  const renderUseGetList = async (
    hookFn: (props: Partial<GetListOptions>) => ListResult<string[]>,
  ) => {
    let renderedHook!: RenderUseGetListResult;
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
    } = await renderUseGetList(() =>
      useGetList('users', {
        currentPage: 0,
        pageSize: DEFAULT_PAGE_SIZE,
        filters: new Set([]),
        searchQuery: '',
      }),
    );
    expect(current.data).toEqual([]);
  });

  it('uses the given filter and search', async () => {
    await renderUseGetList(() =>
      useGetList('users', {
        filters: new Set(['admin', 'superuser']),
        searchQuery: 'john',
        pageSize: DEFAULT_PAGE_SIZE,
        currentPage: 0,
      }),
    );
    const { searchParams } = new URL(req!.path, API_BASE_URL);
    expect(searchParams.getAll('filter')).toEqual(['admin', 'superuser']);
    expect(searchParams.get('search')).toEqual('john');
  });

  it('re-fetches when the search query changes', async () => {
    const { rerender } = await renderUseGetList(({ searchQuery = '' } = {}) =>
      useGetList('users', {
        searchQuery,
        filters: new Set(),
        pageSize: DEFAULT_PAGE_SIZE,
        currentPage: 0,
      }),
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
    await expect(
      renderUseGetList(() =>
        useGetList('users', {
          searchQuery: '',
          currentPage: 0,
          pageSize: DEFAULT_PAGE_SIZE,
          filters: new Set(),
        }),
      ),
    ).rejects.toThrow(/500/);
  });
});
