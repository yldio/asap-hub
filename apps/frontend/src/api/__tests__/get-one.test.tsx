import React from 'react';
import {
  RenderHookResult,
  renderHook,
  act,
} from '@testing-library/react-hooks';
import { waitFor } from '@testing-library/dom';
import { authTestUtils } from '@asap-hub/react-components';
import { ClientRequest } from 'http';
import nock from 'nock';

import { API_BASE_URL } from '../../config';
import { useGetOne, OneResult } from '../get-one';

jest.mock('../../config');

describe('useGetOne', () => {
  const wrapper: React.FC = ({ children }) => (
    <authTestUtils.Auth0Provider>
      <authTestUtils.WhenReady>
        <authTestUtils.LoggedIn user={undefined}>
          {children}
        </authTestUtils.LoggedIn>
      </authTestUtils.WhenReady>
    </authTestUtils.Auth0Provider>
  );
  const renderUseGetList = async <P extends unknown>(
    hookFn: (props: P) => OneResult<{ id: string }>,
  ) => {
    let renderedHook!: RenderHookResult<P, OneResult<{ id: string }>>;
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
      .get('/users/42')
      .reply(200, function handleRequest(url, body, cb) {
        req = this.req;
        cb(null, { id: '42' });
      })
      .persist();
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it('requests from given URL', async () => {
    const {
      result: { current },
    } = await renderUseGetList(() => useGetOne('users/42'));
    expect(current.data).toEqual({ id: '42' });
  });

  it('sets the authorization header by default', async () => {
    await renderUseGetList(() => useGetOne('users/42'));
    expect(req!.getHeader('authorization')).not.toHaveLength(0);
  });
  it('does not set the authorization header with authenticated=false', async () => {
    await renderUseGetList(() =>
      useGetOne('users/42', { authenticated: false }),
    );
    expect(req!.hasHeader('authorization')).toBe(false);
  });

  it('throws if the request errors', async () => {
    nock.cleanAll();
    nock(API_BASE_URL).get('/users/42').reply(500, 'nope');
    await expect(
      renderUseGetList(() => useGetOne('users/42', { authenticated: false })),
    ).rejects.toThrow(/500/);
  });

  it('returns empty data if the request 404s', async () => {
    nock.cleanAll();
    nock(API_BASE_URL).get('/users/42').reply(404, { id: 'nope' });
    const {
      result: { current },
    } = await renderUseGetList(() => useGetOne('users/42'));
    expect(current.data).toBe(undefined);
  });
});
