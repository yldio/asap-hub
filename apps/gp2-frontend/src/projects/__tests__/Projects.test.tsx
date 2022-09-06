import {
  createProjectResponse,
  createProjectsResponse,
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
import { getProjects } from '../api';
import Projects from '../Projects';
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
            <MemoryRouter initialEntries={['/projects']}>
              <Route path="/projects">
                <Projects />
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
  mockGetProjects.mockResolvedValueOnce(createProjectsResponse());
  await renderProjectsList();
  expect(
    screen.getByRole('heading', { name: 'Project Title' }),
  ).toBeInTheDocument();
});

it('renders a list of working groups', async () => {
  const mockGetProjects = getProjects as jest.MockedFunction<
    typeof getProjects
  >;
  const firstProject = createProjectResponse({
    id: '42',
    title: 'Project 42',
  });
  const secondProject = createProjectResponse({
    id: '11',
    title: 'Project 11',
  });
  mockGetProjects.mockResolvedValue(
    createProjectsResponse([firstProject, secondProject]),
  );
  await renderProjectsList();
  expect(
    screen.getByRole('heading', { name: 'Project 42' }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole('heading', { name: 'Project 11' }),
  ).toBeInTheDocument();
});
