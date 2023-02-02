import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import { gp2 as gp2Model } from '@asap-hub/model';
import {
  render,
  waitForElementToBeRemoved,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getUser, getContributingCohorts, patchUser } from '../../users/api';
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
  const contributingCohortResponse: gp2Model.ContributingCohortResponse[] = [
    { id: '7', name: 'AGPDS' },
    { id: '11', name: 'S3' },
  ];
  const mockGetUser = getUser as jest.MockedFunction<typeof getUser>;
  const mockPatchUser = patchUser as jest.MockedFunction<typeof patchUser>;
  const mockGetContributingCohorts =
    getContributingCohorts as jest.MockedFunction<
      typeof getContributingCohorts
    >;

  it('renders questions, funding providers, contributing cohorts and external profiles', async () => {
    const user = gp2Fixtures.createUserResponse();
    mockGetUser.mockResolvedValueOnce(user);
    mockGetContributingCohorts.mockResolvedValueOnce(
      contributingCohortResponse,
    );
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
    mockGetContributingCohorts.mockResolvedValueOnce(
      contributingCohortResponse,
    );
    await renderAdditionalDetails('unknown-id');
    expect(
      screen.getByRole('heading', {
        name: 'Sorry! We can’t seem to find that page.',
      }),
    ).toBeVisible();
  });

  it('saves the funding providers modal', async () => {
    const user = gp2Fixtures.createUserResponse();
    mockGetUser.mockResolvedValueOnce(user);
    await renderAdditionalDetails(user.id);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    const [fundingProvidersButton] = screen.getAllByRole('link', {
      name: 'Optional Add',
    });
    userEvent.click(fundingProvidersButton);
    expect(screen.getByRole('dialog')).toBeVisible();
    userEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    expect(mockPatchUser).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        fundingStreams: '',
      }),
      expect.anything(),
    );
  });
});
