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
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps, Suspense, useEffect } from 'react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import {
  getManuscript,
  resubmitManuscript,
  uploadManuscriptFileViaPresignedUrl,
} from '../api';
import { EligibilityReasonProvider } from '../EligibilityReasonProvider';
import { ManuscriptToastProvider } from '../ManuscriptToastProvider';
import { refreshTeamState } from '../state';
import TeamManuscript from '../TeamManuscript';

jest.setTimeout(100_000);

const manuscriptResponse = { id: '1', title: 'The Manuscript' };

const teamId = '42';
const defaultPath = network({})
  .teams({})
  .team({ teamId })
  .workspace({})
  .createManuscript({}).$;

// Helper to capture location in tests
let currentLocation: { pathname: string; search: string } | null = null;
const LocationCapture = () => {
  const location = useLocation();
  useEffect(() => {
    currentLocation = { pathname: location.pathname, search: location.search };
  }, [location]);
  return null;
};

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

beforeEach(() => {
  mockSetFormType.mockReset();
  currentLocation = null;
  jest.spyOn(console, 'error').mockImplementation();
  jest.spyOn(console, 'warn').mockImplementation();
  // Set up mock to return different file responses based on file type
  mockUploadManuscriptFileViaPresignedUrl.mockReset();
  mockUploadManuscriptFileViaPresignedUrl.mockImplementation(
    async (file: File, fileType: string) => {
      // Handle both exact matches and partial matches for file type
      if (fileType === 'Manuscript File' || fileType?.includes('Manuscript')) {
        const result = {
          filename: 'manuscript.pdf',
          url: 'https://example.com/manuscript.pdf',
          id: 'manuscript-file-id',
        };
        return result;
      }
      if (
        fileType === 'Key Resource Table' ||
        fileType?.includes('Key Resource') ||
        fileType?.includes('Resource Table')
      ) {
        const result = {
          filename: 'key-resource-table.csv',
          url: 'https://example.com/key-resource-table.csv',
          id: 'key-resource-table-id',
        };
        return result;
      }
      // Fallback: use the file name from the File object
      const result = {
        filename: file.name,
        url: `https://example.com/${file.name}`,
        id: 'file-id',
      };
      return result;
    },
  );
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
  initialEntries: string[] = [defaultPath],
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
            <MemoryRouter initialEntries={initialEntries}>
              <LocationCapture />
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
                ></Route>
              </Routes>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  await waitFor(
    () => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    },
    { timeout: 10000 },
  );
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

  manuscript.impact = { id: 'impact-id-1', name: 'My Impact' };
  manuscript.categories = [{ id: 'category-id-1', name: 'My Category' }];

  mockGetManuscript.mockResolvedValue(manuscript);
  mockResubmitManuscript.mockResolvedValue(manuscript);

  const resubmitPath = `/network/teams/${teamId}/workspace/resubmit-manuscript/:manuscriptId`;
  const resubmitInitialEntries = [
    `/network/teams/${teamId}/workspace/resubmit-manuscript/${manuscript.id}`,
  ];

  const user = userEvent.setup();

  await renderPage({}, true, resubmitPath, resubmitInitialEntries);

  const urlTextbox = screen.getByRole('textbox', {
    name: /URL/i,
  });
  await user.type(urlTextbox, 'https://example.com/manuscript');

  const lifecycleTextbox = screen.getByRole('combobox', {
    name: /Where is the manuscript in the life cycle/i,
  });

  await user.click(lifecycleTextbox);
  await user.type(lifecycleTextbox, 'Preprint{enter}');

  const preprintDoi = '10.4444/test';

  const preprintDoiTextbox = screen.getByRole('textbox', {
    name: /Preprint DOI/i,
  });

  await user.type(preprintDoiTextbox, preprintDoi);

  // Quick checks
  const quickChecks = screen.getByRole('region', { name: /quick checks/i });
  const yesButtons = within(quickChecks).getAllByRole('radio', { name: 'Yes' });

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
    { timeout: 15000 },
  );

  // Submit
  const submitButton = await screen.findByRole(
    'button',
    {
      name: /Submit/,
    },
    { timeout: 5000 },
  );

  expect(submitButton).toBeEnabled();

  await user.click(submitButton);

  const confirmButton = await screen.findByRole('button', {
    name: /Submit Manuscript/i,
  });

  await user.click(confirmButton);

  await waitFor(() => {
    expect(mockResubmitManuscript).toHaveBeenCalledWith(
      manuscript.id,
      expect.objectContaining({
        versions: [expect.objectContaining({ preprintDoi })],
      }),
      expect.anything(),
    );
  });
  await waitFor(() => {
    expect(currentLocation).not.toBeNull();
    expect(currentLocation?.pathname).toBe(
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
  const resubmitInitialEntries = [
    `/network/teams/${teamId}/workspace/resubmit-manuscript/${manuscript.id}`,
  ];

  await renderPage({}, true, resubmitPath, resubmitInitialEntries);

  const lifecycleTextbox = screen.getByRole('combobox', {
    name: /Where is the manuscript in the life cycle/i,
  });

  await userEvent.click(lifecycleTextbox);
  await userEvent.type(lifecycleTextbox, 'Preprint{enter}');

  const preprintDoi = '10.4444/test';

  const preprintDoiTextbox = screen.getByRole('textbox', {
    name: /Preprint DOI/i,
  });
  await userEvent.type(preprintDoiTextbox, preprintDoi);

  expect(screen.queryByText(/manuscript_1.pdf/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/manuscript_1.csv/i)).not.toBeInTheDocument();
});
