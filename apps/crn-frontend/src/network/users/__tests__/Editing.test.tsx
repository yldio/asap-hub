import { ReactNode, Suspense, useState, useCallback } from 'react';
import { RecoilRoot } from 'recoil';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createUserResponse } from '@asap-hub/fixtures';
import { network } from '@asap-hub/routing';
import { User } from '@auth0/auth0-spa-js';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import { loadInstitutionOptions } from '@asap-hub/frontend-utils';

import Editing from '../Editing';
import { patchUser } from '../api';
import CheckOnboarded from '../../../auth/CheckOnboarded';

jest.mock('../api');
jest.mock('@asap-hub/frontend-utils', () => {
  const actual = jest.requireActual('@asap-hub/frontend-utils');
  return {
    ...actual,
    loadInstitutionOptions: jest.fn(),
  };
});

const mockPatchUser = patchUser as jest.MockedFunction<typeof patchUser>;
const mockLoadInstitutionOptions =
  loadInstitutionOptions as jest.MockedFunction<typeof loadInstitutionOptions>;

const id = '42';

const renderWithRoot = (children: ReactNode): ReturnType<typeof render> =>
  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{ id }}>
          <WhenReady>{children}</WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
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
    const { findByText, findByTitle } = renderWithRoot(
      <MemoryRouter initialEntries={[route({}).$]}>
        <Routes>
          <Route path={aboutPath} element={<>Profile</>} />
          <Route
            path={`${aboutPath}/*`}
            element={
              <Editing user={createUserResponse()} backHref={aboutPath} />
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    await userEvent.click(await findByTitle(/close/i));
    expect(await findByText('Profile')).toBeVisible();
  });

  it('goes back when saved', async () => {
    const { findByText } = renderWithRoot(
      <MemoryRouter initialEntries={[route({}).$]}>
        <Routes>
          <Route path={aboutPath} element={<>Profile</>} />
          <Route
            path={`${aboutPath}/*`}
            element={
              <Editing user={createUserResponse()} backHref={aboutPath} />
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    await userEvent.click(await findByText(/save/i));
    expect(await findByText('Profile')).toBeVisible();
  });
});

describe('the personal info modal', () => {
  it('searches and displays results from organisations api', async () => {
    mockLoadInstitutionOptions.mockResolvedValue(['ExampleInst']);
    const { findByDisplayValue, findByText } = renderWithRoot(
      <Auth0Provider user={{ id }}>
        <MemoryRouter initialEntries={[editPersonalInfo({}).$]}>
          <Routes>
            <Route
              path={`${aboutPath}/*`}
              element={
                <Editing
                  user={{
                    ...createUserResponse(),
                    institution: 'NCU',
                  }}
                  backHref={aboutPath}
                />
              }
            />
          </Routes>
        </MemoryRouter>
      </Auth0Provider>,
    );

    await userEvent.type(await findByDisplayValue('NCU'), ' 1');
    expect(await findByText('ExampleInst')).toBeVisible();
    expect(mockLoadInstitutionOptions).toHaveBeenCalledWith('NCU 1');
  });

  it('saves changes', async () => {
    const {
      findByText,
      findByLabelText,
      getByDisplayValue,
      queryByText,
      queryByDisplayValue,
    } = renderWithRoot(
      <Auth0Provider user={{ id }}>
        <MemoryRouter initialEntries={[editPersonalInfo({}).$]}>
          <Routes>
            <Route
              path={`${aboutPath}/*`}
              element={
                <Editing
                  user={{
                    ...createUserResponse(),
                    id,
                    city: 'Lon',
                  }}
                  backHref={aboutPath}
                />
              }
            />
          </Routes>
        </MemoryRouter>
      </Auth0Provider>,
    );

    await userEvent.type(await findByLabelText(/city/i), 'don');
    expect(getByDisplayValue('London')).toBeVisible();

    await userEvent.click(await findByText(/save/i));
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
    const { findByDisplayValue } = renderWithRoot(
      <MemoryRouter initialEntries={[editContactInfo({}).$]}>
        <Routes>
          <Route
            path={`${aboutPath}/*`}
            element={
              <Editing
                user={{
                  ...createUserResponse(),
                  social: { github: 'github' },
                }}
                backHref={aboutPath}
              />
            }
          />
        </Routes>
      </MemoryRouter>,
    );
    expect(await findByDisplayValue('github')).toBeVisible();
  });
  it('uses the contact email as the email value', async () => {
    const { findByLabelText } = renderWithRoot(
      <MemoryRouter initialEntries={[editContactInfo({}).$]}>
        <Routes>
          <Route
            path={`${aboutPath}/*`}
            element={
              <Editing
                user={{
                  ...createUserResponse(),
                  contactEmail: 'contact@example.com',
                }}
                backHref={aboutPath}
              />
            }
          />
        </Routes>
      </MemoryRouter>,
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
    } = renderWithRoot(
      <MemoryRouter initialEntries={[`/profile${editContactInfo.template}`]}>
        <Routes>
          <Route
            path="/profile/*"
            element={
              <Editing
                user={{
                  ...createUserResponse(),
                  id,
                  contactEmail: 'contact@example.com',
                }}
                backHref="/profile"
              />
            }
          />
          <Route path="/profile" element={<>Profile</>} />
        </Routes>
      </MemoryRouter>,
    );

    await userEvent.type(await findByLabelText(/e-?mail/i), 'm');
    expect(getByDisplayValue('contact@example.comm')).toBeVisible();

    await userEvent.click(await findByText(/save/i));
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
    const { findByText } = renderWithRoot(
      <MemoryRouter initialEntries={[`/profile${editOnboarded.template}`]}>
        <Routes>
          <Route
            path="/profile/*"
            element={
              <Editing
                user={{
                  ...createUserResponse(),
                  id,
                  onboarded: false,
                }}
                backHref="/profile"
              />
            }
          />
          <Route path="/" element={<>Homepage</>} />
        </Routes>
      </MemoryRouter>,
    );

    await userEvent.click(await findByText(/publish profile/i));
    await waitFor(() => {
      expect(mockPatchUser).toHaveBeenLastCalledWith(
        id,
        expect.objectContaining({ onboarded: true }),
        expect.any(String),
      );
    });
  });

  it('redirects to homepage', async () => {
    window.alert = jest.fn();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    const initialUser: User = {
      ...createUserResponse(),
      id,
      onboarded: false,
    };
    const ownProfileRoute = network({})
      .users({})
      .user({ userId: initialUser.id })
      .about({});
    const ownProfileBasePath = network({})
      .users({})
      .user({ userId: initialUser.id }).$;

    // Mock patchUser to return updated user
    mockPatchUser.mockResolvedValue({
      ...createUserResponse(),
      id,
      onboarded: true,
    });

    // Location display helper
    const LocationDisplay = () => {
      const location = useLocation();
      return <div data-testid="location">{location.pathname}</div>;
    };

    // Component to manage user state
    const TestComponent = () => {
      const [currentUser, setCurrentUser] = useState(initialUser);

      // Stable refreshUser callback that updates the user state
      const handleRefreshUser = useCallback(async () => {
        // Use a new object to ensure React detects the change
        setCurrentUser((prev) => ({
          ...prev,
          onboarded: true,
        }));
        // Wait for React to process the state update and for Auth0Provider's useEffect to run
        // This ensures the auth0 object is recreated with the updated user before navigation
        await new Promise((resolve) => {
          setTimeout(resolve, 50);
        });
      }, []);

      // Stable auth0Overrides function - only override refreshUser, let Auth0Provider handle user updates
      const auth0Overrides = useCallback(
        () => ({
          refreshUser: handleRefreshUser,
        }),
        [handleRefreshUser],
      );

      return (
        <RecoilRoot>
          <Suspense fallback="loading">
            <Auth0Provider user={currentUser} auth0Overrides={auth0Overrides}>
              <WhenReady>
                <MemoryRouter
                  initialEntries={[ownProfileRoute.editOnboarded({}).$]}
                >
                  <LocationDisplay />
                  <CheckOnboarded>
                    <Routes>
                      <Route
                        path={`${ownProfileBasePath}/*`}
                        element={
                          <Routes>
                            <Route
                              path="about/*"
                              element={
                                <Editing
                                  user={{
                                    ...createUserResponse(),
                                    ...currentUser,
                                  }}
                                  backHref={ownProfileRoute.$}
                                />
                              }
                            />
                          </Routes>
                        }
                      />
                      <Route path="/" element={<>Homepage!</>} />
                    </Routes>
                  </CheckOnboarded>
                </MemoryRouter>
              </WhenReady>
            </Auth0Provider>
          </Suspense>
        </RecoilRoot>
      );
    };

    const { findByText, findByTestId } = render(<TestComponent />);

    await userEvent.click(await findByText(/publish profile/i));
    await waitFor(() => {
      expect(mockPatchUser).toHaveBeenLastCalledWith(
        id,
        expect.objectContaining({ onboarded: true }),
        expect.any(String),
      );
    });

    await waitFor(
      async () => {
        const locationElement = await findByTestId('location');
        expect(locationElement.textContent).toBe('/');
      },
      { timeout: 5000 },
    );

    // Verify homepage is rendered after successful navigation
    expect(await findByText('Homepage!')).toBeVisible();
  });
});
