import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import { createManuscriptResponse } from '@asap-hub/fixtures';
import { AuthorResponse } from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import {
  act,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '@testing-library/react';
import userEvent, { specialChars } from '@testing-library/user-event';
import { createMemoryHistory, MemoryHistory } from 'history';
import { ComponentProps, Suspense } from 'react';
import { Route, Router } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { createManuscript, getManuscript, resubmitManuscript } from '../api';
import { EligibilityReasonProvider } from '../EligibilityReasonProvider';
import { ManuscriptToastProvider } from '../ManuscriptToastProvider';
import { refreshTeamState } from '../state';
import TeamManuscript from '../TeamManuscript';

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
  uploadManuscriptFile: jest.fn().mockResolvedValue({
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

beforeEach(() => {
  jest.resetModules();

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

it('can publish a form when the data is valid and navigates to team workspace', async () => {
  const title = 'The Manuscript';

  await renderPage();

  userEvent.type(
    screen.getByRole('textbox', { name: /title of manuscript/i }),
    title,
  );
  const typeTextbox = screen.getByRole('textbox', {
    name: /Type of Manuscript/i,
  });
  userEvent.type(typeTextbox, 'Original');
  userEvent.type(typeTextbox, specialChars.enter);
  typeTextbox.blur();

  const lifecycleTextbox = screen.getByRole('textbox', {
    name: /Where is the manuscript in the life cycle/i,
  });
  userEvent.type(lifecycleTextbox, 'Typeset proof');
  userEvent.type(lifecycleTextbox, specialChars.enter);
  lifecycleTextbox.blur();

  const apcCoverage = screen.getByRole('group', {
    name: /Will you be requesting APC coverage/i,
  });

  userEvent.click(within(apcCoverage).getByRole('radio', { name: /no/i }));

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
  userEvent.type(descriptionTextbox, 'Some description');

  userEvent.type(screen.getByLabelText(/First Authors/i), 'Jane Doe');

  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
  );

  userEvent.click(screen.getByText(/Non CRN/i));

  expect(screen.getByText(/Jane Doe Email/i)).toBeInTheDocument();
  userEvent.type(screen.getByLabelText(/Jane Doe Email/i), 'jane@doe.com');

  userEvent.upload(manuscriptFileInput, testFile);
  userEvent.upload(keyResourceTableInput, testFile);

  const submitButton = screen.getByRole('button', { name: /Submit/ });

  await waitFor(() => {
    expect(submitButton).toBeEnabled();
  });

  const quickChecks = screen.getByRole('region', { name: /quick checks/i });

  within(quickChecks)
    .getAllByText('Yes')
    .forEach((button) => {
      userEvent.click(button);
    });

  await act(async () => {
    await userEvent.click(
      await screen.findByRole('button', { name: /Submit/ }),
    );
  });

  await userEvent.click(
    screen.getByRole('button', { name: /Submit Manuscript/ }),
  );

  await waitFor(() => {
    expect(createManuscript).toHaveBeenCalledWith(
      {
        title,
        teamId,
        eligibilityReasons: [],
        versions: [
          {
            lifecycle: 'Typeset proof',
            type: 'Original Research',
            manuscriptFile: {
              filename: 'manuscript.pdf',
              url: 'https://example.com/manuscript.pdf',
              id: 'file-id',
            },
            keyResourceTable: {
              filename: 'manuscript.pdf',
              url: 'https://example.com/manuscript.pdf',
              id: 'file-id',
            },
            requestingApcCoverage: 'No',
            acknowledgedGrantNumber: 'Yes',
            asapAffiliationIncluded: 'Yes',
            manuscriptLicense: 'Yes',
            datasetsDeposited: 'Yes',
            codeDeposited: 'Yes',
            protocolsDeposited: 'Yes',
            labMaterialsRegistered: 'Yes',
            availabilityStatement: 'Yes',
            acknowledgedGrantNumberDetails: '',
            asapAffiliationIncludedDetails: '',
            manuscriptLicenseDetails: '',
            datasetsDepositedDetails: '',
            codeDepositedDetails: '',
            protocolsDepositedDetails: '',
            labMaterialsRegisteredDetails: '',
            availabilityStatementDetails: '',

            teams: ['42'],
            labs: [],
            description: 'Some description',
            firstAuthors: [
              {
                externalAuthorEmail: 'jane@doe.com',
                externalAuthorName: 'Jane Doe',
              },
            ],
            additionalAuthors: [],
          },
        ],
      },
      expect.anything(),
    );
    expect(history.location.pathname).toBe(
      `/network/teams/${teamId}/workspace`,
    );
  });
}, 180_000);

it('shows duplicate manuscript toast when submitting with duplicate title', async () => {
  const duplicateTitleError = {
    statusCode: 422,
    response: {
      errors: [
        {
          path: ['versions', 'title'],
          name: 'unique',
          details: 'Title must be unique',
          value: 'The Manuscript',
        },
      ],
      message: 'Validation Error',
    },
  };

  (createManuscript as jest.Mock).mockRejectedValueOnce(duplicateTitleError);
  const title = 'The Manuscript';

  await renderPage();

  userEvent.type(
    screen.getByRole('textbox', { name: /title of manuscript/i }),
    title,
  );
  const typeTextbox = screen.getByRole('textbox', {
    name: /Type of Manuscript/i,
  });
  userEvent.type(typeTextbox, 'Original');
  userEvent.type(typeTextbox, specialChars.enter);
  typeTextbox.blur();

  const lifecycleTextbox = screen.getByRole('textbox', {
    name: /Where is the manuscript in the life cycle/i,
  });
  userEvent.type(lifecycleTextbox, 'Typeset proof');
  userEvent.type(lifecycleTextbox, specialChars.enter);
  lifecycleTextbox.blur();

  const apcCoverage = screen.getByRole('group', {
    name: /Will you be requesting APC coverage/i,
  });

  userEvent.click(within(apcCoverage).getByRole('radio', { name: /no/i }));

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
  userEvent.type(descriptionTextbox, 'Some description');

  userEvent.type(screen.getByLabelText(/First Authors/i), 'Jane Doe');

  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
  );

  userEvent.click(screen.getByText(/Non CRN/i));

  expect(screen.getByText(/Jane Doe Email/i)).toBeInTheDocument();
  userEvent.type(screen.getByLabelText(/Jane Doe Email/i), 'jane@doe.com');

  userEvent.upload(manuscriptFileInput, testFile);
  userEvent.upload(keyResourceTableInput, testFile);

  const submitButton = screen.getByRole('button', { name: /Submit/ });

  await waitFor(() => {
    expect(submitButton).toBeEnabled();
  });

  const quickChecks = screen.getByRole('region', { name: /quick checks/i });

  within(quickChecks)
    .getAllByText('Yes')
    .forEach((button) => {
      userEvent.click(button);
    });

  await act(async () => {
    await userEvent.click(
      await screen.findByRole('button', { name: /Submit/ }),
    );
  });

  await userEvent.click(
    screen.getByRole('button', { name: /Submit Manuscript/ }),
  );

  await waitFor(() => {
    expect(
      screen.getByText('A manuscript with the same title already exists'),
    ).toBeInTheDocument();
  });
}, 180_000);

it('shows default error toast when submitting with any other error', async () => {
  const genericError = {
    statusCode: 500,
    response: {
      message: 'Internal Server Error',
    },
  };

  (createManuscript as jest.Mock).mockRejectedValueOnce(genericError);
  const title = 'The Manuscript';

  await renderPage();

  userEvent.type(
    screen.getByRole('textbox', { name: /title of manuscript/i }),
    title,
  );
  const typeTextbox = screen.getByRole('textbox', {
    name: /Type of Manuscript/i,
  });
  userEvent.type(typeTextbox, 'Original');
  userEvent.type(typeTextbox, specialChars.enter);
  typeTextbox.blur();

  const lifecycleTextbox = screen.getByRole('textbox', {
    name: /Where is the manuscript in the life cycle/i,
  });
  userEvent.type(lifecycleTextbox, 'Typeset proof');
  userEvent.type(lifecycleTextbox, specialChars.enter);
  lifecycleTextbox.blur();

  const apcCoverage = screen.getByRole('group', {
    name: /Will you be requesting APC coverage/i,
  });

  userEvent.click(within(apcCoverage).getByRole('radio', { name: /no/i }));

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
  userEvent.type(descriptionTextbox, 'Some description');

  userEvent.type(screen.getByLabelText(/First Authors/i), 'Jane Doe');

  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
  );

  userEvent.click(screen.getByText(/Non CRN/i));

  expect(screen.getByText(/Jane Doe Email/i)).toBeInTheDocument();
  userEvent.type(screen.getByLabelText(/Jane Doe Email/i), 'jane@doe.com');

  userEvent.upload(manuscriptFileInput, testFile);
  userEvent.upload(keyResourceTableInput, testFile);

  const submitButton = screen.getByRole('button', { name: /Submit/ });

  await waitFor(() => {
    expect(submitButton).toBeEnabled();
  });

  const quickChecks = screen.getByRole('region', { name: /quick checks/i });

  within(quickChecks)
    .getAllByText('Yes')
    .forEach((button) => {
      userEvent.click(button);
    });

  await act(async () => {
    await userEvent.click(
      await screen.findByRole('button', { name: /Submit/ }),
    );
  });

  await userEvent.click(
    screen.getByRole('button', { name: /Submit Manuscript/ }),
  );

  await waitFor(() => {
    expect(
      screen.getByText('An error has occurred. Please try again later.'),
    ).toBeInTheDocument();
  });
}, 180_000);

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

  const preprintDoi = '10.4444/test';

  const preprintDoiTextbox = screen.getByRole('textbox', {
    name: /Preprint DOI/i,
  });
  userEvent.type(preprintDoiTextbox, preprintDoi);

  await act(async () => {
    userEvent.click(await screen.findByRole('button', { name: /Submit/ }));
  });

  userEvent.click(screen.getByRole('button', { name: /Submit Manuscript/ }));

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
