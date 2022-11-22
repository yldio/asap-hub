import { createWorkingGroupResponse } from '@asap-hub/fixtures';
import { network } from '@asap-hub/routing';
import { render, waitFor, screen } from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import { getWorkingGroup } from '../api';
import { refreshWorkingGroupState } from '../state';
import WorkingGroupProfile from '../WorkingGroupProfile';

jest.mock('../api');

const mockGetWorkingGroup = getWorkingGroup as jest.MockedFunction<
  typeof getWorkingGroup
>;

beforeEach(jest.clearAllMocks);

const renderWorkingGroupProfile = async (
  workingGroupResponse = createWorkingGroupResponse({}),
  { workingGroupId = workingGroupResponse.id } = {},
) => {
  mockGetWorkingGroup.mockImplementation(async (id) =>
    id === workingGroupResponse.id ? workingGroupResponse : undefined,
  );

  const result = render(
    <RecoilRoot
      initializeState={({ set }) =>
        set(refreshWorkingGroupState(workingGroupResponse.id), Math.random())
      }
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter
              initialEntries={[
                network({}).workingGroups({}).workingGroup({ workingGroupId })
                  .$,
              ]}
            >
              <Route
                path={
                  network.template +
                  network({}).workingGroups.template +
                  network({}).workingGroups({}).workingGroup.template
                }
              >
                <WorkingGroupProfile />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  await waitFor(() =>
    expect(result.queryByText(/loading/i)).not.toBeInTheDocument(),
  );
  return result;
};

it('renders the about working-group information by default', async () => {
  await renderWorkingGroupProfile(createWorkingGroupResponse({}));

  expect(await screen.findByText(/Working Group Description/i)).toBeVisible();
});

it('renders the not-found page when the working-group is not found', async () => {
  mockGetWorkingGroup.mockResolvedValueOnce(undefined);
  await renderWorkingGroupProfile();

  expect(
    await screen.findByText(/can’t seem to find that page/i),
  ).toBeVisible();
});
