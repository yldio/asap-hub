import React from 'react';
import nock from 'nock';
import { render, RenderResult, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Admin from '../Admin';
import { API_BASE_URL } from '../../config';

jest.mock('../../config');

it('shows the user invitation form', () => {
  const { queryByText } = render(<Admin />);
  expect(queryByText(/invite user/i)).toBeInTheDocument();
});

describe('when submitting the form', () => {
  let nockInterceptor: nock.Interceptor;
  let result: RenderResult;

  beforeEach(() => {
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
  afterEach(() => {
    nock.cleanAll();
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
      nockInterceptor.delay(1).reply(201);
    });

    beforeEach(() => {
      const { getByRole } = result;

      userEvent.click(getByRole('button'));
    });

    it('hides the form', () => {
      const { queryByText } = result;

      expect(queryByText(/^invite user$/i)).not.toBeInTheDocument();
    });

    it('shows a loading indicator', () => {
      const { getByText } = result;

      expect(getByText(/inviting/i)).toBeInTheDocument();
    });
  });

  describe('and the invitation succeeds', () => {
    beforeEach(() => {
      nockInterceptor.reply(201);
    });

    beforeEach(async () => {
      const { getByRole } = result;

      userEvent.click(getByRole('button'));
      await waitFor(() => nock.isDone());
    });

    it('shows the form again', async () => {
      const { findByText } = result;
      await expect(findByText(/^invite user$/i)).resolves.toBeInTheDocument();
    });

    it('shows a success message', async () => {
      const { findByText } = result;
      await expect(findByText(/invited/i)).resolves.toBeInTheDocument();
    });
  });

  describe('and the invitation fails', () => {
    beforeEach(() => {
      nockInterceptor.reply(401);
    });

    beforeEach(async () => {
      const { getByRole } = result;

      userEvent.click(getByRole('button'));
      await waitFor(() => nock.isDone());
    });

    it('shows the form again', async () => {
      const { findByText } = result;
      await expect(findByText(/^invite user$/i)).resolves.toBeInTheDocument();
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
      const { getByRole } = result;

      userEvent.click(getByRole('button'));
      await waitFor(() => nock.isDone());
    });

    it('shows the form again', async () => {
      const { findByText } = result;
      await expect(findByText(/^invite user$/i)).resolves.toBeInTheDocument();
    });

    it('shows an error message', async () => {
      const { findByText } = result;
      expect((await findByText(/failed/i)).textContent).toMatchInlineSnapshot(
        `"Failed to invite user. FetchError: request to http://api/users failed, reason: socket timeout"`,
      );
    });
  });
});
