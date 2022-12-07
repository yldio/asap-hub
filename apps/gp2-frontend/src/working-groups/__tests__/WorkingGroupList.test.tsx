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
import { getWorkingGroupNetwork } from '../api';
import { refreshWorkingGroupNetworkState } from '../state';
import WorkingGroupList from '../WorkingGroupList';

jest.mock('../api');

const renderWorkingGroupsList = async () => {
  render(
    <RecoilRoot
      initializeState={({ set }) => {
        set(refreshWorkingGroupNetworkState, Math.random());
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={[gp2Routing.workingGroups({}).$]}>
              <Route path={gp2Routing.workingGroups.template}>
                <WorkingGroupList />
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

it('renders a list of working groups', async () => {
  const mockGetWorkingGroups = getWorkingGroupNetwork as jest.MockedFunction<
    typeof getWorkingGroupNetwork
  >;
  const firstGroup = gp2Fixtures.createWorkingGroupResponse({
    id: '42',
    title: 'Working Group 42',
  });
  const secondGroup = gp2Fixtures.createWorkingGroupResponse({
    id: '11',
    title: 'Working Group 11',
  });
  const response = {
    total: 2,
    items: [
      {
        role: 'complexDisease' as const,
        workingGroups: [firstGroup, secondGroup],
      },
    ],
  };
  mockGetWorkingGroups.mockResolvedValue(response);
  await renderWorkingGroupsList();
  expect(
    screen.getByRole('heading', { name: 'Working Group 42' }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole('heading', { name: 'Working Group 11' }),
  ).toBeInTheDocument();
});
