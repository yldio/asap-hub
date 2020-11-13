import React from 'react';
import { StaticRouter, MemoryRouter, Route } from 'react-router-dom';
import { render, RenderResult, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import nock from 'nock';
import { createUserResponse } from '@asap-hub/fixtures';
import { authTestUtils } from '@asap-hub/react-components';

import About from '../About';
import { API_BASE_URL } from '../../../config';

jest.mock('../../../config');

it('renders the profile about section', () => {
  const { getByText } = render(
    <authTestUtils.LoggedIn user={{ id: '42' }}>
      <About userProfile={{ ...createUserResponse(), biography: 'Some Bio' }} />
    </authTestUtils.LoggedIn>,
    { wrapper: StaticRouter },
  );
  expect(getByText('Some Bio')).toBeVisible();
});

it("does not allow editing somebody else's profile", () => {
  const { queryByLabelText } = render(
    <authTestUtils.LoggedIn user={{ id: '42' }}>
      <About userProfile={{ ...createUserResponse(), id: '1337' }} />,
    </authTestUtils.LoggedIn>,
    { wrapper: StaticRouter },
  );
  expect(queryByLabelText(/edit/i)).not.toBeInTheDocument();
});

it('allows editing your own profile', () => {
  const { getAllByLabelText } = render(
    <authTestUtils.LoggedIn user={{ id: '42' }}>
      <About userProfile={{ ...createUserResponse(), id: '42' }} />,
    </authTestUtils.LoggedIn>,
    { wrapper: StaticRouter },
  );
  expect(getAllByLabelText(/edit/i)).not.toHaveLength(0);
});

describe('when editing the biography', () => {
  const userProfile = {
    ...createUserResponse(),
    id: '42',
    biography: 'My Bio',
  };

  let nockScope: nock.Scope;
  beforeEach(() => {
    nockScope = nock(API_BASE_URL).get('/users/42').reply(200, userProfile);
  });
  afterEach(() => {
    nock.cleanAll();
  });

  let result!: RenderResult;
  beforeEach(async () => {
    await act(async () => {
      result = render(
        <authTestUtils.LoggedIn user={{ id: '42' }}>
          <MemoryRouter initialEntries={['/about']}>
            <Route path="/about">
              <About userProfile={userProfile} />
            </Route>
          </MemoryRouter>
        </authTestUtils.LoggedIn>,
      );
      await waitFor(() =>
        expect(result.queryByText(/loading/i)).not.toBeInTheDocument(),
      );
    });
  });

  it('opens and closes the dialog', async () => {
    const {
      getByText,
      queryByText,
      getByLabelText,
      getByDisplayValue,
      queryByDisplayValue,
    } = result;

    userEvent.click(getByLabelText(/edit.+bio/i));
    expect(getByDisplayValue('My Bio')).toBeVisible();

    userEvent.click(getByText(/close/i));
    await new Promise((resolve) => nockScope.once('replied', resolve));
    await waitFor(() => {
      expect(queryByText(/loading/i)).not.toBeInTheDocument();
      expect(queryByDisplayValue('My Bio')).not.toBeInTheDocument();
    });
  });

  it('saves the changes from the dialog', async () => {
    const {
      getByText,
      queryByText,
      getByLabelText,
      getByDisplayValue,
      queryByDisplayValue,
    } = result;

    userEvent.click(getByLabelText(/edit.+bio/i));
    await userEvent.type(getByDisplayValue('My Bio'), ' 2');
    expect(getByDisplayValue('My Bio 2')).toBeVisible();

    const patched = new Promise((resolve) =>
      nockScope.patch('/users/42').reply(200, (_uri, body, cb) => {
        resolve(body);
        const newUserProfile = { ...userProfile, ...(body as object) };
        nockScope.get('/users/42').reply(200, newUserProfile).persist();
        cb(null, newUserProfile);
      }),
    );

    userEvent.click(getByText(/save/i));
    await waitFor(() => {
      expect(queryByText(/loading/i)).not.toBeInTheDocument();
      expect(queryByDisplayValue('My Bio 2')).not.toBeInTheDocument();
    });
    expect(await patched).toEqual({ biography: 'My Bio 2' });
  });
});
