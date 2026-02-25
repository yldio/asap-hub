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

jest.mock('../useManuscriptToast', () => ({
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
    return (
      <div>
        <h2>Compliance Review</h2>
        {props.isProjectMember && (
          <>
            <h3>Collaboration Tools (Project Only)</h3>
            <a href={props.toolsHref as string}>Add Collaboration Tools</a>
          </>
        )}
        {props.isTeamBased && (
          <>
            <h4>Team Submission</h4>
            <h4>Collaborator Submission</h4>
          </>
        )}
        {!props.isProjectMember &&
          (props.manuscripts as string[])?.length === 0 && (
            <p>
              This project has not submitted a manuscript for compliance review.
            </p>
          )}
      </div>
    );
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
  it('renders the workspace with Compliance Review heading', async () => {
    await renderProjectWorkspace();
    expect(
      screen.getByRole('heading', { name: 'Compliance Review' }),
    ).toBeInTheDocument();
  });

  it('renders Collaboration Tools section for project members', async () => {
    await renderProjectWorkspace({ isProjectMember: true });
    expect(
      screen.getByRole('heading', {
        name: 'Collaboration Tools (Project Only)',
      }),
    ).toBeInTheDocument();
  });

  it('does not render Collaboration Tools section for non-project members', async () => {
    await renderProjectWorkspace({ isProjectMember: false });
    expect(
      screen.queryByRole('heading', {
        name: 'Collaboration Tools (Project Only)',
      }),
    ).not.toBeInTheDocument();
  });

  it('renders team-based submission sections when isTeamBased is true', async () => {
    await renderProjectWorkspace({ isTeamBased: true });
    expect(screen.getByText('Team Submission')).toBeInTheDocument();
    expect(screen.getByText('Collaborator Submission')).toBeInTheDocument();
  });

  it('does not render team submission sections when isTeamBased is false', async () => {
    await renderProjectWorkspace({ isTeamBased: false });
    expect(screen.queryByText('Team Submission')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Collaborator Submission'),
    ).not.toBeInTheDocument();
  });

  it('renders empty state text when no manuscripts exist', async () => {
    await renderProjectWorkspace({ manuscripts: [], isProjectMember: false });
    expect(
      screen.getByText(
        'This project has not submitted a manuscript for compliance review.',
      ),
    ).toBeInTheDocument();
  });

  it('renders Add Collaboration Tools button for project members', async () => {
    await renderProjectWorkspace({ isProjectMember: true });
    expect(screen.getByText('Add Collaboration Tools')).toBeInTheDocument();
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
