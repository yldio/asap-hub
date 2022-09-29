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
import { getProjects } from '../api';
import Routes from '../Routes';
import { refreshProjectsState } from '../state';

const renderRoutes = async () => {
  render(
    <RecoilRoot
      initializeState={({ set }) => {
        set(refreshProjectsState, Math.random());
      }}
    >
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
describe('Routes', () => {
  it('renders a list of projects', async () => {
    const mockGetProjects = getProjects as jest.MockedFunction<
      typeof getProjects
    >;
    const firstGroup = gp2.createProjectResponse({
      id: '42',
      title: 'Project 42',
    });
    const secondGroup = gp2.createProjectResponse({
      id: '11',
      title: 'Project 11',
    });
    mockGetProjects.mockResolvedValue(
      gp2.createProjectsResponse([firstGroup, secondGroup]),
    );
    await renderRoutes();
    expect(
      screen.getByRole('heading', { name: 'Project 42' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Project 11' }),
    ).toBeInTheDocument();
  }, 30_000);
});
