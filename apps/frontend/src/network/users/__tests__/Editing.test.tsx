import React from 'react';
import { RecoilRoot } from 'recoil';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createUserResponse } from '@asap-hub/fixtures';

import { Auth0Provider } from '@asap-hub/frontend/src/auth/test-utils';
import Editing from '../Editing';
import { EDIT_PERSONAL_INFO_PATH, EDIT_CONTACT_INFO_PATH } from '../routes';
import { patchUser } from '../api';

jest.mock('../api');

const mockPatchUser = patchUser as jest.MockedFunction<typeof patchUser>;

const wrapper: React.FC<{}> = ({ children }) => (
  <RecoilRoot>
    <React.Suspense fallback="loading">
      <Auth0Provider user={{ id: '42' }}>{children}</Auth0Provider>
    </React.Suspense>
  </RecoilRoot>
);

describe.each([EDIT_PERSONAL_INFO_PATH, EDIT_CONTACT_INFO_PATH])(
  'the %s modal',
  (path) => {
    it('goes back when closed', async () => {
      const { findByText, findByTitle } = render(
        <MemoryRouter initialEntries={[`/profile/${path}`]}>
          <Route path="/profile">
            <Route exact path="/profile">
              Profile
            </Route>
            <Editing user={createUserResponse()} />
          </Route>
        </MemoryRouter>,
        { wrapper },
      );

      userEvent.click(await findByTitle(/close/i));
      expect(await findByText('Profile')).toBeVisible();
    });

    it('goes back when saved', async () => {
      const { findByText } = render(
        <MemoryRouter initialEntries={[`/profile/${path}`]}>
          <Route path="/profile">
            <Route exact path="/profile">
              Profile
            </Route>
            <Editing user={createUserResponse()} />
          </Route>
        </MemoryRouter>,
        { wrapper },
      );

      userEvent.click(await findByText(/save/i));
      expect(await findByText('Profile')).toBeVisible();
    });
  },
);

describe('the personal info modal', () => {
  it('saves changes', async () => {
    const {
      findByText,
      findByLabelText,
      getByDisplayValue,
      queryByText,
      queryByDisplayValue,
    } = render(
      <Auth0Provider user={{ id: '42' }}>
        <MemoryRouter initialEntries={[`/profile/${EDIT_PERSONAL_INFO_PATH}`]}>
          <Route path="/profile">
            <Editing
              user={{
                ...createUserResponse(),
                id: '42',
                location: 'York',
              }}
            />
          </Route>
        </MemoryRouter>
      </Auth0Provider>,
      { wrapper },
    );

    await userEvent.type(await findByLabelText(/location/i), 'shire');
    expect(getByDisplayValue('Yorkshire')).toBeVisible();

    userEvent.click(await findByText(/save/i));
    await waitFor(() => {
      expect(queryByText(/loading/i)).not.toBeInTheDocument();
      expect(queryByDisplayValue('Yorkshire')).not.toBeInTheDocument();
    });
    expect(mockPatchUser).toHaveBeenLastCalledWith(
      '42',
      expect.objectContaining({
        location: 'Yorkshire',
      }),
      expect.any(String),
    );
  });
});

describe('the contact info modal', () => {
  it('uses the contact email as the email value', async () => {
    const { findByLabelText } = render(
      <MemoryRouter initialEntries={[`/profile/${EDIT_CONTACT_INFO_PATH}`]}>
        <Route path="/profile">
          <Editing
            user={{
              ...createUserResponse(),
              contactEmail: 'contact@example.com',
            }}
          />
        </Route>
      </MemoryRouter>,
      { wrapper },
    );

    expect(await findByLabelText(/e-?mail/i)).toHaveValue(
      'contact@example.com',
    );
  });

  it('saves changes', async () => {
    const {
      findByText,
      findByLabelText,
      getByDisplayValue,
      queryByText,
      queryByDisplayValue,
    } = render(
      <Auth0Provider user={{ id: '42' }}>
        <MemoryRouter initialEntries={[`/profile/${EDIT_CONTACT_INFO_PATH}`]}>
          <Route path="/profile">
            <Editing
              user={{
                ...createUserResponse(),
                id: '42',
                contactEmail: 'contact@example.com',
              }}
            />
          </Route>
        </MemoryRouter>
      </Auth0Provider>,
      { wrapper },
    );

    await userEvent.type(await findByLabelText(/e-?mail/i), 'm');
    expect(getByDisplayValue('contact@example.comm')).toBeVisible();

    userEvent.click(await findByText(/save/i));
    await waitFor(() => {
      expect(queryByText(/loading/i)).not.toBeInTheDocument();
      expect(queryByDisplayValue('Yorkshire')).not.toBeInTheDocument();
    });
    expect(mockPatchUser).toHaveBeenLastCalledWith(
      '42',
      { contactEmail: 'contact@example.comm' },
      expect.any(String),
    );
  });
});
