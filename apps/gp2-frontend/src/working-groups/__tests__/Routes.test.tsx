import {
  createWorkingGroupResponse,
  createWorkingGroupsResponse,
} from '@asap-hub/fixtures';
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
import Routes from '../Routes';
import { refreshWorkingGroupsState } from '../state';

jest.setTimeout(30000);
const renderRoutes = async () => {
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
                <Routes />
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

jest.mock('../api');
describe('Routes', () => {
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
    await renderRoutes();
    expect(
      screen.getByRole('heading', { name: 'Working Group 42' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Working Group 11' }),
    ).toBeInTheDocument();
  });
});
