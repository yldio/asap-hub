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
import userEvent from '@testing-library/user-event';
import { ComponentProps, Suspense } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { createManuscript, uploadManuscriptFileViaPresignedUrl } from '../api';
import { EligibilityReasonProvider } from '../EligibilityReasonProvider';
import { ManuscriptToastProvider } from '../ManuscriptToastProvider';
import { getGeneratedShortDescription } from '../../../shared-api/content-generator';
import { refreshTeamState } from '../state';
import TeamManuscript from '../TeamManuscript';

jest.mock('../../../shared-api/content-generator');

jest.setTimeout(100_000);

const manuscriptResponse = { id: '1', title: 'The Manuscript' };

const teamId = '42';

jest.mock('../../users/api');

jest.mock('../api', () => ({
  createManuscript: jest.fn().mockResolvedValue(manuscriptResponse),
  getManuscript: jest.fn().mockResolvedValue(null),
  resubmitManuscript: jest.fn().mockResolvedValue(null),
  uploadManuscriptFileViaPresignedUrl: jest.fn(),
  getTeam: jest.fn().mockResolvedValue({ id: teamId, displayName: 'Team A' }),
  getLabs: jest.fn().mockResolvedValue([{ id: 'lab-1', name: 'Lab 1' }]),
  getTeams: jest
    .fn()
    .mockResolvedValue([{ id: teamId, displayName: 'Team A' }]),
}));

// Get reference to the mock after jest.mock has run
const mockUploadManuscriptFileViaPresignedUrl =
  uploadManuscriptFileViaPresignedUrl as jest.MockedFunction<
    typeof uploadManuscriptFileViaPresignedUrl
  >;

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

const mockGetGeneratedShortDescription =
  getGeneratedShortDescription as jest.MockedFunction<
    typeof getGeneratedShortDescription
  >;

beforeEach(() => {
  mockSetFormType.mockReset();
  jest.spyOn(console, 'error').mockImplementation();
  jest.spyOn(console, 'warn').mockImplementation();
  // Set up mock to return different file responses based on file type
  mockUploadManuscriptFileViaPresignedUrl.mockReset();
  mockUploadManuscriptFileViaPresignedUrl.mockImplementation(
    async (file: File, fileType: string) => {
      if (fileType === 'Manuscript File') {
        return {
          filename: 'manuscript.pdf',
          url: 'https://example.com/manuscript.pdf',
          id: 'manuscript-file-id',
        };
      }
      if (fileType === 'Key Resource Table') {
        return {
          filename: 'key-resource-table.csv',
          url: 'https://example.com/key-resource-table.csv',
          id: 'key-resource-table-id',
        };
      }
      return {
        filename: file.name,
        url: `https://example.com/${file.name}`,
        id: 'file-id',
      };
    },
  );
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
            <MemoryRouter
              initialEntries={[
                network({})
                  .teams({})
                  .team({ teamId })
                  .workspace({})
                  .createManuscript({}).$,
              ]}
            >
              <Routes>
                <Route
                  path={path}
                  element={
                    <ManuscriptToastProvider>
                      <EligibilityReasonProvider>
                        <TeamManuscript
                          teamId={teamId}
                          resubmitManuscript={resubmit}
                        />
                      </EligibilityReasonProvider>
                    </ManuscriptToastProvider>
                  }
                />
              </Routes>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
  return { container };
};

it('shows server validation error toast and a message when submitting with duplicate title', async () => {
  mockGetGeneratedShortDescription.mockResolvedValueOnce({
    shortDescription: 'Some short description',
  });

  const duplicateTitleError = {
    statusCode: 422,
    response: {
      message: 'Title must be unique',
      data: { team: 'ASAP', manuscriptId: 'SC1-000129-005-org-G-1' },
    },
  };

  (createManuscript as jest.Mock).mockRejectedValueOnce(duplicateTitleError);
  const title = 'The Manuscript';
  const user = userEvent.setup();

  await renderPage();

  // Title of manuscript
  const titleInput = await screen.findByRole('textbox', {
    name: /title of manuscript/i,
  });
  await user.type(titleInput, title);
  // Type of manuscript
  const typeTextbox = screen.getByRole('combobox', {
    name: /Type of Manuscript/i,
  });
  await user.click(typeTextbox);
  await user.type(typeTextbox, 'Original{enter}');

  // Lifecycle
  const lifecycleTextbox = screen.getByRole('combobox', {
    name: /Where is the manuscript in the life cycle/i,
  });
  await user.click(lifecycleTextbox);
  await user.type(lifecycleTextbox, 'Typeset{enter}');

  // Description and short description
  await user.type(
    screen.getByRole('textbox', { name: /Manuscript Description/i }),
    'Some description',
  );
  await user.type(
    screen.getByRole('textbox', { name: /Short Description/i }),
    'Some short description',
  );

  // Impact and category
  const impactInput = screen.getByRole('combobox', { name: /Impact/i });
  await user.type(impactInput, 'My Imp');
  await user.click(await screen.findByText(/^My Impact$/i));

  const categoryInput = screen.getByRole('combobox', { name: /Category/i });
  await user.type(categoryInput, 'My Cat');
  await user.click(await screen.findByText(/^My Category$/i));

  // First authors
  await user.type(screen.getByLabelText(/First Authors/i), 'Jane Doe');

  // External author email
  await user.click(screen.getByText(/Non CRN/i));
  await user.type(
    screen.getByLabelText(/Jane Doe Email/i),
    'jane@doe.com{enter}',
  );

  // Quick checks
  const quickChecks = screen.getByRole('region', { name: /quick checks/i });
  const yesButtons = within(quickChecks).getAllByText('Yes');

  await Promise.all(
    yesButtons.map((button: HTMLElement) => user.click(button)),
  );

  // Upload files after quick checks are filled
  const manuscriptFile = new File(['manuscript content'], 'manuscript.pdf', {
    type: 'application/pdf',
  });
  const keyResourceTableFile = new File(
    ['key,resource,table'],
    'key-resource-table.csv',
    {
      type: 'text/csv',
    },
  );
  const manuscriptFileInput = screen.getByLabelText(/Upload Manuscript File/i);
  const keyResourceTableInput = screen.getByLabelText(
    /Upload Key Resource Table/i,
  );

  // Upload manuscript file and wait for upload to complete
  await user.upload(manuscriptFileInput, manuscriptFile);

  // Upload key resource table file and wait for upload to complete
  await user.upload(keyResourceTableInput, keyResourceTableFile);

  await waitFor(
    () => {
      expect(screen.getByText('key-resource-table.csv')).toBeInTheDocument();
      expect(screen.getByText('manuscript.pdf')).toBeInTheDocument();
    },
    { timeout: 10000 },
  );

  // Submit
  const submitButton = await screen.findByRole('button', {
    name: /Submit/,
  });

  expect(submitButton).toBeEnabled();

  await user.click(submitButton);

  const confirmButton = await screen.findByRole('button', {
    name: /Submit Manuscript/i,
  });

  await user.click(confirmButton);

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
