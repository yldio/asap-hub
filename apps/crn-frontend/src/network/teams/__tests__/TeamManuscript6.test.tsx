import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import { createManuscriptResponse } from '@asap-hub/fixtures';
import { AuthorResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory, MemoryHistory } from 'history';
import { ComponentProps, Suspense } from 'react';
import { Route, Router } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { getManuscript, resubmitManuscript } from '../api';
import { EligibilityReasonProvider } from '../EligibilityReasonProvider';
import { ManuscriptToastProvider } from '../ManuscriptToastProvider';
import { refreshTeamState } from '../state';
import TeamManuscript from '../TeamManuscript';

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

it('files are not prefilled on manuscript resubmit', async () => {
  const mockResubmitManuscript = resubmitManuscript as jest.MockedFunction<
    typeof resubmitManuscript
  >;
  const mockGetManuscript = getManuscript as jest.MockedFunction<
    typeof getManuscript
  >;

  const manuscript = createManuscriptResponse();
  manuscript.versions[0]!.lifecycle = 'Preprint';
  manuscript.versions[0]!.firstAuthors = [
    {
      label: 'Author 1',
      value: 'author-1',
      id: 'author-1',
      displayName: 'Author 1',
      email: 'author@email.com',
    } as AuthorResponse,
  ];

  mockGetManuscript.mockResolvedValue(manuscript);
  mockResubmitManuscript.mockResolvedValue(manuscript);

  const resubmitPath = `/network/teams/${teamId}/workspace/resubmit-manuscript/:manuscriptId`;
  const resubmitHistory = createMemoryHistory({
    initialEntries: [
      `/network/teams/${teamId}/workspace/resubmit-manuscript/${manuscript.id}`,
    ],
  });

  await renderPage({}, true, resubmitPath, resubmitHistory);

  const preprintDoi = '10.4444/test';

  const preprintDoiTextbox = screen.getByRole('textbox', {
    name: /Preprint DOI/i,
  });
  userEvent.type(preprintDoiTextbox, preprintDoi);

  expect(screen.queryByText(/manuscript_1.pdf/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/manuscript_1.csv/i)).not.toBeInTheDocument();
});
