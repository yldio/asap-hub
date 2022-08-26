import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import {
  createWorkingGroupsResponse,
  createWorkingGroupResponse,
} from '@asap-hub/fixtures';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getWorkingGroups } from '../api';
import { refreshWorkingGroupsState } from '../state';
import WorkingGroups from '../WorkingGroups';

jest.mock('../api');

const renderWorkingGroupsList = async () => {
  render(
    <RecoilRoot
      initializeState={({ set }) => {
        set(refreshWorkingGroupsState, Math.random());
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/working-groups']}>
              <Route path="/working-groups">
                <WorkingGroups />
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

it('renders the Title', async () => {
  const mockGetWorkingGroups = getWorkingGroups as jest.MockedFunction<
    typeof getWorkingGroups
  >;
  mockGetWorkingGroups.mockResolvedValueOnce(createWorkingGroupsResponse());
  await renderWorkingGroupsList();
  expect(
    screen.getByRole('heading', { name: 'Working Groups' }),
  ).toBeInTheDocument();
});

it('renders a list of working groups', async () => {
  const mockGetWorkingGroups = getWorkingGroups as jest.MockedFunction<
    typeof getWorkingGroups
  >;
  const firstGroup = createWorkingGroupResponse({
    id: '42',
    title: 'Working Group 42',
  });
  const secondGroup = createWorkingGroupResponse({
    id: '11',
    title: 'Working Group 11',
  });
  mockGetWorkingGroups.mockResolvedValue(
    createWorkingGroupsResponse([firstGroup, secondGroup]),
  );
  await renderWorkingGroupsList();
  expect(
    screen.getByRole('heading', { name: 'Working Group 42' }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole('heading', { name: 'Working Group 11' }),
  ).toBeInTheDocument();
});
