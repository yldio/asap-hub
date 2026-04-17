import { ComponentProps, Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { MemoryRouter, Route, Routes } from 'react-router';
import { act, render, screen, waitFor } from '@testing-library/react';
import { BackendError } from '@asap-hub/frontend-utils';

import { Auth0Provider, WhenReady } from '../../auth/test-utils';

import ProjectWorkspace from '../ProjectWorkspace';
import { ManuscriptToastProvider } from '../../network/teams/ManuscriptToastProvider';
import { EligibilityReasonProvider } from '../../network/teams/EligibilityReasonProvider';

const mockUpdateManuscript = jest.fn().mockResolvedValue({});
const mockCreateDiscussion = jest.fn().mockResolvedValue('disc-1');
const mockReplyToDiscussion = jest.fn().mockResolvedValue(undefined);
const mockMarkDiscussionAsRead = jest.fn().mockResolvedValue(undefined);
const mockSetFormType = jest.fn();

jest.mock('../../network/teams/state', () => ({
  useBatchManuscriptsByIds: jest.fn(),
  useIsComplianceReviewer: jest.fn(() => false),
  usePutManuscript: jest.fn(() => mockUpdateManuscript),
  useCreateDiscussion: jest.fn(() => mockCreateDiscussion),
  useReplyToDiscussion: jest.fn(() => mockReplyToDiscussion),
  useMarkDiscussionAsRead: jest.fn(() => mockMarkDiscussionAsRead),
  useManuscriptById: jest.fn(() => [undefined, jest.fn()]),
}));

jest.mock('../../network/teams/useManuscriptToast', () => ({
  useManuscriptToast: jest.fn(() => ({
    setFormType: mockSetFormType,
  })),
}));

const mockPatchProject = jest.fn().mockResolvedValue({});

jest.mock('../state', () => ({
  ...jest.requireActual('../state'),
  usePatchProjectById: jest.fn(() => mockPatchProject),
}));

type CapturedProps = Record<string, unknown> & {
  onUpdateManuscript: (id: string, payload: unknown) => Promise<unknown>;
  createDiscussion: (
    manuscriptId: string,
    title: string,
    message: string,
  ) => Promise<string | undefined>;
  onReplyToDiscussion: (
    manuscriptId: string,
    discussionId: string,
    patch: unknown,
  ) => Promise<void>;
  onMarkDiscussionAsRead: (
    manuscriptId: string,
    discussionId: string,
  ) => Promise<void>;
  onDeleteTool: (toolIndex: number) => Promise<void>;
};

let capturedProps: CapturedProps;
let capturedConfirmModalProps: Record<string, unknown>;
let capturedToolModalProps: Record<string, unknown>;

jest.mock('@asap-hub/react-components', () => ({
  __esModule: true,
  ProjectProfileWorkspace: (props: CapturedProps) => {
    capturedProps = props;
    return <div data-testid="project-profile-workspace" />;
  },
  ToolModal: (props: Record<string, unknown>) => {
    capturedToolModalProps = props;
    return <div data-testid="tool-modal" />;
  },
  NotFoundPage: () => <div data-testid="not-found" />,
  ConfirmModal: (props: Record<string, unknown>) => {
    capturedConfirmModalProps = props;
    return <div data-testid="confirm-modal" />;
  },
}));

const renderProjectWorkspace = async (
  overrides: Partial<ComponentProps<typeof ProjectWorkspace>> = {},
) => {
  const defaultProps: ComponentProps<typeof ProjectWorkspace> = {
    id: 'proj-1',
    isProjectMember: true,
    isTeamBased: true,
    manuscripts: [],
    collaborationManuscripts: [],
    tools: [],
    lastModifiedDate: new Date().toISOString(),
    toolsHref: '/workspace/tools',
    editToolHref: (i: number) => `/workspace/tools/${i}`,
    isActiveProject: true,
    createManuscriptHref: '/workspace/create-manuscript',
    workspaceHref: '/projects/discovery/proj-1/workspace',
    ...overrides,
  };

  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter
              initialEntries={['/projects/discovery/proj-1/workspace']}
            >
              <Routes>
                <Route
                  path="/projects/discovery/:projectId/workspace/*"
                  element={
                    <ManuscriptToastProvider>
                      <EligibilityReasonProvider>
                        <ProjectWorkspace {...defaultProps} />
                      </EligibilityReasonProvider>
                    </ManuscriptToastProvider>
                  }
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

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(console, 'error').mockImplementation(() => {});
  window.scrollTo = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('ProjectWorkspace', () => {
  it('renders the ProjectProfileWorkspace component', async () => {
    await renderProjectWorkspace();
    expect(screen.getByTestId('project-profile-workspace')).toBeInTheDocument();
  });

  it('passes correct props to ProjectProfileWorkspace', async () => {
    await renderProjectWorkspace({
      id: 'proj-1',
      isProjectMember: true,
      isTeamBased: true,
      manuscripts: [],
      tools: [],
    });
    expect(capturedProps.id).toBe('proj-1');
    expect(capturedProps.isProjectMember).toBe(true);
    expect(capturedProps.isTeamBased).toBe(true);
    expect(capturedProps.manuscripts).toEqual([]);
    expect(capturedProps.tools).toEqual([]);
    expect(capturedProps.setEligibilityReasons).toBeDefined();
    expect(capturedProps.useManuscriptById).toBeDefined();
    expect(capturedProps.onUpdateManuscript).toBeDefined();
    expect(capturedProps.isComplianceReviewer).toBe(false);
  });

  it('preloads manuscript ids for the workspace', async () => {
    const { useBatchManuscriptsByIds } = jest.requireMock(
      '../../network/teams/state',
    ) as {
      useBatchManuscriptsByIds: jest.Mock;
    };

    await renderProjectWorkspace({
      manuscripts: ['manuscript-1'],
      collaborationManuscripts: ['manuscript-2'],
    });

    expect(useBatchManuscriptsByIds).toHaveBeenCalledWith([
      'manuscript-1',
      'manuscript-2',
    ]);
  });

  describe('handleUpdateManuscript', () => {
    it('calls updateManuscript with correct arguments', async () => {
      await renderProjectWorkspace();
      await act(async () => {
        await capturedProps.onUpdateManuscript('ms-1', {
          status: 'Review Completed',
        });
      });
      expect(mockUpdateManuscript).toHaveBeenCalledWith('ms-1', {
        status: 'Review Completed',
      });
    });
  });

  describe('handleCreateDiscussion', () => {
    it('calls createDiscussion and sets success toast on success', async () => {
      await renderProjectWorkspace();
      let result: string | undefined;
      await act(async () => {
        result = await capturedProps.createDiscussion(
          'ms-1',
          'Test Title',
          'Test message',
        );
      });
      expect(mockCreateDiscussion).toHaveBeenCalledWith(
        'ms-1',
        'Test Title',
        'Test message',
      );
      expect(result).toBe('disc-1');
      expect(mockSetFormType).toHaveBeenCalledWith({
        type: 'discussion-started',
        accent: 'successLarge',
      });
    });

    it('sets manuscript-status-error toast on 403 BackendError', async () => {
      mockCreateDiscussion.mockRejectedValueOnce(
        new BackendError(
          'Forbidden',
          { error: 'Forbidden', statusCode: 403, message: 'Forbidden' },
          403,
        ),
      );
      await renderProjectWorkspace();
      let result: string | undefined;
      await act(async () => {
        result = await capturedProps.createDiscussion(
          'ms-1',
          'Title',
          'Message',
        );
      });
      expect(result).toBeUndefined();
      expect(mockSetFormType).toHaveBeenCalledWith({
        type: 'manuscript-status-error',
        accent: 'error',
      });
      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      });
    });

    it('sets default-error toast on non-403 error', async () => {
      mockCreateDiscussion.mockRejectedValueOnce(new Error('Server Error'));
      await renderProjectWorkspace();
      let result: string | undefined;
      await act(async () => {
        result = await capturedProps.createDiscussion(
          'ms-1',
          'Title',
          'Message',
        );
      });
      expect(result).toBeUndefined();
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

  describe('handleReplyToDiscussion', () => {
    it('calls replyToDiscussion and sets success toast on success', async () => {
      await renderProjectWorkspace();
      await act(async () => {
        await capturedProps.onReplyToDiscussion('ms-1', 'disc-1', {
          text: 'Reply text',
          manuscriptId: 'ms-1',
        });
      });
      expect(mockReplyToDiscussion).toHaveBeenCalledWith('ms-1', 'disc-1', {
        text: 'Reply text',
        manuscriptId: 'ms-1',
      });
      expect(mockSetFormType).toHaveBeenCalledWith({
        type: 'reply-to-discussion',
        accent: 'successLarge',
      });
    });

    it('sets manuscript-status-error toast on 403 BackendError', async () => {
      mockReplyToDiscussion.mockRejectedValueOnce(
        new BackendError(
          'Forbidden',
          { error: 'Forbidden', statusCode: 403, message: 'Forbidden' },
          403,
        ),
      );
      await renderProjectWorkspace();
      await act(async () => {
        await capturedProps.onReplyToDiscussion('ms-1', 'disc-1', {
          text: 'Reply',
          manuscriptId: 'ms-1',
        });
      });
      expect(mockSetFormType).toHaveBeenCalledWith({
        type: 'manuscript-status-error',
        accent: 'error',
      });
      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      });
    });

    it('sets default-error toast on non-403 error', async () => {
      mockReplyToDiscussion.mockRejectedValueOnce(new Error('Server Error'));
      await renderProjectWorkspace();
      await act(async () => {
        await capturedProps.onReplyToDiscussion('ms-1', 'disc-1', {
          text: 'Reply',
          manuscriptId: 'ms-1',
        });
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

  describe('handleMarkDiscussionAsRead', () => {
    it('calls markDiscussionAsRead with correct arguments', async () => {
      await renderProjectWorkspace();
      await act(async () => {
        await capturedProps.onMarkDiscussionAsRead('ms-1', 'disc-1');
      });
      expect(mockMarkDiscussionAsRead).toHaveBeenCalledWith('ms-1', 'disc-1');
    });
  });

  describe('onDeleteTool', () => {
    it('shows ConfirmModal when onDeleteTool is called', async () => {
      await renderProjectWorkspace({
        tools: [{ name: 'Slack', url: 'https://slack.com', description: '' }],
      });
      expect(screen.queryByTestId('confirm-modal')).not.toBeInTheDocument();

      await act(async () => {
        await capturedProps.onDeleteTool(0);
      });

      expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();
    });

    it('deletes tool and closes modal on confirm', async () => {
      await renderProjectWorkspace({
        tools: [
          { name: 'Slack', url: 'https://slack.com', description: '' },
          { name: 'Jira', url: 'https://jira.com', description: '' },
        ],
      });

      await act(async () => {
        await capturedProps.onDeleteTool(0);
      });

      await act(async () => {
        await (capturedConfirmModalProps.onSave as () => Promise<void>)();
      });

      expect(mockPatchProject).toHaveBeenCalledWith({
        tools: [{ name: 'Jira', url: 'https://jira.com', description: '' }],
      });
      expect(screen.queryByTestId('confirm-modal')).not.toBeInTheDocument();
    });

    it('closes modal on cancel without deleting', async () => {
      await renderProjectWorkspace({
        tools: [{ name: 'Slack', url: 'https://slack.com', description: '' }],
      });

      await act(async () => {
        await capturedProps.onDeleteTool(0);
      });
      expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();

      act(() => {
        (capturedConfirmModalProps.onCancel as () => void)();
      });

      await waitFor(() => {
        expect(screen.queryByTestId('confirm-modal')).not.toBeInTheDocument();
      });
      expect(mockPatchProject).not.toHaveBeenCalled();
    });
  });

  describe('tool routes', () => {
    it('renders ToolModal on /tools route', async () => {
      render(
        <RecoilRoot>
          <Suspense fallback="loading">
            <Auth0Provider user={{}}>
              <WhenReady>
                <MemoryRouter
                  initialEntries={[
                    '/projects/discovery/proj-1/workspace/tools',
                  ]}
                >
                  <Routes>
                    <Route
                      path="/projects/discovery/:projectId/workspace/*"
                      element={
                        <ManuscriptToastProvider>
                          <EligibilityReasonProvider>
                            <ProjectWorkspace
                              id="proj-1"
                              isProjectMember
                              isTeamBased
                              manuscripts={[]}
                              collaborationManuscripts={[]}
                              tools={[]}
                              lastModifiedDate={new Date().toISOString()}
                              toolsHref="/workspace/tools"
                              editToolHref={(i) => `/workspace/tools/tool/${i}`}
                              isActiveProject
                              createManuscriptHref="/workspace/create-manuscript"
                              workspaceHref="/projects/discovery/proj-1/workspace"
                            />
                          </EligibilityReasonProvider>
                        </ManuscriptToastProvider>
                      }
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

      expect(screen.getByTestId('tool-modal')).toBeInTheDocument();
      expect(capturedToolModalProps.title).toBe('Add Collaboration Tool');
      expect(capturedToolModalProps.saveButtonText).toBe('Add Tool');
    });

    it('renders ToolModal for editing on /tools/tool/:toolIndex route', async () => {
      render(
        <RecoilRoot>
          <Suspense fallback="loading">
            <Auth0Provider user={{}}>
              <WhenReady>
                <MemoryRouter
                  initialEntries={[
                    '/projects/discovery/proj-1/workspace/tools/tool/0',
                  ]}
                >
                  <Routes>
                    <Route
                      path="/projects/discovery/:projectId/workspace/*"
                      element={
                        <ManuscriptToastProvider>
                          <EligibilityReasonProvider>
                            <ProjectWorkspace
                              id="proj-1"
                              isProjectMember
                              isTeamBased
                              manuscripts={[]}
                              collaborationManuscripts={[]}
                              tools={[
                                {
                                  name: 'Slack',
                                  url: 'https://slack.com',
                                  description: 'Team chat',
                                },
                              ]}
                              lastModifiedDate={new Date().toISOString()}
                              toolsHref="/workspace/tools"
                              editToolHref={(i) => `/workspace/tools/tool/${i}`}
                              isActiveProject
                              createManuscriptHref="/workspace/create-manuscript"
                              workspaceHref="/projects/discovery/proj-1/workspace"
                            />
                          </EligibilityReasonProvider>
                        </ManuscriptToastProvider>
                      }
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

      expect(screen.getByTestId('tool-modal')).toBeInTheDocument();
      expect(capturedToolModalProps.title).toBe('Edit Collaboration Tool');
      expect(capturedToolModalProps.saveButtonText).toBe('Save Changes');
      expect(capturedToolModalProps.name).toBe('Slack');
    });

    it('renders NotFoundPage for invalid tool index', async () => {
      render(
        <RecoilRoot>
          <Suspense fallback="loading">
            <Auth0Provider user={{}}>
              <WhenReady>
                <MemoryRouter
                  initialEntries={[
                    '/projects/discovery/proj-1/workspace/tools/tool/99',
                  ]}
                >
                  <Routes>
                    <Route
                      path="/projects/discovery/:projectId/workspace/*"
                      element={
                        <ManuscriptToastProvider>
                          <EligibilityReasonProvider>
                            <ProjectWorkspace
                              id="proj-1"
                              isProjectMember
                              isTeamBased
                              manuscripts={[]}
                              collaborationManuscripts={[]}
                              tools={[
                                {
                                  name: 'Slack',
                                  url: 'https://slack.com',
                                  description: '',
                                },
                              ]}
                              lastModifiedDate={new Date().toISOString()}
                              toolsHref="/workspace/tools"
                              editToolHref={(i) => `/workspace/tools/tool/${i}`}
                              isActiveProject
                              createManuscriptHref="/workspace/create-manuscript"
                              workspaceHref="/projects/discovery/proj-1/workspace"
                            />
                          </EligibilityReasonProvider>
                        </ManuscriptToastProvider>
                      }
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

      expect(screen.getByTestId('not-found')).toBeInTheDocument();
    });

    it('calls patchProject with updated tool on edit save', async () => {
      render(
        <RecoilRoot>
          <Suspense fallback="loading">
            <Auth0Provider user={{}}>
              <WhenReady>
                <MemoryRouter
                  initialEntries={[
                    '/projects/discovery/proj-1/workspace/tools/tool/0',
                  ]}
                >
                  <Routes>
                    <Route
                      path="/projects/discovery/:projectId/workspace/*"
                      element={
                        <ManuscriptToastProvider>
                          <EligibilityReasonProvider>
                            <ProjectWorkspace
                              id="proj-1"
                              isProjectMember
                              isTeamBased
                              manuscripts={[]}
                              collaborationManuscripts={[]}
                              tools={[
                                {
                                  name: 'Slack',
                                  url: 'https://slack.com',
                                  description: '',
                                },
                              ]}
                              lastModifiedDate={new Date().toISOString()}
                              toolsHref="/workspace/tools"
                              editToolHref={(i) => `/workspace/tools/tool/${i}`}
                              isActiveProject
                              createManuscriptHref="/workspace/create-manuscript"
                              workspaceHref="/projects/discovery/proj-1/workspace"
                            />
                          </EligibilityReasonProvider>
                        </ManuscriptToastProvider>
                      }
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

      const updatedTool = {
        name: 'Updated Slack',
        url: 'https://slack.com/new',
        description: 'Updated',
      };

      await act(async () => {
        await (
          capturedToolModalProps.onSave as (data: unknown) => Promise<void>
        )(updatedTool);
      });

      expect(mockPatchProject).toHaveBeenCalledWith({
        tools: [updatedTool],
      });
    });

    it('calls patchProject with new tool on add save', async () => {
      render(
        <RecoilRoot>
          <Suspense fallback="loading">
            <Auth0Provider user={{}}>
              <WhenReady>
                <MemoryRouter
                  initialEntries={[
                    '/projects/discovery/proj-1/workspace/tools',
                  ]}
                >
                  <Routes>
                    <Route
                      path="/projects/discovery/:projectId/workspace/*"
                      element={
                        <ManuscriptToastProvider>
                          <EligibilityReasonProvider>
                            <ProjectWorkspace
                              id="proj-1"
                              isProjectMember
                              isTeamBased
                              manuscripts={[]}
                              collaborationManuscripts={[]}
                              tools={[
                                {
                                  name: 'Slack',
                                  url: 'https://slack.com',
                                  description: '',
                                },
                              ]}
                              lastModifiedDate={new Date().toISOString()}
                              toolsHref="/workspace/tools"
                              editToolHref={(i) => `/workspace/tools/tool/${i}`}
                              isActiveProject
                              createManuscriptHref="/workspace/create-manuscript"
                              workspaceHref="/projects/discovery/proj-1/workspace"
                            />
                          </EligibilityReasonProvider>
                        </ManuscriptToastProvider>
                      }
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

      const newTool = {
        name: 'Jira',
        url: 'https://jira.com',
        description: 'Tracking',
      };

      await act(async () => {
        await (
          capturedToolModalProps.onSave as (data: unknown) => Promise<void>
        )(newTool);
      });

      expect(mockPatchProject).toHaveBeenCalledWith({
        tools: [
          { name: 'Slack', url: 'https://slack.com', description: '' },
          newTool,
        ],
      });
    });
  });
});
