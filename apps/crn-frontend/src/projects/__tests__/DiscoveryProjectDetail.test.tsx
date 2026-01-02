import { Suspense } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { projects } from '@asap-hub/routing';
import type {
  DiscoveryProjectDetail as DiscoveryProjectDetailType,
  ResourceProject,
} from '@asap-hub/model';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import DiscoveryProjectDetail from '../DiscoveryProjectDetail';

const mockDiscoveryProject: DiscoveryProjectDetailType = {
  id: 'discovery-1',
  title: 'Discovery Project 1',
  status: 'Active',
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

jest.mock('../state', () => {
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
    __esModule: true,
    useProjectById,
  };
});

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
  });

  afterEach(() => {
    jest.restoreAllMocks();
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
    const heading = await screen.findByRole('heading');
    expect(heading.textContent).toMatch(
      /Sorry! We can.+t seem to find that page/,
    );
  });

  it('renders NotFoundPage when project is undefined', async () => {
    await renderDiscoveryProjectDetail('non-existent');
    // This test covers line 21-22: if (!project) return <NotFoundPage />
    const heading = await screen.findByRole('heading');
    expect(heading.textContent).toMatch(
      /Sorry! We can.+t seem to find that page/,
    );
  });
});
