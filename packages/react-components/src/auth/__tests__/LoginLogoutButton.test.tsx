/** @jest-environment jsdom */
import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react';

import { LoggedIn, Auth0Provider } from '../test-utils';

import LoginLogoutButton from '../LoginLogoutButton';

const originalLocation = globalThis.location;
let assign: jest.MockedFunction<typeof globalThis.location.assign>;
beforeEach(() => {
  assign = jest.fn();
  delete globalThis.location;
  globalThis.location = { ...originalLocation, assign };
});
afterEach(() => {
  globalThis.location = originalLocation;
});

describe('when not logged in', () => {
  it('shows a login button', () => {
    const { getByRole } = render(<LoginLogoutButton />);
    const button = getByRole('button');
    expect(button).toHaveTextContent(/log in/i);
  });

  describe('and clicking login', () => {
    it('redirects to the auth form', async () => {
      let button!: HTMLElement;
      await act(async () => {
        const { findByRole } = render(
          <Auth0Provider>
            <LoginLogoutButton />
          </Auth0Provider>,
        );
        button = await findByRole('button');
      });

      fireEvent.click(button);
      await waitFor(() => expect(assign).toHaveBeenCalled());

      const { origin, pathname, searchParams } = new URL(
        assign.mock.calls[0][0],
      );
      expect(origin).toMatchInlineSnapshot(`"https://auth.example.com"`);
      expect(pathname).toMatchInlineSnapshot(`"/authorize"`);
      expect(searchParams.get('client_id')).toMatchInlineSnapshot(
        `"client_id"`,
      );
      expect(searchParams.get('redirect_uri')).toMatchInlineSnapshot(
        `"http://localhost"`,
      );
      const scopes = searchParams.get('scope')!.split(' ');
      expect(scopes).toContain('openid');
      expect(scopes).toContain('profile');
      expect(scopes).toContain('email');
    });
  });
});

describe('when logged in', () => {
  it('shows a logout button', async () => {
    let button!: HTMLElement;
    await act(async () => {
      const { findByRole } = render(
        <Auth0Provider>
          <LoggedIn user={undefined}>
            <LoginLogoutButton />
          </LoggedIn>
        </Auth0Provider>,
      );
      button = await findByRole('button');
    });
    expect(button).toHaveTextContent(/log out$/i);
  });

  it("shows the logged in user's name on the button", async () => {
    let button!: HTMLElement;
    await act(async () => {
      const { findByRole } = render(
        <Auth0Provider>
          <LoggedIn user={{ name: 'John Doe' }}>
            <LoginLogoutButton />
          </LoggedIn>
        </Auth0Provider>,
      );
      button = await findByRole('button');
    });
    expect(button).toHaveTextContent(/John Doe/);
  });

  describe('and clicking log out', () => {
    it('redirects to the logout URL', async () => {
      let button!: HTMLElement;
      await act(async () => {
        const { findByRole } = render(
          <Auth0Provider>
            <LoggedIn user={undefined}>
              <LoginLogoutButton />
            </LoggedIn>
          </Auth0Provider>,
        );
        button = await findByRole('button');
      });

      fireEvent.click(button);
      await waitFor(() => expect(assign).toHaveBeenCalled());
      const { origin, pathname, searchParams } = new URL(
        assign.mock.calls[0][0],
      );
      expect(origin).toMatchInlineSnapshot(`"https://auth.example.com"`);
      expect(pathname).toMatchInlineSnapshot(`"/v2/logout"`);
      expect(searchParams.get('client_id')).toMatchInlineSnapshot(
        `"client_id"`,
      );
      expect(searchParams.get('returnTo')).toMatchInlineSnapshot(
        `"http://localhost"`,
      );
    });
  });
});
