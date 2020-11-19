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
import { join } from 'path';
import { API_BASE_URL } from '@asap-hub/frontend/src/config';
import { UserDegree } from '@asap-hub/model';
import userEvent from '@testing-library/user-event';

import Profile from '../Routes';

jest.mock('../../../config');

const renderProfile = async (
  userResponse = createUserResponse(),
  {
    ownUserId = userResponse.id,
    routeProfileId = userResponse.id,
    tab = '.',
    modal = '.',
  }: {
    ownUserId?: string;
    routeProfileId?: string;
    tab?: string;
    modal?: string;
  } = {},
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
          <MemoryRouter
            initialEntries={[`/${join(routeProfileId, tab, modal)}/`]}
          >
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

// TODO improve test quality
describe('with team', () => {
  it('calculates links', async () => {
    const { findAllByRole } = await renderProfile({
      ...createUserResponse({ teams: 1 }),
    });
    const links = (await findAllByRole('link')) as HTMLAnchorElement[];
    expect(links.map(({ href }) => href)).toMatchInlineSnapshot(`
      Array [
        "http://localhost/network/teams/t0",
        "http://localhost/u0/research/edit-personal-info",
        "mailto:agnete.kirkeby@sund.ku.dk",
        "http://localhost/u0/research/edit-contact-info",
        "http://localhost/u0/research",
        "http://localhost/u0/about",
        "http://localhost/u0/outputs",
        "http://localhost/network/teams/t0",
        "http://localhost/network/teams/t0",
        "http://localhost/u0/research/edit-background",
        "http://localhost/u0/research/edit-skills",
        "http://localhost/u0/research/edit-questions",
        "mailto:agnete.kirkeby@sund.ku.dk",
      ]
    `);
  });

  it('calculates links with proposal', async () => {
    const { findAllByRole } = await renderProfile({
      ...createUserResponse(),
      teams: [{ ...createUserTeams({ teams: 1 })[0], proposal: 'uuid' }],
    });
    const links = (await findAllByRole('link')) as HTMLAnchorElement[];
    expect(links.map(({ href }) => href)).toMatchInlineSnapshot(`
      Array [
        "http://localhost/network/teams/t0",
        "http://localhost/u0/research/edit-personal-info",
        "mailto:agnete.kirkeby@sund.ku.dk",
        "http://localhost/u0/research/edit-contact-info",
        "http://localhost/u0/research",
        "http://localhost/u0/about",
        "http://localhost/u0/outputs",
        "http://localhost/network/teams/t0",
        "http://localhost/shared-research/uuid",
        "http://localhost/network/teams/t0",
        "http://localhost/u0/research/edit-background",
        "http://localhost/u0/research/edit-skills",
        "http://localhost/u0/research/edit-questions",
        "mailto:agnete.kirkeby@sund.ku.dk",
      ]
    `);
  });
});

describe('for a staff member', () => {
  it('calculates links', async () => {
    const { findAllByText, findByText } = await renderProfile({
      ...createUserResponse(),
      role: 'Staff',
      reachOut: 'approach',
      responsibilities: 'responsible',
    });

    expect(
      await findByText(/get in touch/i, {
        selector: 'a',
      }),
    ).toHaveAttribute(
      'href',
      'mailto:techsupport@asap.science?subject=ASAP+Hub%3A+Tech+support',
    );

    const links = await findAllByText(/team\sasap/i, {
      selector: 'a',
    });
    expect(links.map((a) => a.getAttribute('href'))).toEqual([
      '/discover',
      '/discover',
    ]);
  });
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
});

describe('an edit personal info modal', () => {
  it.each(['research', 'about', 'outputs'])(
    'can be opened and closed from %s',
    async (page) => {
      const {
        getByTitle,
        getByLabelText,
        getByText,
        queryByText,
      } = await renderProfile(
        {
          ...createUserResponse(),
          role: page === 'staff' ? 'Staff' : 'Grantee',
          id: '42',
        },
        {
          tab: page === 'staff' ? undefined : page,
          ownUserId: '42',
        },
      );
      const loadingIndicator = getByText(/loading/i);
      await waitForElementToBeRemoved(loadingIndicator);
      userEvent.click(getByLabelText(/edit.+personal/i));
      expect(getByText('Your details', { selector: 'h3' })).toBeVisible();
      userEvent.click(getByTitle('Close'));
      expect(queryByText('Your details', { selector: 'h3' })).toBeNull();
    },
  );

  it.each`
    page          | ownProfile | visible
    ${'research'} | ${true}    | ${true}
    ${'research'} | ${false}   | ${false}
    ${'about'}    | ${true}    | ${true}
    ${'about'}    | ${false}   | ${false}
    ${'outputs'}  | ${true}    | ${true}
    ${'outputs'}  | ${false}   | ${false}
  `('opens and closes', async ({ page, ownProfile, visible }) => {
    const { findByText, getByText, queryByText } = await renderProfile(
      {
        ...createUserResponse(),
        id: '42',
      },
      {
        modal: 'edit-personal-info',
        tab: page,
        ownUserId: ownProfile ? '42' : '1337',
      },
    );

    const loadingIndicator = getByText(/loading/i);
    await waitForElementToBeRemoved(loadingIndicator);
    if (visible) {
      expect(
        await findByText('Your details', { selector: 'h3' }),
      ).toBeVisible();
    } else {
      expect(queryByText('Your details', { selector: 'h3' })).toBe(null);
    }
  });

  it.each`
    page          | ownProfile | visible
    ${'research'} | ${true}    | ${true}
    ${'research'} | ${false}   | ${false}
    ${'about'}    | ${true}    | ${true}
    ${'about'}    | ${false}   | ${false}
    ${'outputs'}  | ${true}    | ${true}
    ${'outputs'}  | ${false}   | ${false}
  `(
    'is visible ($visible); viewing $page; using ownProfile ($ownProfile)',
    async ({ page, ownProfile, visible }) => {
      const { findByText, getByText, queryByText } = await renderProfile(
        {
          ...createUserResponse(),
          role: page,
          id: '42',
        },
        {
          modal: 'edit-personal-info',
          tab: page,
          ownUserId: ownProfile ? '42' : '1337',
        },
      );

      const loadingIndicator = getByText(/loading/i);
      await waitForElementToBeRemoved(loadingIndicator);
      if (visible) {
        expect(
          await findByText('Your details', { selector: 'h3' }),
        ).toBeVisible();
      } else {
        expect(queryByText('Your details', { selector: 'h3' })).toBe(null);
      }
    },
  );

  it('Submits data', async () => {
    const user = {
      ...createUserResponse(),
      firstName: 'John',
      lastName: 'smith',
      institution: 'harvard',
      jobTitle: 'researcher',
      location: 'moon',
      degree: 'BA' as UserDegree,
      id: '42',
    };
    const updatedUser = {
      firstName: 'John edited',
      lastName: 'smith edited',
      institution: 'harvard edited',
      jobTitle: 'researcher edited',
      location: 'moon edited',
      degree: 'MD',
    };

    const { getByLabelText, getByText } = await renderProfile(user, {
      tab: 'research',
      modal: 'edit-personal-info',
      ownUserId: '42',
    });
    const patch = nock(API_BASE_URL)
      .patch('/users/42', updatedUser)
      .reply(200, { ...user, ...updatedUser });

    const loadingIndicator = getByText(/loading/i);
    await waitForElementToBeRemoved(loadingIndicator);

    await userEvent.type(getByLabelText(/first name/i), ' edited', {
      allAtOnce: true,
    });
    await userEvent.type(getByLabelText(/last name/i), ' edited', {
      allAtOnce: true,
    });
    await userEvent.type(getByLabelText(/institution/i), ' edited', {
      allAtOnce: true,
    });
    await userEvent.type(getByLabelText(/position/i), ' edited', {
      allAtOnce: true,
    });
    await userEvent.type(getByLabelText(/location/i), ' edited', {
      allAtOnce: true,
    });
    userEvent.click(getByText('BA'));
    userEvent.click(getByText('MD'));
    userEvent.click(getByText('Save'));

    await waitFor(() => expect(patch.isDone()).toBe(true));
  }, 10_000);
});

describe('when editing the contact info', () => {
  it('opens and closes the dialog', async () => {
    const {
      getByText,
      queryByText,
      findByLabelText,
      getByDisplayValue,
      queryByDisplayValue,
    } = await renderProfile({
      ...createUserResponse(),
      contactEmail: 'contact@example.com',
    });

    userEvent.click(await findByLabelText(/edit.+contact/i));
    expect(getByDisplayValue('contact@example.com')).toBeVisible();

    userEvent.click(getByText(/close/i));
    await waitFor(() => {
      expect(queryByText(/loading/i)).not.toBeInTheDocument();
      expect(
        queryByDisplayValue('contact@example.com'),
      ).not.toBeInTheDocument();
    });
  });

  it('saves the changes from the dialog', async () => {
    const userProfile = {
      ...createUserResponse(),
      contactEmail: 'contact@example.com',
      id: '42',
    };
    const {
      getByText,
      queryByText,
      findByLabelText,
      getByDisplayValue,
      queryByDisplayValue,
    } = await renderProfile(userProfile);

    userEvent.click(await findByLabelText(/edit.+contact/i));
    await userEvent.type(getByDisplayValue('contact@example.com'), 'm');
    expect(getByDisplayValue('contact@example.comm')).toBeVisible();

    const patched = new Promise((resolve) =>
      nock(API_BASE_URL)
        .patch('/users/42')
        .reply(200, (uri, body, cb) => {
          resolve(body);
          cb(null, { ...userProfile, ...(body as object) });
        }),
    );

    userEvent.click(getByText(/save/i));
    await waitFor(() => {
      expect(queryByText(/loading/i)).not.toBeInTheDocument();
      expect(
        queryByDisplayValue('contact@example.comm'),
      ).not.toBeInTheDocument();
    });
    expect(await patched).toEqual({ contactEmail: 'contact@example.comm' });
  });
});
