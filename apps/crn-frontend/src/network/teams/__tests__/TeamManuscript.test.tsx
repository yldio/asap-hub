import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import { network } from '@asap-hub/routing';
import {
  render,
  screen,
  waitForElementToBeRemoved,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory, MemoryHistory } from 'history';
import { ComponentProps, Suspense } from 'react';
import { Route, Router } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { EligibilityReasonProvider } from '../EligibilityReasonProvider';
import { ManuscriptToastProvider } from '../ManuscriptToastProvider';
import { getGeneratedShortDescription } from '../../../shared-api/content-generator';
import { refreshTeamState } from '../state';
import TeamManuscript from '../TeamManuscript';

jest.mock('../../../shared-api/content-generator');

jest.mock(
  'react-lottie',
  () =>
    function MockLottie() {
      return <div>Loading...</div>;
    },
);

jest.setTimeout(100_000);

const manuscriptResponse = { id: '1', title: 'The Manuscript' };

const teamId = '42';
let history = createMemoryHistory({
  initialEntries: [
    network({}).teams({}).team({ teamId }).workspace({}).createManuscript({}).$,
  ],
});

jest.mock('../../users/api');

jest.mock('../api', () => ({
  createManuscript: jest.fn().mockResolvedValue(manuscriptResponse),
  getManuscript: jest.fn().mockResolvedValue(null),
  resubmitManuscript: jest.fn().mockResolvedValue(null),
  uploadManuscriptFileViaPresignedUrl: jest.fn().mockResolvedValue({
    filename: 'manuscript.pdf',
    url: 'https://example.com/manuscript.pdf',
    id: 'file-id',
  }),
  getTeam: jest.fn().mockResolvedValue({ id: teamId, displayName: 'Team A' }),
  getLabs: jest.fn().mockResolvedValue([{ id: 'lab-1', name: 'Lab 1' }]),
  getTeams: jest
    .fn()
    .mockResolvedValue([{ id: teamId, displayName: 'Team A' }]),
}));

const mockSetFormType = jest.fn();
// mock useManuscriptToast hook
jest.mock('../useManuscriptToast', () => {
  const originalModule = jest.requireActual('../useManuscriptToast');
  return {
    ...originalModule,
    useManuscriptToast: jest.fn(() => ({
      setFormType: mockSetFormType,
      eligibilityReasons: [],
    })),
  };
});

const mockGetGeneratedShortDescription =
  getGeneratedShortDescription as jest.MockedFunction<
    typeof getGeneratedShortDescription
  >;

beforeEach(() => {
  jest.resetModules();
  mockSetFormType.mockReset();
  jest.spyOn(console, 'error').mockImplementation();

  history = createMemoryHistory({
    initialEntries: [
      network({}).teams({}).team({ teamId }).workspace({}).createManuscript({})
        .$,
    ],
  });
});

const renderPage = async (
  user: ComponentProps<typeof Auth0Provider>['user'] = {},
  resubmit: boolean = false,
  path: string = network.template +
    network({}).teams.template +
    network({}).teams({}).team.template +
    network({}).teams({}).team({ teamId }).workspace.template +
    network({}).teams({}).team({ teamId }).workspace({}).createManuscript
      .template,
  routerHistory: MemoryHistory = history,
) => {
  const { container } = render(
    <RecoilRoot
      initializeState={({ set }) => {
        set(refreshTeamState(teamId), Math.random());
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={user}>
          <WhenReady>
            <Router history={routerHistory}>
              <Route path={path}>
                <ManuscriptToastProvider>
                  <EligibilityReasonProvider>
                    <TeamManuscript
                      teamId={teamId}
                      resubmitManuscript={resubmit}
                    />
                  </EligibilityReasonProvider>
                </ManuscriptToastProvider>
              </Route>
            </Router>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  return { container };
};

it('renders manuscript form page', async () => {
  const { container } = await renderPage();

  expect(container).toHaveTextContent(
    'Start a new manuscript to receive an itemized compliance report outlining action items for compliance with the ASAP Open Science Policy',
  );
  expect(container).toHaveTextContent('What are you sharing');
  expect(container).toHaveTextContent('Title of Manuscript');
});

it('generates the short description based on the current description', async () => {
  mockGetGeneratedShortDescription.mockResolvedValueOnce({
    shortDescription: 'test generated short description 1',
  });

  await renderPage();

  const descriptionTextbox = screen.getByRole('textbox', {
    name: /Manuscript Description/i,
  });
  userEvent.type(descriptionTextbox, 'Some description');

  await userEvent.click(screen.getByRole('button', { name: 'Generate' }));

  await waitFor(() => {
    expect(mockGetGeneratedShortDescription).toHaveBeenCalledWith(
      'Some description',
      expect.anything(),
    );
    expect(
      screen.getByRole('textbox', { name: /short description/i }),
    ).toHaveValue('test generated short description 1');
  });
});
