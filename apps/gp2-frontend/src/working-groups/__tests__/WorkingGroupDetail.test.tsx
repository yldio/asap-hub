import {
  render,
  waitForElementToBeRemoved,
  screen,
} from '@testing-library/react';
import { Suspense } from 'react';
import { RecoilRoot } from 'recoil';
import { MemoryRouter, Route } from 'react-router-dom';

import { gp2 as gp2Routing } from '@asap-hub/routing';
import { createWorkingGroupResponse } from '@asap-hub/fixtures';

import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { refreshWorkingGroupState } from '../state';
import WorkingGroupDetail from '../WorkingGroupDetail';
import { getWorkingGroup } from '../api';

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
    const workingGroup = createWorkingGroupResponse();
    mockGetWorkingGroup.mockResolvedValueOnce(workingGroup);
    await renderWorkingGroupDetail(workingGroup.id);
    expect(screen.getByRole('banner')).toBeVisible();
  });
});
