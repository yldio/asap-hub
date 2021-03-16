import React, { ComponentProps } from 'react';
import { render, waitFor } from '@testing-library/react';
import { createTeamResponse, createGroupResponse } from '@asap-hub/fixtures';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/frontend/src/auth/test-utils';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import About from '../About';
import { refreshTeamState } from '../state';
import { getTeamGroups } from '../groups/api';

jest.mock('../api');
jest.mock('../groups/api');
const mockedGetTeamGroups = getTeamGroups as jest.MockedFunction<
  typeof getTeamGroups
>;

const renderTeamAbout = async (aboutProps: ComponentProps<typeof About>) => {
  const result = render(
    <RecoilRoot
      initializeState={({ set }) =>
        set(refreshTeamState(aboutProps.team.id), Math.random())
      }
    >
      <React.Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/team/about']}>
              <Route path="/team/about">
                <About {...aboutProps} />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </React.Suspense>
    </RecoilRoot>,
  );
  await waitFor(() =>
    expect(result.queryByText(/Loading/i)).not.toBeInTheDocument(),
  );
  return result;
};

it('renders the member links', async () => {
  const { getByText } = await renderTeamAbout({
    team: {
      ...createTeamResponse(),
      members: [
        {
          ...createTeamResponse({ teamMembers: 1 }).members[0],
          id: '42',
          displayName: 'Mem',
        },
      ],
    },
  });
  expect(getByText('Mem').closest('a')!.href).toContain('42');
});

describe('the proposal', () => {
  it('is not rendered when there is no proposal', async () => {
    const { queryByText } = await renderTeamAbout({
      team: { ...createTeamResponse(), proposalURL: undefined },
    });
    expect(queryByText(/proposal/i)).not.toBeInTheDocument();
  });

  it('is rendered with a library href', async () => {
    const { getByText } = await renderTeamAbout({
      team: { ...createTeamResponse(), proposalURL: 'someproposal' },
    });
    expect(getByText(/proposal/i).closest('a')!.href).toMatch(/someproposal$/);
  });
});

it('renders the team groups card when a group is present', async () => {
  mockedGetTeamGroups.mockResolvedValue({
    items: [
      {
        ...createGroupResponse(),
        name: 'Example Group 123',
      },
    ],
    total: 1,
  });
  const { getByText } = await renderTeamAbout({
    team: { ...createTeamResponse(), proposalURL: undefined },
  });
  await waitFor(() => {
    expect(mockedGetTeamGroups).toHaveBeenCalled();
    expect(getByText('Example Group 123')).toBeVisible();
  });
});
