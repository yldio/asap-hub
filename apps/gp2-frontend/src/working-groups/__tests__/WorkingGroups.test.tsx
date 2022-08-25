import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getWorkingGroups } from '../api';
import { refreshWorkingGroupsState } from '../state';
import WorkingGroups from '../WorkingGroups';
import { getWorkingGroupFixture } from './util';

jest.mock('../api');

const getWorkingGroupsFixture = (items = [getWorkingGroupFixture()]) => ({
  items,
  total: items.length,
});

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
  mockGetWorkingGroups.mockResolvedValueOnce(getWorkingGroupsFixture());
  await renderWorkingGroupsList();
  expect(
    screen.getByRole('heading', { name: 'Working Groups' }),
  ).toBeInTheDocument();
});

it('renders a list of working groups', async () => {
  const mockGetWorkingGroups = getWorkingGroups as jest.MockedFunction<
    typeof getWorkingGroups
  >;
  const firstGroup = getWorkingGroupFixture({
    id: '42',
    title: 'Working Group 42',
  });
  const secondGroup = getWorkingGroupFixture({
    id: '11',
    title: 'Working Group 11',
  });
  mockGetWorkingGroups.mockResolvedValue(
    getWorkingGroupsFixture([firstGroup, secondGroup]),
  );
  await renderWorkingGroupsList();
  expect(
    screen.getByRole('heading', { name: 'Working Group 42' }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole('heading', { name: 'Working Group 11' }),
  ).toBeInTheDocument();
});
