import { gp2 } from '@asap-hub/fixtures';
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import {
  createProjectAlgoliaRecord,
  createProjectListAlgoliaResponse,
} from '../../__fixtures__/algolia';
import { getAlgoliaProjects } from '../api';
import Routes from '../Routes';

const renderRoutes = async () => {
  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/projects']}>
              <Route path="/projects">
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
const mockGetProjects = getAlgoliaProjects as jest.MockedFunction<
  typeof getAlgoliaProjects
>;
describe('Routes', () => {
  it('renders a list of projects', async () => {
    const firstGroup = gp2.createProjectResponse({
      id: '42',
      title: 'Project 42',
    });
    const secondGroup = gp2.createProjectResponse({
      id: '11',
      title: 'Project 11',
    });
    mockGetProjects.mockResolvedValue(
      createProjectListAlgoliaResponse(2, {
        hits: [
          createProjectAlgoliaRecord(0, gp2.createProjectResponse(firstGroup)),
          createProjectAlgoliaRecord(0, gp2.createProjectResponse(secondGroup)),
        ],
      }),
    );
    await renderRoutes();
    expect(
      screen.getByRole('heading', { name: 'Project 42' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Project 11' }),
    ).toBeInTheDocument();
  }, 30_000);

  it('can perform a search', async () => {
    mockGetProjects.mockResolvedValue(createProjectListAlgoliaResponse(1));
    await renderRoutes();
    userEvent.type(screen.getByPlaceholderText(/Enter name/i), 'example');
    await waitFor(() =>
      expect(mockGetProjects).toHaveBeenLastCalledWith(
        expect.anything(),
        expect.objectContaining({ searchQuery: 'example' }),
      ),
    );
  });
});
