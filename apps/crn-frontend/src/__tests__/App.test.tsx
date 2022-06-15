import { authTestUtils } from '@asap-hub/react-components';
import { render, waitFor } from '@testing-library/react';
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
