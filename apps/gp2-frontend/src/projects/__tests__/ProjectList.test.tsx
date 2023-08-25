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
import {
  createProjectAlgoliaRecord,
  createProjectListAlgoliaResponse,
} from '../../__fixtures__/algolia';
import { getAlgoliaProjects } from '../api';
import ProjectList from '../ProjectList';

jest.mock('../api');

const renderProjectsList = async () => {
  render(
    <RecoilRoot>
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
  const mockGetProjects = getAlgoliaProjects as jest.MockedFunction<
    typeof getAlgoliaProjects
  >;
  mockGetProjects.mockResolvedValueOnce(createProjectListAlgoliaResponse(1));
  await renderProjectsList();
  expect(
    screen.getByRole('heading', { name: 'Project Title' }),
  ).toBeInTheDocument();
});

it('renders a list of working groups', async () => {
  const mockGetProjects = getAlgoliaProjects as jest.MockedFunction<
    typeof getAlgoliaProjects
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
    createProjectListAlgoliaResponse(2, {
      hits: [
        createProjectAlgoliaRecord(
          0,
          gp2Fixtures.createProjectResponse(firstProject),
        ),
        createProjectAlgoliaRecord(
          0,
          gp2Fixtures.createProjectResponse(secondProject),
        ),
      ],
    }),
  );
  await renderProjectsList();
  expect(
    screen.getByRole('heading', { name: 'Project 42' }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole('heading', { name: 'Project 11' }),
  ).toBeInTheDocument();
});
