import { FC, Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createUserResponse } from '@asap-hub/fixtures';
import { network } from '@asap-hub/routing';

import { Auth0Provider } from '@asap-hub/frontend/src/auth/test-utils';
import Editing from '../Editing';
import { patchUser } from '../api';

jest.mock('../api');

const mockPatchUser = patchUser as jest.MockedFunction<typeof patchUser>;

const id = '42';

const wrapper: FC<Record<string, never>> = ({ children }) => (
  <RecoilRoot>
    <Suspense fallback="loading">
      <Auth0Provider user={{ id }}>{children}</Auth0Provider>
    </Suspense>
  </RecoilRoot>
);
const aboutRoute = network({}).users({}).user({ userId: id }).about;
const aboutPath =
  network.template +
  network({}).users.template +
  network({}).users({}).user.template +
  aboutRoute.template;
const { editPersonalInfo, editContactInfo } = aboutRoute({});

describe.each([editPersonalInfo, editContactInfo])('the %s modal', (route) => {
  it('goes back when closed', async () => {
    const { findByText, findByTitle } = render(
      <MemoryRouter initialEntries={[route({}).$]}>
        <Route path={aboutPath}>
          <Route exact path={aboutPath}>
            Profile
          </Route>
          <Editing user={createUserResponse()} backHref={aboutPath} />
        </Route>
      </MemoryRouter>,
      { wrapper },
    );

    userEvent.click(await findByTitle(/close/i));
    expect(await findByText('Profile')).toBeVisible();
  });

  it('goes back when saved', async () => {
    const { findByText } = render(
      <MemoryRouter initialEntries={[route({}).$]}>
        <Route path={aboutPath}>
          <Route exact path={aboutPath}>
            Profile
          </Route>
          <Editing user={createUserResponse()} backHref={aboutPath} />
        </Route>
      </MemoryRouter>,
      { wrapper },
    );

    userEvent.click(await findByText(/save/i));
    expect(await findByText('Profile')).toBeVisible();
  });
});

describe('the personal info modal', () => {
  it('saves changes', async () => {
    const {
      findByText,
      findByLabelText,
      getByDisplayValue,
      queryByText,
      queryByDisplayValue,
    } = render(
      <Auth0Provider user={{ id }}>
        <MemoryRouter initialEntries={[editPersonalInfo({}).$]}>
          <Route path={aboutPath}>
            <Editing
              user={{
                ...createUserResponse(),
                id,
                location: 'York',
              }}
              backHref={aboutPath}
            />
          </Route>
        </MemoryRouter>
      </Auth0Provider>,
      { wrapper },
    );

    userEvent.type(await findByLabelText(/location/i), 'shire');
    expect(getByDisplayValue('Yorkshire')).toBeVisible();

    userEvent.click(await findByText(/save/i));
    await waitFor(() => {
      expect(queryByText(/loading/i)).not.toBeInTheDocument();
      expect(queryByDisplayValue('Yorkshire')).not.toBeInTheDocument();
    });
    expect(mockPatchUser).toHaveBeenLastCalledWith(
      id,
      expect.objectContaining({
        location: 'Yorkshire',
      }),
      expect.any(String),
    );
  });
});

describe('the contact info modal', () => {
  it('passes user data to contact info modal', async () => {
    const { findByDisplayValue } = render(
      <MemoryRouter initialEntries={[editContactInfo({}).$]}>
        <Route path={aboutPath}>
          <Editing
            user={{
              ...createUserResponse(),
              social: { github: 'github' },
            }}
            backHref={aboutPath}
          />
        </Route>
      </MemoryRouter>,
      { wrapper },
    );
    expect(await findByDisplayValue('github')).toBeVisible();
  });
  it('uses the contact email as the email value', async () => {
    const { findByLabelText } = render(
      <MemoryRouter initialEntries={[editContactInfo({}).$]}>
        <Route path={aboutPath}>
          <Editing
            user={{
              ...createUserResponse(),
              contactEmail: 'contact@example.com',
            }}
            backHref={aboutPath}
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
      <Auth0Provider user={{ id }}>
        <MemoryRouter initialEntries={[`/profile${editContactInfo.template}`]}>
          <Route path="/profile">
            <Editing
              user={{
                ...createUserResponse(),
                id,
                contactEmail: 'contact@example.com',
              }}
              backHref={aboutPath}
            />
          </Route>
        </MemoryRouter>
      </Auth0Provider>,
      { wrapper },
    );

    userEvent.type(await findByLabelText(/e-?mail/i), 'm');
    expect(getByDisplayValue('contact@example.comm')).toBeVisible();

    userEvent.click(await findByText(/save/i));
    await waitFor(() => {
      expect(queryByText(/loading/i)).not.toBeInTheDocument();
      expect(queryByDisplayValue('Yorkshire')).not.toBeInTheDocument();
    });
    expect(mockPatchUser).toHaveBeenLastCalledWith(
      id,
      expect.objectContaining({ contactEmail: 'contact@example.comm' }),
      expect.any(String),
    );
  });
});
