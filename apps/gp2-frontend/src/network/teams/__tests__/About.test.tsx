import { ComponentProps, Suspense } from 'react';
import { render, waitFor } from '@testing-library/react';
import { createTeamResponse, createGroupResponse } from '@asap-hub/fixtures';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/gp2-frontend/src/auth/test-utils';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { network } from '@asap-hub/routing';

import About from '../About';
import { refreshTeamState } from '../state';
import { getTeamGroups } from '../groups/api';

jest.mock('../api');
jest.mock('../groups/api');
const mockedGetTeamGroups = getTeamGroups as jest.MockedFunction<
  typeof getTeamGroups
>;

const teamId = '42';

const renderTeamAbout = async (
  aboutProps: Omit<ComponentProps<typeof About>, 'teamListElementId'>,
) => {
  const result = render(
    <RecoilRoot
      initializeState={({ set }) =>
        set(refreshTeamState(aboutProps.team.id), Math.random())
      }
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter
              initialEntries={[
                network({}).teams({}).team({ teamId }).about({}).$,
              ]}
            >
              <Route
                path={
                  network.template +
                  network({}).teams.template +
                  network({}).teams({}).team.template +
                  network({}).teams({}).team({ teamId }).about.template
                }
              >
                <About teamListElementId="uuid" {...aboutProps} />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
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
          id: teamId,
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
