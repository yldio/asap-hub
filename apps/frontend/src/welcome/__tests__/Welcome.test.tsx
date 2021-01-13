import React from 'react';
import { render, waitFor, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import nock from 'nock';
import { authTestUtils } from '@asap-hub/react-components';
import { mockLocation } from '@asap-hub/dom-test-utils';

import Welcome from '../Welcome';
import { API_BASE_URL } from '../../config';

// fetch user by code request
beforeEach(() => {
  nock(API_BASE_URL).get('/users/invites/42').reply(200, {});
});

// storage
afterEach(() => {
  window.sessionStorage.clear();
});

// redirect
const { mockAssign } = mockLocation();

const renderWelcome = async (): Promise<RenderResult> => {
  const result = render(
    <authTestUtils.Auth0Provider>
      <MemoryRouter initialEntries={['/42/']}>
        <Route exact path="/" render={() => 'root route'} />
        <Route exact path="/:code/" component={Welcome} />
      </MemoryRouter>
    </authTestUtils.Auth0Provider>,
  );
  await waitFor(() => nock.isDone());
  await waitFor(() => !!result.container.textContent);
  return result;
};

it('renders a headline', async () => {
  const { getByRole } = await renderWelcome();
  expect(getByRole('heading').textContent).toMatch(/asap hub/i);
});

it('renders one button', async () => {
  const { getByRole } = await renderWelcome();
  expect(getByRole('button').textContent).toMatchInlineSnapshot(
    `"Create account"`,
  );
});

describe('when clicking the button', () => {
  it('redirects to the signup page', async () => {
    const { getByRole } = await renderWelcome();
    userEvent.click(getByRole('button'));
    await waitFor(() => expect(mockAssign).toHaveBeenCalled());

    const { origin, pathname, searchParams } = new URL(
      mockAssign.mock.calls[0][0],
    );
    expect(origin).toMatchInlineSnapshot(`"https://auth.example.com"`);
    expect(pathname).toMatchInlineSnapshot(`"/authorize"`);
    expect(searchParams.get('prompt')).toBe('login');
    expect(searchParams.get('screen_hint')).toBe('signup');
  });
});

describe('the get user by code request', () => {
  it('redirects to / for a 4xx status code', async () => {
    nock.cleanAll();
    nock(API_BASE_URL).get('/users/invites/42').reply(403, {});

    const { findByText } = await renderWelcome();
    expect(await findByText('root route')).toBeVisible();
  });
});
