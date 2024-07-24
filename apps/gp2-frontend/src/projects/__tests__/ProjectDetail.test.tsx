import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 as gp2Model } from '@asap-hub/model';
import { gp2 as gp2Routing } from '@asap-hub/routing';
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
import { getEvents } from '../../events/api';
import { getOutputs, getOutput } from '../../outputs/api';
import { getContributingCohorts, getTags } from '../../shared/api';
import { getWorkingGroups } from '../../working-groups/api';
import {
  createEventListAlgoliaResponse,
  createOutputListAlgoliaResponse,
  createProjectAlgoliaRecord,
  createProjectListAlgoliaResponse,
} from '../../__fixtures__/algolia';
import { getProject, getProjects, putProjectResources } from '../api';
import ProjectDetail from '../ProjectDetail';

jest.mock('../api');
jest.mock('../../outputs/api');
jest.mock('../../events/api');
jest.mock('../../shared/api');
jest.mock('../../working-groups/api');

const renderProjectDetail = async ({
  id,
  userId,
  route,
  role = 'Trainee',
  projects = [],
}: {
  id: string;
  userId?: string;
  route?: string;
  role?: gp2Model.UserRole;
  projects?: gp2Model.UserProject[];
}) => {
  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{ id: userId, role, projects }}>
          <WhenReady>
            <MemoryRouter
              initialEntries={[
                route ||
                  gp2Routing.projects.DEFAULT.DETAILS.buildPath({
                    projectId: id,
                  }),
              ]}
            >
              <Route path={gp2Routing.projects.DEFAULT.DETAILS.path}>
                <ProjectDetail currentTime={new Date()} />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );

  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};
const projectMember = {
  userId: '23',
  firstName: 'Tony',
  lastName: 'Stark',
  displayName: 'Tony Stark',
  role: 'Project lead',
} as gp2Model.ProjectMember;

describe('ProjectDetail', () => {
  const mockGetProject = getProject as jest.MockedFunction<typeof getProject>;
  const mockGetProjects = getProjects as jest.MockedFunction<
    typeof getProjects
  >;
  const mockGetOutput = getOutput as jest.MockedFunction<typeof getOutput>;
  const mockGetTags = getTags as jest.MockedFunction<typeof getTags>;
  const mockGetContributingCohorts =
    getContributingCohorts as jest.MockedFunction<
      typeof getContributingCohorts
    >;
  const mockGetWorkingGroups = getWorkingGroups as jest.MockedFunction<
    typeof getWorkingGroups
  >;
  const mockGetOutputs = getOutputs as jest.MockedFunction<typeof getOutputs>;
  const mockPutProjectResources = putProjectResources as jest.MockedFunction<
    typeof putProjectResources
  >;
  const mockGetEvents = getEvents as jest.MockedFunction<typeof getEvents>;

  beforeEach(jest.resetAllMocks);
  beforeEach(() => {
    mockGetOutputs.mockResolvedValue(createOutputListAlgoliaResponse(1));
    mockGetEvents.mockResolvedValue(createEventListAlgoliaResponse(1));
  });
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
    project.members = [projectMember];
    mockGetProject.mockResolvedValueOnce(project);
    await renderProjectDetail({ id: project.id });
    expect(screen.getByText(/project Members/i)).toBeVisible();
  });

  describe('resources', () => {
    it('renders the resources tab if the user is in the project', async () => {
      const project = gp2Fixtures.createProjectResponse();
      project.members = [
        {
          ...projectMember,
          userId: '11',
        },
      ];
      mockGetProject.mockResolvedValueOnce(project);
      await renderProjectDetail({ id: project.id, userId: '11' });
      expect(screen.getByRole('link', { name: /workspace/i })).toBeVisible();
    });

    it('does not render the resources tab if the user is not in the project', async () => {
      const project = gp2Fixtures.createProjectResponse();
      project.members = [projectMember];
      mockGetProject.mockResolvedValueOnce(project);
      await renderProjectDetail({ id: project.id, userId: '11' });
      expect(
        screen.queryByRole('link', { name: /workspace/i }),
      ).not.toBeInTheDocument();
    });

    it('renders the resources if the user is in the project', async () => {
      const project = gp2Fixtures.createProjectResponse();
      project.members = [projectMember];
      mockGetProject.mockResolvedValueOnce(project);
      await renderProjectDetail({
        id: project.id,
        userId: '23',
        route: gp2Routing.projects.DEFAULT.DETAILS.WORKSPACE.buildPath({
          projectId: project.id,
        }),
      });
      expect(
        screen.getByRole('heading', { name: /Workspace Resources/i }),
      ).toBeInTheDocument();
    });

    it('does not render the resources if the user is not in the project', async () => {
      const project = gp2Fixtures.createProjectResponse();
      project.members = [projectMember];
      mockGetProject.mockResolvedValueOnce(project);
      await renderProjectDetail({
        id: project.id,
        userId: '11',
        route: gp2Routing.projects.DEFAULT.DETAILS.WORKSPACE.buildPath({
          projectId: project.id,
        }),
      });
      expect(
        screen.queryByRole('heading', { name: /Workspace Resources/i }),
      ).not.toBeInTheDocument();
    });
  });

  it('clicking on the resource tab loads the resources', async () => {
    const project = gp2Fixtures.createProjectResponse();
    project.members = [projectMember];
    mockGetProject.mockResolvedValueOnce(project);
    await renderProjectDetail({
      id: project.id,
      userId: '23',
    });
    userEvent.click(screen.getByRole('link', { name: /workspace/i }));
    expect(
      screen.getByRole('heading', { name: /Workspace Resources/i }),
    ).toBeInTheDocument();
  });

  it('clicking on the overview tab loads the resources', async () => {
    const project = gp2Fixtures.createProjectResponse();
    project.members = [projectMember];
    mockGetProject.mockResolvedValueOnce(project);
    await renderProjectDetail({
      id: project.id,
      userId: '23',
      route: gp2Routing.projects.DEFAULT.DETAILS.WORKSPACE.buildPath({
        projectId: project.id,
      }),
    });
    expect(
      screen.queryByRole('heading', { name: /Contact/i }),
    ).not.toBeInTheDocument();
    userEvent.click(screen.getByRole('link', { name: /overview/i }));

    expect(
      screen.getByRole('heading', { name: /Contact/i }),
    ).toBeInTheDocument();
  });

  it.each(gp2Model.userRoles.filter((role) => role !== 'Administrator'))(
    'does not render the add modal when the user is not an Administrator or Project manager',
    async (role) => {
      const project = gp2Fixtures.createProjectResponse();
      project.members = [projectMember];
      mockGetProject.mockResolvedValueOnce(project);
      await renderProjectDetail({
        id: project.id,
        userId: '23',
        role,
        route: gp2Routing.projects.DEFAULT.DETAILS.WORKSPACE.ADD.buildPath({
          projectId: project.id,
        }),
      });
      expect(
        screen.queryByRole('heading', { name: /Add resource/i }),
      ).not.toBeInTheDocument();
    },
  );

  it('renders the add modal when the user is an Administrator', async () => {
    const project = gp2Fixtures.createProjectResponse();
    project.members = [projectMember];
    mockGetProject.mockResolvedValueOnce(project);
    await renderProjectDetail({
      id: project.id,
      userId: '23',
      role: 'Administrator',
      route: gp2Routing.projects.DEFAULT.DETAILS.WORKSPACE.ADD.buildPath({
        projectId: project.id,
      }),
    });
    expect(
      screen.getByRole('heading', { name: /Add resource/i }),
    ).toBeInTheDocument();
  });

  it('renders the add modal when the user is not Administrator but is a Project manager', async () => {
    const project = gp2Fixtures.createProjectResponse();
    project.members = [
      {
        ...projectMember,
        role: 'Project manager',
      },
    ];
    mockGetProject.mockResolvedValueOnce(project);
    await renderProjectDetail({
      id: project.id,
      userId: '23',
      role: 'Trainee',
      projects: [project],
      route: gp2Routing.projects.DEFAULT.DETAILS.WORKSPACE.ADD.buildPath({
        projectId: project.id,
      }),
    });
    expect(
      screen.getByRole('heading', { name: /Add resource/i }),
    ).toBeInTheDocument();
  });

  describe('Resources Modal', () => {
    const project = gp2Fixtures.createProjectResponse();
    project.members = [projectMember];

    it('does render the add and edit button to Administrators', async () => {
      mockGetProject.mockResolvedValueOnce(project);
      await renderProjectDetail({
        id: project.id,
        userId: '23',
        role: 'Administrator',
        route: gp2Routing.projects.DEFAULT.DETAILS.WORKSPACE.buildPath({
          projectId: project.id,
        }),
      });

      expect(screen.getByRole('link', { name: /add/i })).toBeVisible();
      expect(screen.getByRole('link', { name: /edit/i })).toBeVisible();
    });

    it.each(gp2Model.userRoles.filter((role) => role !== 'Administrator'))(
      'does not render the add and edit button to non Administrators - %s',
      async (role) => {
        mockGetProject.mockResolvedValueOnce(project);
        await renderProjectDetail({
          id: project.id,
          userId: '23',
          role,
          route: gp2Routing.projects.DEFAULT.DETAILS.WORKSPACE.buildPath({
            projectId: project.id,
          }),
        });

        expect(
          screen.queryByRole('link', { name: /add/i }),
        ).not.toBeInTheDocument();
        expect(
          screen.queryByRole('link', { name: /edit/i }),
        ).not.toBeInTheDocument();
      },
    );

    it('can submit an add modal when form data is valid', async () => {
      const title = 'example42 title';
      const type = 'Note';

      mockGetProject.mockResolvedValueOnce(project);
      mockPutProjectResources.mockResolvedValueOnce(project);
      await renderProjectDetail({
        id: project.id,
        userId: '23',
        role: 'Administrator',
        route: gp2Routing.projects.DEFAULT.DETAILS.WORKSPACE.buildPath({
          projectId: project.id,
        }),
      });

      const addButton = screen.getByRole('link', { name: /add/i });
      userEvent.click(addButton);
      const typeBox = await screen.findByRole('textbox', { name: /type/i });
      userEvent.type(typeBox, `${type}{enter}`);
      const titleBox = screen.getByRole('textbox', { name: /title/i });
      userEvent.type(titleBox, title);
      const saveButton = screen.getByRole('button', { name: /save/i });
      userEvent.click(saveButton);

      expect(mockPutProjectResources).toHaveBeenCalledWith(
        project.id,
        [...project.resources!, { title, type }],
        expect.anything(),
      );
      await waitFor(() => expect(saveButton).toBeEnabled());
    });

    it('can submit an edit modal when form data is valid', async () => {
      const resources: gp2Model.Resource[] = [
        {
          type: 'Note',
          title: 'first resource',
        },
        {
          type: 'Note',
          title: 'second resource',
        },
        {
          type: 'Note',
          title: 'third resource',
        },
      ];
      const title = 'example42 title';

      const projectResources = { ...project, resources };
      mockGetProject.mockResolvedValueOnce(projectResources);
      mockPutProjectResources.mockResolvedValueOnce(projectResources);
      await renderProjectDetail({
        id: projectResources.id,
        userId: '23',
        role: 'Administrator',
        route: gp2Routing.projects.DEFAULT.DETAILS.WORKSPACE.buildPath({
          projectId: project.id,
        }),
      });

      const editButton = screen.getAllByRole('link', { name: /edit/i })[1]!;
      userEvent.click(editButton);
      const titleBox = screen.getByRole('textbox', { name: /title/i });
      userEvent.clear(titleBox);
      userEvent.type(titleBox, title);
      const saveButton = screen.getByRole('button', { name: /save/i });
      userEvent.click(saveButton);

      expect(mockPutProjectResources).toHaveBeenCalledWith(
        project.id,
        [resources[0], { ...resources[1], title }, resources[2]],
        expect.anything(),
      );
      await waitFor(() => expect(saveButton).toBeEnabled());
    });
  });
  describe('the upcoming events tab', () => {
    it('can be switched to', async () => {
      const project = gp2Fixtures.createProjectResponse();
      mockGetProject.mockResolvedValueOnce(project);
      await renderProjectDetail({ id: project.id });
      userEvent.click(await screen.findByText(/upcoming events \(1\)/i));
      expect(await screen.findByText(/Event 0/i)).toBeVisible();
    });
  });

  describe('the past events tab', () => {
    it('can be switched to', async () => {
      const project = gp2Fixtures.createProjectResponse();
      mockGetProject.mockResolvedValueOnce(project);
      await renderProjectDetail({ id: project.id });
      userEvent.click(await screen.findByText(/past events \(1\)/i));
      expect(await screen.findByText(/Event 0/i)).toBeVisible();
    });
  });
  it('displays the correct count', async () => {
    const project = gp2Fixtures.createProjectResponse();
    mockGetProject.mockResolvedValueOnce(project);
    mockGetEvents
      .mockResolvedValueOnce(createEventListAlgoliaResponse(2))
      .mockResolvedValueOnce(createEventListAlgoliaResponse(3));
    await renderProjectDetail({ id: project.id });
    expect(await screen.findByText(/upcoming events \(2\)/i)).toBeVisible();
    expect(await screen.findByText(/past events \(3\)/i)).toBeVisible();
  });

  describe('Duplicate Output', () => {
    it('allows a user who is an Administrator or Project Manager to duplicate an output', async () => {
      const project = {
        ...gp2Fixtures.createProjectResponse(),
        members: [
          {
            userId: '23',
            firstName: 'Tony',
            lastName: 'Stark',
            role: 'Project manager',
          },
        ] as gp2Model.ProjectMember[],
      };
      const output = gp2Fixtures.createOutputResponse();
      mockGetProject.mockResolvedValue(project);
      mockGetOutput.mockResolvedValueOnce({
        ...output,
        title: 'Test Output',
        projects: [project],
      });
      mockGetTags.mockResolvedValue(gp2Fixtures.createTagsResponse());
      mockGetContributingCohorts.mockResolvedValueOnce(
        gp2Fixtures.contributingCohortResponse,
      );
      mockGetWorkingGroups.mockResolvedValue(
        gp2Fixtures.createWorkingGroupsResponse(),
      );
      mockGetProjects.mockResolvedValue(
        createProjectListAlgoliaResponse(1, {
          hits: [
            createProjectAlgoliaRecord(
              gp2Fixtures.createProjectResponse(project),
            ),
          ],
        }),
      );

      await renderProjectDetail({
        id: project.id,
        userId: '23',
        route: gp2Routing.projects.DEFAULT.DETAILS.DUPLICATE_OUTPUT.buildPath({
          projectId: project.id,
          outputId: output.id,
        }),
        projects: [project],
      });

      expect(screen.getByLabelText(/Title/i)).toHaveValue(
        'Copy of Test Output',
      );
      expect(screen.getByLabelText(/URL/i)).toHaveValue('');
    });

    it('will show a page not found if output does not exist', async () => {
      const project = {
        ...gp2Fixtures.createProjectResponse(),
        members: [
          {
            userId: '23',
            firstName: 'Tony',
            lastName: 'Stark',
            role: 'Project manager',
          },
        ] as gp2Model.ProjectMember[],
      };
      mockGetProject.mockResolvedValueOnce(project);
      mockGetOutput.mockResolvedValueOnce(undefined);
      await renderProjectDetail({
        id: project.id,
        userId: '23',
        route: gp2Routing.projects.DEFAULT.DETAILS.DUPLICATE_OUTPUT.buildPath({
          projectId: project.id,
          outputId: 'test-id',
        }),
        projects: [project],
      });
      expect(screen.getByText(/sorry.+page/i)).toBeVisible();
    });
  });
});
