import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getWorkingGroup } from '../api';
import { refreshWorkingGroupState } from '../state';
import WorkingGroupDetail from '../WorkingGroupDetail';

jest.mock('../api');

const renderWorkingGroupDetail = async (id: string) => {
  render(
    <RecoilRoot
      initializeState={({ set }) => {
        set(refreshWorkingGroupState(id), Math.random());
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter
              initialEntries={[
                gp2Routing
                  .workingGroups({})
                  .workingGroup({ workingGroupId: id }).$,
              ]}
            >
              <Route
                path={
                  gp2Routing.workingGroups.template +
                  gp2Routing.workingGroups({}).workingGroup.template
                }
              >
                <WorkingGroupDetail />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );

  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};
beforeEach(() => {
  jest.resetAllMocks();
});
describe('WorkingGroupDetail', () => {
  const mockGetWorkingGroup = getWorkingGroup as jest.MockedFunction<
    typeof getWorkingGroup
  >;

  it('renders header with title', async () => {
    const workingGroup = gp2Fixtures.createWorkingGroupResponse();
    mockGetWorkingGroup.mockResolvedValueOnce(workingGroup);
    await renderWorkingGroupDetail(workingGroup.id);
    expect(screen.getByRole('banner')).toBeVisible();
  });

  it('renders not found if no working group is returned', async () => {
    mockGetWorkingGroup.mockResolvedValueOnce(undefined);
    await renderWorkingGroupDetail('unknown-id');
    expect(
      screen.getByRole('heading', {
        name: 'Sorry! We can’t seem to find that page.',
      }),
    ).toBeVisible();
  });

  it('renders the members section', async () => {
    const workingGroup = gp2Fixtures.createWorkingGroupResponse();
    workingGroup.members = [
      {
        userId: 'uuid',
        firstName: 'John',
        lastName: 'Doe',
        role: 'Lead',
      },
    ];
    mockGetWorkingGroup.mockResolvedValueOnce(workingGroup);
    await renderWorkingGroupDetail(workingGroup.id);
    expect(screen.getByText(/Working Group Members/i)).toBeVisible();
  });
});
