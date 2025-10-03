import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import { network } from '@asap-hub/routing';
import {
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

import { createManuscript } from '../api';
import { EligibilityReasonProvider } from '../EligibilityReasonProvider';
import { ManuscriptToastProvider } from '../ManuscriptToastProvider';
import { refreshTeamState } from '../state';
import TeamManuscript from '../TeamManuscript';

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

it('shows server validation error toast and a message when submitting with duplicate title', async () => {
  const duplicateTitleError = {
    statusCode: 422,
    response: {
      message: 'Title must be unique',
      data: { team: 'ASAP', manuscriptId: 'SC1-000129-005-org-G-1' },
    },
  };

  (createManuscript as jest.Mock).mockRejectedValueOnce(duplicateTitleError);
  const title = 'The Manuscript';

  await renderPage();

  await userEvent.type(
    screen.getByRole('textbox', { name: /title of manuscript/i }),
    title,
  );
  const typeTextbox = screen.getByRole('textbox', {
    name: /Type of Manuscript/i,
  });
  await act(async () => {
    await userEvent.type(typeTextbox, 'Original');
    await userEvent.type(typeTextbox, specialChars.enter);
    typeTextbox.blur();
  });

  const lifecycleTextbox = screen.getByRole('textbox', {
    name: /Where is the manuscript in the life cycle/i,
  });
  await act(async () => {
    await userEvent.type(lifecycleTextbox, 'Typeset proof');
    await userEvent.type(lifecycleTextbox, specialChars.enter);
    lifecycleTextbox.blur();
  });

  const testFile = new File(['file content'], 'file.txt', {
    type: 'text/plain',
  });
  const manuscriptFileInput = screen.getByLabelText(/Upload Manuscript File/i);
  const keyResourceTableInput = screen.getByLabelText(
    /Upload Key Resource Table/i,
  );

  const descriptionTextbox = screen.getByRole('textbox', {
    name: /Manuscript Description/i,
  });
  await userEvent.type(descriptionTextbox, 'Some description');

  const shortDescriptionTextbox = screen.getByRole('textbox', {
    name: /Short Description/i,
  });
  await userEvent.type(shortDescriptionTextbox, 'Some short description');

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

  userEvent.type(screen.getByLabelText(/First Authors/i), 'Jane Doe');

  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
  );

  userEvent.click(screen.getByText(/Non CRN/i));

  expect(screen.getByText(/Jane Doe Email/i)).toBeInTheDocument();
  userEvent.type(screen.getByLabelText(/Jane Doe Email/i), 'jane@doe.com');

  userEvent.upload(manuscriptFileInput, testFile);
  userEvent.upload(keyResourceTableInput, testFile);

  const quickChecks = screen.getByRole('region', { name: /quick checks/i });

  within(quickChecks)
    .getAllByText('Yes')
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

  await userEvent.click(
    screen.getByRole('button', { name: /Submit Manuscript/ }),
  );

  await waitFor(() => {
    expect(mockSetFormType).toHaveBeenCalledWith({
      type: 'server-validation-error',
      accent: 'error',
    });
  });

  expect(
    screen.getAllByText(
      /A manuscript with this title has already been submitted for Team ASAP \(SC1-000129-005-org-G-1\)./i,
    ).length,
  ).toBeGreaterThan(0);
});
