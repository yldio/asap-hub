import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockLocation } from '@asap-hub/dom-test-utils';
import { WebAuthError } from '@asap-hub/auth-frontend-utils';

import Login from '../Login';
import {
  authorizeWithSso,
  authorizeWithEmailPassword,
} from '../../auth0/web-auth';

const { mockGetLocation } = mockLocation(
  `http://localhost/login?response_type=code&redirect_uri=${encodeURIComponent(
    'https://dev.hub.asap.science/',
  )}`,
);

jest.mock('../../auth0/web-auth');
const mockAuthorizeWithSso = authorizeWithSso as jest.MockedFunction<
  typeof authorizeWithSso
>;
const mockAuthorizeWithEmailPassword =
  authorizeWithEmailPassword as jest.MockedFunction<
    typeof authorizeWithEmailPassword
  >;
beforeEach(() => {
  mockAuthorizeWithSso.mockClear();
  mockAuthorizeWithEmailPassword.mockClear();
});

it('renders a signin form', () => {
  const { getByText } = render(<Login email="" setEmail={() => {}} />);
  expect(getByText(/sign in/i, { selector: 'h1' })).toBeVisible();
});

it('renders the form in signup mode', () => {
  mockGetLocation.mockReturnValue(
    new URL(
      '?response_type=code&screen_hint=signup&redirect_uri=https%3A%2F%2Fdev.hub.asap.science',
      mockGetLocation(),
    ),
  );
  const { getByText } = render(<Login email="" setEmail={() => {}} />);
  expect(getByText(/choose.+login.+method/i, { selector: 'h1' })).toBeVisible();
  expect(getByText(/continue$/i, { selector: 'button *' })).toBeVisible();
});

it.each(['Google', 'ORCID'])('initiates a SSO with %s', (provider) => {
  const { getByText } = render(<Login email="" setEmail={() => {}} />);

  userEvent.click(
    getByText(new RegExp(provider, 'i'), { selector: 'button > *' }),
  );
  expect(authorizeWithSso).toHaveBeenCalledTimes(1);

  const [{ search }, connection] = mockAuthorizeWithSso.mock.calls[0];
  expect(new URLSearchParams(search).get('response_type')).toBe('code');
  expect(connection).toMatch(new RegExp(provider, 'i'));
});

it('initiates a signin with email and password', async () => {
  const { getByText, getByLabelText } = render(
    <Login email="john.doe@example.com" setEmail={() => {}} />,
  );
  userEvent.type(getByLabelText(/password/i), 'PW');

  userEvent.click(getByText(/sign.*in/i, { selector: 'button *' }));
  expect(mockAuthorizeWithEmailPassword).toHaveBeenCalledWith(
    expect.objectContaining({
      search: expect.stringContaining('response_type=code'),
    }),
    'john.doe@example.com',
    'PW',
    false,
  );
});

it('initiates a signup with email and password', async () => {
  mockGetLocation.mockReturnValue(
    new URL(
      '?response_type=code&screen_hint=signup&redirect_uri=https%3A%2F%2Fdev.hub.asap.science',
      mockGetLocation(),
    ),
  );
  const { getByText, getByLabelText } = render(
    <Login email="john.doe@example.com" setEmail={() => {}} />,
  );
  userEvent.type(getByLabelText(/password/i), 'PW');

  userEvent.click(getByText(/continue$/i, { selector: 'button *' }));
  expect(mockAuthorizeWithEmailPassword).toHaveBeenCalledWith(
    expect.objectContaining({
      search: expect.stringContaining(
        'response_type=code&screen_hint=signup&redirect_uri=https%3A%2F%2Fdev.hub.asap.science',
      ),
    }),
    'john.doe@example.com',
    'PW',
    true,
  );
});

it('shows an Auth0 email error', async () => {
  mockGetLocation.mockReturnValue(
    new URL(
      '?response_type=code&screen_hint=signup&redirect_uri=https%3A%2F%2Fdev.hub.asap.science',
      mockGetLocation(),
    ),
  );
  const { getByText, getByLabelText, findAllByText } = render(
    <Login email="john.doe@example.com" setEmail={() => {}} />,
  );
  userEvent.type(getByLabelText(/password/i), 'PW');

  const error = new Error('Authentication Error');
  (error as unknown as WebAuthError).code = 'invalid_signup';
  (error as unknown as WebAuthError).errorDescription = 'Invalid signup.';
  mockAuthorizeWithEmailPassword.mockRejectedValueOnce(error);

  userEvent.click(getByText(/continue$/i, { selector: 'button *' }));
  expect(await findAllByText(/failed/i)).toHaveLength(1);
  expect(getByLabelText(/e-?mail/i)).toBeInvalid();
});
it('shows an Auth0 password error', async () => {
  mockGetLocation.mockReturnValue(
    new URL(
      '?response_type=code&screen_hint=signup&redirect_uri=https%3A%2F%2Fdev.hub.asap.science',
      mockGetLocation(),
    ),
  );
  const { getByText, getByLabelText, findAllByText } = render(
    <Login email="john.doe@example.com" setEmail={() => {}} />,
  );
  userEvent.type(getByLabelText(/password/i), 'PW');

  const error = new Error('Authentication Error');
  (error as unknown as WebAuthError).code = 'invalid_password';
  (error as unknown as WebAuthError).errorDescription =
    'Your password is too weak';
  mockAuthorizeWithEmailPassword.mockRejectedValueOnce(error);

  userEvent.click(getByText(/continue$/i, { selector: 'button *' }));
  expect(await findAllByText(/weak/i)).toHaveLength(1);
  expect(getByLabelText(/password/i)).toBeInvalid();
});

it('shows a generic authentication error on both fields', async () => {
  mockGetLocation.mockReturnValue(
    new URL(
      '?response_type=code&screen_hint=signup&redirect_uri=https%3A%2F%2Fdev.hub.asap.science',
      mockGetLocation(),
    ),
  );
  const { getByText, getByLabelText, findAllByText } = render(
    <Login email="john.doe@example.com" setEmail={() => {}} />,
  );
  userEvent.type(getByLabelText(/password/i), 'PW');

  const error = new Error('FetchError');
  mockAuthorizeWithEmailPassword.mockRejectedValueOnce(error);

  userEvent.click(getByText(/continue$/i, { selector: 'button *' }));
  expect(await findAllByText(/unknown.+FetchError/i)).toHaveLength(2);
  expect(getByLabelText(/e-?mail/i)).toBeInvalid();
  expect(getByLabelText(/password/i)).toBeInvalid();
});

it('hides the authentication error message again when changing the credentials', async () => {
  mockGetLocation.mockReturnValue(
    new URL(
      '?response_type=code&screen_hint=signup&redirect_uri=https%3A%2F%2Fdev.hub.asap.science',
      mockGetLocation(),
    ),
  );
  const { getByText, getByLabelText, queryByText, findAllByText } = render(
    <Login email="john.doe@example.com" setEmail={() => {}} />,
  );
  userEvent.type(getByLabelText(/password/i), 'PW');

  const error = new Error('FetchError');
  mockAuthorizeWithEmailPassword.mockRejectedValueOnce(error);

  userEvent.click(getByText(/continue$/i, { selector: 'button *' }));
  expect(await findAllByText(/unknown.+FetchError/i)).not.toHaveLength(0);

  userEvent.clear(getByLabelText(/e-?mail/i));
  userEvent.tab();
  userEvent.click(getByText(/continue$/i, { selector: 'button *' }));
  await waitFor(() => expect(queryByText(/error/i)).not.toBeInTheDocument());
});
