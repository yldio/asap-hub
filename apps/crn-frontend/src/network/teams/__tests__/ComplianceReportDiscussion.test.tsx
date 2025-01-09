import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import {
  createDiscussionResponse,
  createManuscriptResponse,
  createMessage,
  createTeamResponse,
} from '@asap-hub/fixtures';
import { enable } from '@asap-hub/flags';
import { ManuscriptVersion, TeamManuscript } from '@asap-hub/model';
import { network } from '@asap-hub/routing';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactNode, Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { getDiscussion, updateDiscussion } from '../api';
import {
  useIsComplianceReviewer,
  useReplyToDiscussion,
  useVersionById,
  useEndDiscussion,
} from '../state';
import { useManuscriptToast } from '../useManuscriptToast';
import Workspace from '../Workspace';

jest.setTimeout(60000);

jest.mock('../api', () => ({
  patchTeam: jest.fn(),
  updateManuscript: jest.fn().mockResolvedValue({}),
  getDiscussion: jest.fn(),
  updateDiscussion: jest.fn(),
  createComplianceDiscussion: jest.fn(),
}));

jest.mock('../state', () => ({
  ...jest.requireActual('../state'),
  useVersionById: jest.fn(),
  useReplyToDiscussion: jest.fn(),
  useIsComplianceReviewer: jest.fn(),
  useEndDiscussion: jest.fn(),
}));

jest.mock('../useManuscriptToast', () => ({
  useManuscriptToast: jest.fn(),
}));

const manuscript = createManuscriptResponse();
const complianceReport = {
  id: 'compliance-report-id',
  url: 'http://example.com/file.pdf',
  description: 'A description',
  count: 1,
  createdDate: '2024-12-10T20:36:54Z',
  createdBy: {
    displayName: 'John Doe',
    email: 'john@doe.com',
    firstName: 'John',
    lastName: 'Doe',
    avatarUrl: 'http://example.com/avatar.jpg',
    teams: [
      {
        id: 'team-1',
        name: 'Team 1',
      },
    ],
    id: 'user-1',
  },
};
const manuscriptVersion = {
  ...manuscript.versions[0],
  complianceReport,
} as ManuscriptVersion;
const mockManuscript = {
  id: `manuscript_1`,
  title: `Manuscript 1`,
  teamId: 'team-1',
  status: 'Waiting for Report',
  count: 1,
  versions: [manuscriptVersion],
  grantId: 'grand-id',
};
const version = createManuscriptResponse().versions[0] as ManuscriptVersion;

const mockVersionData = {
  ...version,
  complianceReport: {
    ...version.complianceReport,
    discussionId: 'discussion-id',
  },
};

const mockGetDiscussion = getDiscussion as jest.MockedFunction<
  typeof getDiscussion
>;
const mockUpdateDiscussion = updateDiscussion as jest.MockedFunction<
  typeof updateDiscussion
>;

const endDiscussion = jest.fn();

const id = '42';

const renderWithWrapper = (
  children: ReactNode,
  user = {},
): ReturnType<typeof render> =>
  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={user}>
          <WhenReady>
            <MemoryRouter
              initialEntries={[
                network({}).teams({}).team({ teamId: id }).workspace({}).$,
              ]}
            >
              <Route
                path={
                  network.template +
                  network({}).teams.template +
                  network({}).teams({}).team.template +
                  network({}).teams({}).team({ teamId: id }).workspace.template
                }
              >
                {children}
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
const mockSetVersion = jest.fn();

describe('compliance report discussion', () => {
  manuscript.versions[0]!.acknowledgedGrantNumber = 'No';
  const reply = createMessage('when can this be completed?');
  const quickCheckResponse = 'We have not been able to complete this yet';
  const acknowledgedGrantNumberDiscussion = createDiscussionResponse(
    quickCheckResponse,
    [reply],
  );
  manuscript.versions[0]!.acknowledgedGrantNumberDetails =
    acknowledgedGrantNumberDiscussion;
  beforeEach(() => {
    mockGetDiscussion.mockImplementation(
      async () => acknowledgedGrantNumberDiscussion,
    );

    (useVersionById as jest.Mock).mockImplementation(() => [
      {
        ...mockManuscript.versions[0],
        acknowledgedGrantNumberDetails: acknowledgedGrantNumberDiscussion,
        acknowledgedGrantNumber: 'No',
      },
      mockSetVersion,
    ]);

    mockGetDiscussion.mockResolvedValue(acknowledgedGrantNumberDiscussion);
    mockUpdateDiscussion.mockResolvedValue(acknowledgedGrantNumberDiscussion);
  });

  it('calls setFormType with error when replyToDiscussion fails', async () => {
    jest.spyOn(console, 'error').mockImplementation();
    enable('DISPLAY_MANUSCRIPTS');

    (getDiscussion as jest.Mock).mockImplementation(() => ({
      id: 'discussion-id',
      message: {
        text: 'Nam adipiscing',
        createdBy: {
          id: '6D9SxLvttLIYKHqpfW7slJ',
          firstName: 'Amin',
          lastName: 'Aimeur',
          displayName: 'Amin Aimeur',
          teams: [
            {
              id: 'team-id',
              name: 'test-team',
            },
          ],
        },
        createdDate: '2024-12-31T05:28:42.353Z',
      },
      replies: [],
    }));

    const mockSetFormType = jest.fn();
    (useManuscriptToast as jest.Mock).mockImplementation(() => ({
      setFormType: mockSetFormType,
    }));

    const replyToDiscussion = jest
      .fn()
      .mockImplementation(() =>
        Promise.reject(new Error('Failed to reply to discussion')),
      );

    (useReplyToDiscussion as jest.Mock).mockReturnValue(replyToDiscussion);

    mockGetDiscussion.mockImplementation(
      async () => acknowledgedGrantNumberDiscussion,
    );

    (useVersionById as jest.Mock).mockImplementation(() => [
      {
        ...mockVersionData,
        complianceReport: {
          ...complianceReport,
          discussionId: 'discussion-id',
        },
      },
      mockSetVersion,
    ]);

    (useIsComplianceReviewer as jest.Mock).mockImplementation(() => true);

    const { findByTestId, getByText, getByTestId, getByLabelText } =
      renderWithWrapper(
        <Workspace
          team={{
            ...createTeamResponse(),
            manuscripts: [
              {
                ...mockManuscript,
                versions: [
                  {
                    ...manuscriptVersion,
                    complianceReport: {
                      ...complianceReport,
                      discussionId: 'mock-discussion-id',
                    },
                  },
                ],
              } as TeamManuscript,
            ],
            tools: [],
          }}
        />,
      );

    await act(async () => {
      userEvent.click(await findByTestId('collapsible-button'));
      await waitFor(() => {
        expect(getByLabelText('Expand Version')).toBeInTheDocument();
      });
      userEvent.click(getByLabelText('Expand Version'));
      await waitFor(() => {
        expect(getByLabelText('Expand Report')).toBeInTheDocument();
      });
      userEvent.click(getByLabelText('Expand Report'));
      await waitFor(() => {
        expect(getByText('1 reply')).toBeInTheDocument();
      });
      userEvent.click(getByText('1 reply'));
    });

    expect(getByTestId('discussion-reply-button')).toBeInTheDocument();

    await act(async () => {
      userEvent.click(getByTestId('discussion-reply-button'));
    });

    const replyEditor = getByTestId('editor');
    await act(async () => {
      userEvent.click(replyEditor);
      userEvent.tab();
      fireEvent.input(replyEditor, { data: 'New discussion message' });
      userEvent.tab();
    });

    expect(getByText(/Send/i)).toBeInTheDocument();

    await act(async () => {
      userEvent.click(getByText(/Send/i));
    });

    await waitFor(() => {
      expect(replyToDiscussion).toHaveBeenCalled();
      expect(mockSetFormType).toHaveBeenLastCalledWith({
        type: 'discussion-already-closed',
        accent: 'error',
      });
    });
  });

  it('calls setFormType with success when replyToDiscussion succeeds', async () => {
    jest.spyOn(console, 'error').mockImplementation();
    enable('DISPLAY_MANUSCRIPTS');

    (getDiscussion as jest.Mock).mockImplementation(() => ({
      id: 'discussion-id',
      message: {
        text: 'Nam adipiscing',
        createdBy: {
          id: '6D9SxLvttLIYKHqpfW7slJ',
          firstName: 'Amin',
          lastName: 'Aimeur',
          displayName: 'Amin Aimeur',
          teams: [
            {
              id: 'team-id',
              name: 'test-team',
            },
          ],
        },
        createdDate: '2024-12-31T05:28:42.353Z',
      },
      replies: [],
    }));

    const mockSetFormType = jest.fn();
    (useManuscriptToast as jest.Mock).mockImplementation(() => ({
      setFormType: mockSetFormType,
    }));

    const replyToDiscussion = jest.fn().mockImplementation(() =>
      Promise.resolve({
        id: 'discussionId',
      }),
    );

    (useReplyToDiscussion as jest.Mock).mockReturnValue(replyToDiscussion);

    mockGetDiscussion.mockImplementation(
      async () => acknowledgedGrantNumberDiscussion,
    );

    (useVersionById as jest.Mock).mockImplementation(() => [
      {
        ...mockVersionData,
        complianceReport: {
          ...complianceReport,
          discussionId: 'discussion-id',
        },
      },
      mockSetVersion,
    ]);

    (useIsComplianceReviewer as jest.Mock).mockImplementation(() => true);

    const { findByTestId, getByText, getByTestId, getByLabelText } =
      renderWithWrapper(
        <Workspace
          team={{
            ...createTeamResponse(),
            manuscripts: [
              {
                ...mockManuscript,
                versions: [
                  {
                    ...manuscriptVersion,
                    complianceReport: {
                      ...complianceReport,
                      discussionId: 'mock-discussion-id',
                    },
                  },
                ],
              } as TeamManuscript,
            ],
            tools: [],
          }}
        />,
      );

    await act(async () => {
      userEvent.click(await findByTestId('collapsible-button'));
      await waitFor(() => {
        expect(getByLabelText('Expand Version')).toBeInTheDocument();
      });
      userEvent.click(getByLabelText('Expand Version'));
      await waitFor(() => {
        expect(getByLabelText('Expand Report')).toBeInTheDocument();
      });
      userEvent.click(getByLabelText('Expand Report'));
      await waitFor(() => {
        expect(getByText('1 reply')).toBeInTheDocument();
      });
      userEvent.click(getByText('1 reply'));
    });

    expect(getByTestId('discussion-reply-button')).toBeInTheDocument();

    await act(async () => {
      userEvent.click(getByTestId('discussion-reply-button'));
    });

    const replyEditor = getByTestId('editor');
    await act(async () => {
      userEvent.click(replyEditor);
      userEvent.tab();
      fireEvent.input(replyEditor, { data: 'New discussion message' });
      userEvent.tab();
    });

    expect(getByText(/Send/i)).toBeInTheDocument();

    await act(async () => {
      userEvent.click(getByText(/Send/i));
    });

    await waitFor(() => {
      expect(replyToDiscussion).toHaveBeenCalled();
      expect(mockSetFormType).toHaveBeenLastCalledWith({
        type: 'quick-check',
        accent: 'successLarge',
      });
    });
  });

  it('calls endDiscussion and setFormType with success when ending a discussion', async () => {
    jest.spyOn(console, 'error').mockImplementation();
    enable('DISPLAY_MANUSCRIPTS');

    (getDiscussion as jest.Mock).mockImplementation(() => ({
      id: 'discussion-id',
      message: {
        text: 'Nam adipiscing',
        createdBy: {
          id: '6D9SxLvttLIYKHqpfW7slJ',
          firstName: 'Amin',
          lastName: 'Aimeur',
          displayName: 'Amin Aimeur',
          teams: [
            {
              id: 'team-id',
              name: 'test-team',
            },
          ],
        },
        createdDate: '2024-12-31T05:28:42.353Z',
      },
      replies: [],
    }));

    const mockSetFormType = jest.fn();
    (useManuscriptToast as jest.Mock).mockImplementation(() => ({
      setFormType: mockSetFormType,
    }));

    const replyToDiscussion = jest.fn().mockImplementation(() =>
      Promise.resolve({
        id: 'discussionId',
      }),
    );

    (useReplyToDiscussion as jest.Mock).mockReturnValue(replyToDiscussion);

    mockGetDiscussion.mockImplementation(
      async () => acknowledgedGrantNumberDiscussion,
    );

    (useVersionById as jest.Mock).mockImplementation(() => [
      {
        ...mockVersionData,
        complianceReport: {
          ...complianceReport,
          discussionId: 'discussion-id',
        },
      },
      mockSetVersion,
    ]);

    (useIsComplianceReviewer as jest.Mock).mockImplementation(() => true);

    (useEndDiscussion as jest.Mock).mockImplementation(() => endDiscussion);

    const { findByTestId, getByText, getByTestId, getByLabelText } =
      renderWithWrapper(
        <Workspace
          team={{
            ...createTeamResponse(),
            manuscripts: [
              {
                ...mockManuscript,
                versions: [
                  {
                    ...manuscriptVersion,
                    complianceReport: {
                      ...complianceReport,
                      discussionId: 'mock-discussion-id',
                    },
                  },
                ],
              } as TeamManuscript,
            ],
            tools: [],
          }}
        />,
      );

    await act(async () => {
      userEvent.click(await findByTestId('collapsible-button'));
      await waitFor(() => {
        expect(getByLabelText('Expand Version')).toBeInTheDocument();
      });
      userEvent.click(getByLabelText('Expand Version'));
      await waitFor(() => {
        expect(getByLabelText('Expand Report')).toBeInTheDocument();
      });
      userEvent.click(getByLabelText('Expand Report'));
      await waitFor(() => {
        expect(getByText('1 reply')).toBeInTheDocument();
      });
      userEvent.click(getByText('1 reply'));
    });

    expect(getByTestId('end-discussion-button')).toBeInTheDocument();

    await act(() => {
      userEvent.click(getByTestId('end-discussion-button'));
    });

    expect(getByTestId('submit-end-discussion')).toBeInTheDocument();

    await act(() => {
      userEvent.click(getByTestId('submit-end-discussion'));
    });
    expect(endDiscussion).toHaveBeenCalled();
    expect(mockSetFormType).toHaveBeenCalledWith({
      type: 'compliance-report-discussion-end',
      accent: 'successLarge',
    });
  });
});
