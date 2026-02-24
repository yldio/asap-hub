import { Suspense } from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { projects } from '@asap-hub/routing';

import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { ManuscriptToastProvider } from '../../network/teams/ManuscriptToastProvider';
import { EligibilityReasonProvider } from '../../network/teams/EligibilityReasonProvider';
import ProjectManuscript from '../ProjectManuscript';

jest.setTimeout(60000);

const projectId = 'proj-1';

jest.mock('../../network/teams/state', () => ({
  useManuscriptById: jest.fn(() => [undefined, jest.fn()]),
  usePostManuscript: jest.fn(() => jest.fn().mockResolvedValue({})),
  usePutManuscript: jest.fn(() => jest.fn().mockResolvedValue({})),
  useResubmitManuscript: jest.fn(() => jest.fn().mockResolvedValue({})),
  useUploadManuscriptFileViaPresignedUrl: jest
    .fn()
    .mockReturnValue(jest.fn().mockResolvedValue({ id: 'file-1' })),
}));

jest.mock('../../shared-state', () => ({
  useTeamSuggestions: jest.fn(() => jest.fn().mockResolvedValue([])),
  useLabSuggestions: jest.fn(() => jest.fn().mockResolvedValue([])),
  useAuthorSuggestions: jest.fn(() => jest.fn().mockResolvedValue([])),
  useGeneratedContent: jest.fn(() => jest.fn().mockResolvedValue('')),
  useImpactSuggestions: jest.fn(() => jest.fn().mockResolvedValue([])),
  useCategorySuggestions: jest.fn(() => jest.fn().mockResolvedValue([])),
}));

const mockSetFormType = jest.fn();
jest.mock('../useManuscriptToast', () => ({
  useManuscriptToast: jest.fn(() => ({
    setFormType: mockSetFormType,
  })),
}));

jest.mock('../useEligibilityReason', () => ({
  useEligibilityReason: jest.fn(() => ({
    eligibilityReasons: new Set(),
  })),
}));

beforeEach(() => {
  mockSetFormType.mockReset();
  jest.spyOn(console, 'error').mockImplementation();
});

afterEach(() => {
  jest.restoreAllMocks();
});

const renderPage = async (
  projectType: 'discovery' | 'resource' | 'trainee' = 'discovery',
  resubmit = false,
) => {
  const routeTemplate =
    projects.template +
    projects({}).discoveryProjects.template +
    projects({}).discoveryProjects({}).discoveryProject.template +
    projects({}).discoveryProjects({}).discoveryProject({ projectId }).workspace
      .template +
    projects({})
      .discoveryProjects({})
      .discoveryProject({ projectId })
      .workspace({}).createManuscript.template;

  const initialEntry = projects({})
    .discoveryProjects({})
    .discoveryProject({ projectId })
    .workspace({})
    .createManuscript({}).$;

  const router = createMemoryRouter(
    [
      {
        path: routeTemplate,
        element: (
          <ManuscriptToastProvider>
            <EligibilityReasonProvider>
              <ProjectManuscript
                projectId={projectId}
                projectType={projectType}
                resubmitManuscript={resubmit}
              />
            </EligibilityReasonProvider>
          </ManuscriptToastProvider>
        ),
      },
    ],
    { initialEntries: [initialEntry] },
  );

  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <RouterProvider router={router} />
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );

  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });
};

describe('ProjectManuscript', () => {
  it('renders the manuscript form page', async () => {
    await renderPage();
    await waitFor(() => {
      expect(screen.getByText(/what are you sharing/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Title of Manuscript/i)).toBeInTheDocument();
  });

  it('renders resubmit header in resubmit mode', async () => {
    await renderPage('discovery', true);
    await waitFor(() => {
      expect(
        screen.getByText(/Submit Revised Manuscript/i),
      ).toBeInTheDocument();
    });
  });
});
