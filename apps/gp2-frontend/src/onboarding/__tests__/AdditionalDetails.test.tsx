import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import {
  render,
  waitForElementToBeRemoved,
  screen,
} from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getUser } from '../../users/api';
import { refreshUserState } from '../../users/state';
import AdditionalDetails from '../AdditionalDetails';

jest.mock('../../users/api');

mockConsoleError();

const renderAdditionalDetails = async (id: string) => {
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
              initialEntries={[
                gp2Routing.onboarding({}).additionalDetails({}).$,
              ]}
            >
              <Route
                path={gp2Routing.onboarding({}).additionalDetails.template}
              >
                <AdditionalDetails />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );

  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};
describe('AdditionalDetails', () => {
  beforeEach(jest.resetAllMocks);
  const mockGetUser = getUser as jest.MockedFunction<typeof getUser>;

  it('renders questions, funding providers, contributing cohorts and external profiles', async () => {
    const user = gp2Fixtures.createUserResponse();
    mockGetUser.mockResolvedValueOnce(user);
    await renderAdditionalDetails(user.id);
    expect(
      screen.getByRole('heading', { name: 'Open Questions' }),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'Funding Providers' }),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'Contributing Cohort Studies' }),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'External Profiles' }),
    ).toBeVisible();
  });

  it('renders not found if no user is returned', async () => {
    mockGetUser.mockResolvedValueOnce(undefined);
    await renderAdditionalDetails('unknown-id');
    expect(
      screen.getByRole('heading', {
        name: 'Sorry! We can’t seem to find that page.',
      }),
    ).toBeVisible();
  });
});
