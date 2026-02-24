import { Suspense } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render, screen, waitFor } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { projects } from '@asap-hub/routing';
import type {
  DiscoveryProject,
  TraineeProjectDetail as TraineeProjectDetailType,
} from '@asap-hub/model';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import TraineeProjectDetail from '../TraineeProjectDetail';

jest.mock('../../network/teams/state', () => ({
  useIsComplianceReviewer: jest.fn(() => false),
  usePutManuscript: jest.fn(() => jest.fn().mockResolvedValue({})),
  useCreateDiscussion: jest.fn(() => jest.fn().mockResolvedValue('disc-1')),
  useReplyToDiscussion: jest.fn(() => jest.fn().mockResolvedValue(undefined)),
  useMarkDiscussionAsRead: jest
    .fn()
    .mockReturnValue(jest.fn().mockResolvedValue(undefined)),
  useManuscriptById: jest.fn(() => [undefined, jest.fn()]),
}));

const mockTraineeProject: TraineeProjectDetailType = {
  id: 'trainee-1',
  title: 'Trainee Project 1',
  status: 'Active',
  statusRank: 1,
  startDate: '2024-01-01',
  endDate: '2024-06-01',
  duration: '5 mos',
  tags: [],
  projectType: 'Trainee Project',
  members: [
    {
      id: 'trainer-1',
      displayName: 'Taylor Trainer',
      firstName: 'Taylor',
      lastName: 'Trainer',
      role: 'Trainee Project - Mentor',
    },
  ],
  originalGrant: 'Original Grant',
  originalGrantProposalId: 'proposal-1',
  contactEmail: 'contact@example.com',
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
    if (id === 'trainee-1') {
      return mockTraineeProject;
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

const renderTraineeProjectDetail = async (
  projectId: string,
  user: Record<string, unknown> = {},
  subPath = 'about',
) => {
  const path = `${projects.template}/trainee/${projectId}/${subPath}`;

  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={user}>
          <WhenReady>
            <MemoryRouter initialEntries={[path]}>
              <Routes>
                <Route
                  path={`${projects.template}/trainee/:projectId/*`}
                  element={<TraineeProjectDetail />}
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

describe('TraineeProjectDetail', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders Trainee Project detail page when project type matches', async () => {
    await renderTraineeProjectDetail('trainee-1');
    expect(await screen.findByText('Overview')).toBeVisible();
    expect(screen.getByText('Trainee Project 1')).toBeVisible();
  });

  it('renders NotFoundPage when project type is not Trainee Project', async () => {
    await renderTraineeProjectDetail('discovery-1');
    // NotFoundPage shows "Sorry! We can't seem to find that page."
    // This test specifically covers line 27: if (project.projectType !== 'Trainee Project')
    const heading = await screen.findByRole('heading');
    expect(heading.textContent).toMatch(
      /Sorry! We can.+t seem to find that page/,
    );
  });

  it('renders NotFoundPage when project is undefined', async () => {
    await renderTraineeProjectDetail('non-existent');
    // This test covers line 21-22: if (!project) return <NotFoundPage />
    const heading = await screen.findByRole('heading');
    expect(heading.textContent).toMatch(
      /Sorry! We can.+t seem to find that page/,
    );
  });

  it('renders Workspace tab when user is a project member and flag is enabled', async () => {
    const memberUser = {
      projects: [{ id: 'trainee-1' }],
      role: 'Grantee',
    };
    document.cookie = 'ASAP_PROJECT_WORKSPACE=true';
    await renderTraineeProjectDetail('trainee-1', memberUser);
    expect(screen.getByText('Workspace')).toBeInTheDocument();
    document.cookie =
      'ASAP_PROJECT_WORKSPACE=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  });

  it('does not render Workspace tab when flag is disabled', async () => {
    await renderTraineeProjectDetail('trainee-1');
    expect(screen.queryByText('Workspace')).not.toBeInTheDocument();
  });

  it('renders workspace route with Compliance Review heading', async () => {
    const memberUser = {
      projects: [{ id: 'trainee-1' }],
      role: 'Grantee',
    };
    document.cookie = 'ASAP_PROJECT_WORKSPACE=true';
    await renderTraineeProjectDetail('trainee-1', memberUser, 'workspace');
    expect(
      await screen.findByRole('heading', { name: 'Compliance Review' }),
    ).toBeInTheDocument();
    document.cookie =
      'ASAP_PROJECT_WORKSPACE=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  });
});
