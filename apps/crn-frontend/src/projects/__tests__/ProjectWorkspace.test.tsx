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
};

let capturedProps: CapturedProps;

jest.mock('@asap-hub/react-components', () => ({
  __esModule: true,
  ProjectProfileWorkspace: (props: CapturedProps) => {
    capturedProps = props;
    return <div data-testid="project-profile-workspace" />;
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
                  path="/projects/discovery/:projectId/workspace"
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
});
