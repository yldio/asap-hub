import { Suspense, FC } from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render, screen, waitFor } from '@testing-library/react';
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

const mockDiscoveryProjectNoContact: DiscoveryProjectDetailType = {
  ...mockDiscoveryProject,
  id: 'discovery-no-contact',
  contactEmail: '',
  collaborators: [],
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
      'resource-1': mockResourceProject,
      'resource-no-contact': mockResourceProjectNoContact,
      'resource-collab': mockResourceProjectCollabContact,
      'trainee-1': mockTraineeProject,
      'trainee-no-contact': mockTraineeProjectNoContact,
    };
    return map[id];
  }),
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
  },
  {
    name: 'ResourceProjectDetail',
    Component: ResourceProjectDetail,
    routeKeyword: 'resource',
    mainProjectId: 'resource-1',
    mainProjectTitle: 'Resource Project 1',
    noContactProjectId: 'resource-no-contact',
    wrongTypeProjectId: 'discovery-1',
  },
  {
    name: 'TraineeProjectDetail',
    Component: TraineeProjectDetail,
    routeKeyword: 'trainee',
    mainProjectId: 'trainee-1',
    mainProjectTitle: 'Trainee Project 1',
    noContactProjectId: 'trainee-no-contact',
    wrongTypeProjectId: 'discovery-1',
  },
];

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
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
      document.cookie = 'ASAP_PROJECT_WORKSPACE=true';
      await renderProjectDetail(
        Component,
        routeKeyword,
        mainProjectId,
        memberUser,
      );
      expect(screen.getByText('Workspace')).toBeInTheDocument();
      document.cookie =
        'ASAP_PROJECT_WORKSPACE=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    });

    it('does not render Workspace tab when flag is disabled', async () => {
      await renderProjectDetail(Component, routeKeyword, mainProjectId);
      expect(screen.queryByText('Workspace')).not.toBeInTheDocument();
    });

    it('renders workspace route with Compliance Review heading', async () => {
      const memberUser = {
        projects: [{ id: mainProjectId }],
        role: 'Grantee',
      };
      document.cookie = 'ASAP_PROJECT_WORKSPACE=true';
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
      document.cookie =
        'ASAP_PROJECT_WORKSPACE=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    });

    it('renders Workspace tab for Staff users even without project membership', async () => {
      const staffUser = {
        projects: [],
        role: 'Staff',
      };
      document.cookie = 'ASAP_PROJECT_WORKSPACE=true';
      await renderProjectDetail(
        Component,
        routeKeyword,
        mainProjectId,
        staffUser,
      );
      expect(screen.getByText('Workspace')).toBeInTheDocument();
      document.cookie =
        'ASAP_PROJECT_WORKSPACE=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    });

    it('renders create manuscript route via lazy loading', async () => {
      const memberUser = {
        projects: [{ id: mainProjectId }],
        role: 'Grantee',
      };
      document.cookie = 'ASAP_PROJECT_WORKSPACE=true';
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
      document.cookie =
        'ASAP_PROJECT_WORKSPACE=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    });

    it('renders edit manuscript route via lazy loading', async () => {
      const memberUser = {
        projects: [{ id: mainProjectId }],
        role: 'Grantee',
      };
      document.cookie = 'ASAP_PROJECT_WORKSPACE=true';
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
      document.cookie =
        'ASAP_PROJECT_WORKSPACE=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    });

    it('renders workspace when project has no contactEmail', async () => {
      const memberUser = {
        projects: [{ id: noContactProjectId }],
        role: 'Grantee',
      };
      document.cookie = 'ASAP_PROJECT_WORKSPACE=true';
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
      document.cookie =
        'ASAP_PROJECT_WORKSPACE=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    });

    it('renders resubmit manuscript route via lazy loading', async () => {
      const memberUser = {
        projects: [{ id: mainProjectId }],
        role: 'Grantee',
      };
      document.cookie = 'ASAP_PROJECT_WORKSPACE=true';
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
      document.cookie =
        'ASAP_PROJECT_WORKSPACE=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    });
  },
);

// --- Variant-specific tests ---

describe('DiscoveryProjectDetail - specific', () => {
  it('renders workspace with contact name from collaborators', async () => {
    const memberUser = {
      projects: [{ id: 'discovery-1' }],
      role: 'Grantee',
    };
    document.cookie = 'ASAP_PROJECT_WORKSPACE=true';
    await renderProjectDetail(
      DiscoveryProjectDetail,
      'discovery',
      'discovery-1',
      memberUser,
      'workspace',
    );
    await screen.findByRole('heading', { name: 'Compliance Review' });
    expect(lastWorkspaceProps.contactName).toBe('Jane Contact');
    document.cookie =
      'ASAP_PROJECT_WORKSPACE=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  });

  it('passes manuscripts and collaborationManuscripts from projectDetail to workspace', async () => {
    const memberUser = {
      projects: [{ id: 'discovery-1' }],
      role: 'Grantee',
    };
    document.cookie = 'ASAP_PROJECT_WORKSPACE=true';
    await renderProjectDetail(
      DiscoveryProjectDetail,
      'discovery',
      'discovery-1',
      memberUser,
      'workspace',
    );
    await screen.findByRole('heading', { name: 'Compliance Review' });
    // mockDiscoveryProject doesn't have manuscripts fields → defaults to []
    expect(lastWorkspaceProps.manuscripts).toEqual([]);
    expect(lastWorkspaceProps.collaborationManuscripts).toEqual([]);
    document.cookie =
      'ASAP_PROJECT_WORKSPACE=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  });
});

describe('ResourceProjectDetail - specific', () => {
  it('resolves contactName from collaborators when no member matches contactEmail', async () => {
    const memberUser = {
      projects: [{ id: 'resource-collab' }],
      role: 'Grantee',
    };
    document.cookie = 'ASAP_PROJECT_WORKSPACE=true';
    await renderProjectDetail(
      ResourceProjectDetail,
      'resource',
      'resource-collab',
      memberUser,
      'workspace',
    );
    await screen.findByRole('heading', { name: 'Compliance Review' });
    expect(lastWorkspaceProps.contactName).toBe('Jane Collaborator');
    document.cookie =
      'ASAP_PROJECT_WORKSPACE=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  });
});
