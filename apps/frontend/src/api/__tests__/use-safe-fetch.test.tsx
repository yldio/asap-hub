import React from 'react';
import nock, { ReplyFnContext, ReplyFnResult } from 'nock';
import { waitFor } from '@testing-library/dom';
import { render, act, RenderResult } from '@testing-library/react';
import { CachePolicies } from 'use-http';

import userEvent from '@testing-library/user-event';
import useSafeFetch from '../use-safe-fetch';
import { API_BASE_URL } from '../../config';

jest.mock('../../config');

afterEach(() => {
  nock.cleanAll();
});

const TestComponent: React.FC<{ path: string; acceptCharset?: string }> = ({
  path,
  acceptCharset,
}) => {
  const { loading, error, data } = useSafeFetch<string>(
    `${API_BASE_URL}${path}`,
    {
      cachePolicy: CachePolicies.NO_CACHE,
      headers: acceptCharset ? { 'accept-charset': acceptCharset } : undefined,
    },
  );

  if (loading) return <>loading</>;
  if (error) return <>error: {error.toString()}</>;
  if (data) return <>data: {data}</>;
  return <>what?</>;
};
let result!: RenderResult;

it('fetches given URL', async () => {
  nock(API_BASE_URL).get('/hi').reply(200, 'hello');
  await act(async () => {
    result = render(<TestComponent path="/hi" />);
    await waitFor(() =>
      expect(result.container).not.toHaveTextContent(/loading/i),
    );
  });

  expect(result.container).toHaveTextContent('data: hello');
});

it('respects the passed options', async () => {
  nock(API_BASE_URL, { reqheaders: { 'accept-charset': 'utf-8' } })
    .get('/hi')
    .reply(200, 'hello in utf-8');
  await act(async () => {
    result = render(<TestComponent path="/hi" acceptCharset="utf-8" />);
    await waitFor(() =>
      expect(result.container).not.toHaveTextContent(/loading/i),
    );
  });

  expect(result.container).toHaveTextContent('data: hello in utf-8');
});

describe('when the request URL changes', () => {
  let requests!: Array<{
    context: ReplyFnContext;
    // complaining about `result` here is a lint rule bug
    // eslint-disable-next-line no-shadow
    cb: (err: NodeJS.ErrnoException | null, result: ReplyFnResult) => void;
  }>;
  beforeEach(async () => {
    requests = [];
    nock(API_BASE_URL)
      .get(/.+/)
      .reply(function handleRequest(_uri, _body, _cb) {
        requests.push({ context: this, cb: _cb });
      })
      .persist();
  });
  afterEach(async () => {
    await act(async () => {
      requests.forEach(({ context }) => context.req.abort());
      await waitFor(() =>
        expect(result.container).not.toHaveTextContent(/loading/i),
      );
    });
  });

  beforeEach(async () => {
    await act(async () => {
      result = render(<TestComponent path="/hi" />);
      await waitFor(() => expect(requests).toHaveLength(1));
    });
  });

  it('aborts the old request', async () => {
    await act(async () => {
      result.rerender(<TestComponent path="/hi2" />);
      await waitFor(() => expect(requests[0].context.req.aborted).toBe(true));
    });
  });

  it('requests the new URL', async () => {
    await act(async () => {
      result.rerender(<TestComponent path="/hi2" />);
      await waitFor(() => expect(requests).toHaveLength(2));
    });
    expect(requests[1].context.req.path).toBe('/hi2');
  });

  it('ignores an outdated response coming in shortly after a URL change', async () => {
    await act(async () => {
      result.rerender(<TestComponent path="/hi2" />);
      requests[0].cb(null, [200, 'hello']);

      await waitFor(() => expect(requests).toHaveLength(2));
      requests[1].cb(null, [200, 'hello2']);
      await waitFor(() =>
        expect(result.container).not.toHaveTextContent(/loading/i),
      );
    });
    expect(result.container).toHaveTextContent('data: hello2');
  });

  it('ignores responses coming in out of sequence', async () => {
    await act(async () => {
      result.rerender(<TestComponent path="/hi2" />);
      await waitFor(() => expect(requests).toHaveLength(2));

      requests[1].cb(null, [200, 'hello2']);
      await waitFor(() =>
        expect(result.container).not.toHaveTextContent(/loading/i),
      );

      requests[0].cb(null, [200, 'hello']);
      await waitFor(() =>
        expect(result.container).not.toHaveTextContent(/loading/i),
      );
    });
    expect(result.container).toHaveTextContent('data: hello2');
  });
});

it('Supplies content type on patch requests', async () => {
  nock(API_BASE_URL).get('/patch').reply(200, 'hello');
  const patchIntercept = nock(API_BASE_URL, {
    reqheaders: { 'content-type': 'application/json' },
  })
    .patch('/patch')
    .reply(201);
  const PatchComponent: React.FC<Record<string, never>> = () => {
    const { loading, error, data, patch } = useSafeFetch<string>(
      `${API_BASE_URL}/patch`,
      {
        cachePolicy: CachePolicies.NO_CACHE,
      },
    );

    if (loading) return <>loading</>;
    if (error) return <>error: {error.toString()}</>;
    if (data)
      return (
        <button
          onClick={() => {
            patch({ test: 123 });
          }}
        >
          data: {data}
        </button>
      );
    return <>what?</>;
  };
  await act(async () => {
    result = render(<PatchComponent />);
    await waitFor(() =>
      expect(result.container).not.toHaveTextContent(/loading/i),
    );
    userEvent.click(result.getByRole('button'));
    await waitFor(() => expect(patchIntercept.isDone()).toBe(true));
  });
});
