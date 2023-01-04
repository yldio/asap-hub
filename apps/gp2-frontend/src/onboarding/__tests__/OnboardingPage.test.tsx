import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import userEvent from '@testing-library/user-event';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { gp2 } from '@asap-hub/model';

import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getUser, patchUser } from '../../users/api';
import { refreshUserState } from '../../users/state';
import OnboardingPage from '../OnboardingPage';

jest.mock('../../users/api');

mockConsoleError();

const renderOnboardingPage = async (id: string) => {
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
              <OnboardingPage />
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );

  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};

describe('OnboardingPage', () => {
  beforeEach(jest.resetAllMocks);
  const mockGetUser = getUser as jest.MockedFunction<typeof getUser>;
  const mockPatchUser = patchUser as jest.MockedFunction<typeof patchUser>;

  it('has core details activated', async () => {
    const user = gp2Fixtures.createUserResponse();
    mockGetUser.mockResolvedValueOnce(user);
    await renderOnboardingPage(user.id);
    expect(screen.getByRole('link', { name: /core details/i })).toHaveClass(
      'active-link',
    );
  });
  it('can publish profile if user profile is completed', async () => {
    const user: gp2.UserResponse = {
      ...gp2Fixtures.createUserResponse(),
      onboarded: false,
      biography: 'bio',
    };
    mockGetUser.mockResolvedValueOnce(user);

    await renderOnboardingPage(user.id);
    userEvent.click(screen.getByRole('link', { name: 'Continue' }));
    userEvent.click(screen.getByRole('link', { name: 'Continue' }));
    userEvent.click(screen.getByRole('link', { name: 'Continue' }));
    userEvent.click(screen.getByRole('link', { name: 'Continue' }));
    userEvent.click(screen.getByRole('button', { name: 'Publish' }));
    expect(mockPatchUser).toHaveBeenCalledWith(
      expect.anything(),
      { onboarded: true },
      expect.anything(),
    );
  });
});
