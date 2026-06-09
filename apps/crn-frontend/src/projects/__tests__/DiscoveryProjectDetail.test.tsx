import { Suspense } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render, screen, waitFor, within } from '@testing-library/react';
import { enable, disable, reset } from '@asap-hub/flags';
import {
  createResearchOutputResponse,
  createUserResponse,
} from '@asap-hub/fixtures';
import { RecoilRoot } from 'recoil';
import { projects } from '@asap-hub/routing';
import userEvent from '@testing-library/user-event';
import type {
  DiscoveryProjectDetail as DiscoveryProjectDetailType,
  ResourceProject,
  TeamRole,
} from '@asap-hub/model';
import type { AlgoliaSearchClient } from '@asap-hub/algolia';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { createResearchOutputListAlgoliaResponse } from '../../__fixtures__/algolia';
import { useAlgolia } from '../../hooks/algolia';
import { getResearchOutputs } from '../../shared-research/api';
import DiscoveryProjectDetail from '../DiscoveryProjectDetail';

jest.mock('../../hooks/algolia', () => ({
  useAlgolia: jest.fn(),
}));

jest.mock('../../shared-research/api', () => ({
  ...jest.requireActual('../../shared-research/api'),
  getResearchOutputs: jest.fn(),
}));

const mockUseAlgolia = useAlgolia as jest.MockedFunction<typeof useAlgolia>;
const mockGetResearchOutputs = getResearchOutputs as jest.MockedFunction<
  typeof getResearchOutputs
>;
const mockAlgoliaClient = { search: jest.fn() };

const mockDiscoveryProject: DiscoveryProjectDetailType = {
  id: 'discovery-1',
  title: 'Discovery Project 1',
  status: 'Active',
  statusRank: 1,
  startDate: '2024-01-01',
  endDate: '2024-06-01',
  duration: '5 mos',
  tags: [],
  projectType: 'Discovery Project',
  researchTheme: 'Theme One',
  teamName: 'Discovery Team',
  teamId: 'team-1',
  originalGrant: 'Original Grant',
  originalGrantProposalId: 'proposal-1',
  originalGrantAims: [
    {
      id: '1',
      order: 1,
      description: 'Aim Description One',
      status: 'In Progress',
      articleCount: 0,
    },
  ],
  contactEmail: 'contact@example.com',
  fundedTeam: {
    id: 'team-1',
    displayName: 'Discovery Team',
    teamType: 'Discovery Team',
    researchTheme: 'Theme One',
    teamDescription: 'Team description',
  },
};

const mockResourceProject: ResourceProject = {
  id: 'resource-1',
  title: 'Resource Project 1',
  status: 'Active',
  statusRank: 1,
  startDate: '2024-01-01',
  endDate: '2024-06-01',
  duration: '5 mos',
  tags: [],
  projectType: 'Resource Project',
  resourceType: 'Data Portal',
  isTeamBased: true,
  teamName: 'Resource Team',
  teamId: 'team-1',
  googleDriveLink: undefined,
};

const mockPublishedResearchOutput = {
  ...createResearchOutputResponse(1),
  id: 'published-output-1',
  published: true,
};

const mockDraftResearchOutput = {
  ...createResearchOutputResponse(2),
  id: 'draft-output-1',
  published: false,
};

jest.mock('../state', () => {
  const actual = jest.requireActual('../state');
  const useProjectById = jest.fn((id: string) => {
    if (id === 'discovery-1') {
      return mockDiscoveryProject;
    }
    if (id === 'resource-1') {
      return mockResourceProject;
    }
    return undefined;
  });

  return {
    ...actual,
    useProjectById,
    useProjectMilestones: jest.fn().mockResolvedValue({
      items: [],
      total: 0,
    }),
    useCreateProjectMilestone: jest.fn().mockReturnValue(jest.fn()),
  };
});

jest.mock('../../shared-research/state', () => ({
  __esModule: true,
  useResearchOutputs: jest.fn((options: { draftsOnly?: boolean }) =>
    options.draftsOnly
      ? { items: [mockDraftResearchOutput], total: 1 }
      : { items: [mockPublishedResearchOutput], total: 1 },
  ),
}));

const renderDiscoveryProjectDetail = async (projectId: string) => {
  const path = `${projects.template}/discovery/${projectId}/about`;

  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={[path]}>
              <Routes>
                <Route
                  path={`${projects.template}/discovery/:projectId/*`}
                  element={<DiscoveryProjectDetail />}
                />
              </Routes>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );

  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });
};

describe('DiscoveryProjectDetail', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockUseAlgolia.mockReturnValue({
      client: mockAlgoliaClient as unknown as AlgoliaSearchClient<'crn'>,
    });
    mockGetResearchOutputs.mockResolvedValue(
      createResearchOutputListAlgoliaResponse(0),
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
    reset();
  });

  it('renders Discovery Project detail page when project type matches', async () => {
    await renderDiscoveryProjectDetail('discovery-1');
    expect(await screen.findByText('Overview')).toBeVisible();
    expect(screen.getByText('Discovery Project 1')).toBeVisible();
  });

  it('renders NotFoundPage when project type is not Discovery Project', async () => {
    await renderDiscoveryProjectDetail('resource-1');
    // NotFoundPage shows "Sorry! We can't seem to find that page."
    // This test specifically covers line 27: if (project.projectType !== 'Discovery Project')
    const headings = await screen.findAllByRole('heading');
    expect(
      headings.some((h) =>
        (h.textContent || '').match(/Sorry! We can.+t seem to find that page/),
      ),
    ).toBe(true);
  });

  it('renders NotFoundPage when project is undefined', async () => {
    await renderDiscoveryProjectDetail('non-existent');
    // This test covers line 21-22: if (!project) return <NotFoundPage />
    const headings = await screen.findAllByRole('heading');
    expect(
      headings.some((h) =>
        (h.textContent || '').match(/Sorry! We can.+t seem to find that page/),
      ),
    ).toBe(true);
  });

  it('does not allow accessing milestones route when PROJECT_AIMS_AND_MILESTONES flag is disabled', async () => {
    disable('PROJECT_AIMS_AND_MILESTONES');
    const path = `${projects.template}/discovery/discovery-1/milestones`;

    render(
      <RecoilRoot>
        <Suspense fallback="loading">
          <Auth0Provider user={{}}>
            <WhenReady>
              <MemoryRouter initialEntries={[path]}>
                <Routes>
                  <Route
                    path={`${projects.template}/discovery/:projectId/*`}
                    element={<DiscoveryProjectDetail />}
                  />
                </Routes>
              </MemoryRouter>
            </WhenReady>
          </Auth0Provider>
        </Suspense>
      </RecoilRoot>,
    );

    const headings = await screen.findAllByRole('heading');
    expect(
      headings.some((h) =>
        (h.textContent || '').match(/Sorry! We can.+t seem to find that page/),
      ),
    ).toBe(true);
  });

  it('allows accessing milestones route when PROJECT_AIMS_AND_MILESTONES flag is enabled', async () => {
    enable('PROJECT_AIMS_AND_MILESTONES');
    const path = `${projects.template}/discovery/discovery-1/milestones`;

    render(
      <RecoilRoot>
        <Suspense fallback="loading">
          <Auth0Provider user={{}}>
            <WhenReady>
              <MemoryRouter initialEntries={[path]}>
                <Routes>
                  <Route
                    path={`${projects.template}/discovery/:projectId/*`}
                    element={<DiscoveryProjectDetail />}
                  />
                </Routes>
              </MemoryRouter>
            </WhenReady>
          </Auth0Provider>
        </Suspense>
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    expect(screen.getAllByText('Milestones').length).toBeGreaterThanOrEqual(1);
  });

  it('can fetch the projects articles', async () => {
    enable('PROJECT_AIMS_AND_MILESTONES');
    mockGetResearchOutputs.mockResolvedValue({
      ...createResearchOutputListAlgoliaResponse(2),
      hits: createResearchOutputListAlgoliaResponse(2).hits.map(
        (hit, index) => ({
          ...hit,
          title: `Project Article ${index}`,
        }),
      ),
    });
    const path = `${projects.template}/discovery/discovery-1/milestones`;
    const mockUser = {
      ...createUserResponse({}, 1),
      onboarded: true,
      algoliaApiKey: null,
      teams: [
        {
          displayName: 'Discovery Team',
          role: 'Project Manager' as TeamRole,
          id: 'team-1',
        },
      ],
    };

    render(
      <RecoilRoot>
        <Suspense fallback="loading">
          <Auth0Provider user={mockUser}>
            <WhenReady>
              <MemoryRouter initialEntries={[path]}>
                <Routes>
                  <Route
                    path={`${projects.template}/discovery/:projectId/*`}
                    element={<DiscoveryProjectDetail />}
                  />
                </Routes>
              </MemoryRouter>
            </WhenReady>
          </Auth0Provider>
        </Suspense>
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    const addNewMilestoneButton = await screen.findByRole('button', {
      name: /Add New Milestone/i,
    });

    await userEvent.click(addNewMilestoneButton);

    const relatedArticlesLabel = screen
      .getByText('Related Articles')
      .closest('div')!;

    const articlesInput = within(relatedArticlesLabel!).getByRole('combobox');
    await userEvent.click(articlesInput);

    expect(await screen.findByText(/Project Article 1/i)).toBeVisible();
  });
});
