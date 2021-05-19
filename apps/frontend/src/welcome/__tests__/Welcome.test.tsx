import { render, waitFor, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import nock from 'nock';
import { authTestUtils } from '@asap-hub/react-components';
import { mockLocation } from '@asap-hub/dom-test-utils';
import { ToastContext } from '@asap-hub/react-context';

import Welcome from '../Welcome';
import { API_BASE_URL } from '../../config';

describe('the welcome page', () => {
  // fetch user by code request
  beforeEach(() => {
    nock.cleanAll();
    nock(API_BASE_URL).get('/users/invites/42').reply(200, {});
  });
  afterEach(async () => {
    await waitFor(() => expect(nock.isDone()).toBe(true));
    // allow macro tasks to run, found no other way here
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  // redirect
  const { mockAssign } = mockLocation();

  // toast
  let mockToast: jest.Mock;
  beforeEach(() => {
    mockToast = jest.fn();
  });

  const renderWelcome = async (): Promise<RenderResult> =>
    render(
      <authTestUtils.Auth0Provider>
        <ToastContext.Provider value={mockToast}>
          <MemoryRouter initialEntries={['/42/']}>
            <Route exact path="/:code/" component={Welcome} />
          </MemoryRouter>
        </ToastContext.Provider>
      </authTestUtils.Auth0Provider>,
    );

  it('renders a headline', async () => {
    const { findByRole } = await renderWelcome();
    expect((await findByRole('heading')).textContent).toMatch(/asap hub/i);
  });

  it('renders one button', async () => {
    const { findByRole } = await renderWelcome();
    expect((await findByRole('button')).textContent).toMatchInlineSnapshot(
      `"Activate account"`,
    );
  });

  describe('when clicking the button', () => {
    it('redirects to the signup page', async () => {
      const { findByRole } = await renderWelcome();
      userEvent.click(await findByRole('button'));
      await waitFor(() => expect(mockAssign).toHaveBeenCalled());

      const { origin, pathname, searchParams } = new URL(
        mockAssign.mock.calls[0][0],
      );
      expect(origin).toMatchInlineSnapshot(`"https://auth.example.com"`);
      expect(pathname).toMatchInlineSnapshot(`"/authorize"`);
      expect(searchParams.get('prompt')).toBe('login');
      expect(searchParams.get('screen_hint')).toBe('signup');
    });

    describe('but the invitation code is invalid', () => {
      beforeEach(() => {
        nock.cleanAll();
        nock(API_BASE_URL).get('/users/invites/42').reply(404, {});
      });

      it('shows an error message toast', async () => {
        const { findByRole } = await renderWelcome();
        userEvent.click(await findByRole('button'));
        await waitFor(() => {
          expect(mockToast).toHaveBeenCalledWith(
            expect.stringMatching(/invalid/i),
          );
        });
      });
    });

    describe('but an unknown status is returned', () => {
      beforeEach(() => {
        nock.cleanAll();
        nock(API_BASE_URL).get('/users/invites/42').reply(500, {});
      });

      it('shows an error message toast', async () => {
        const { findByRole } = await renderWelcome();
        userEvent.click(await findByRole('button'));
        await waitFor(() => {
          expect(mockToast).toHaveBeenCalledWith(
            expect.stringMatching(/error/i),
          );
        });
      });
    });

    describe('but an unknown error occurs', () => {
      beforeEach(() => {
        nock.cleanAll();
        nock(API_BASE_URL)
          .get('/users/invites/42')
          .replyWithError(new Error('Network Error'));
      });

      it('shows an error message toast', async () => {
        const { findByRole } = await renderWelcome();
        userEvent.click(await findByRole('button'));
        await waitFor(() => {
          expect(mockToast).toHaveBeenCalledWith(
            expect.stringContaining('Network Error'),
          );
        });
      });
    });
  });
});
