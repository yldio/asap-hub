import { FC, Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { MemoryRouter, Route } from 'react-router-dom';
import {
  render,
  waitFor,
  getByText as getChildByText,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TeamResponse } from '@asap-hub/model';
import { createTeamResponse } from '@asap-hub/fixtures';
import { network } from '@asap-hub/routing';
import { ToastContext } from '@asap-hub/react-context';
import { mockAlert } from '@asap-hub/dom-test-utils';

import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/gp2-frontend/src/auth/test-utils';
import Workspace from '../Workspace';
import { patchTeam } from '../api';

jest.mock('../api');
const mockPatchTeam = patchTeam as jest.MockedFunction<typeof patchTeam>;

const id = '42';

const wrapper: FC<Record<string, never>> = ({ children }) => (
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
  </RecoilRoot>
);

const mockPatchTeamImpl = mockPatchTeam.getMockImplementation();
afterEach(() => {
  mockPatchTeam.mockClear().mockImplementation(mockPatchTeamImpl);
});

describe('a tool', () => {
  const { mockConfirm } = mockAlert();

  it('can be deleted', async () => {
    const { findByText } = render(
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
      { wrapper },
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
    const { findByText } = render(
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
      { wrapper },
    );

    mockConfirm.mockReturnValue(false);
    userEvent.click(await findByText(/delete/i));
    await findByText(/delete/i);

    expect(mockPatchTeam).not.toHaveBeenCalled();
  });

  it('warns when its deletion failed', async () => {
    const mockToast = jest.fn();
    const { findByText } = render(
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
      { wrapper },
    );

    mockPatchTeam.mockRejectedValue(new Error('Nope'));
    userEvent.click(await findByText(/delete/i));

    await waitFor(() => expect(mockToast).toHaveBeenCalled());
  });

  it('can not be deleted while another tool is being deleted', async () => {
    const { queryByText, findByText, findAllByText } = render(
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
      { wrapper },
    );
    let resolvePatchTeam!: (team: TeamResponse) => void;
    mockPatchTeam.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePatchTeam = resolve;
        }),
    );

    userEvent.click((await findAllByText(/delete/i))[0]);
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
    const { getByText, queryByTitle, findByText, findByTitle } = render(
      <Workspace team={{ ...createTeamResponse(), id, tools: [] }} />,
      { wrapper },
    );
    userEvent.click(await findByText(/add/i));

    userEvent.click(await findByTitle(/close/i));
    expect(queryByTitle(/close/i)).not.toBeInTheDocument();
    expect(getByText(/add/i)).toBeVisible();
  });

  it('saves the new tool and goes back', async () => {
    const { queryByText, queryByDisplayValue, findByText, findByLabelText } =
      render(<Workspace team={{ ...createTeamResponse(), id, tools: [] }} />, {
        wrapper,
      });
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
    const { getByText, queryByTitle, findByText, findByTitle } = render(
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
      { wrapper },
    );
    userEvent.click(await findByText(/edit/i, { selector: 'li *' }));

    userEvent.click(await findByTitle(/close/i));
    expect(queryByTitle(/close/i)).not.toBeInTheDocument();
    expect(getByText(/edit/i, { selector: 'li *' })).toBeVisible();
  });

  it('saves the changes and goes back', async () => {
    const { queryByText, queryByDisplayValue, findByText, findByLabelText } =
      render(
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
        { wrapper },
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
