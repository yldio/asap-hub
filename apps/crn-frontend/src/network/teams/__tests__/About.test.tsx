import { ComponentProps, Suspense } from 'react';
import {
  render,
  waitFor,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import {
  createTeamResponse,
  createInterestGroupResponse,
} from '@asap-hub/fixtures';
import {
  Auth0Provider,
  WhenReady,
} from '@asap-hub/crn-frontend/src/auth/test-utils';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { networkRoutes } from '@asap-hub/routing';

import About from '../About';
import { refreshTeamState } from '../state';
import { getTeamInterestGroups } from '../interest-groups/api';

jest.mock('../api');
jest.mock('../interest-groups/api');
const mockedGetTeamGroups = getTeamInterestGroups as jest.MockedFunction<
  typeof getTeamInterestGroups
>;

const teamId = '42';

beforeEach(jest.clearAllMocks);
const renderTeamAbout = async (
  aboutProps: Omit<ComponentProps<typeof About>, 'teamListElementId'>,
) => {
  render(
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
                networkRoutes.DEFAULT.TEAMS.DETAILS.ABOUT.buildPath({ teamId }),
              ]}
            >
              <Routes>
                <Route
                  path={networkRoutes.DEFAULT.TEAMS.DETAILS.ABOUT.path}
                  element={<About teamListElementId="uuid" {...aboutProps} />}
                />
              </Routes>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};

it('renders the member links', async () => {
  await renderTeamAbout({
    team: {
      ...createTeamResponse(),
      members: [
        {
          ...createTeamResponse({ teamMembers: 1 }).members[0]!,
          id: teamId,
          displayName: 'Mem',
        },
      ],
    },
  });
  expect(screen.getByText('Mem').closest('a')!.href).toContain('42');
  await waitFor(() => expect(mockedGetTeamGroups).toHaveBeenCalled());
});

describe('the proposal', () => {
  it('is not rendered when there is no proposal', async () => {
    await renderTeamAbout({
      team: { ...createTeamResponse(), proposalURL: undefined },
    });
    expect(screen.queryByText(/proposal/i)).not.toBeInTheDocument();
    await waitFor(() => expect(mockedGetTeamGroups).toHaveBeenCalled());
  });

  it('is rendered with a library href', async () => {
    await renderTeamAbout({
      team: { ...createTeamResponse(), proposalURL: 'someproposal' },
    });
    expect(screen.getByText(/proposal/i).closest('a')!.href).toMatch(
      /someproposal$/,
    );
    await waitFor(() => expect(mockedGetTeamGroups).toHaveBeenCalled());
  });
});

it('renders the team groups card when a group is present', async () => {
  mockedGetTeamGroups.mockResolvedValue({
    items: [
      {
        ...createInterestGroupResponse(),
        name: 'Example Group 123',
      },
    ],
    total: 1,
  });
  await renderTeamAbout({
    team: { ...createTeamResponse(), proposalURL: undefined },
  });
  expect(await screen.findByText('Example Group 123')).toBeVisible();
});
