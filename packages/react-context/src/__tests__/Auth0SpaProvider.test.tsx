import { render, screen } from '@testing-library/react';

import { Auth0ContextCRN } from '../auth0';
import { createAuthProvider } from '../createAuthProvider';

jest.mock('react-router', () => ({
  useNavigate: () => jest.fn(),
}));

jest.mock('@auth0/auth0-spa-js', () => ({
  Auth0Client: jest.fn(() => ({
    isAuthenticated: jest.fn().mockResolvedValue(false),
    checkSession: jest.fn(),
    getUser: jest.fn(),
    getIdTokenClaims: jest.fn(),
    getTokenSilently: jest.fn(),
    loginWithRedirect: jest.fn(),
    getTokenWithPopup: jest.fn(),
    logout: jest.fn(),
  })),
}));

const AuthProvider = createAuthProvider({
  context: Auth0ContextCRN,
  domain: 'auth.example.com',
  clientId: 'client_id',
  audience: 'audience',
});

it('renders children once auth0 is initialized', async () => {
  render(
    <AuthProvider>
      <div>child content</div>
    </AuthProvider>,
  );

  expect(await screen.findByText('child content')).toBeVisible();
});
