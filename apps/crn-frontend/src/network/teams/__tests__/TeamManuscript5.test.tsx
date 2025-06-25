import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import { createManuscriptResponse } from '@asap-hub/fixtures';
import { AuthorResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import {
  cleanup,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
  act,
} from '@testing-library/react';
import userEvent, { specialChars } from '@testing-library/user-event';
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

jest.mock('../../../shared-api/impact', () => ({
  getImpacts: jest
    .fn()
    .mockResolvedValue({ items: [{ id: 'impact-id-1', name: 'My Impact' }] }),
}));

jest.mock('../../../shared-api/category', () => ({
  getCategories: jest.fn().mockResolvedValue({
    items: [{ id: 'category-id-1', name: 'My Category' }],
  }),
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
  mockSetFormType.mockReset();
  jest.spyOn(console, 'error').mockImplementation();

  history = createMemoryHistory({
    initialEntries: [
      network({}).teams({}).team({ teamId }).workspace({}).createManuscript({})
        .$,
    ],
  });
});

afterEach(cleanup);

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

it('can resubmit a manuscript and navigates to team workspace', async () => {
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

  const urlTextbox = screen.getByRole('textbox', {
    name: /URL/i,
  });
  await userEvent.type(urlTextbox, 'https://example.com/manuscript');

  const lifecycleTextbox = screen.getByRole('textbox', {
    name: /Where is the manuscript in the life cycle/i,
  });

  await userEvent.type(lifecycleTextbox, 'Preprint');
  await act(async () => {
    await userEvent.type(lifecycleTextbox, specialChars.enter);
    lifecycleTextbox.blur();
  });

  const preprintDoi = '10.4444/test';

  const preprintDoiTextbox = screen.getByRole('textbox', {
    name: /Preprint DOI/i,
  });

  await userEvent.type(preprintDoiTextbox, preprintDoi);

  const testFile = new File(['file content'], 'file.txt', {
    type: 'text/plain',
  });
  const manuscriptFileInput = screen.getByLabelText(/Upload Manuscript File/i);
  const keyResourceTableInput = screen.getByLabelText(
    /Upload Key Resource Table/i,
  );

  userEvent.upload(manuscriptFileInput, testFile);
  userEvent.upload(keyResourceTableInput, testFile);

  const impactInput = screen.getByRole('textbox', {
    name: /Impact/i,
  });
  await userEvent.type(impactInput, 'My Imp');
  await userEvent.click(screen.getByText(/^My Impact$/i));

  const categoryInput = screen.getByRole('textbox', {
    name: /Category/i,
  });
  await userEvent.type(categoryInput, 'My Cat');
  await userEvent.click(screen.getByText(/^My Category$/i));

  const quickChecks = screen.getByRole('region', { name: /quick checks/i });

  within(quickChecks)
    .getAllByRole('radio', { name: 'Yes' })
    .forEach((button) => {
      userEvent.click(button);
    });

  await waitFor(() => {
    const submitButton = screen.getByRole('button', { name: /Submit/ });
    expect(submitButton).toBeEnabled();
  });
  userEvent.click(screen.getByRole('button', { name: /Submit/ }));

  await waitFor(() => {
    const confirmButton = screen.getByRole('button', {
      name: /Submit Manuscript/i,
    });
    expect(confirmButton).toBeEnabled();
  });
  userEvent.click(screen.getByRole('button', { name: /Submit Manuscript/i }));

  await waitFor(() => {
    expect(mockResubmitManuscript).toHaveBeenCalledWith(
      manuscript.id,
      expect.objectContaining({
        versions: [expect.objectContaining({ preprintDoi })],
      }),
      expect.anything(),
    );
    expect(resubmitHistory.location.pathname).toBe(
      `/network/teams/${teamId}/workspace`,
    );
  });
});

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

  const lifecycleTextbox = screen.getByRole('textbox', {
    name: /Where is the manuscript in the life cycle/i,
  });

  userEvent.type(lifecycleTextbox, 'Preprint');
  userEvent.type(lifecycleTextbox, specialChars.enter);
  lifecycleTextbox.blur();

  const preprintDoi = '10.4444/test';

  const preprintDoiTextbox = screen.getByRole('textbox', {
    name: /Preprint DOI/i,
  });
  userEvent.type(preprintDoiTextbox, preprintDoi);

  expect(screen.queryByText(/manuscript_1.pdf/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/manuscript_1.csv/i)).not.toBeInTheDocument();
});
