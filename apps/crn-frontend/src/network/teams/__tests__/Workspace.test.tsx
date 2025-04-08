import { ReactNode, Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { MemoryRouter, Route } from 'react-router-dom';
import {
  render,
  waitFor,
  getByText as getChildByText,
  fireEvent,
  act,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ManuscriptVersion, TeamResponse } from '@asap-hub/model';
import {
  createTeamManuscriptResponse,
  createTeamResponse,
} from '@asap-hub/fixtures';
import { network } from '@asap-hub/routing';
import { ToastContext } from '@asap-hub/react-context';
import { mockAlert } from '@asap-hub/dom-test-utils';

import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import { enable } from '@asap-hub/flags';

import {
  patchTeam,
  updateManuscript,
  createDiscussion,
  getManuscript,
} from '../api';

import Workspace from '../Workspace';
import {
  useManuscriptById,
  useVersionById,
  useReplyToDiscussion,
} from '../state';
import { useManuscriptToast } from '../useManuscriptToast';

jest.setTimeout(60000);
jest.mock('../api', () => ({
  patchTeam: jest.fn(),
  updateManuscript: jest.fn().mockResolvedValue({}),
  getDiscussion: jest.fn(),
  updateDiscussion: jest.fn(),
  createDiscussion: jest.fn().mockResolvedValue({}),
  getManuscript: jest.fn(),
}));

jest.mock('../state', () => ({
  ...jest.requireActual('../state'),
  useVersionById: jest.fn(),
  useManuscriptById: jest.fn(),
  useReplyToDiscussion: jest.fn(),
}));

jest.mock('../useManuscriptToast', () => ({
  useManuscriptToast: jest.fn(),
}));

const mockPatchTeam = patchTeam as jest.MockedFunction<typeof patchTeam>;

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

const user = {
  id: 'test-user-1',
  teams: [
    {
      id,
      role: 'Project Manager',
    },
  ],
};

const mockSetVersion = jest.fn();

const version = createTeamManuscriptResponse().versions[0] as ManuscriptVersion;

const mockVersionData = {
  ...version,
  complianceReport: {
    ...version.complianceReport,
    discussionId: 'discussion-id',
  },
};
const mockReplyToDiscussion = jest.fn();
const mockSetFormType = jest.fn();
beforeEach(() => {
  (useVersionById as jest.Mock).mockImplementation(() => [
    mockVersionData,
    mockSetVersion,
  ]);
  (useManuscriptToast as jest.Mock).mockImplementation(() => ({
    setFormType: mockSetFormType,
  }));
  (useManuscriptById as jest.Mock).mockImplementation(() => [
    createTeamManuscriptResponse(),
    jest.fn(),
  ]);
  (useReplyToDiscussion as jest.Mock).mockImplementation(
    () => mockReplyToDiscussion,
  );
  (createDiscussion as jest.Mock).mockResolvedValue({});
  (getManuscript as jest.Mock).mockResolvedValue(
    createTeamManuscriptResponse(),
  );
  window.scrollTo = jest.fn();
});

afterEach(jest.resetAllMocks);

describe('Manuscript', () => {
  it('status can be changed', async () => {
    enable('DISPLAY_MANUSCRIPTS');

    const screen = renderWithWrapper(
      <Workspace
        team={{
          ...createTeamResponse(),
          id,
          tools: [],
          manuscripts: [createTeamManuscriptResponse()],
        }}
      />,
    );

    userEvent.click(await screen.findByTestId('status-button'));
    userEvent.click(screen.getByText('Manuscript Resubmitted'));
    userEvent.click(
      screen.getByRole('button', { name: 'Update Status and Notify' }),
    );
    await waitFor(() => {
      expect(updateManuscript).toHaveBeenCalledWith(
        'manuscript_0',
        {
          notificationList: '',
          status: 'Manuscript Resubmitted',
          sendNotifications: false,
        },
        expect.anything(),
      );
    });
  });

  it('should create discussion', async () => {
    enable('DISPLAY_MANUSCRIPTS');

    const screen = renderWithWrapper(
      <Workspace
        team={{
          ...createTeamResponse(),
          id,
          tools: [],
          manuscripts: [createTeamManuscriptResponse()],
        }}
      />,
    );

    userEvent.click(await screen.findByTestId('collapsible-button'));
    userEvent.click(screen.getByText('Discussions'));
    userEvent.click(screen.getByRole('button', { name: /Start Discussion/i }));
    userEvent.type(screen.getByRole('textbox', { name: /Title/i }), 'Test');
    const textInput = screen.getByTestId('editor');
    await act(async () => {
      userEvent.click(textInput);
      userEvent.tab();
      fireEvent.input(textInput, { data: 'test message' });
      userEvent.tab();
    });

    const shareButton = screen.getByRole('button', { name: /Send/i });
    await waitFor(() => expect(shareButton).toBeEnabled());
    userEvent.click(shareButton);
    await waitFor(() => {
      expect(createDiscussion).toHaveBeenCalledWith(
        'manuscript_0',
        'Test',
        'test message',
        'Bearer access_token',
      );
    });
  });

  it('should reply to discussion', async () => {
    enable('DISPLAY_MANUSCRIPTS');

    (useManuscriptById as jest.Mock).mockImplementation(() => [
      {
        ...createTeamManuscriptResponse(),
        discussions: [
          {
            id: 'discussion-id-1',
            title: 'Where does Lorem Ipsum come from?',
            text: 'It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.',
            lastUpdatedAt: '2025-04-01T15:00:00.000Z',
            createdDate: '2025-03-31T10:00:00.000Z',
            createdBy: {
              alumniSinceDate: undefined,
              avatarUrl: undefined,
              displayName: 'John Doe',
              firstName: 'John',
              id: 'user-id-1',
              lastName: 'Doe',
              teams: [
                {
                  id: 'team-id-1',
                  name: 'Team 1',
                },
              ],
            },
            replies: [],
          },
        ],
      },
      jest.fn(),
    ]);

    const screen = renderWithWrapper(
      <Workspace
        team={{
          ...createTeamResponse(),
          id,
          tools: [],
          manuscripts: [createTeamManuscriptResponse()],
        }}
      />,
    );

    userEvent.click(await screen.findByTestId('collapsible-button'));
    userEvent.click(screen.getByText('Discussions'));
    userEvent.click(
      await screen.findByTestId(
        'discussion-collapsible-button-discussion-id-1',
      ),
    );

    userEvent.click(
      await screen.findByTestId('discussion-reply-button-discussion-id-1'),
    );

    userEvent.click(await screen.findByText('Reply', { selector: 'h3' }));

    const textInput = screen.getByTestId('editor');
    await act(async () => {
      userEvent.click(textInput);
      userEvent.tab();
      fireEvent.input(textInput, { data: 'test message' });
      userEvent.tab();
    });

    const shareButton = screen.getByRole('button', { name: /Send/i });
    await waitFor(() => expect(shareButton).toBeEnabled());
    userEvent.click(shareButton);
    await waitFor(() => {
      expect(mockReplyToDiscussion).toHaveBeenCalledWith(
        'manuscript_0',
        'discussion-id-1',
        { text: 'test message' },
      );
    });
    await waitFor(() => {
      expect(mockSetFormType).toHaveBeenCalledWith({
        type: 'reply-to-discussion',
        accent: 'successLarge',
      });
    });
  });

  it('should show an error when reply to discussion fails', async () => {
    jest.spyOn(console, 'error').mockImplementation();
    enable('DISPLAY_MANUSCRIPTS');

    (useManuscriptById as jest.Mock).mockImplementation(() => [
      {
        ...createTeamManuscriptResponse(),
        discussions: [
          {
            id: 'discussion-id-1',
            title: 'Where does Lorem Ipsum come from?',
            text: 'It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.',
            lastUpdatedAt: '2025-04-01T15:00:00.000Z',
            createdDate: '2025-03-31T10:00:00.000Z',
            createdBy: {
              alumniSinceDate: undefined,
              avatarUrl: undefined,
              displayName: 'John Doe',
              firstName: 'John',
              id: 'user-id-1',
              lastName: 'Doe',
              teams: [
                {
                  id: 'team-id-1',
                  name: 'Team 1',
                },
              ],
            },
            replies: [],
          },
        ],
      },
      jest.fn(),
    ]);

    (useReplyToDiscussion as jest.Mock).mockReturnValue(() =>
      Promise.reject(new Error('Reply failed')),
    );

    const screen = renderWithWrapper(
      <Workspace
        team={{
          ...createTeamResponse(),
          id,
          tools: [],
          manuscripts: [createTeamManuscriptResponse()],
        }}
      />,
    );

    userEvent.click(await screen.findByTestId('collapsible-button'));
    userEvent.click(screen.getByText('Discussions'));
    userEvent.click(
      await screen.findByTestId(
        'discussion-collapsible-button-discussion-id-1',
      ),
    );

    userEvent.click(
      await screen.findByTestId('discussion-reply-button-discussion-id-1'),
    );

    userEvent.click(await screen.findByText('Reply', { selector: 'h3' }));

    const textInput = screen.getByTestId('editor');
    await act(async () => {
      userEvent.click(textInput);
      userEvent.tab();
      fireEvent.input(textInput, { data: 'test message' });
      userEvent.tab();
    });

    const shareButton = screen.getByRole('button', { name: /Send/i });
    await waitFor(() => expect(shareButton).toBeEnabled());
    userEvent.click(shareButton);
    await waitFor(() => {
      expect(mockSetFormType).toHaveBeenCalledWith({
        type: 'default-error',
        accent: 'error',
      });

      expect(window.scrollTo).toHaveBeenCalled();
    });
  });
});

describe('a tool', () => {
  const { mockConfirm } = mockAlert();

  it('can be deleted', async () => {
    const { findByText } = renderWithWrapper(
      <Workspace
        team={{
          ...createTeamResponse(),
          id,
          tools: [
            {
              name: 'My Tool',
              description: 'A nice tool',
              url: 'https://example.com/tool',
            },
          ],
        }}
      />,
      user,
    );

    userEvent.click(await findByText(/delete/i));
    await findByText(/deleting/i);
    expect(mockPatchTeam).toHaveBeenLastCalledWith(
      id,
      { tools: [] },
      expect.anything(),
    );
  });

  it('is not deleted when rejecting the confirm prompt', async () => {
    const { findByText } = renderWithWrapper(
      <Workspace
        team={{
          ...createTeamResponse(),
          id,
          tools: [
            {
              name: 'My Tool',
              description: 'A nice tool',
              url: 'https://example.com/tool',
            },
          ],
        }}
      />,
      user,
    );

    mockConfirm.mockReturnValue(false);
    userEvent.click(await findByText(/delete/i));
    await findByText(/delete/i);

    expect(mockPatchTeam).not.toHaveBeenCalled();
  });

  it('warns when its deletion failed', async () => {
    const mockToast = jest.fn();
    const { findByText } = renderWithWrapper(
      <ToastContext.Provider value={mockToast}>
        <Workspace
          team={{
            ...createTeamResponse(),
            id,
            tools: [
              {
                name: 'My Tool',
                description: 'A nice tool',
                url: 'https://example.com/tool',
              },
            ],
          }}
        />
      </ToastContext.Provider>,
      user,
    );

    mockPatchTeam.mockRejectedValue(new Error('Nope'));
    userEvent.click(await findByText(/delete/i));

    await waitFor(() => expect(mockToast).toHaveBeenCalled());
  });

  it('can not be deleted while another tool is being deleted', async () => {
    const { queryByText, findByText, findAllByText } = renderWithWrapper(
      <Workspace
        team={{
          ...createTeamResponse(),
          id,
          tools: [
            {
              name: 'My Tool',
              description: 'A nice tool',
              url: 'https://example.com/tool',
            },
            {
              name: 'My other tool',
              description: 'Also a nice tool',
              url: 'https://example.com/tool2',
            },
          ],
        }}
      />,
      user,
    );
    let resolvePatchTeam!: (team: TeamResponse) => void;
    mockPatchTeam.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePatchTeam = resolve;
        }),
    );

    userEvent.click((await findAllByText(/delete/i))[0]!);
    await findByText(/deleting/i);
    mockPatchTeam.mockClear();

    userEvent.click(await findByText(/delete/i));
    expect(mockPatchTeam).not.toHaveBeenCalled();

    resolvePatchTeam(createTeamResponse());
    await waitFor(() =>
      expect(queryByText(/deleting/i)).not.toBeInTheDocument(),
    );
  });
});

describe('the add tool dialog', () => {
  it('goes back when closed', async () => {
    const { getByText, queryByTitle, findByText, findByTitle } =
      renderWithWrapper(
        <Workspace team={{ ...createTeamResponse(), id, tools: [] }} />,
        user,
      );
    userEvent.click(await findByText(/add/i));

    userEvent.click(await findByTitle(/close/i));
    expect(queryByTitle(/close/i)).not.toBeInTheDocument();
    expect(getByText(/add/i)).toBeVisible();
  });

  it('saves the new tool and goes back', async () => {
    const { queryByText, queryByDisplayValue, findByText, findByLabelText } =
      renderWithWrapper(
        <Workspace team={{ ...createTeamResponse(), id, tools: [] }} />,
        user,
      );
    userEvent.click(await findByText(/add/i));
    userEvent.type(await findByLabelText(/tool.+name/i), 'tool');
    userEvent.type(await findByLabelText(/description/i), 'description');
    userEvent.type(await findByLabelText(/url/i), 'http://example.com/tool');
    userEvent.click(await findByText(/save/i));

    await waitFor(() => {
      expect(queryByText(/loading/i)).not.toBeInTheDocument();
      expect(queryByDisplayValue('tool')).not.toBeInTheDocument();
    });
    expect(mockPatchTeam).toHaveBeenLastCalledWith(
      id,
      {
        tools: [
          {
            name: 'tool',
            description: 'description',
            url: 'http://example.com/tool',
          },
        ],
      },
      expect.any(String),
    );
  });
});

describe('the edit tool dialog', () => {
  it('goes back when closed', async () => {
    const { getByText, queryByTitle, findByText, findByTitle } =
      renderWithWrapper(
        <Workspace
          team={{
            ...createTeamResponse(),
            id,
            tools: [
              {
                name: 'tool',
                description: 'desc',
                url: 'http://example.com/tool',
              },
            ],
          }}
        />,
        user,
      );
    userEvent.click(await findByText(/edit/i, { selector: 'li *' }));

    userEvent.click(await findByTitle(/close/i));
    expect(queryByTitle(/close/i)).not.toBeInTheDocument();
    expect(getByText(/edit/i, { selector: 'li *' })).toBeVisible();
  });

  it('saves the changes and goes back', async () => {
    const { queryByText, queryByDisplayValue, findByText, findByLabelText } =
      renderWithWrapper(
        <Workspace
          team={{
            ...createTeamResponse(),
            id,
            tools: [
              {
                name: 'tool 1',
                description: 'description',
                url: 'http://example.com/tool-1',
              },
              {
                name: 'tool 2',
                description: 'description',
                url: 'http://example.com/tool-2',
              },
            ],
          }}
        />,
        user,
      );
    userEvent.click(
      getChildByText((await findByText('tool 2')).closest('li')!, /edit/i),
    );
    userEvent.type(await findByLabelText(/tool.+name/i), ' new');
    userEvent.type(await findByLabelText(/description/i), ' new');
    userEvent.type(await findByLabelText(/url/i), '-new');
    userEvent.click(await findByText(/save/i));

    await waitFor(() => {
      expect(queryByText(/loading/i)).not.toBeInTheDocument();
      expect(queryByDisplayValue('tool 2 new')).not.toBeInTheDocument();
    });
    expect(mockPatchTeam).toHaveBeenLastCalledWith(
      id,
      {
        tools: [
          expect.objectContaining({ name: 'tool 1' }),
          {
            name: 'tool 2 new',
            description: 'description new',
            url: 'http://example.com/tool-2-new',
          },
        ],
      },
      expect.any(String),
    );
  });
});
