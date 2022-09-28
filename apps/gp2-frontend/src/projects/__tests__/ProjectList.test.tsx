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
import { getProjects } from '../api';
import ProjectList from '../ProjectList';
import { refreshProjectsState } from '../state';

jest.mock('../api');

const renderProjectsList = async () => {
  render(
    <RecoilRoot
      initializeState={({ set }) => {
        set(refreshProjectsState, Math.random());
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={[gp2Routing.projects({}).$]}>
              <Route path={gp2Routing.projects.template}>
                <ProjectList />
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
  const mockGetProjects = getProjects as jest.MockedFunction<
    typeof getProjects
  >;
  mockGetProjects.mockResolvedValueOnce(gp2Fixtures.createProjectsResponse());
  await renderProjectsList();
  expect(
    screen.getByRole('heading', { name: 'Project Title' }),
  ).toBeInTheDocument();
});

it('renders a list of working groups', async () => {
  const mockGetProjects = getProjects as jest.MockedFunction<
    typeof getProjects
  >;
  const firstProject = gp2Fixtures.createProjectResponse({
    id: '42',
    title: 'Project 42',
  });
  const secondProject = gp2Fixtures.createProjectResponse({
    id: '11',
    title: 'Project 11',
  });
  mockGetProjects.mockResolvedValue(
    gp2Fixtures.createProjectsResponse([firstProject, secondProject]),
  );
  await renderProjectsList();
  expect(
    screen.getByRole('heading', { name: 'Project 42' }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole('heading', { name: 'Project 11' }),
  ).toBeInTheDocument();
});
