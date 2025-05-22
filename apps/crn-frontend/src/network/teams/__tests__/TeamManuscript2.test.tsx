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
} from '@testing-library/react';
import userEvent, { specialChars } from '@testing-library/user-event';
import { createMemoryHistory, MemoryHistory } from 'history';
import { ComponentProps, Suspense } from 'react';
import { Route, Router } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { createManuscript } from '../api';
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

it('can publish a form when the data is valid and navigates to team workspace', async () => {
  mockGetGeneratedShortDescription.mockResolvedValueOnce({
    shortDescription: 'Some short description',
  });

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

  const shortDescriptionTextbox = screen.getByRole('textbox', {
    name: /Short Description/i,
  });
  userEvent.type(shortDescriptionTextbox, 'Some short description');

  userEvent.type(screen.getByLabelText(/First Authors/i), 'Jane Doe');

  await waitFor(() =>
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
  );

  userEvent.click(screen.getByText(/Non CRN/i));

  expect(screen.getByText(/Jane Doe Email/i)).toBeInTheDocument();
  userEvent.type(screen.getByLabelText(/Jane Doe Email/i), 'jane@doe.com');
  userEvent.type(screen.getByLabelText(/Jane Doe Email/i), specialChars.enter);

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
    // expect setFormType to be called with successLarge
    expect(mockSetFormType).toHaveBeenCalledWith({
      type: '',
      accent: 'successLarge',
    });
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
            shortDescription: 'Some short description',
            firstAuthors: [
              {
                externalAuthorEmail: 'jane@doe.com',
                externalAuthorName: 'Jane Doe',
                externalAuthorId: undefined,
              },
            ],
            additionalAuthors: [],
            additionalFiles: undefined,
            correspondingAuthor: undefined,
            otherDetails: undefined,
            preprintDoi: undefined,
            publicationDoi: undefined,
          },
        ],
        notificationList: '',
      },
      expect.anything(),
    );
    expect(history.location.pathname).toBe(
      `/network/teams/${teamId}/workspace`,
    );
  });
});
