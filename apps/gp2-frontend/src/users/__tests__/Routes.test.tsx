import { mockConsoleError } from '@asap-hub/dom-test-utils';
import { gp2 } from '@asap-hub/fixtures';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { Suspense } from 'react';
import {
  MemoryRouter,
  Route,
  Routes as ReactRouterRoutes,
} from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getProjects } from '../../projects/api';
import { getTags } from '../../shared/api';
import { getWorkingGroups } from '../../working-groups/api';
import {
  createProjectListAlgoliaResponse,
  createUserListAlgoliaResponse,
} from '../../__fixtures__/algolia';
import { getAlgoliaUsers } from '../api';
import Routes from '../Routes';

mockConsoleError();

const renderRoutes = async () => {
  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/users']}>
              <ReactRouterRoutes>
                <Route path="/users/*" element={<Routes />} />
              </ReactRouterRoutes>
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
jest.mock('../../shared/api');
describe('Routes', () => {
  it('renders a list of users', async () => {
    const mockGetProjects = getProjects as jest.MockedFunction<
      typeof getProjects
    >;
    mockGetProjects.mockResolvedValue(createProjectListAlgoliaResponse(1));
    const mockGetWorkingGroups = getWorkingGroups as jest.MockedFunction<
      typeof getWorkingGroups
    >;
    mockGetWorkingGroups.mockResolvedValue(gp2.createWorkingGroupsResponse());
    const mockGetUsers = getAlgoliaUsers as jest.MockedFunction<
      typeof getAlgoliaUsers
    >;
    mockGetUsers.mockResolvedValue(createUserListAlgoliaResponse(1));
    const mockGetTags = getTags as jest.MockedFunction<typeof getTags>;
    mockGetTags.mockResolvedValue(gp2.createTagsResponse());

    await renderRoutes();
    expect(
      screen.getByRole('heading', { name: 'Tony Stark 0, PhD' }),
    ).toBeInTheDocument();
  }, 30_000);
  it('renders error message when the request is not a 2XX', async () => {
    const mockGetProjects = getProjects as jest.MockedFunction<
      typeof getProjects
    >;
    mockGetProjects.mockResolvedValue(createProjectListAlgoliaResponse(1));
    const mockGetWorkingGroups = getWorkingGroups as jest.MockedFunction<
      typeof getWorkingGroups
    >;
    mockGetWorkingGroups.mockResolvedValue(gp2.createWorkingGroupsResponse());
    const mockGetUsers = getAlgoliaUsers as jest.MockedFunction<
      typeof getAlgoliaUsers
    >;
    const mockGetTags = getTags as jest.MockedFunction<typeof getTags>;
    mockGetTags.mockResolvedValue(gp2.createTagsResponse());
    mockGetUsers.mockRejectedValue(new Error('error'));

    await renderRoutes();
    expect(mockGetUsers).toHaveBeenCalled();
    expect(screen.getByText(/Something went wrong/i)).toBeVisible();
  });
});
