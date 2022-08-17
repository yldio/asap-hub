import { WorkingGroupResponse } from '@asap-hub/model/build/gp2';
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

jest.mock('../api');

const getWorkingGroup = (overrides: Partial<WorkingGroupResponse> = {}) => ({
  id: '42',
  title: 'Working Group Title',
  members: [],
  shortDescription: 'This is a short description',
  leadingMembers: 'This is a list of leading members',
  ...overrides,
});
const getWorkingGroupsFixture = (items = [getWorkingGroup()]) => ({
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
describe('WorkingGroups', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  afterEach(() => {
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
    const firstGroup = getWorkingGroup({ id: '42', title: 'Working Group 42' });
    const secondGroup = getWorkingGroup({
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
});
