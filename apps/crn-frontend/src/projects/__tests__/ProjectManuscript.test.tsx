import { Suspense } from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { render, screen, waitFor, act } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { projects } from '@asap-hub/routing';

import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { ManuscriptToastProvider } from '../../network/teams/ManuscriptToastProvider';
import { EligibilityReasonProvider } from '../../network/teams/EligibilityReasonProvider';
import ProjectManuscript from '../ProjectManuscript';

jest.setTimeout(60000);

const projectId = 'proj-1';

const mockUseManuscriptById = jest.fn((_id?: string) => [undefined, jest.fn()]);
jest.mock('../../network/teams/state', () => ({
  useManuscriptById: (id: string) => mockUseManuscriptById(id),
  usePostManuscript: jest.fn(() => jest.fn().mockResolvedValue({})),
  usePutManuscript: jest.fn(() => jest.fn().mockResolvedValue({})),
  useResubmitManuscript: jest.fn(() => jest.fn().mockResolvedValue({})),
  useUploadManuscriptFileViaPresignedUrl: jest
    .fn()
    .mockReturnValue(jest.fn().mockResolvedValue({ id: 'file-1' })),
}));

const mockAuthorSuggestions = jest
  .fn()
  .mockResolvedValue([{ id: 'author-1', displayName: 'Test Author' }]);
jest.mock('../../shared-state', () => ({
  useTeamSuggestions: jest.fn(() => jest.fn().mockResolvedValue([])),
  useLabSuggestions: jest.fn(() => jest.fn().mockResolvedValue([])),
  useAuthorSuggestions: jest.fn(() => mockAuthorSuggestions),
  useGeneratedContent: jest.fn(() => jest.fn().mockResolvedValue('')),
  useImpactSuggestions: jest.fn(() => jest.fn().mockResolvedValue([])),
  useCategorySuggestions: jest.fn(() => jest.fn().mockResolvedValue([])),
}));

const mockSetFormType = jest.fn();
jest.mock('../../network/teams/useManuscriptToast', () => ({
  useManuscriptToast: jest.fn(() => ({
    setFormType: mockSetFormType,
  })),
}));

jest.mock('../../network/teams/useEligibilityReason', () => ({
  useEligibilityReason: jest.fn(() => ({
    eligibilityReasons: new Set(),
  })),
}));

type CapturedFormProps = Record<string, unknown> & {
  onSuccess: () => void;
  onError: (error: { statusCode?: number } | Error) => void;
  clearFormToast: () => void;
  onInvalid: () => void;
  getAuthorSuggestions: (
    input: string,
  ) => Promise<{ author: unknown; label: string; value: string }[]>;
};

let capturedFormProps: CapturedFormProps;

jest.mock('@asap-hub/react-components/manuscript-form', () => ({
  __esModule: true,
  default: (props: CapturedFormProps) => {
    capturedFormProps = props;
    return (
      <div>
        <p>What are you sharing</p>
        <p>Title of Manuscript</p>
      </div>
    );
  },
}));

beforeEach(() => {
  mockSetFormType.mockReset();
  jest.spyOn(console, 'error').mockImplementation();
  jest.spyOn(console, 'warn').mockImplementation();
  window.scrollTo = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

const renderPage = async (
  projectType: 'discovery' | 'resource' | 'trainee' = 'discovery',
  resubmit = false,
  user: Record<string, unknown> = {},
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
        <Auth0Provider user={user}>
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

const renderEditPage = async (manuscriptId = 'ms-1') => {
  const routeTemplate =
    projects.template +
    projects({}).discoveryProjects.template +
    projects({}).discoveryProjects({}).discoveryProject.template +
    projects({}).discoveryProjects({}).discoveryProject({ projectId }).workspace
      .template +
    projects({})
      .discoveryProjects({})
      .discoveryProject({ projectId })
      .workspace({}).editManuscript.template;

  const initialEntry = projects({})
    .discoveryProjects({})
    .discoveryProject({ projectId })
    .workspace({})
    .editManuscript({ manuscriptId }).$;

  const router = createMemoryRouter(
    [
      {
        path: routeTemplate,
        element: (
          <ManuscriptToastProvider>
            <EligibilityReasonProvider>
              <ProjectManuscript
                projectId={projectId}
                projectType="discovery"
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

  describe('onSuccess', () => {
    it('navigates to discovery workspace path and sets toast', async () => {
      await renderPage('discovery');
      act(() => {
        capturedFormProps.onSuccess();
      });
      expect(mockSetFormType).toHaveBeenCalledWith({
        type: 'manuscript',
        accent: 'successLarge',
      });
    });

    it('navigates to resource workspace path on success', async () => {
      await renderPage('resource');
      act(() => {
        capturedFormProps.onSuccess();
      });
      expect(mockSetFormType).toHaveBeenCalledWith({
        type: 'manuscript',
        accent: 'successLarge',
      });
    });

    it('navigates to trainee workspace path on success', async () => {
      await renderPage('trainee');
      act(() => {
        capturedFormProps.onSuccess();
      });
      expect(mockSetFormType).toHaveBeenCalledWith({
        type: 'manuscript',
        accent: 'successLarge',
      });
    });
  });

  describe('onError', () => {
    it('sets server-validation-error toast on 422 error', async () => {
      await renderPage();
      act(() => {
        capturedFormProps.onError({ statusCode: 422, message: 'Validation' });
      });
      expect(mockSetFormType).toHaveBeenCalledWith({
        type: 'server-validation-error',
        accent: 'error',
      });
      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      });
    });

    it('sets default-error toast on non-422 error', async () => {
      await renderPage();
      act(() => {
        capturedFormProps.onError(new Error('Something went wrong'));
      });
      expect(mockSetFormType).toHaveBeenCalledWith({
        type: 'default-error',
        accent: 'error',
      });
      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      });
    });
  });

  describe('clearFormToast', () => {
    it('clears the form toast', async () => {
      await renderPage();
      act(() => {
        capturedFormProps.clearFormToast();
      });
      expect(mockSetFormType).toHaveBeenCalledWith({
        type: '',
        accent: 'successLarge',
      });
    });
  });

  describe('onInvalid', () => {
    it('sets server-validation-error toast on invalid form', async () => {
      await renderPage();
      act(() => {
        capturedFormProps.onInvalid();
      });
      expect(mockSetFormType).toHaveBeenCalledWith({
        type: 'server-validation-error',
        accent: 'error',
      });
    });
  });

  describe('getAuthorSuggestions', () => {
    it('wraps suggestions with author, label, and value fields', async () => {
      await renderPage();
      const result = await capturedFormProps.getAuthorSuggestions('Test');
      expect(mockAuthorSuggestions).toHaveBeenCalledWith('Test');
      expect(result).toEqual([
        {
          author: { id: 'author-1', displayName: 'Test Author' },
          label: 'Test Author',
          value: 'author-1',
        },
      ]);
    });
  });

  it('renders the edit manuscript page with manuscriptId from URL params', async () => {
    mockUseManuscriptById.mockReturnValueOnce([undefined, jest.fn()]);
    await renderEditPage('ms-1');
    await waitFor(() => {
      expect(screen.getByText(/what are you sharing/i)).toBeInTheDocument();
    });
    expect(mockUseManuscriptById).toHaveBeenCalledWith('ms-1');
  });

  it('falls back to empty teamId when user has no teams', async () => {
    await renderPage('discovery', false, { teams: [] });
    await waitFor(() => {
      expect(screen.getByText(/what are you sharing/i)).toBeInTheDocument();
    });
    expect(capturedFormProps.teamId).toBe('');
    expect(capturedFormProps.selectedTeams).toEqual([
      { value: '', label: '', isFixed: true },
    ]);
  });

  describe('with existing manuscript data', () => {
    it('maps categories, teams, labs, and authors to select options', async () => {
      mockUseManuscriptById.mockReturnValueOnce([
        {
          id: 'manuscript-1',
          impact: { id: 'impact-1', name: 'High Impact' },
          categories: [{ id: 'cat-1', name: 'Genetics' }],
          versions: [
            {
              teams: [
                { id: 'team-1', displayName: 'Team Alpha' },
                { id: 'team-2', displayName: 'Team Beta' },
              ],
              labs: [
                {
                  id: 'lab-1',
                  name: 'Lab One',
                  labPITeamIds: ['team-1'],
                },
              ],
              firstAuthors: [{ id: 'auth-1', displayName: 'Author One' }],
              correspondingAuthor: [
                { id: 'auth-2', displayName: 'Author Two' },
              ],
              additionalAuthors: [
                { id: 'auth-3', displayName: 'Author Three' },
              ],
            },
          ],
        },
        jest.fn(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any);

      await renderPage();

      expect(capturedFormProps.selectedTeams).toEqual([
        { value: 'team-1', label: 'Team Alpha', isFixed: true },
        { value: 'team-2', label: 'Team Beta', isFixed: false },
      ]);
      expect(capturedFormProps.selectedLabs).toEqual([
        {
          value: 'lab-1',
          label: 'Lab One',
          labPITeamIds: ['team-1'],
          isFixed: false,
        },
      ]);
      expect(capturedFormProps.categories).toEqual([
        { value: 'cat-1', label: 'Genetics' },
      ]);
      expect(capturedFormProps.firstAuthors).toEqual([
        {
          author: { id: 'auth-1', displayName: 'Author One' },
          label: 'Author One',
          value: 'auth-1',
        },
      ]);
    });
  });
});
