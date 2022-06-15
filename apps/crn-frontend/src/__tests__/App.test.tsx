import { render, waitFor } from '@testing-library/react';
import { authTestUtils } from '@asap-hub/react-components';
import { renderHook } from '@testing-library/react-hooks';
import { useFlags } from '@asap-hub/react-context';

import App from '../App';
import Signin from '../auth/Signin';
import AuthenticatedApp from '../AuthenticatedApp';

// Mock out normal auth
jest.mock('../auth/AuthProvider', () =>
  jest.fn(({ children }) => <>{children}</>),
);
// We don't want to test the implementation just the routing
jest.mock('../auth/Signin', () => jest.fn());
jest.mock('../AuthenticatedApp', () => jest.fn());
const MockSignin = Signin as jest.MockedFunction<typeof Signin>;
const MockAuthenticatedApp = AuthenticatedApp as jest.MockedFunction<
  typeof AuthenticatedApp
>;

const originalCookie = document.cookie;

beforeEach(() => {
  MockSignin.mockReset().mockReturnValue(<>Signin</>);
  MockAuthenticatedApp.mockReset().mockReturnValue(<>Authenticated</>);
});

it('changes routing for logged in users', async () => {
  const { container, rerender } = render(
    <authTestUtils.Auth0Provider>
      <App />
    </authTestUtils.Auth0Provider>,
  );

  await waitFor(() => expect(container).not.toHaveTextContent(/loading/i));
  expect(container).toHaveTextContent(/Signin/i);
  rerender(
    <authTestUtils.Auth0Provider>
      <authTestUtils.LoggedIn user={{}}>
        <App />
      </authTestUtils.LoggedIn>
    </authTestUtils.Auth0Provider>,
  );
  await waitFor(() => expect(container).not.toHaveTextContent(/loading/i));
  expect(container).toHaveTextContent(/Authenticated/i);
});

it('loads overrides for feature flags', async () => {
  const {
    result: { current },
  } = renderHook(useFlags);

  const { container } = render(
    <authTestUtils.Auth0Provider>
      <authTestUtils.LoggedIn user={{}}>
        <App />
      </authTestUtils.LoggedIn>
    </authTestUtils.Auth0Provider>,
  );
  await waitFor(() => expect(container).not.toHaveTextContent(/loading/i));
  current.setCurrentOverrides({ ASAP_PERSISTENT_EXAMPLE: false });

  document.cookie = 'ASAP_PERSISTENT_EXAMPLE=true';
  expect(current.isEnabled('PERSISTENT_EXAMPLE')).toBe(true);
  document.cookie = originalCookie;
});
