import { Suspense, FC } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render, screen, waitFor } from '@testing-library/react';
import { enable, disable, reset } from '@asap-hub/flags';
import { createTestQueryClient } from '@asap-hub/frontend-utils';
import { QueryClientProvider } from '@tanstack/react-query';
import { projects } from '@asap-hub/routing';
import {
  createResearchOutputResponse,
  createTeamResponse,
} from '@asap-hub/fixtures';
import type {
  DiscoveryProjectDetail as DiscoveryProjectDetailType,
  ResearchOutputTeamResponse,
  ResourceProjectDetail as ResourceProjectDetailType,
  TraineeProjectDetail as TraineeProjectDetailType,
} from '@asap-hub/model';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import DiscoveryProjectDetail from '../DiscoveryProjectDetail';
import ResourceProjectDetail from '../ResourceProjectDetail';
import TraineeProjectDetail from '../TraineeProjectDetail';
import { useResearchOutputById } from '../../shared-research/state';

jest.mock('../../network/teams/state', () => ({
  useIsComplianceReviewer: jest.fn(() => false),
  usePutManuscript: jest.fn(() => jest.fn().mockResolvedValue({})),
  useCreateDiscussion: jest.fn(() => jest.fn().mockResolvedValue('disc-1')),
  useReplyToDiscussion: jest.fn(() => jest.fn().mockResolvedValue(undefined)),
  useMarkDiscussionAsRead: jest
    .fn()
    .mockReturnValue(jest.fn().mockResolvedValue(undefined)),
  useManuscriptById: jest.fn(() => [undefined, jest.fn()]),
  useTeamById: jest.fn(() => jest.fn().mockResolvedValue({ id: 'team-1' })),
  usePostPreprintResearchOutput: jest.fn(),
  useManuscriptVersionSuggestions: jest.fn(() =>
    jest.fn().mockResolvedValue([]),
  ),
}));
jest.mock('../../shared-state', () => ({
  useTeamSuggestions: jest.fn(() => jest.fn().mockResolvedValue([])),
  useLabSuggestions: jest.fn(() => jest.fn().mockResolvedValue([])),
  useResearchTags: jest.fn().mockReturnValue([]),
  useAuthorSuggestions: jest.fn(() => jest.fn().mockResolvedValue([])),
  useGeneratedContent: jest.fn(() => jest.fn().mockResolvedValue('')),
  useImpactSuggestions: jest.fn(() => jest.fn().mockResolvedValue([])),
  useCategorySuggestions: jest.fn(() => jest.fn().mockResolvedValue([])),
  usePostResearchOutput: jest.fn(() => jest.fn().mockResolvedValue(undefined)),
  usePutResearchOutput: jest.fn(() => jest.fn().mockResolvedValue(undefined)),
  useRelatedEventsSuggestions: jest.fn(() => jest.fn().mockResolvedValue([])),
  useRelatedResearchSuggestions: jest.fn(() => jest.fn().mockResolvedValue([])),
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

const mockPublishedResearchOutput = {
  ...createResearchOutputResponse(1),
  id: 'published-output-1',
  title:
    "Tracing the Origin and Progression of Parkinson's Disease through the Neuro-Immune Interactome",
  published: true,
};

const mockDraftResearchOutput = {
  ...createResearchOutputResponse(2),
  id: 'draft-output-1',
  title: 'Draft: Longitudinal cohort analysis (work in progress)',
  published: false,
};

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

jest.mock('../../shared-research/state', () => ({
  __esModule: true,
  ...jest.requireActual('../../shared-research/state'),
  useResearchOutputs: jest.fn((options: { draftsOnly?: boolean }) =>
    options.draftsOnly
      ? { items: [mockDraftResearchOutput], total: 1 }
      : { items: [mockPublishedResearchOutput], total: 1 },
  ),
  useResearchOutputById: jest.fn(),
  useSetResearchOutputItem: jest.fn(),
}));

const mockUseResearchOutputById = useResearchOutputById as jest.MockedFunction<
  typeof useResearchOutputById
>;

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
    <QueryClientProvider client={createTestQueryClient()}>
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
    </QueryClientProvider>,
  );

  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });
};

const getWorkspaceRoute = (routeKeyword: string, projectId: string) => {
  const base = projects({});
  switch (routeKeyword) {
    case 'discovery':
      return base
        .discoveryProjects({})
        .discoveryProject({ projectId })
        .workspace({});
    case 'resource':
      return base
        .resourceProjects({})
        .resourceProject({ projectId })
        .workspace({});
    case 'trainee':
      return base
        .traineeProjects({})
        .traineeProject({ projectId })
        .workspace({});
    default:
      throw new Error(`Unknown route keyword: ${routeKeyword}`);
  }
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
  memberUser: Record<string, unknown>;
  noContactMemberUser: Record<string, unknown>;
};

const teamBasedMemberUser = {
  id: 'user-team',
  projects: [],
  teams: [{ id: 'team-1', role: 'Project Manager' }],
  role: 'Grantee',
};

const traineeMemberUser = {
  id: 'trainer-1',
  projects: [],
  teams: [],
  role: 'Grantee',
};

const nonMemberUser = {
  id: 'non-member-user',
  projects: [],
  teams: [],
  role: 'Grantee',
  openScienceTeamMember: false,
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
    memberUser: teamBasedMemberUser,
    noContactMemberUser: teamBasedMemberUser,
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
    memberUser: teamBasedMemberUser,
    noContactMemberUser: teamBasedMemberUser,
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
    memberUser: traineeMemberUser,
    noContactMemberUser: {
      id: 'no-one',
      projects: [],
      teams: [],
      role: 'Staff',
      openScienceTeamMember: true,
    },
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
    memberUser,
    noContactMemberUser,
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

    it('renders Workspace tab for Open Science Staff users even without project membership', async () => {
      const openScienceUser = {
        projects: [],
        teams: [],
        role: 'Staff',
        openScienceTeamMember: true,
      };
      enable('PROJECT_WORKSPACE');
      await renderProjectDetail(
        Component,
        routeKeyword,
        mainProjectId,
        openScienceUser,
      );
      expect(screen.getByText('Workspace')).toBeInTheDocument();
    });

    it('does not render Workspace tab for non-Open-Science Staff users', async () => {
      const staffUser = {
        projects: [],
        teams: [],
        role: 'Staff',
        openScienceTeamMember: false,
      };
      enable('PROJECT_WORKSPACE');
      await renderProjectDetail(
        Component,
        routeKeyword,
        mainProjectId,
        staffUser,
      );
      expect(screen.queryByText('Workspace')).not.toBeInTheDocument();
    });

    it('does not render Workspace tab for users who are neither members nor Open Science', async () => {
      const outsider = {
        projects: [],
        teams: [],
        role: 'Grantee',
        openScienceTeamMember: false,
      };
      enable('PROJECT_WORKSPACE');
      await renderProjectDetail(
        Component,
        routeKeyword,
        mainProjectId,
        outsider,
      );
      expect(screen.queryByText('Workspace')).not.toBeInTheDocument();
    });

    it('renders create manuscript route via lazy loading', async () => {
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
      enable('PROJECT_WORKSPACE');
      await renderProjectDetail(
        Component,
        routeKeyword,
        noContactProjectId,
        noContactMemberUser,
        'workspace',
      );
      expect(
        await screen.findByRole('heading', { name: 'Compliance Review' }),
      ).toBeInTheDocument();
    });

    it('renders resubmit manuscript route via lazy loading', async () => {
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
      const openScienceUser = {
        projects: [],
        teams: [],
        role: 'Staff',
        openScienceTeamMember: true,
      };
      enable('PROJECT_WORKSPACE');
      await renderProjectDetail(
        Component,
        routeKeyword,
        mainProjectId,
        openScienceUser,
        'workspace/create-compliance-report/ms-1',
      );
      expect(
        await screen.findByTestId('mock-compliance-report-form'),
      ).toBeInTheDocument();
    });

    it('does not render create manuscript route for Open Science non-members', async () => {
      const openScienceUser = {
        projects: [],
        teams: [],
        role: 'Staff',
        openScienceTeamMember: true,
      };
      enable('PROJECT_WORKSPACE');
      await renderProjectDetail(
        Component,
        routeKeyword,
        mainProjectId,
        openScienceUser,
        'workspace/create-manuscript',
      );
      expect(
        screen.queryByTestId('mock-manuscript-form'),
      ).not.toBeInTheDocument();
    });

    it('does not render create compliance report route for project members without OS access', async () => {
      enable('PROJECT_WORKSPACE');
      await renderProjectDetail(
        Component,
        routeKeyword,
        mainProjectId,
        memberUser,
        'workspace/create-compliance-report/ms-1',
      );
      expect(
        screen.queryByTestId('mock-compliance-report-form'),
      ).not.toBeInTheDocument();
    });

    it('renders Outputs tab with count when flag is enabled', async () => {
      enable('PROJECT_OUTPUTS');
      await renderProjectDetail(Component, routeKeyword, mainProjectId);
      expect(screen.getByText(/^Outputs \(\d+\)$/)).toBeInTheDocument();
    });

    it('renders Draft Outputs tab with count when flag is enabled and user is a project member', async () => {
      enable('PROJECT_OUTPUTS');
      await renderProjectDetail(
        Component,
        routeKeyword,
        mainProjectId,
        memberUser,
      );
      expect(screen.getByText(/^Draft Outputs \(\d+\)$/)).toBeInTheDocument();
    });

    it('renders Draft Outputs tab with count when flag is enabled and user is a staff', async () => {
      enable('PROJECT_OUTPUTS');
      await renderProjectDetail(Component, routeKeyword, mainProjectId, {
        ...memberUser,
        projects: [],
        teams: [],
        role: 'Staff',
        openScienceTeamMember: false,
      });
      expect(screen.getByText(/^Draft Outputs \(\d+\)$/)).toBeInTheDocument();
    });

    it('does not render Draft Outputs tabs when user is not a project member or staff', async () => {
      enable('PROJECT_OUTPUTS');
      await renderProjectDetail(
        Component,
        routeKeyword,
        mainProjectId,
        nonMemberUser,
      );
      expect(screen.queryByText(/^Draft Outputs/)).not.toBeInTheDocument();
    });

    it('does not render Outputs or Draft Outputs tabs when flag is disabled', async () => {
      disable('PROJECT_OUTPUTS');
      await renderProjectDetail(Component, routeKeyword, mainProjectId);
      expect(screen.queryByText(/^Outputs/)).not.toBeInTheDocument();
      expect(screen.queryByText(/^Draft Outputs/)).not.toBeInTheDocument();
    });

    it('renders outputs list when navigating to outputs route', async () => {
      enable('PROJECT_OUTPUTS');
      await renderProjectDetail(
        Component,
        routeKeyword,
        mainProjectId,
        {},
        'outputs',
      );
      expect(
        await screen.findByText(
          /Tracing the Origin and Progression of Parkinson/i,
        ),
      ).toBeInTheDocument();
    });

    it('renders draft outputs list when navigating to draft-outputs route', async () => {
      enable('PROJECT_OUTPUTS');
      await renderProjectDetail(
        Component,
        routeKeyword,
        mainProjectId,
        memberUser,
        'draft-outputs',
      );
      expect(
        await screen.findByText(/Draft: Longitudinal cohort analysis/i),
      ).toBeInTheDocument();
    });

    it('does not render outputs list when flag is disabled', async () => {
      disable('PROJECT_OUTPUTS');
      await renderProjectDetail(
        Component,
        routeKeyword,
        mainProjectId,
        {},
        'outputs',
      );
      expect(
        screen.queryByText(/Tracing the Origin and Progression of Parkinson/i),
      ).not.toBeInTheDocument();
    });

    it('does not render draft outputs list when flag is disabled', async () => {
      disable('PROJECT_OUTPUTS');
      await renderProjectDetail(
        Component,
        routeKeyword,
        mainProjectId,
        {},
        'draft-outputs',
      );
      expect(
        screen.queryByText(/Draft: Longitudinal cohort analysis/i),
      ).not.toBeInTheDocument();
    });

    it('renders milestones route and covers hasSupplementGrant logic', async () => {
      await renderProjectDetail(
        Component,
        routeKeyword,
        supplementProjectId,
        {},
        'milestones',
      );
      expect(await screen.findByText('Supplement')).toBeInTheDocument();
    });

    it('builds correct manuscript hrefs from workspace callbacks', async () => {
      enable('PROJECT_WORKSPACE');
      await renderProjectDetail(
        Component,
        routeKeyword,
        mainProjectId,
        memberUser,
        'workspace',
      );
      await screen.findByRole('heading', { name: 'Compliance Review' });

      const getEditManuscriptHref =
        lastWorkspaceProps.getEditManuscriptHref as (
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

      const manuscriptId = 'manuscript-1';
      const workspaceRoute = getWorkspaceRoute(routeKeyword, mainProjectId);

      expect(getEditManuscriptHref(manuscriptId)).toBe(
        workspaceRoute.editManuscript({ manuscriptId }).$,
      );
      expect(getResubmitManuscriptHref(manuscriptId)).toBe(
        workspaceRoute.resubmitManuscript({ manuscriptId }).$,
      );
      expect(getCreateComplianceReportHref(manuscriptId)).toBe(
        workspaceRoute.createComplianceReport({ manuscriptId }).$,
      );
    });
  },
);

// --- Variant-specific tests ---

describe('DiscoveryProjectDetail - specific', () => {
  it('passes manuscripts and collaborationManuscripts to ProjectWorkspace', async () => {
    const memberUser = {
      id: 'user-team',
      projects: [],
      teams: [{ id: 'team-1', role: 'Project Manager' }],
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
      id: 'user-team',
      projects: [],
      teams: [{ id: 'team-1', role: 'Project Manager' }],
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

  describe('Duplicate Output', () => {
    const teamResponse = createTeamResponse();
    const memberUser = {
      id: 'user-team',
      projects: [],
      teams: [{ id: teamResponse.id, role: 'Project Manager' }],
      role: 'Grantee',
    };
    it('allows a user who is a member of the primary team duplicate the output', async () => {
      const researchOutput: ResearchOutputTeamResponse = {
        ...createResearchOutputResponse(),
        id: '123',
        workingGroups: undefined,
        teams: [
          {
            displayName: teamResponse.displayName,
            id: teamResponse.id,
            teamType: 'Discovery Team',
          },
        ],
        title: 'Example',
        link: 'http://example.com',
      };
      mockUseResearchOutputById.mockReturnValue(researchOutput);

      enable('PROJECT_OUTPUTS');
      await renderProjectDetail(
        DiscoveryProjectDetail,
        'discovery',
        'discovery-1',
        memberUser,
        `duplicate/${researchOutput.id}`,
      );
      expect(await screen.findByLabelText(/Title/i)).toHaveValue(
        'Copy of Example',
      );
      expect(screen.getByLabelText(/URL/i)).toHaveValue('');
    });

    it('will show a page not found if research output does not exist', async () => {
      mockUseResearchOutputById.mockReturnValue(undefined);

      enable('PROJECT_OUTPUTS');
      await renderProjectDetail(
        DiscoveryProjectDetail,
        'discovery',
        'discovery-1',
        memberUser,
        `duplicate/randomId`,
      );
      expect(screen.getByText(/sorry.+page/i)).toBeVisible();
    });
  });
});

describe('ResourceProjectDetail - specific', () => {
  it('resolves contactName from collaborators when no member matches contactEmail', async () => {
    const memberUser = {
      id: 'user-team',
      projects: [],
      teams: [{ id: 'team-1', role: 'Project Manager' }],
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
