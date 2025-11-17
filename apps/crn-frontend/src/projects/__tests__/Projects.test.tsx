import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import {
  render,
  screen,
  waitForElementToBeRemoved,
  waitFor,
  act,
} from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { projects } from '@asap-hub/routing';
import userEvent from '@testing-library/user-event';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import type {
  DiscoveryProject,
  ResourceProject,
  TraineeProject,
  ProjectMember,
} from '@asap-hub/model';
import Projects from '../Projects';

const mockDiscoveryProject: DiscoveryProject = {
  id: '1',
  title: 'Discovery Project 1',
  status: 'Active',
  startDate: '2024-01-01',
  endDate: '2024-06-01',
  duration: '5 mos',
  tags: [],
  projectType: 'Discovery',
  researchTheme: 'Theme One',
  teamName: 'Discovery Team',
  teamId: 'team-1',
  inactiveSinceDate: undefined,
};

const mockResourceMembers: ReadonlyArray<ProjectMember> = [
  { id: 'resource-team-main', displayName: 'Resource Team' },
  { id: 'resource-team-support', displayName: 'Resource Support' },
];

const mockResourceProject: ResourceProject = {
  id: '2',
  title: 'Resource Project 1',
  status: 'Active',
  startDate: '2023-01-01',
  endDate: '2023-07-01',
  duration: '6 mos',
  tags: [],
  projectType: 'Resource',
  resourceType: 'Data Portal',
  isTeamBased: true,
  teamName: 'Resource Team',
  teamId: 'team-2',
  googleDriveLink: undefined,
  members: mockResourceMembers,
};

const mockTraineeTrainer: ProjectMember = {
  id: 'trainer-1',
  displayName: 'Taylor Trainer',
  firstName: 'Taylor',
  lastName: 'Trainer',
};

const mockTraineeProjectMembers: ReadonlyArray<ProjectMember> = [
  {
    id: 'trainee-1',
    displayName: 'Dana Trainee',
    firstName: 'Dana',
    lastName: 'Trainee',
  },
];

const mockTraineeProject: TraineeProject = {
  id: '3',
  title: 'Trainee Project 1',
  status: 'Active',
  startDate: '2024-02-01',
  endDate: '2025-02-01',
  duration: '1 yr',
  tags: [],
  projectType: 'Trainee',
  trainer: mockTraineeTrainer,
  members: mockTraineeProjectMembers,
};

jest.mock('../state', () => {
  const createMockListResponse = (
    items: ReadonlyArray<DiscoveryProject | ResourceProject | TraineeProject>,
  ) => ({
    total: items.length,
    items,
    algoliaIndexName: 'projects-index',
    algoliaQueryId: 'query-id',
  });

  const useProjects = jest.fn((options: { projectType: string }) => {
    switch (options.projectType) {
      case 'Discovery':
        return createMockListResponse([mockDiscoveryProject]);
      case 'Resource':
        return createMockListResponse([mockResourceProject]);
      case 'Trainee':
        return createMockListResponse([mockTraineeProject]);
      default:
        return createMockListResponse([mockDiscoveryProject]);
    }
  });

  const useProjectFacets = jest.fn((options: { projectType: string }) => {
    if (options.projectType === 'Discovery') {
      return {
        researchTheme: {
          'Theme One': 2,
        },
      };
    }
    if (options.projectType === 'Resource') {
      return {
        resourceType: {
          'Data Portal': 1,
        },
      };
    }
    return {};
  });

  const useProjectById = jest.fn((id: string) => {
    if (id === '1') {
      return mockDiscoveryProject;
    }
    if (id === '2') {
      return mockResourceProject;
    }
    if (id === '3') {
      return mockTraineeProject;
    }
    return undefined;
  });

  return {
    __esModule: true,
    useProjects,
    useProjectFacets,
    useProjectById,
  };
});

jest.mock('../../shared-research/api', () => ({
  ...jest.requireActual('../../shared-research/api'),
  getResearchThemes: jest.fn(() =>
    Promise.resolve([
      { id: 'theme-1', name: 'Theme One' },
      { id: 'theme-2', name: 'Theme Two' },
    ]),
  ),
  getResourceTypes: jest.fn(() =>
    Promise.resolve([
      { id: 'type-1', name: 'Data Portal' },
      { id: 'type-2', name: 'Dataset' },
    ]),
  ),
}));

const renderProjectsPage = async (pathname: string, query = '') => {
  const { container } = render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={[{ pathname, search: query }]}>
              <Route path={projects.template}>
                <Projects />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );

  await waitForElementToBeRemoved(screen.queryByText(/loading/i), {
    timeout: 30_000,
  });

  return container;
};

describe('Projects Routes', () => {
  it('redirects to discovery projects when the index page is accessed', async () => {
    await renderProjectsPage(projects({}).$);
    // Verify we're on Discovery Projects by checking for the description
    expect(
      await screen.findByText(
        /Discovery Projects are collaborative research projects/i,
      ),
    ).toBeVisible();
  });

  it.each([
    {
      type: 'Discovery',
      path: projects.template + projects({}).discoveryProjects.template,
      expectedDescription:
        /Discovery Projects are collaborative research projects/i,
    },
    {
      type: 'Resource',
      path: projects.template + projects({}).resourceProjects.template,
      expectedDescription:
        /Resource Projects are projects whose primary objective is to generate research tools/i,
    },
    {
      type: 'Trainee',
      path: projects.template + projects({}).traineeProjects.template,
      expectedDescription:
        /Trainee Projects provide early-career scientists with dedicated support/i,
    },
  ])('renders $type Projects page', async ({ path, expectedDescription }) => {
    await renderProjectsPage(path);
    expect(await screen.findByText(expectedDescription)).toBeVisible();
  });

  it('allows navigation between project types', async () => {
    await renderProjectsPage(
      projects.template + projects({}).discoveryProjects.template,
    );

    // Start on Discovery Projects - verify by checking for description
    expect(
      await screen.findByText(
        /Discovery Projects are collaborative research projects/i,
      ),
    ).toBeVisible();

    // Navigate to Resource Projects tab
    const resourceTab = await screen.findByText('Resource Projects', {
      selector: 'p',
    });
    await act(async () => {
      await userEvent.click(resourceTab);
    });

    // Should now show Resource Projects description
    expect(
      await screen.findByText(
        /Resource Projects are projects whose primary objective is to generate research tools/i,
      ),
    ).toBeVisible();

    // Navigate to Trainee Projects tab
    const traineeTab = await screen.findByText('Trainee Projects', {
      selector: 'p',
    });
    await userEvent.click(traineeTab);

    // Should now show Trainee Projects description
    expect(
      await screen.findByText(
        /Trainee Projects provide early-career scientists with dedicated support/i,
      ),
    ).toBeVisible();
  });

  it('allows typing in search queries', async () => {
    await renderProjectsPage(
      projects.template + projects({}).discoveryProjects.template,
    );
    const searchBox = (await screen.findByRole(
      'searchbox',
    )) as HTMLInputElement;

    userEvent.type(searchBox, 'test project');
    expect(searchBox.value).toEqual('test project');
  });

  it('preserves search query when switching tabs', async () => {
    await renderProjectsPage(
      projects.template + projects({}).discoveryProjects.template,
      '?searchQuery=biomarker',
    );
    const searchBox = (await screen.findByRole(
      'searchbox',
    )) as HTMLInputElement;

    expect(searchBox.value).toEqual('biomarker');

    const resourceTab = await screen.findByText('Resource Projects', {
      selector: 'p',
    });
    await act(async () => {
      await userEvent.click(resourceTab);
    });

    await waitFor(() => {
      expect(searchBox.value).toEqual('biomarker');
    });
  });

  it.each([
    {
      type: 'Discovery',
      path: `${projects.template}/discovery/1/about`,
    },
    {
      type: 'Resource',
      path: `${projects.template}/resource/1/about`,
    },
    {
      type: 'Trainee',
      path: `${projects.template}/trainee/1/about`,
    },
  ])('renders $type project detail page', async ({ path }) => {
    await renderProjectsPage(path);
    // Check that we're on a detail page by looking for the Overview section
    expect(await screen.findByText('Overview')).toBeVisible();
  });
});
