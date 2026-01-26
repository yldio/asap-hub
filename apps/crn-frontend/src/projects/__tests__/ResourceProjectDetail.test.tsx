import { Suspense } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { projects } from '@asap-hub/routing';
import type {
  DiscoveryProject,
  ResourceProjectDetail as ResourceProjectDetailType,
} from '@asap-hub/model';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import ResourceProjectDetail from '../ResourceProjectDetail';

const mockResourceProject: ResourceProjectDetailType = {
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
  originalGrant: 'Original Grant',
  originalGrantProposalId: 'proposal-1',
  contactEmail: 'contact@example.com',
  fundedTeam: {
    id: 'team-1',
    displayName: 'Resource Team',
    teamType: 'Resource Team',
    researchTheme: 'Theme One',
    teamDescription: 'Team description',
  },
};

const mockDiscoveryProject: DiscoveryProject = {
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
};

jest.mock('../state', () => {
  const useProjectById = jest.fn((id: string) => {
    if (id === 'resource-1') {
      return mockResourceProject;
    }
    if (id === 'discovery-1') {
      return mockDiscoveryProject;
    }
    return undefined;
  });

  return {
    __esModule: true,
    useProjectById,
  };
});

const renderResourceProjectDetail = async (projectId: string) => {
  const path = `${projects.template}/resource/${projectId}/about`;

  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={[path]}>
              <Routes>
                <Route
                  path={`${projects.template}/resource/:projectId/*`}
                  element={<ResourceProjectDetail />}
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

describe('ResourceProjectDetail', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders Resource Project detail page when project type matches', async () => {
    await renderResourceProjectDetail('resource-1');
    expect(await screen.findByText('Overview')).toBeVisible();
    expect(screen.getByText('Resource Project 1')).toBeVisible();
  });

  it('renders NotFoundPage when project type is not Resource Project', async () => {
    await renderResourceProjectDetail('discovery-1');
    // NotFoundPage shows "Sorry! We can't seem to find that page."
    // This test specifically covers line 27: if (project.projectType !== 'Resource Project')
    const heading = await screen.findByRole('heading');
    expect(heading.textContent).toMatch(
      /Sorry! We can.+t seem to find that page/,
    );
  });

  it('renders NotFoundPage when project is undefined', async () => {
    await renderResourceProjectDetail('non-existent');
    // This test covers line 21-22: if (!project) return <NotFoundPage />
    const heading = await screen.findByRole('heading');
    expect(heading.textContent).toMatch(
      /Sorry! We can.+t seem to find that page/,
    );
  });
});
