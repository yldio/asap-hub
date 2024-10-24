import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import { mockAlert } from '@asap-hub/dom-test-utils';
import {
  createManuscriptResponse,
  createTeamResponse,
} from '@asap-hub/fixtures';
import { enable } from '@asap-hub/flags';
import { TeamResponse } from '@asap-hub/model';
import { ToastContext } from '@asap-hub/react-context';
import { network } from '@asap-hub/routing';
import {
  getByText as getChildByText,
  render,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactNode, Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { patchTeam, updateManuscript } from '../api';
import Workspace from '../Workspace';

jest.mock('../api', () => ({
  patchTeam: jest.fn(),
  updateManuscript: jest.fn().mockResolvedValue({}),
}));

const mockPatchTeam = patchTeam as jest.MockedFunction<typeof patchTeam>;

const id = '42';

const renderWithWrapper = (children: ReactNode): ReturnType<typeof render> =>
  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
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
