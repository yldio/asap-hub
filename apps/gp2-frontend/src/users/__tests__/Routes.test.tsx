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
import { getUsers } from '../api';
import { getAlgoliaProjects } from '../../projects/api';
import { getWorkingGroups } from '../../working-groups/api';
import Routes from '../Routes';
import { createProjectListAlgoliaResponse } from '../../__fixtures__/algolia';

const renderRoutes = async () => {
  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/users']}>
              <Route path="/users">
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
beforeEach(jest.resetAllMocks);

jest.mock('../api');
jest.mock('../../projects/api');
jest.mock('../../working-groups/api');
describe('Routes', () => {
  it('renders a list of users', async () => {
    const mockGetUsers = getUsers as jest.MockedFunction<typeof getUsers>;
    mockGetUsers.mockResolvedValue(gp2.createUsersResponse(1));
    const mockGetProjects = getAlgoliaProjects as jest.MockedFunction<
      typeof getAlgoliaProjects
    >;
    mockGetProjects.mockResolvedValue(createProjectListAlgoliaResponse(1));
    const mockGetWorkingGroups = getWorkingGroups as jest.MockedFunction<
      typeof getWorkingGroups
    >;
    mockGetWorkingGroups.mockResolvedValue(gp2.createWorkingGroupsResponse());
    await renderRoutes();
    expect(
      screen.getByRole('heading', { name: 'Tony Stark, PhD' }),
    ).toBeInTheDocument();
  }, 30_000);
});
