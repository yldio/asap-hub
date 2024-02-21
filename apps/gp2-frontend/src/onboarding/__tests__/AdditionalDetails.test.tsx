import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 as gp2Model } from '@asap-hub/model';
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
import { getContributingCohorts } from '../../shared/api';
import { getUser, patchUser } from '../../users/api';
import AdditionalDetails from '../AdditionalDetails';

jest.mock('../../users/api');
jest.mock('../../shared/api');

mockConsoleError();

const renderAdditionalDetails = async (id: string) => {
  render(
    <RecoilRoot>
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
  const mockPatchUser = patchUser as jest.MockedFunction<typeof patchUser>;
  const mockGetContributingCohorts =
    getContributingCohorts as jest.MockedFunction<
      typeof getContributingCohorts
    >;

  it('renders questions, funding providers and contributing cohorts', async () => {
    const user = gp2Fixtures.createUserResponse();
    mockGetUser.mockResolvedValueOnce(user);
    mockGetContributingCohorts.mockResolvedValueOnce(
      gp2Fixtures.contributingCohortResponse,
    );
    await renderAdditionalDetails(user.id);
    expect(
      screen.getByRole('heading', { name: 'Open Questions' }),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'Financial Disclosures' }),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'Contributing Cohort Studies' }),
    ).toBeVisible();
  });

  it('renders not found if no user is returned', async () => {
    mockGetUser.mockResolvedValueOnce(undefined);
    mockGetContributingCohorts.mockResolvedValueOnce(
      gp2Fixtures.contributingCohortResponse,
    );
    await renderAdditionalDetails('unknown-id');
    expect(
      screen.getByRole('heading', {
        name: 'Sorry! We can’t seem to find that page.',
      }),
    ).toBeVisible();
  });

  it('saves the open questions modal', async () => {
    const user = gp2Fixtures.createUserResponse();
    mockGetUser.mockResolvedValueOnce(user);
    await renderAdditionalDetails(user.id);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    const [openQuestionsButton] = screen.getAllByRole('link', {
      name: 'Edit Edit',
    });
    userEvent.click(openQuestionsButton!);
    expect(screen.getByRole('dialog')).toBeVisible();
    userEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    expect(mockPatchUser).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        questions: ['a first question?', 'a second question?'],
      }),
      expect.anything(),
    );
  });

  it('saves the funding providers modal', async () => {
    const user = gp2Fixtures.createUserResponse();
    mockGetUser.mockResolvedValueOnce(user);
    await renderAdditionalDetails(user.id);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    const [fundingProvidersButton] = screen.getAllByRole('link', {
      name: 'Optional Add',
    });
    userEvent.click(fundingProvidersButton!);
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

  it('opens the contributing cohorts modal', async () => {
    const contributingCohorts: gp2Model.UserContributingCohort[] = [
      {
        contributingCohortId: '11',
        name: 'some name',
        role: 'Lead Investigator',
        studyUrl: 'http://example.com/study',
      },
    ];
    const user = { ...gp2Fixtures.createUserResponse(), contributingCohorts };
    mockGetUser.mockResolvedValueOnce(user);
    mockGetContributingCohorts.mockResolvedValueOnce(
      gp2Fixtures.contributingCohortResponse,
    );

    await renderAdditionalDetails(user.id);
    const [, cohortEditButton] = screen.getAllByRole('link', {
      name: 'Edit Edit',
    });
    userEvent.click(cohortEditButton!);
    expect(await screen.findByRole('dialog')).toBeVisible();
    userEvent.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    const expectedCohorts = contributingCohorts.map(
      ({ contributingCohortId, role, studyUrl }) => ({
        contributingCohortId,
        role,
        studyUrl,
      }),
    );
    expect(mockPatchUser).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ contributingCohorts: expectedCohorts }),
      expect.anything(),
    );
  });
});
