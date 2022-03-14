import { FC, Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createUserResponse } from '@asap-hub/fixtures';
import { network } from '@asap-hub/routing';
import { User } from '@auth0/auth0-spa-js';
import { Auth0Provider } from '@asap-hub/crn-frontend/src/auth/test-utils';
import { getUserClaimKey } from '@asap-hub/react-context';

import Editing from '../Editing';
import { patchUser, getInstitutions } from '../api';
import CheckOnboarded from '../../../auth/CheckOnboarded';

jest.mock('../api');

const mockPatchUser = patchUser as jest.MockedFunction<typeof patchUser>;
const mockGetInstitutions = getInstitutions as jest.MockedFunction<
  typeof getInstitutions
>;

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
const { editPersonalInfo, editContactInfo, editOnboarded } = aboutRoute({});

beforeEach(() => jest.resetAllMocks());

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
  it('searches and displays results from organisations api', async () => {
    mockGetInstitutions.mockResolvedValue({
      number_of_results: 1,
      time_taken: 0,
      items: [
        {
          name: 'ExampleInst',
          id: 'id-1',
          email_address: 'example@example.com',
          status: '',
          wikipedia_url: '',
          established: 1999,
          aliases: [],
          acronyms: [],
          links: [],
          types: [],
        },
      ],
    });
    const { findByDisplayValue, findByText } = render(
      <Auth0Provider user={{ id }}>
        <MemoryRouter initialEntries={[editPersonalInfo({}).$]}>
          <Route path={aboutPath}>
            <Editing
              user={{
                ...createUserResponse(),
                institution: 'NCU',
              }}
              backHref={aboutPath}
            />
          </Route>
        </MemoryRouter>
      </Auth0Provider>,
      { wrapper },
    );

    userEvent.type(await findByDisplayValue('NCU'), ' 1');
    expect(await findByText('ExampleInst')).toBeVisible();
    expect(mockGetInstitutions).toHaveBeenCalledWith({
      searchQuery: 'NCU 1',
    });
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
        <MemoryRouter initialEntries={[editPersonalInfo({}).$]}>
          <Route path={aboutPath}>
            <Editing
              user={{
                ...createUserResponse(),
                id,
                city: 'Lon',
              }}
              backHref={aboutPath}
            />
          </Route>
        </MemoryRouter>
      </Auth0Provider>,
      { wrapper },
    );

    userEvent.type(await findByLabelText(/city/i), 'don');
    expect(getByDisplayValue('London')).toBeVisible();

    userEvent.click(await findByText(/save/i));
    await waitFor(() => {
      expect(queryByText(/loading/i)).not.toBeInTheDocument();
      expect(queryByDisplayValue('London')).not.toBeInTheDocument();
    });
    expect(mockPatchUser).toHaveBeenLastCalledWith(
      id,
      expect.objectContaining({
        city: 'London',
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

describe('the onboarded modal', () => {
  it('saves changes', async () => {
    const { findByText } = render(
      <Auth0Provider user={{ id, onboarded: false }}>
        <MemoryRouter initialEntries={[`/profile${editOnboarded.template}`]}>
          <Route path="/profile">
            <Editing
              user={{
                ...createUserResponse(),
                id,
                onboarded: false,
              }}
              backHref={aboutPath}
            />
          </Route>
        </MemoryRouter>
      </Auth0Provider>,
      { wrapper },
    );

    userEvent.click(await findByText(/publish and explore/i));
    await waitFor(() => {
      expect(mockPatchUser).toHaveBeenLastCalledWith(
        id,
        expect.objectContaining({ onboarded: true }),
        expect.any(String),
      );
    });
  });

  it('redirects to homepage', async () => {
    let user: User = {
      ...createUserResponse(),
      id,
      onboarded: false,
    };
    const ownProfileRoute = network({})
      .users({})
      .user({ userId: user.id })
      .about({});

    const { findByText } = render(
      <Auth0Provider
        user={user}
        auth0Overrides={() => ({
          user: {
            sub: 'testuser',
            name: user.displayName,
            given_name: user.firstName,
            family_name: user.lastName,
            aud: 'Av2psgVspAN00Kez9v1vR2c496a9zCW3',
            [getUserClaimKey()]: user,
          },
        })}
      >
        <MemoryRouter initialEntries={[ownProfileRoute.editOnboarded({}).$]}>
          <CheckOnboarded>
            <Route path={ownProfileRoute.$}>
              <Editing
                user={{
                  ...createUserResponse(),
                  ...user,
                }}
                backHref={aboutPath}
              />
            </Route>
            <Route exact path={'/'}>
              Homepage!
            </Route>
          </CheckOnboarded>
        </MemoryRouter>
      </Auth0Provider>,
      { wrapper },
    );

    userEvent.click(await findByText(/publish and explore/i));
    await waitFor(() => {
      expect(mockPatchUser).toHaveBeenLastCalledWith(
        id,
        expect.objectContaining({ onboarded: true }),
        expect.any(String),
      );
    });
    user = {
      ...user,
      onboarded: true,
    };
    expect(await findByText('Homepage!')).toBeVisible();
  });
});
