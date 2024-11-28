import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
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
import { createMemoryHistory } from 'history';
import { ComponentProps, Suspense } from 'react';
import { Route, Router } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { createManuscript } from '../api';
import { EligibilityReasonProvider } from '../EligibilityReasonProvider';
import { ManuscriptToastProvider } from '../ManuscriptToastProvider';
import { refreshTeamState } from '../state';
import TeamManuscript from '../TeamManuscript';

const manuscriptResponse = { id: '1', title: 'The Manuscript' };

const teamId = '42';
const history = createMemoryHistory({
  initialEntries: [
    network({}).teams({}).team({ teamId }).workspace({}).createManuscript({}).$,
  ],
});

jest.mock('../../users/api');

jest.mock('../api', () => ({
  createManuscript: jest.fn().mockResolvedValue(manuscriptResponse),
  getManuscript: jest.fn().mockResolvedValue(null),
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
});

const renderPage = async (
  user: ComponentProps<typeof Auth0Provider>['user'] = {},
) => {
  const path =
    network.template +
    network({}).teams.template +
    network({}).teams({}).team.template +
    network({}).teams({}).team({ teamId }).workspace.template +
    network({}).teams({}).team({ teamId }).workspace({}).createManuscript
      .template;

  const { container } = render(
    <RecoilRoot
      initializeState={({ set }) => {
        set(refreshTeamState(teamId), Math.random());
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={user}>
          <WhenReady>
            <Router history={history}>
              <Route path={path}>
                <ManuscriptToastProvider>
                  <EligibilityReasonProvider>
                    <TeamManuscript teamId={teamId} />
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
