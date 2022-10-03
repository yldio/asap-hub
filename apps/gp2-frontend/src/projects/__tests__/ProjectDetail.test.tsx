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
import { getProject } from '../api';
import { refreshProjectState } from '../state';
import ProjectDetail from '../ProjectDetail';

jest.mock('../api');

const renderProjectDetail = async (id: string) => {
  render(
    <RecoilRoot
      initializeState={({ set }) => {
        set(refreshProjectState(id), Math.random());
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter
              initialEntries={[
                gp2Routing.projects({}).project({ projectId: id }).$,
              ]}
            >
              <Route
                path={
                  gp2Routing.projects.template +
                  gp2Routing.projects({}).project.template
                }
              >
                <ProjectDetail />
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
describe('ProjectDetail', () => {
  const mockGetProject = getProject as jest.MockedFunction<typeof getProject>;

  it('renders header with title', async () => {
    const project = gp2Fixtures.createProjectResponse();
    mockGetProject.mockResolvedValueOnce(project);
    await renderProjectDetail(project.id);
    expect(screen.getByRole('banner')).toBeVisible();
  });

  it('renders not found if no working group is returned', async () => {
    mockGetProject.mockResolvedValueOnce(undefined);
    await renderProjectDetail('unknown-id');
    expect(
      screen.getByRole('heading', {
        name: 'Sorry! We can’t seem to find that page.',
      }),
    ).toBeVisible();
  });
});
