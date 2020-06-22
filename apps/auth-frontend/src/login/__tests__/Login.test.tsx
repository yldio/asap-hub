import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StaticRouter } from 'react-router-dom';
import { createLocation } from 'history';

import Login from '../Login';
import {
  authorizeWithSso,
  authorizeWithEmailPassword,
} from '../../auth0/web-auth';

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

it('renders a signin form', () => {
  const { getByText } = render(
    <StaticRouter location={createLocation('/login?response_type=code')}>
      <Login />
    </StaticRouter>,
  );
  expect(getByText(/sign in/i, { selector: 'h1' })).toBeVisible();
});

it('renders the form in signup mode', () => {
  const { getByText } = render(
    <StaticRouter
      location={createLocation('/login?response_type=code&screen_hint=signup')}
    >
      <Login />
    </StaticRouter>,
  );
  expect(getByText(/create.+account/i, { selector: 'h1' })).toBeVisible();
});

it.each(['Google', 'ORCID'])('initiates a SSO with %s', (provider) => {
  const location = createLocation('/login?response_type=code');
  const { getByText } = render(
    <StaticRouter location={location}>
      <Login />
    </StaticRouter>,
  );

  userEvent.click(
    getByText(new RegExp(provider, 'i'), { selector: 'button > *' }),
  );
  expect(authorizeWithSso).toHaveBeenCalledTimes(1);

  const [{ search }, connection] = mockAuthorizeWithSso.mock.calls[0];
  expect(search).toBe(location.search);
  expect(connection).toMatch(new RegExp(provider, 'i'));
});

it('initiates a signin with email and password', async () => {
  const location = createLocation('/login?response_type=code');
  const { getByText, getByLabelText } = render(
    <StaticRouter location={location}>
      <Login />
    </StaticRouter>,
  );
  await userEvent.type(getByLabelText(/e-?mail/i), 'john.doe@example.com', {
    allAtOnce: true,
  });
  await userEvent.type(getByLabelText(/password/i), 'PW', {
    allAtOnce: true,
  });

  userEvent.click(getByText(/sign.*in/i, { selector: 'button *' }));
  expect(mockAuthorizeWithEmailPassword).toHaveBeenCalledWith(
    expect.objectContaining({ search: location.search }),
    'john.doe@example.com',
    'PW',
    false,
  );
});

it('initiates a signup with email and password', async () => {
  const location = createLocation(
    '/login?response_type=code&screen_hint=signup',
  );
  const { getByText, getByLabelText } = render(
    <StaticRouter location={location}>
      <Login />
    </StaticRouter>,
  );
  await userEvent.type(getByLabelText(/e-?mail/i), 'john.doe@example.com', {
    allAtOnce: true,
  });
  await userEvent.type(getByLabelText(/password/i), 'PW', {
    allAtOnce: true,
  });

  userEvent.click(getByText(/sign.*in/i, { selector: 'button *' }));
  expect(mockAuthorizeWithEmailPassword).toHaveBeenCalledWith(
    expect.objectContaining({ search: location.search }),
    'john.doe@example.com',
    'PW',
    true,
  );
});

it.each(['error_description', 'errorDescription', 'description'])(
  'shows an Auth0 error with its %s',
  async (errorProperty) => {
    const location = createLocation(
      '/login?response_type=code&screen_hint=signup',
    );
    const { getByText, getByLabelText, findAllByText } = render(
      <StaticRouter location={location}>
        <Login />
      </StaticRouter>,
    );
    await userEvent.type(getByLabelText(/e-?mail/i), 'john.doe@example.com', {
      allAtOnce: true,
    });
    await userEvent.type(getByLabelText(/password/i), 'PW', {
      allAtOnce: true,
    });

    const error = new Error('Authentication Error');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error as any)[errorProperty] = 'An unknown authentication error occurred.';
    mockAuthorizeWithEmailPassword.mockRejectedValueOnce(error);

    userEvent.click(getByText(/sign.*in/i, { selector: 'button *' }));
    expect(
      await findAllByText('An unknown authentication error occurred.'),
    ).not.toHaveLength(0);
  },
);

it('shows a generic authentication error', async () => {
  const location = createLocation(
    '/login?response_type=code&screen_hint=signup',
  );
  const { getByText, getByLabelText, findAllByText } = render(
    <StaticRouter location={location}>
      <Login />
    </StaticRouter>,
  );
  await userEvent.type(getByLabelText(/e-?mail/i), 'john.doe@example.com', {
    allAtOnce: true,
  });
  await userEvent.type(getByLabelText(/password/i), 'PW', {
    allAtOnce: true,
  });

  const error = new Error('FetchError');
  mockAuthorizeWithEmailPassword.mockRejectedValueOnce(error);

  userEvent.click(getByText(/sign.*in/i, { selector: 'button *' }));
  expect(await findAllByText(/unknown.+FetchError/i)).not.toHaveLength(0);
});
