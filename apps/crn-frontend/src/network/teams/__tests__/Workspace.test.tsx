import { ReactNode, Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { MemoryRouter, Route } from 'react-router-dom';
import {
  render,
  waitFor,
  getByText as getChildByText,
  act,
  fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TeamResponse } from '@asap-hub/model';
import {
  createDiscussionResponse,
  createManuscriptResponse,
  createMessage,
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
  getDiscussion,
  updateDiscussion,
} from '../api';

import Workspace from '../Workspace';
import { ManuscriptToastProvider } from '../ManuscriptToastProvider';

jest.setTimeout(30000);
jest.mock('../api', () => ({
  patchTeam: jest.fn(),
  updateManuscript: jest.fn().mockResolvedValue({}),
  getDiscussion: jest.fn(),
  updateDiscussion: jest.fn(),
}));

const mockPatchTeam = patchTeam as jest.MockedFunction<typeof patchTeam>;
const mockGetDiscussion = getDiscussion as jest.MockedFunction<
  typeof getDiscussion
>;
const mockUpdateDiscussion = updateDiscussion as jest.MockedFunction<
  typeof updateDiscussion
>;

const id = '42';

const renderWithWrapper = (children: ReactNode, user = {}): ReturnType<typeof render> =>
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
  teams: [
    {
      id,
      role: 'Project Manager',
    },
  ],
};

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
          manuscripts: [createManuscriptResponse()],
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
        { status: 'Manuscript Resubmitted' },
        expect.anything(),
      );
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

describe('manuscript quick check discussion', () => {
  const manuscript = createManuscriptResponse();
  manuscript.versions[0]!.acknowledgedGrantNumber = 'No';
  const reply = createMessage('when can this be completed?');
  const quickCheckResponse = 'We have not been able to complete this yet';
  const acknowledgedGrantNumberDiscussion = createDiscussionResponse(
    quickCheckResponse,
    [reply],
  );
  manuscript.versions[0]!.acknowledgedGrantNumberDetails =
    acknowledgedGrantNumberDiscussion;

  it('fetches quick check discussion details', async () => {
    enable('DISPLAY_MANUSCRIPTS');

    mockGetDiscussion.mockResolvedValueOnce(acknowledgedGrantNumberDiscussion);
    const { getByText, findByTestId, getByLabelText, getByTestId } =
      renderWithWrapper(
        <Workspace
          team={{
            ...createTeamResponse(),
            id,
            manuscripts: [manuscript],
            tools: [],
          }}
        />,
      );

    await act(async () => {
      userEvent.click(await findByTestId('collapsible-button'));
      userEvent.click(getByLabelText('Expand Version'));
    });

    userEvent.click(getByTestId('discussion-collapsible-button'));

    expect(getByText(quickCheckResponse)).toBeVisible();
    expect(getByText(reply.text)).toBeVisible();
    expect(mockGetDiscussion).toHaveBeenLastCalledWith(
      acknowledgedGrantNumberDiscussion.id,
      expect.anything(),
    );
  });

  it('replies to a quick check discussion', async () => {
    enable('DISPLAY_MANUSCRIPTS');
    mockGetDiscussion.mockResolvedValue(acknowledgedGrantNumberDiscussion);
    mockUpdateDiscussion.mockResolvedValue(acknowledgedGrantNumberDiscussion);
    const { findByTestId, getByRole, getByTestId, getByLabelText } =
      renderWithWrapper(
        <ManuscriptToastProvider>
          <Workspace
            team={{
              ...createTeamResponse(),
              id,
              manuscripts: [manuscript],
              tools: [],
            }}
          />
        </ManuscriptToastProvider>,
      );

    await act(async () => {
      userEvent.click(await findByTestId('collapsible-button'));
      userEvent.click(getByLabelText('Expand Version'));
    });

    userEvent.click(getByTestId('discussion-collapsible-button'));

    const replyButton = getByRole('button', { name: /Reply/i });
    userEvent.click(replyButton);

    const replyEditor = getByTestId('editor');
    userEvent.click(replyEditor);
    userEvent.tab();
    fireEvent.input(replyEditor, { data: 'new reply' });
    userEvent.tab();

    const sendButton = getByRole('button', { name: /Send/i });

    await waitFor(() => {
      expect(sendButton).toBeEnabled();
    });
    await act(async () => {
      userEvent.click(sendButton);
    });

    expect(mockUpdateDiscussion).toHaveBeenLastCalledWith(
      acknowledgedGrantNumberDiscussion.id,
      { replyText: 'new reply' },
      expect.anything(),
    );
  });
});
