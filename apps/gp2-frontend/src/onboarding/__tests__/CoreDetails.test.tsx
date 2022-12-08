import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getUser, patchUser } from '../../users/api';
import { refreshUserState } from '../../users/state';
import CoreDetails from '../CoreDetails';

jest.mock('../../users/api');

mockConsoleError();

const renderCoreDetails = async (id: string) => {
  render(
    <RecoilRoot
      initializeState={({ set }) => {
        set(refreshUserState(id), Math.random());
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{ onboarded: false, id }}>
          <WhenReady>
            <MemoryRouter
              initialEntries={[gp2Routing.onboarding({}).coreDetails({}).$]}
            >
              <Route path={gp2Routing.onboarding({}).coreDetails.template}>
                <CoreDetails />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );

  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};

describe('CoreDetails', () => {
  beforeEach(jest.resetAllMocks);
  const mockGetUser = getUser as jest.MockedFunction<typeof getUser>;
  const mockPatchUser = patchUser as jest.MockedFunction<typeof patchUser>;
  it('renders header with title', async () => {
    const user = gp2Fixtures.createUserResponse();
    mockGetUser.mockResolvedValueOnce(user);
    await renderCoreDetails(user.id);
    expect(screen.getByRole('heading', { name: /tony stark/i })).toBeVisible();
  });

  it('renders not found if no user is returned', async () => {
    mockGetUser.mockResolvedValueOnce(undefined);
    await renderCoreDetails('unknown-id');
    expect(
      screen.getByRole('heading', {
        name: 'Sorry! We can’t seem to find that page.',
      }),
    ).toBeVisible();
  });
  it('renders the primary email', async () => {
    const user = gp2Fixtures.createUserResponse();
    mockGetUser.mockResolvedValueOnce(user);
    await renderCoreDetails(user.id);
    expect(screen.getByRole('link', { name: /T@ark.io/i })).toBeVisible();
  });
  it('renders the secondary email', async () => {
    const user = gp2Fixtures.createUserResponse();
    mockGetUser.mockResolvedValueOnce({
      ...user,
      secondaryEmail: 'secondary@stark.com',
    });
    await renderCoreDetails(user.id);
    expect(
      screen.getByRole('link', { name: /secondary@stark.com/i }),
    ).toBeVisible();
  });

  it('opens the key information modal', async () => {
    const user = gp2Fixtures.createUserResponse();
    mockGetUser.mockResolvedValueOnce(user);
    await renderCoreDetails(user.id);
    userEvent.click(screen.getByRole('link', { name: 'Required Add' }));
    expect(screen.getByRole('dialog')).toBeVisible();
  });

  it('saves the key information modal', async () => {
    const user = gp2Fixtures.createUserResponse();
    mockGetUser.mockResolvedValueOnce(user);
    await renderCoreDetails(user.id);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    userEvent.click(screen.getByRole('link', { name: 'Required Add' }));
    expect(screen.getByRole('dialog')).toBeVisible();
    userEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    expect(mockPatchUser).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ firstName: 'Tony', lastName: 'Stark' }),
      expect.anything(),
    );
  });
});
