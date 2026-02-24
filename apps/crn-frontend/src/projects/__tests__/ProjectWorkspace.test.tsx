import { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render, screen, waitFor } from '@testing-library/react';

import { Auth0Provider, WhenReady } from '../../auth/test-utils';

import ProjectWorkspace from '../ProjectWorkspace';
import { ManuscriptToastProvider } from '../../network/teams/ManuscriptToastProvider';
import { EligibilityReasonProvider } from '../../network/teams/EligibilityReasonProvider';

jest.mock('../../network/teams/state', () => ({
  useIsComplianceReviewer: jest.fn(() => false),
  usePutManuscript: jest.fn(() => jest.fn().mockResolvedValue({})),
  useCreateDiscussion: jest.fn(() => jest.fn().mockResolvedValue('disc-1')),
  useReplyToDiscussion: jest
    .fn()
    .mockReturnValue(jest.fn().mockResolvedValue(undefined)),
  useMarkDiscussionAsRead: jest
    .fn()
    .mockReturnValue(jest.fn().mockResolvedValue(undefined)),
  useManuscriptById: jest.fn(() => [undefined, jest.fn()]),
}));

const renderProjectWorkspace = async (
  overrides: Partial<React.ComponentProps<typeof ProjectWorkspace>> = {},
) => {
  const defaultProps: React.ComponentProps<typeof ProjectWorkspace> = {
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
});
