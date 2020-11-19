import React from 'react';
import {
  render,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import nock from 'nock';
import { authTestUtils } from '@asap-hub/react-components';
import { createUserResponse, createUserTeams } from '@asap-hub/fixtures';
import { API_BASE_URL } from '@asap-hub/frontend/src/config';
import { UserResponse } from '@asap-hub/model';
import userEvent from '@testing-library/user-event';

import Profile from '../Profile';

jest.mock('../../../config');

const renderProfile = async (
  userResponse = createUserResponse(),
  { ownUserId = userResponse.id, routeProfileId = userResponse.id } = {},
) => {
  nock.cleanAll();
  nock(API_BASE_URL, {
    reqheaders: { authorization: 'Bearer token' },
  })
    .get(`/users/${userResponse.id}`)
    .reply(200, userResponse)
    .get(() => true)
    .reply(404);
  const result = render(
    <authTestUtils.Auth0Provider>
      <authTestUtils.WhenReady>
        <authTestUtils.LoggedIn user={{ id: ownUserId }}>
          <MemoryRouter initialEntries={[`/${routeProfileId}/`]}>
            <Route path="/:id" component={Profile} />
          </MemoryRouter>
        </authTestUtils.LoggedIn>
      </authTestUtils.WhenReady>
    </authTestUtils.Auth0Provider>,
  );
  await waitFor(() =>
    expect(result.queryByText(/auth0/i)).not.toBeInTheDocument(),
  );
  return result;
};

it('initially renders a loading indicator', async () => {
  const { getByText } = await renderProfile();

  const loadingIndicator = getByText(/loading/i);
  expect(loadingIndicator).toBeVisible();

  await waitForElementToBeRemoved(loadingIndicator);
});

it('renders the personal info', async () => {
  const { findByText } = await renderProfile({
    ...createUserResponse(),
    displayName: 'Someone',
  });
  expect((await findByText('Someone')).tagName).toBe('H1');
});

it('by default renders the research tab', async () => {
  const { findByText } = await renderProfile({
    ...createUserResponse(),
    questions: ['What?'],
  });
  expect(await findByText('What?')).toBeVisible();
});

it('navigates to the background tab', async () => {
  const { findByText } = await renderProfile({
    ...createUserResponse(),
    biography: 'My Bio',
  });

  userEvent.click(await findByText(/background/i, { selector: 'nav *' }));
  expect(await findByText('My Bio')).toBeVisible();
});

it('navigates to the outputs tab', async () => {
  const { findByText } = await renderProfile(createUserResponse());

  userEvent.click(await findByText(/output/i, { selector: 'nav *' }));
  expect(await findByText(/research.+outputs/i)).toBeVisible();
});

it("links to the user's team", async () => {
  const { findByText } = await renderProfile({
    ...createUserResponse(),
    teams: [
      {
        ...createUserTeams({ teams: 1 })[0],
        id: '42',
        displayName: 'Kool Krew',
      },
    ],
  });
  expect(
    (
      await findByText('Kool Krew', { exact: false, selector: 'h2 ~ * *' })
    ).closest('a')!.href,
  ).toContain('42');
});

it("links to the user's team proposal", async () => {
  const { findByText } = await renderProfile({
    ...createUserResponse(),
    teams: [
      {
        ...createUserTeams({ teams: 1 })[0],
        proposal: '1337',
      },
    ],
  });
  expect((await findByText(/proposal/i)).closest('a')!.href).toContain('1337');
});
it('does not show a proposal for a user whose team has none', async () => {
  const { getByText, queryByText } = await renderProfile({
    ...createUserResponse(),
    teams: [
      {
        ...createUserTeams({ teams: 1 })[0],
        proposal: undefined,
      },
    ],
  });
  const loadingIndicator = getByText(/loading/i);
  await waitForElementToBeRemoved(loadingIndicator);
  expect(queryByText(/proposal/i)).not.toBeInTheDocument();
});

it('renders the 404 page for a missing user', async () => {
  const { findByText } = await renderProfile(
    {
      ...createUserResponse(),
      id: '42',
    },
    { routeProfileId: '1337' },
  );
  expect(await findByText(/sorry.+page/i)).toBeVisible();
});

describe('a header edit button', () => {
  it("is not rendered on someone else's profile", async () => {
    const { getByText, queryByLabelText } = await renderProfile(
      { ...createUserResponse(), id: '42' },
      { ownUserId: '1337' },
    );
    const loadingIndicator = getByText(/loading/i);
    await waitForElementToBeRemoved(loadingIndicator);

    expect(queryByLabelText(/edit/i)).not.toBeInTheDocument();
  });
  it('is not rendered on your own staff profile', async () => {
    const { getByText, queryByLabelText } = await renderProfile({
      ...createUserResponse(),
      role: 'Staff',
    });
    const loadingIndicator = getByText(/loading/i);
    await waitForElementToBeRemoved(loadingIndicator);

    expect(queryByLabelText(/edit/i)).not.toBeInTheDocument();
  });

  it('is rendered for personal info on your own profile', async () => {
    const { findByLabelText } = await renderProfile();
    expect(await findByLabelText(/edit.+personal/i)).toBeVisible();
  });

  it('is rendered for contact info on your own profile', async () => {
    const { findByLabelText } = await renderProfile();
    expect(await findByLabelText(/edit.+contact/i)).toBeVisible();
  });

  it('can change personal info', async () => {
    const userProfile: UserResponse = {
      ...createUserResponse(),
      location: 'York',
      id: '42',
    };

    const {
      getByText,
      findByText,
      findByLabelText,
      getByDisplayValue,
    } = await renderProfile(userProfile);

    userEvent.click(await findByLabelText(/edit.+personal/i));
    await userEvent.type(getByDisplayValue('York'), 'shire');
    expect(getByDisplayValue('Yorkshire')).toBeVisible();

    const patched = new Promise((resolve) =>
      nock(API_BASE_URL)
        .patch('/users/42')
        .reply(200, (_uri, body, cb) => {
          resolve(body);
          cb(null, { ...userProfile, ...(body as object) });
        }),
    );

    userEvent.click(getByText(/save/i));
    expect(await findByText('Yorkshire')).toBeVisible();
    expect(await patched).toHaveProperty('location', 'Yorkshire');
  });

  it('can change contact info', async () => {
    const userProfile: UserResponse = {
      ...createUserResponse(),
      contactEmail: 'contact@example.com',
      id: '42',
    };
    const {
      getByText,
      findByText,
      findByLabelText,
      getByDisplayValue,
    } = await renderProfile(userProfile);

    userEvent.click(await findByLabelText(/edit.+contact/i));
    await userEvent.type(getByDisplayValue('contact@example.com'), 'm');
    expect(getByDisplayValue('contact@example.comm')).toBeVisible();

    const patched = new Promise((resolve) =>
      nock(API_BASE_URL)
        .patch('/users/42')
        .reply(200, (_uri, body, cb) => {
          resolve(body);
          cb(null, { ...userProfile, ...(body as object) });
        }),
    );

    userEvent.click(getByText(/save/i));
    expect(
      (await findByText(/contact/i, { selector: 'header *' })).closest('a'),
    ).toHaveAttribute('href', 'mailto:contact@example.comm');
    expect(await patched).toHaveProperty(
      'contactEmail',
      'contact@example.comm',
    );
  });
});
