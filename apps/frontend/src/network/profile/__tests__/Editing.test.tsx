import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import { createUserResponse } from '@asap-hub/fixtures';

import Editing from '../Editing';
import { EDIT_PERSONAL_INFO_PATH, EDIT_CONTACT_INFO_PATH } from '../routes';

describe.each([EDIT_PERSONAL_INFO_PATH, EDIT_CONTACT_INFO_PATH])(
  'the %s modal',
  (path) => {
    it('goes back when closed', async () => {
      const { findByText, getByTitle } = render(
        <MemoryRouter initialEntries={[`/profile/${path}`]}>
          <Route path="/profile">
            <Route exact path="/profile">
              Profile
            </Route>
            <Editing
              userProfile={createUserResponse()}
              onPatchUserProfile={() => {}}
            />
          </Route>
        </MemoryRouter>,
      );

      userEvent.click(getByTitle(/close/i));
      expect(await findByText('Profile')).toBeVisible();
    });

    it('goes back when saved', async () => {
      const { findByText } = render(
        <MemoryRouter initialEntries={[`/profile/${path}`]}>
          <Route path="/profile">
            <Route exact path="/profile">
              Profile
            </Route>
            <Editing
              userProfile={createUserResponse()}
              onPatchUserProfile={() => {}}
            />
          </Route>
        </MemoryRouter>,
      );

      userEvent.click(await findByText(/save/i));
      expect(await findByText('Profile')).toBeVisible();
    });
  },
);

describe('the personal info modal', () => {
  it('saves changes', async () => {
    const handlePatchUserProfile = jest.fn();
    const { getByText, getByLabelText } = render(
      <MemoryRouter initialEntries={[`/profile/${EDIT_PERSONAL_INFO_PATH}`]}>
        <Route path="/profile">
          <Editing
            userProfile={{
              ...createUserResponse(),
              location: 'York',
            }}
            onPatchUserProfile={handlePatchUserProfile}
          />
        </Route>
      </MemoryRouter>,
    );

    await userEvent.type(getByLabelText(/location/i), 'shire');
    userEvent.click(getByText(/save/i));
    expect(handlePatchUserProfile).toHaveBeenLastCalledWith(
      expect.objectContaining({
        location: 'Yorkshire',
      }),
    );
  });
});

describe('the contact info modal', () => {
  it('uses the contact email as the email value', () => {
    const { getByLabelText } = render(
      <MemoryRouter initialEntries={[`/profile/${EDIT_CONTACT_INFO_PATH}`]}>
        <Route path="/profile">
          <Editing
            userProfile={{
              ...createUserResponse(),
              contactEmail: 'contact@example.com',
            }}
            onPatchUserProfile={() => {}}
          />
        </Route>
      </MemoryRouter>,
    );

    expect(getByLabelText(/e-?mail/i)).toHaveValue('contact@example.com');
  });

  it('saves changes', async () => {
    const handlePatchUserProfile = jest.fn();
    const { getByText, getByLabelText } = render(
      <MemoryRouter initialEntries={[`/profile/${EDIT_CONTACT_INFO_PATH}`]}>
        <Route path="/profile">
          <Editing
            userProfile={{
              ...createUserResponse(),
              contactEmail: 'contact@example.com',
            }}
            onPatchUserProfile={handlePatchUserProfile}
          />
        </Route>
      </MemoryRouter>,
    );

    await userEvent.type(getByLabelText(/e-?mail/i), 'm');
    userEvent.click(getByText(/save/i));
    expect(handlePatchUserProfile).toHaveBeenLastCalledWith({
      contactEmail: 'contact@example.comm',
    });
  });
});
