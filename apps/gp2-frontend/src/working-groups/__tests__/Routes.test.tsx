import { gp2 } from '@asap-hub/fixtures';
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
  return waitForElementToBeRemoved(() => screen.queryByText(/loading/i), {
    timeout: 30_000,
  });
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
    const firstGroup = gp2.createWorkingGroupResponse({
      id: '42',
      title: 'Working Group 42',
    });
    const secondGroup = gp2.createWorkingGroupResponse({
      id: '11',
      title: 'Working Group 11',
    });
    mockGetWorkingGroups.mockResolvedValue(
      gp2.createWorkingGroupsResponse([firstGroup, secondGroup]),
    );
    await renderRoutes();
    expect(
      screen.getByRole('heading', { name: 'Working Group 42' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Working Group 11' }),
    ).toBeInTheDocument();
  }, 30_000);
});
