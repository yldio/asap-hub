import React from 'react';
import { authTestUtils } from '@asap-hub/react-components';
import { waitFor } from '@testing-library/dom';
import { renderHook, act } from '@testing-library/react-hooks';
import { ClientRequest } from 'http';
import nock from 'nock';

import { useGetList, ListResult } from '../get-list';
import { GetListOptions } from '../../api-util';
import { API_BASE_URL } from '../../config';

jest.mock('../../config');

const helperToExtractReturnType = () =>
  renderHook<GetListOptions, ListResult<string[]>>(() =>
    useGetList('/endpoint'),
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
    hookFn: (props: GetListOptions) => ListResult<string[]>,
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
