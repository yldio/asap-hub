import React from 'react';
import { RecoilRoot } from 'recoil';
import { MemoryRouter, Route } from 'react-router-dom';
import {
  render,
  waitFor,
  getByText as getChildByText,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createTeamResponse } from '@asap-hub/fixtures';

import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/frontend/src/auth/test-utils';
import Workspace from '../Workspace';
import { patchTeam } from '../api';

jest.mock('../api');

const mockPatchTeam = patchTeam as jest.MockedFunction<typeof patchTeam>;

const wrapper: React.FC<Record<string, never>> = ({ children }) => (
  <RecoilRoot>
    <React.Suspense fallback="loading">
      <Auth0Provider user={{}}>
        <WhenReady>
          <MemoryRouter initialEntries={['/team/workspace']}>
            <Route path="/team/workspace">{children}</Route>
          </MemoryRouter>
        </WhenReady>
      </Auth0Provider>
    </React.Suspense>
  </RecoilRoot>
);

afterEach(() => {
  mockPatchTeam.mockClear();
});

describe('the add tool dialog', () => {
  it('goes back when closed', async () => {
    const {
      getByText,
      queryByTitle,
      findByText,
      findByTitle,
    } = render(
      <Workspace team={{ ...createTeamResponse(), id: '42', tools: [] }} />,
      { wrapper },
    );
    userEvent.click(await findByText(/add/i));

    userEvent.click(await findByTitle(/close/i));
    expect(queryByTitle(/close/i)).not.toBeInTheDocument();
    expect(getByText(/add/i)).toBeVisible();
  });

  it('saves the new tool and goes back', async () => {
    const {
      queryByText,
      queryByDisplayValue,
      findByText,
      findByLabelText,
    } = render(
      <Workspace team={{ ...createTeamResponse(), id: '42', tools: [] }} />,
      { wrapper },
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
      '42',
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
          id: '42',
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
    const {
      queryByText,
      queryByDisplayValue,
      findByText,
      findByLabelText,
    } = render(
      <Workspace
        team={{
          ...createTeamResponse(),
          id: '42',
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
      '42',
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
