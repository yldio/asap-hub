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
import { network } from '@asap-hub/routing';
import { enable, reset } from '@asap-hub/flags';

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
afterEach(() => {
  reset();
});
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
                network({}).teams({}).team({ teamId }).about({}).$,
              ]}
            >
              <Routes>
                <Route
                  path={
                    network.template +
                    network({}).teams.template +
                    network({}).teams({}).team.template +
                    network({}).teams({}).team({ teamId }).about.template
                  }
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

it('renders funded project information on the About tab when PROJECTS_MVP is enabled', async () => {
  enable('PROJECTS_MVP');
  const team = {
    ...createTeamResponse(),
    projectTitle: 'Project Alpha',
    projectSummary: 'Original grant',
    linkedProjectId: 'proj-1',
    supplementGrant: { title: 'Supp', description: 'Supplement desc' },
  } as ReturnType<typeof createTeamResponse>;

  await renderTeamAbout({ team });

  expect(screen.getByText('Projects')).toBeVisible();
  expect(screen.getByText('Project Alpha')).toBeVisible();
  expect(screen.getByText('Supplement desc')).toBeVisible();
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
