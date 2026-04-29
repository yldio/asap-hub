import { Suspense, FC } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render, screen, waitFor } from '@testing-library/react';
import { enable, disable, reset } from '@asap-hub/flags';
import { RecoilRoot } from 'recoil';
import { projects } from '@asap-hub/routing';
import type {
  DiscoveryProjectDetail as DiscoveryProjectDetailType,
  ResourceProjectDetail as ResourceProjectDetailType,
  TraineeProjectDetail as TraineeProjectDetailType,
} from '@asap-hub/model';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import DiscoveryProjectDetail from '../DiscoveryProjectDetail';
import ResourceProjectDetail from '../ResourceProjectDetail';
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

const mockEditToolHref = jest.fn();
let lastWorkspaceProps: Record<string, unknown> = {};
jest.mock('../ProjectWorkspace', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    lastWorkspaceProps = props;
    if (typeof props.editToolHref === 'function') {
      mockEditToolHref.mockImplementation(
        props.editToolHref as (...args: unknown[]) => unknown,
      );
      mockEditToolHref(0);
    }
    return <h3>Compliance Review</h3>;
  },
}));

jest.mock('../ProjectManuscript', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-manuscript-form">Manuscript Form</div>,
}));

jest.mock('../ProjectComplianceReport', () => ({
  __esModule: true,
  default: () => (
    <div data-testid="mock-compliance-report-form">Compliance Report Form</div>
  ),
}));

// --- Mock project data ---

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
  contactEmail: 'contact@example.com',
  manuscripts: ['ms-1', 'ms-2'],
  collaborationManuscripts: ['ms-3'],
  collaborators: [
    {
      id: 'collab-1',
      displayName: 'Jane Contact',
      firstName: 'Jane',
      lastName: 'Contact',
      email: 'contact@example.com',
    },
  ],
  fundedTeam: {
    id: 'team-1',
    displayName: 'Discovery Team',
    teamType: 'Discovery Team',
    researchTheme: 'Theme One',
    teamDescription: 'Team description',
  },
};

const mockDiscoveryProjectWithSupplement: DiscoveryProjectDetailType = {
  ...mockDiscoveryProject,
  id: 'discovery-supplement',
  supplementGrant: {
    grantTitle: 'Supplement Grant Title',
  },
};

const mockDiscoveryProjectNoContact: DiscoveryProjectDetailType = {
  ...mockDiscoveryProject,
  id: 'discovery-no-contact',
  contactEmail: '',
  collaborators: [],
  manuscripts: undefined,
  collaborationManuscripts: undefined,
};

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
  manuscripts: ['ms-r1'],
  collaborationManuscripts: ['ms-r2'],
  members: [
    {
      id: 'member-1',
      displayName: 'John Member',
      firstName: 'John',
      lastName: 'Member',
      email: 'contact@example.com',
      role: 'Resource Project - Co-PI',
    },
  ],
  fundedTeam: {
    id: 'team-1',
    displayName: 'Resource Team',
    teamType: 'Resource Team',
    researchTheme: 'Theme One',
    teamDescription: 'Team description',
  },
};

const mockResourceProjectNoContact: ResourceProjectDetailType = {
  ...mockResourceProject,
  id: 'resource-no-contact',
  contactEmail: '',
  members: [],
  collaborators: [],
};

const mockResourceProjectCollabContact: ResourceProjectDetailType = {
  ...mockResourceProject,
  id: 'resource-collab',
  members: [
    {
      id: 'member-1',
      displayName: 'John Member',
      firstName: 'John',
      lastName: 'Member',
      email: 'other@example.com',
      role: 'Resource Project - Co-PI',
    },
  ],
  collaborators: [
    {
      id: 'collab-1',
      displayName: 'Jane Collaborator',
      firstName: 'Jane',
      lastName: 'Collaborator',
      email: 'contact@example.com',
    },
  ],
};

const mockResourceProjectWithSupplement: ResourceProjectDetailType = {
  ...mockResourceProject,
  id: 'resource-supplement',
  supplementGrant: {
    grantTitle: 'Supplement Grant Title',
  },
};

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
      email: 'contact@example.com',
      role: 'Trainee Project - Mentor',
    },
  ],
  originalGrant: 'Original Grant',
  originalGrantProposalId: 'proposal-1',
  contactEmail: 'contact@example.com',
};

const mockTraineeProjectWithSupplement: TraineeProjectDetailType = {
  ...mockTraineeProject,
  id: 'trainee-supplement',
  supplementGrant: {
    grantTitle: 'Supplement Grant Title',
  },
};

const mockTraineeProjectNoContact: TraineeProjectDetailType = {
  ...mockTraineeProject,
  id: 'trainee-no-contact',
  contactEmail: '',
  members: [],
};

// --- Combined state mock ---

jest.mock('../state', () => ({
  __esModule: true,
  useProjectById: jest.fn((id: string) => {
    const map: Record<string, unknown> = {
      'discovery-1': mockDiscoveryProject,
      'discovery-no-contact': mockDiscoveryProjectNoContact,
      'discovery-supplement': mockDiscoveryProjectWithSupplement,
      'resource-1': mockResourceProject,
      'resource-no-contact': mockResourceProjectNoContact,
      'resource-collab': mockResourceProjectCollabContact,
      'resource-supplement': mockResourceProjectWithSupplement,
      'trainee-1': mockTraineeProject,
      'trainee-no-contact': mockTraineeProjectNoContact,
      'trainee-supplement': mockTraineeProjectWithSupplement,
    };
    return map[id];
  }),
  useProjectMilestones: jest.fn().mockResolvedValue({
    items: [],
    total: 0,
  }),
  useProjectArticlesSuggestions: jest.fn().mockResolvedValue([]),
  useCreateProjectMilestone: jest.fn().mockReturnValue(jest.fn()),
}));

// --- Test helper ---

const renderProjectDetail = async (
  Component: FC,
  routeKeyword: string,
  projectId: string,
  user: Record<string, unknown> = {},
  subPath = 'about',
) => {
  const path = `${projects.template}/${routeKeyword}/${projectId}/${subPath}`;

  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={user}>
          <WhenReady>
            <MemoryRouter initialEntries={[path]}>
              <Routes>
                <Route
                  path={`${projects.template}/${routeKeyword}/:projectId/*`}
                  element={<Component />}
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

// --- Test variants ---

type TestVariant = {
  name: string;
  Component: FC;
  routeKeyword: string;
  mainProjectId: string;
  mainProjectTitle: string;
  noContactProjectId: string;
  wrongTypeProjectId: string;
  supplementProjectId: string;
};

const variants: TestVariant[] = [
  {
    name: 'DiscoveryProjectDetail',
    Component: DiscoveryProjectDetail,
    routeKeyword: 'discovery',
    mainProjectId: 'discovery-1',
    mainProjectTitle: 'Discovery Project 1',
    noContactProjectId: 'discovery-no-contact',
    wrongTypeProjectId: 'resource-1',
    supplementProjectId: 'discovery-supplement',
  },
  {
    name: 'ResourceProjectDetail',
    Component: ResourceProjectDetail,
    routeKeyword: 'resource',
    mainProjectId: 'resource-1',
    mainProjectTitle: 'Resource Project 1',
    noContactProjectId: 'resource-no-contact',
    wrongTypeProjectId: 'discovery-1',
    supplementProjectId: 'resource-supplement',
  },
  {
    name: 'TraineeProjectDetail',
    Component: TraineeProjectDetail,
    routeKeyword: 'trainee',
    mainProjectId: 'trainee-1',
    mainProjectTitle: 'Trainee Project 1',
    noContactProjectId: 'trainee-no-contact',
    wrongTypeProjectId: 'discovery-1',
    supplementProjectId: 'trainee-supplement',
  },
];

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
  reset();
});

describe.each(variants)(
  '$name',
  ({
    Component,
    routeKeyword,
    mainProjectId,
    mainProjectTitle,
    noContactProjectId,
    wrongTypeProjectId,
    supplementProjectId,
  }) => {
    it('renders project detail page when project type matches', async () => {
      await renderProjectDetail(Component, routeKeyword, mainProjectId);
      expect(await screen.findByText('Overview')).toBeVisible();
      expect(screen.getByText(mainProjectTitle)).toBeVisible();
    });

    it('renders NotFoundPage when project type does not match', async () => {
      await renderProjectDetail(Component, routeKeyword, wrongTypeProjectId);
      const heading = await screen.findByRole('heading');
      expect(heading.textContent).toMatch(
        /Sorry! We can.+t seem to find that page/,
      );
    });

    it('renders NotFoundPage when project is undefined', async () => {
      await renderProjectDetail(Component, routeKeyword, 'non-existent');
      const heading = await screen.findByRole('heading');
      expect(heading.textContent).toMatch(
        /Sorry! We can.+t seem to find that page/,
      );
    });

    it('renders Workspace tab when user is a project member and flag is enabled', async () => {
      const memberUser = {
        projects: [{ id: mainProjectId }],
        role: 'Grantee',
      };
      enable('PROJECT_WORKSPACE');
      await renderProjectDetail(
        Component,
        routeKeyword,
        mainProjectId,
        memberUser,
      );
      expect(screen.getByText('Workspace')).toBeInTheDocument();
    });

    it('does not render Workspace tab when flag is disabled', async () => {
      disable('PROJECT_WORKSPACE');
      await renderProjectDetail(Component, routeKeyword, mainProjectId);
      expect(screen.queryByText('Workspace')).not.toBeInTheDocument();
    });

    it('renders workspace route with Compliance Review heading', async () => {
      const memberUser = {
        projects: [{ id: mainProjectId }],
        role: 'Grantee',
      };
      enable('PROJECT_WORKSPACE');
      await renderProjectDetail(
        Component,
        routeKeyword,
        mainProjectId,
        memberUser,
        'workspace',
      );
      expect(
        await screen.findByRole('heading', { name: 'Compliance Review' }),
      ).toBeInTheDocument();
    });

    it('renders Workspace tab for Staff users even without project membership', async () => {
      const staffUser = {
        projects: [],
        role: 'Staff',
      };
      enable('PROJECT_WORKSPACE');
      await renderProjectDetail(
        Component,
        routeKeyword,
        mainProjectId,
        staffUser,
      );
      expect(screen.getByText('Workspace')).toBeInTheDocument();
    });

    it('renders create manuscript route via lazy loading', async () => {
      const memberUser = {
        projects: [{ id: mainProjectId }],
        role: 'Grantee',
      };
      enable('PROJECT_WORKSPACE');
      await renderProjectDetail(
        Component,
        routeKeyword,
        mainProjectId,
        memberUser,
        'workspace/create-manuscript',
      );
      expect(
        await screen.findByTestId('mock-manuscript-form'),
      ).toBeInTheDocument();
    });

    it('renders edit manuscript route via lazy loading', async () => {
      const memberUser = {
        projects: [{ id: mainProjectId }],
        role: 'Grantee',
      };
      enable('PROJECT_WORKSPACE');
      await renderProjectDetail(
        Component,
        routeKeyword,
        mainProjectId,
        memberUser,
        'workspace/edit-manuscript/ms-1',
      );
      expect(
        await screen.findByTestId('mock-manuscript-form'),
      ).toBeInTheDocument();
    });

    it('renders workspace when project has no contactEmail', async () => {
      const memberUser = {
        projects: [{ id: noContactProjectId }],
        role: 'Grantee',
      };
      enable('PROJECT_WORKSPACE');
      await renderProjectDetail(
        Component,
        routeKeyword,
        noContactProjectId,
        memberUser,
        'workspace',
      );
      expect(
        await screen.findByRole('heading', { name: 'Compliance Review' }),
      ).toBeInTheDocument();
    });

    it('renders resubmit manuscript route via lazy loading', async () => {
      const memberUser = {
        projects: [{ id: mainProjectId }],
        role: 'Grantee',
      };
      enable('PROJECT_WORKSPACE');
      await renderProjectDetail(
        Component,
        routeKeyword,
        mainProjectId,
        memberUser,
        'workspace/resubmit-manuscript/ms-1',
      );
      expect(
        await screen.findByTestId('mock-manuscript-form'),
      ).toBeInTheDocument();
    });

    it('renders create compliance report route via lazy loading', async () => {
      const memberUser = {
        projects: [{ id: mainProjectId }],
        role: 'Grantee',
      };
      enable('PROJECT_WORKSPACE');
      await renderProjectDetail(
        Component,
        routeKeyword,
        mainProjectId,
        memberUser,
        'workspace/create-compliance-report/ms-1',
      );
      expect(
        await screen.findByTestId('mock-compliance-report-form'),
      ).toBeInTheDocument();
    });

    it('renders milestones route and covers hasSupplementGrant logic', async () => {
      enable('PROJECT_AIMS_AND_MILESTONES');
      await renderProjectDetail(
        Component,
        routeKeyword,
        supplementProjectId,
        {},
        'milestones',
      );
      expect(await screen.findByText('Supplement')).toBeInTheDocument();
    });
  },
);

// --- Variant-specific tests ---

describe('Workspace href callbacks', () => {
  it('builds edit, resubmit, and create-compliance-report hrefs from manuscriptId', async () => {
    const memberUser = {
      projects: [{ id: 'discovery-1' }],
      role: 'Grantee',
    };
    enable('PROJECT_WORKSPACE');
    await renderProjectDetail(
      DiscoveryProjectDetail,
      'discovery',
      'discovery-1',
      memberUser,
      'workspace',
    );
    await screen.findByRole('heading', { name: 'Compliance Review' });

    const getEditManuscriptHref = lastWorkspaceProps.getEditManuscriptHref as (
      manuscriptId: string,
    ) => string;
    const getResubmitManuscriptHref =
      lastWorkspaceProps.getResubmitManuscriptHref as (
        manuscriptId: string,
      ) => string;
    const getCreateComplianceReportHref =
      lastWorkspaceProps.getCreateComplianceReportHref as (
        manuscriptId: string,
      ) => string;

    const workspaceRoute = projects({})
      .discoveryProjects({})
      .discoveryProject({ projectId: 'discovery-1' })
      .workspace({});

    expect(getEditManuscriptHref('ms-1')).toBe(
      workspaceRoute.editManuscript({ manuscriptId: 'ms-1' }).$,
    );
    expect(getResubmitManuscriptHref('ms-1')).toBe(
      workspaceRoute.resubmitManuscript({ manuscriptId: 'ms-1' }).$,
    );
    expect(getCreateComplianceReportHref('ms-1')).toBe(
      workspaceRoute.createComplianceReport({ manuscriptId: 'ms-1' }).$,
    );
  });
});

describe('DiscoveryProjectDetail - specific', () => {
  it('passes manuscripts and collaborationManuscripts to ProjectWorkspace', async () => {
    const memberUser = {
      projects: [{ id: 'discovery-1' }],
      role: 'Grantee',
    };
    enable('PROJECT_WORKSPACE');
    await renderProjectDetail(
      DiscoveryProjectDetail,
      'discovery',
      'discovery-1',
      memberUser,
      'workspace',
    );
    await screen.findByRole('heading', { name: 'Compliance Review' });
    expect(lastWorkspaceProps.manuscripts).toEqual(['ms-1', 'ms-2']);
    expect(lastWorkspaceProps.collaborationManuscripts).toEqual(['ms-3']);
  });

  it('renders workspace with contact name from collaborators', async () => {
    const memberUser = {
      projects: [{ id: 'discovery-1' }],
      role: 'Grantee',
    };
    enable('PROJECT_WORKSPACE');
    await renderProjectDetail(
      DiscoveryProjectDetail,
      'discovery',
      'discovery-1',
      memberUser,
      'workspace',
    );
    await screen.findByRole('heading', { name: 'Compliance Review' });
    expect(lastWorkspaceProps.contactName).toBe('Jane Contact');
  });
});

describe('ResourceProjectDetail - specific', () => {
  it('resolves contactName from collaborators when no member matches contactEmail', async () => {
    const memberUser = {
      projects: [{ id: 'resource-collab' }],
      role: 'Grantee',
    };
    enable('PROJECT_WORKSPACE');
    await renderProjectDetail(
      ResourceProjectDetail,
      'resource',
      'resource-collab',
      memberUser,
      'workspace',
    );
    await screen.findByRole('heading', { name: 'Compliance Review' });
    expect(lastWorkspaceProps.contactName).toBe('Jane Collaborator');
  });
});
