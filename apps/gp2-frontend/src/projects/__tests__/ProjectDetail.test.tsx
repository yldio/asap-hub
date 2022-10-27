import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import { getProject } from '../api';
import ProjectDetail from '../ProjectDetail';
import { refreshProjectState } from '../state';

jest.mock('../api');

const renderProjectDetail = async ({
  id,
  userId,
  route,
}: {
  id: string;
  userId?: string;
  route?: string;
}) => {
  render(
    <RecoilRoot
      initializeState={({ set }) => {
        set(refreshProjectState(id), Math.random());
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{ id: userId }}>
          <WhenReady>
            <MemoryRouter
              initialEntries={[
                route || gp2Routing.projects({}).project({ projectId: id }).$,
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
    await renderProjectDetail({ id: project.id });
    expect(screen.getByRole('banner')).toBeVisible();
  });

  it('renders not found if no project is returned', async () => {
    mockGetProject.mockResolvedValueOnce(undefined);
    await renderProjectDetail({ id: 'unknown-id' });
    expect(
      screen.getByRole('heading', {
        name: 'Sorry! We can’t seem to find that page.',
      }),
    ).toBeVisible();
  });
  it('renders the members section', async () => {
    const project = gp2Fixtures.createProjectResponse();
    project.members = [
      {
        userId: 'uuid',
        firstName: 'John',
        lastName: 'Doe',
        role: 'Contributor',
      },
    ];
    mockGetProject.mockResolvedValueOnce(project);
    await renderProjectDetail({ id: project.id });
    expect(screen.getByText(/project Members/i)).toBeVisible();
  });
  describe('resources', () => {
    it('renders the resources tab if the user is in the project', async () => {
      const project = gp2Fixtures.createProjectResponse();
      project.members = [
        {
          userId: '11',
          firstName: 'Tony',
          lastName: 'Stark',
          role: 'Project lead',
        },
      ];
      mockGetProject.mockResolvedValueOnce(project);
      await renderProjectDetail({ id: project.id, userId: '11' });
      expect(screen.getByRole('link', { name: /resources/i })).toBeVisible();
    });
    it('does not render the resources tab if the user is not in the project', async () => {
      const project = gp2Fixtures.createProjectResponse();
      project.members = [
        {
          userId: '23',
          firstName: 'Tony',
          lastName: 'Stark',
          role: 'Project lead',
        },
      ];
      mockGetProject.mockResolvedValueOnce(project);
      await renderProjectDetail({ id: project.id, userId: '11' });
      expect(
        screen.queryByRole('link', { name: /resources/i }),
      ).not.toBeInTheDocument();
    });
    it('renders the resources if the user is in the project', async () => {
      const project = gp2Fixtures.createProjectResponse();
      project.members = [
        {
          userId: '23',
          firstName: 'Tony',
          lastName: 'Stark',
          role: 'Project lead',
        },
      ];
      mockGetProject.mockResolvedValueOnce(project);
      await renderProjectDetail({
        id: project.id,
        userId: '23',
        route: gp2Routing
          .projects({})
          .project({ projectId: project.id })
          .resources({}).$,
      });
      expect(
        screen.getByRole('heading', { name: /Resource List/i }),
      ).toBeInTheDocument();
    });

    it('does not render the resources if the user is not in the project', async () => {
      const project = gp2Fixtures.createProjectResponse();
      project.members = [
        {
          userId: '23',
          firstName: 'Tony',
          lastName: 'Stark',
          role: 'Project lead',
        },
      ];
      mockGetProject.mockResolvedValueOnce(project);
      await renderProjectDetail({
        id: project.id,
        userId: '11',
        route: gp2Routing
          .projects({})
          .project({ projectId: project.id })
          .resources({}).$,
      });
      expect(
        screen.queryByRole('heading', { name: /Resource List/i }),
      ).not.toBeInTheDocument();
    });
  });
  it('clicking on the resource tab loads the resources', async () => {
    const project = gp2Fixtures.createProjectResponse();
    project.members = [
      {
        userId: '23',
        firstName: 'Tony',
        lastName: 'Stark',
        role: 'Project lead',
      },
    ];
    mockGetProject.mockResolvedValueOnce(project);
    await renderProjectDetail({
      id: project.id,
      userId: '23',
    });
    userEvent.click(screen.getByRole('link', { name: /resources/i }));
    expect(
      screen.getByRole('heading', { name: /Resource List/i }),
    ).toBeInTheDocument();
  });

  it('clicking on the overview tab loads the resources', async () => {
    const project = gp2Fixtures.createProjectResponse();
    project.members = [
      {
        userId: '23',
        firstName: 'Tony',
        lastName: 'Stark',
        role: 'Project lead',
      },
    ];
    mockGetProject.mockResolvedValueOnce(project);
    await renderProjectDetail({
      id: project.id,
      userId: '23',
      route: gp2Routing
        .projects({})
        .project({ projectId: project.id })
        .resources({}).$,
    });
    expect(
      screen.queryByRole('heading', { name: /Contact Information/i }),
    ).not.toBeInTheDocument();
    userEvent.click(screen.getByRole('link', { name: /overview/i }));

    expect(
      screen.getByRole('heading', { name: /Contact Information/i }),
    ).toBeInTheDocument();
  });
});
