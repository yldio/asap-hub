import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Link } from '@asap-hub/react-components';
import { fireEvent } from '@testing-library/dom';
import { RecoilRoot } from 'recoil';
import { act } from 'react-dom/test-utils';

import Auth0Provider from '../AuthProvider';
import CheckAuth from '../CheckAuth';

const mockIsAuthenticated = jest.fn().mockResolvedValue(true);

jest.mock('@auth0/auth0-spa-js', () => ({
  Auth0Client: jest.fn(() => ({
    isAuthenticated: mockIsAuthenticated,
    checkSession: jest.fn(),
    getUser: jest.fn(),
    getIdTokenClaims: jest.fn(),
    loginWithRedirect: jest.fn(),
    getTokenWithPopup: jest.fn(),
    logout: jest.fn(),
  })),
}));

it('Checks auth0 is still logged in when changing pages', async () => {
  await act(async () => {
    const { getByRole, findByText } = render(
      <RecoilRoot>
        <Auth0Provider>
          <MemoryRouter>
            <CheckAuth>
              {({ isAuthenticated }) => (
                <>Authenticated: {isAuthenticated ? 'true' : 'false'}</>
              )}
            </CheckAuth>
            <Link href="/2">Another Page</Link>
          </MemoryRouter>
        </Auth0Provider>
      </RecoilRoot>,
    );
    expect(await findByText(/Authenticated: true/i)).toBeVisible();

    mockIsAuthenticated.mockResolvedValue(false);
    fireEvent.click(getByRole('link'));

    expect(await findByText(/Authenticated: false/i)).toBeVisible();
  });
});
