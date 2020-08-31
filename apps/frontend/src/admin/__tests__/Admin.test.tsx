import React from 'react';
import nock from 'nock';
import { ClientRequest } from 'http';
import { render, RenderResult, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Admin from '../Admin';
import { API_BASE_URL } from '../../config';

jest.mock('../../config');

it('shows the user invitation form', () => {
  const { getByText } = render(<Admin />);
  expect(getByText(/invite user/i)).toBeVisible();
});

describe('when submitting the form', () => {
  let nockInterceptor: nock.Interceptor;
  let result: RenderResult;

  beforeEach(() => {
    nock.cleanAll();
    nockInterceptor = nock(API_BASE_URL, {
      reqheaders: {
        authorization: 'Bearer Pw123',
        'content-type': 'application/json',
      },
    }).post('/users', {
      displayName: 'John Doe',
      email: 'john.doe@example.com',
    });
  });

  beforeEach(async () => {
    result = render(<Admin />);
    const { getByLabelText } = result;

    await userEvent.type(getByLabelText(/name/i), 'John Doe', {
      allAtOnce: true,
    });
    await userEvent.type(getByLabelText(/e-?mail/i), 'john.doe@example.com', {
      allAtOnce: true,
    });
    await userEvent.type(getByLabelText(/password/i), 'Pw123', {
      allAtOnce: true,
    });
  });

  describe('and the invitation is pending', () => {
    beforeEach(() => {
      nockInterceptor.delay(0).reply(201);
    });
    afterEach(async () => {
      await waitFor(() => nock.isDone());
    });

    beforeEach(() => {
      const { getByText } = result;

      userEvent.click(getByText(/invite/i, { selector: 'button *' }));
    });

    it('hides the form', () => {
      const { queryByText } = result;

      expect(queryByText(/^invite user$/i)).not.toBeInTheDocument();
    });

    it('shows a loading indicator', () => {
      const { getByText } = result;

      expect(getByText(/inviting/i)).toBeVisible();
    });
  });

  it('cancels the request on unmount', async () => {
    const { getByText, unmount } = result;
    let req!: ClientRequest;

    nockInterceptor.delay(1).reply(201, function handleRequest(url, body, cb) {
      req = this.req;
      cb(null, {});
    });
    userEvent.click(getByText(/invite/i, { selector: 'button *' }));

    expect(req.aborted).toBe(undefined);
    unmount();
    await waitFor(() => expect(req.aborted).toEqual(expect.any(Number)));
  });

  describe('and the invitation succeeds', () => {
    beforeEach(() => {
      nockInterceptor.reply(201);
    });

    beforeEach(async () => {
      const { getByText } = result;

      userEvent.click(getByText(/invite/i, { selector: 'button *' }));
      await waitFor(() => nock.isDone());
    });

    it('shows the form again', async () => {
      const { findByText } = result;
      expect(await findByText(/^invite user$/i)).toBeVisible();
    });

    it('shows a success message', async () => {
      const { findByText } = result;
      expect(await findByText(/invited/i)).toBeVisible();
    });
  });

  describe('and the invitation fails', () => {
    beforeEach(() => {
      nockInterceptor.reply(401);
    });

    beforeEach(async () => {
      const { getByText } = result;

      userEvent.click(getByText(/invite/i, { selector: 'button *' }));
      await waitFor(() => nock.isDone());
    });

    it('shows the form again', async () => {
      const { findByText } = result;
      expect(await findByText(/^invite user$/i)).toBeVisible();
    });

    it('shows a failure message', async () => {
      const { findByText } = result;
      expect((await findByText(/failed/i)).textContent).toMatchInlineSnapshot(
        `"Failed to invite user. Error: 401 "`,
      );
    });
  });

  describe('and the request errors', () => {
    beforeEach(() => {
      nockInterceptor.replyWithError('socket timeout');
    });

    beforeEach(async () => {
      const { getByText } = result;

      userEvent.click(getByText(/invite/i, { selector: 'button *' }));
      await waitFor(() => nock.isDone());
    });

    it('shows the form again', async () => {
      const { findByText } = result;
      expect(await findByText(/^invite user$/i)).toBeVisible();
    });

    it('shows an error message', async () => {
      const { findByText } = result;
      expect((await findByText(/failed/i)).textContent).toMatchInlineSnapshot(
        `"Failed to invite user. FetchError: request to http://api/users failed, reason: socket timeout"`,
      );
    });
  });
});
