import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Login from '../Login';
import {
  authorizeWithSso,
  authorizeWithEmailPassword,
} from '../../auth0/web-auth';
import { WebAuthError } from '../../auth0/errors';

jest.mock('../../auth0/web-auth');
const mockAuthorizeWithSso = authorizeWithSso as jest.MockedFunction<
  typeof authorizeWithSso
>;
const mockAuthorizeWithEmailPassword = authorizeWithEmailPassword as jest.MockedFunction<
  typeof authorizeWithEmailPassword
>;
beforeEach(() => {
  mockAuthorizeWithSso.mockClear();
  mockAuthorizeWithEmailPassword.mockClear();
});

const originalLocation = globalThis.location;
const mockLocation = jest.fn();
beforeEach(() => {
  mockLocation
    .mockReset()
    .mockReturnValue(
      new URL(
        'http://localhost/login?response_type=code&redirect_uri=https%3A%2F%2Fdev.hub.asap.science',
      ),
    );
  delete globalThis.location;
  Object.defineProperty(globalThis, 'location', {
    configurable: true,
    enumerable: true,
    get: mockLocation,
  });
});
afterEach(() => {
  Object.defineProperty(globalThis, 'location', {
    configurable: true,
    enumerable: true,
    value: originalLocation,
  });
});

it('renders a signin form', () => {
  const { getByText } = render(<Login email="" setEmail={() => {}} />);
  expect(getByText(/sign in/i, { selector: 'h1' })).toBeVisible();
});

it('renders the form in signup mode', () => {
  mockLocation.mockReturnValue(
    new URL(
      '?response_type=code&screen_hint=signup&redirect_uri=https%3A%2F%2Fdev.hub.asap.science',
      mockLocation(),
    ),
  );
  const { getByText } = render(<Login email="" setEmail={() => {}} />);
  expect(getByText(/create.+account/i, { selector: 'h1' })).toBeVisible();
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
  await userEvent.type(getByLabelText(/password/i), 'PW', {
    allAtOnce: true,
  });

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
  mockLocation.mockReturnValue(
    new URL(
      '?response_type=code&screen_hint=signup&redirect_uri=https%3A%2F%2Fdev.hub.asap.science',
      mockLocation(),
    ),
  );
  const { getByText, getByLabelText } = render(
    <Login email="john.doe@example.com" setEmail={() => {}} />,
  );
  await userEvent.type(getByLabelText(/password/i), 'PW', {
    allAtOnce: true,
  });

  userEvent.click(getByText(/sign.*in/i, { selector: 'button *' }));
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

it('shows an Auth0 error', async () => {
  mockLocation.mockReturnValue(
    new URL(
      '?response_type=code&screen_hint=signup&redirect_uri=https%3A%2F%2Fdev.hub.asap.science',
      mockLocation(),
    ),
  );
  const { getByText, getByLabelText, findAllByText } = render(
    <Login email="john.doe@example.com" setEmail={() => {}} />,
  );
  await userEvent.type(getByLabelText(/password/i), 'PW', {
    allAtOnce: true,
  });

  const error = new Error('Authentication Error');
  ((error as unknown) as WebAuthError).errorDescription =
    'An unknown authentication error occurred.';
  mockAuthorizeWithEmailPassword.mockRejectedValueOnce(error);

  userEvent.click(getByText(/sign.*in/i, { selector: 'button *' }));
  expect(
    await findAllByText('An unknown authentication error occurred.'),
  ).not.toHaveLength(0);
});

it('shows a generic authentication error', async () => {
  mockLocation.mockReturnValue(
    new URL(
      '?response_type=code&screen_hint=signup&redirect_uri=https%3A%2F%2Fdev.hub.asap.science',
      mockLocation(),
    ),
  );
  const { getByText, getByLabelText, findAllByText } = render(
    <Login email="john.doe@example.com" setEmail={() => {}} />,
  );
  await userEvent.type(getByLabelText(/password/i), 'PW', {
    allAtOnce: true,
  });

  const error = new Error('FetchError');
  mockAuthorizeWithEmailPassword.mockRejectedValueOnce(error);

  userEvent.click(getByText(/sign.*in/i, { selector: 'button *' }));
  expect(await findAllByText(/unknown.+FetchError/i)).not.toHaveLength(0);
});

it('hides the authentication error message again when changing the credentials', async () => {
  mockLocation.mockReturnValue(
    new URL(
      '?response_type=code&screen_hint=signup&redirect_uri=https%3A%2F%2Fdev.hub.asap.science',
      mockLocation(),
    ),
  );
  const { getByText, getByLabelText, queryByText, findAllByText } = render(
    <Login email="john.doe@example.com" setEmail={() => {}} />,
  );
  await userEvent.type(getByLabelText(/password/i), 'PW', {
    allAtOnce: true,
  });

  const error = new Error('FetchError');
  mockAuthorizeWithEmailPassword.mockRejectedValueOnce(error);

  userEvent.click(getByText(/sign.*in/i, { selector: 'button *' }));
  expect(await findAllByText(/unknown.+FetchError/i)).not.toHaveLength(0);

  userEvent.clear(getByLabelText(/e-?mail/i));
  userEvent.tab();
  userEvent.click(getByText(/sign.*in/i, { selector: 'button *' }));
  await waitFor(() => expect(queryByText(/error/i)).not.toBeInTheDocument());
});
