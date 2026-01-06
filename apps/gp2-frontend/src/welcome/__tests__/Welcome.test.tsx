import { mockLocation } from '@asap-hub/dom-test-utils';
import { authTestUtils } from '@asap-hub/gp2-components';
import { ToastContext } from '@asap-hub/react-context';
import { WelcomePage, mail } from '@asap-hub/react-components';
import { render, RenderResult, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import nock from 'nock';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { API_BASE_URL } from '../../config';
import Welcome, { values } from '../Welcome';

const { INVITE_SUPPORT_EMAIL } = mail;

describe('the welcome page', () => {
  // fetch user by code request
  beforeEach(() => {
    nock.cleanAll();
    nock(API_BASE_URL).get('/users/invites/42').reply(200, {});
  });
  afterEach(async () => {
    await waitFor(() => expect(nock.isDone()).toBe(true));
    // allow macro tasks to run, found no other way here
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
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
      <authTestUtils.UserAuth0Provider>
        <ToastContext.Provider value={mockToast}>
          <MemoryRouter initialEntries={['/42/']}>
            <Routes>
              <Route path="/:code/" element={<Welcome />} />
            </Routes>
          </MemoryRouter>
        </ToastContext.Provider>
      </authTestUtils.UserAuth0Provider>,
    );

  it('renders a headline', async () => {
    await renderWelcome();
    expect((await screen.findByRole('heading')).textContent).toMatch(
      /Join the GP2 Hub/i,
    );
  });

  it('renders one button', async () => {
    await renderWelcome();
    expect(
      (await screen.findByRole('button')).textContent,
    ).toMatchInlineSnapshot(`"Activate account"`);
  });

  it('renders the signup footer with terms and conditions', async () => {
    await renderWelcome();
    expect(
      await screen.findByText(/By proceeding you are agreeing to our/i),
    ).toBeInTheDocument();
    expect(screen.getByText('Terms and Conditions')).toBeInTheDocument();
    expect(screen.getByText('Privacy Notice')).toBeInTheDocument();
  });

  it('renders the welcome footer when allowSignup is false', async () => {
    const handleClick = jest.fn();
    render(
      <WelcomePage
        allowSignup={false}
        onClick={handleClick}
        values={values}
        supportEmail={INVITE_SUPPORT_EMAIL}
      />,
    );
    expect(
      await screen.findByText(/By signing in you are agreeing to our/i),
    ).toBeInTheDocument();
    // This test doesn't use Welcome component, so no nock request is made
    // Clean up nock to avoid afterEach failure
    nock.cleanAll();
  });

  describe('when clicking the button', () => {
    it('redirects to the signup page', async () => {
      await renderWelcome();
      await userEvent.click(await screen.findByRole('button'));
      await waitFor(() => expect(mockAssign).toHaveBeenCalled());

      const { origin, pathname, searchParams } = new URL(
        mockAssign.mock.calls[0]![0],
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
        await renderWelcome();
        await userEvent.click(await screen.findByRole('button'));
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
        await renderWelcome();
        await userEvent.click(await screen.findByRole('button'));
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
        await renderWelcome();
        await userEvent.click(await screen.findByRole('button'));
        await waitFor(() => {
          expect(mockToast).toHaveBeenCalledWith(
            expect.stringContaining('Network Error'),
          );
        });
      });
    });
  });
});
