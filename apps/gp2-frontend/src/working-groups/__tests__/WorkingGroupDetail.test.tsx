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
import { getProjects } from '../../projects/api';
import { getContributingCohorts, getTags } from '../../shared/api';
import {
  createEventListAlgoliaResponse,
  createOutputListAlgoliaResponse,
  createProjectAlgoliaRecord,
  createProjectListAlgoliaResponse,
} from '../../__fixtures__/algolia';
import {
  getWorkingGroup,
  getWorkingGroups,
  putWorkingGroupResources,
} from '../api';
import WorkingGroupDetail from '../WorkingGroupDetail';

jest.mock('../api');
jest.mock('../../outputs/api');
jest.mock('../../events/api');
jest.mock('../../shared/api');
jest.mock('../../projects/api');

const renderWorkingGroupDetail = async ({
  id,
  userId = '11',
  route,
  role = 'Trainee',
}: {
  id: string;
  userId?: string;
  route?: string;
  role?: gp2Model.UserRole;
}) => {
  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{ id: userId, role }}>
          <WhenReady>
            <MemoryRouter
              initialEntries={[
                route ||
                  gp2Routing
                    .workingGroups({})
                    .workingGroup({ workingGroupId: id }).$,
              ]}
            >
              <Route
                path={
                  gp2Routing.workingGroups.template +
                  gp2Routing.workingGroups({}).workingGroup.template
                }
              >
                <WorkingGroupDetail currentTime={new Date()} />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );

  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};

describe('WorkingGroupDetail', () => {
  beforeEach(jest.resetAllMocks);
  const mockGetWorkingGroup = getWorkingGroup as jest.MockedFunction<
    typeof getWorkingGroup
  >;
  const mockPutWorkingGroupResources =
    putWorkingGroupResources as jest.MockedFunction<
      typeof putWorkingGroupResources
    >;
  const mockGetOutputs = getOutputs as jest.MockedFunction<typeof getOutputs>;
  const mockGetEvents = getEvents as jest.MockedFunction<typeof getEvents>;

  const mockGetOutput = getOutput as jest.MockedFunction<typeof getOutput>;
  const mockGetTags = getTags as jest.MockedFunction<typeof getTags>;
  const mockGetContributingCohorts =
    getContributingCohorts as jest.MockedFunction<
      typeof getContributingCohorts
    >;
  const mockGetWorkingGroups = getWorkingGroups as jest.MockedFunction<
    typeof getWorkingGroups
  >;
  const mockGetProjects = getProjects as jest.MockedFunction<
    typeof getProjects
  >;

  const outputs = createOutputListAlgoliaResponse(1);
  outputs.hits[0]!.workingGroups = [
    {
      id: '42',
      title: 'Steering Committee',
    },
  ];

  beforeEach(() => {
    mockGetOutputs.mockResolvedValue(outputs);
    mockGetEvents.mockResolvedValue(createEventListAlgoliaResponse(1));
  });
  it('renders header with title', async () => {
    const workingGroup = gp2Fixtures.createWorkingGroupResponse();
    mockGetWorkingGroup.mockResolvedValueOnce(workingGroup);

    await renderWorkingGroupDetail({ id: workingGroup.id });
    expect(screen.getByRole('banner')).toBeVisible();
  });

  it('renders not found if no working group is returned', async () => {
    mockGetWorkingGroup.mockResolvedValueOnce(undefined);
    await renderWorkingGroupDetail({ id: 'unknown-id' });
    expect(
      screen.getByRole('heading', {
        name: 'Sorry! We can’t seem to find that page.',
      }),
    ).toBeVisible();
  });

  it('renders the members section', async () => {
    const workingGroup = gp2Fixtures.createWorkingGroupResponse();
    workingGroup.members = [
      {
        userId: 'uuid',
        firstName: 'John',
        lastName: 'Doe',
        role: 'Lead',
      },
    ];
    mockGetWorkingGroup.mockResolvedValueOnce(workingGroup);
    await renderWorkingGroupDetail({ id: workingGroup.id });
    expect(screen.getByText(/Working Group Members/i)).toBeVisible();
  });

  describe('resources', () => {
    it('renders the resources tab if the user is in the working group', async () => {
      const workingGroup = gp2Fixtures.createWorkingGroupResponse();
      workingGroup.members = [
        {
          userId: '11',
          firstName: 'Tony',
          lastName: 'Stark',
          role: 'Lead',
        },
      ];
      mockGetWorkingGroup.mockResolvedValueOnce(workingGroup);
      await renderWorkingGroupDetail({ id: workingGroup.id, userId: '11' });
      expect(screen.getByRole('link', { name: /workspace/i })).toBeVisible();
    });

    it('does not render the resources tab if the user is not in the working group', async () => {
      const workingGroup = gp2Fixtures.createWorkingGroupResponse();
      workingGroup.members = [
        {
          userId: '23',
          firstName: 'Tony',
          lastName: 'Stark',
          role: 'Lead',
        },
      ];
      mockGetWorkingGroup.mockResolvedValueOnce(workingGroup);
      await renderWorkingGroupDetail({ id: workingGroup.id, userId: '11' });
      expect(
        screen.queryByRole('link', { name: /workspace/i }),
      ).not.toBeInTheDocument();
    });

    it('does renders the resources if the user is not in the working group', async () => {
      const workingGroup = gp2Fixtures.createWorkingGroupResponse();
      workingGroup.members = [
        {
          userId: '23',
          firstName: 'Tony',
          lastName: 'Stark',
          role: 'Lead',
        },
      ];
      mockGetWorkingGroup.mockResolvedValueOnce(workingGroup);
      await renderWorkingGroupDetail({
        id: workingGroup.id,
        userId: '23',
        route: gp2Routing
          .workingGroups({})
          .workingGroup({ workingGroupId: workingGroup.id })
          .workspace({}).$,
      });
      expect(
        screen.getByRole('heading', { name: /Workspace Resources/i }),
      ).toBeInTheDocument();
    });

    it('does not render the resources if the user is not in the working group', async () => {
      const workingGroup = gp2Fixtures.createWorkingGroupResponse();
      workingGroup.members = [
        {
          userId: '23',
          firstName: 'Tony',
          lastName: 'Stark',
          role: 'Lead',
        },
      ];
      mockGetWorkingGroup.mockResolvedValueOnce(workingGroup);
      await renderWorkingGroupDetail({
        id: workingGroup.id,
        userId: '11',
        route: gp2Routing
          .workingGroups({})
          .workingGroup({ workingGroupId: workingGroup.id })
          .workspace({}).$,
      });
      expect(
        screen.queryByRole('heading', { name: /Workspace Resources/i }),
      ).not.toBeInTheDocument();
    });
  });

  it('clicking on the resource tab loads the resources', async () => {
    const workingGroup = gp2Fixtures.createWorkingGroupResponse();
    workingGroup.members = [
      {
        userId: '23',
        firstName: 'Tony',
        lastName: 'Stark',
        role: 'Lead',
      },
    ];
    mockGetWorkingGroup.mockResolvedValueOnce(workingGroup);
    await renderWorkingGroupDetail({
      id: workingGroup.id,
      userId: '23',
    });
    userEvent.click(screen.getByRole('link', { name: /workspace/i }));
    expect(
      screen.getByRole('heading', { name: /Workspace Resources/i }),
    ).toBeInTheDocument();
  });

  it('clicking on the overview tab loads the overview', async () => {
    const workingGroup = gp2Fixtures.createWorkingGroupResponse();
    workingGroup.members = [
      {
        userId: '23',
        firstName: 'Tony',
        lastName: 'Stark',
        role: 'Lead',
      },
    ];
    mockGetWorkingGroup.mockResolvedValueOnce(workingGroup);
    await renderWorkingGroupDetail({
      id: workingGroup.id,
      userId: '23',
      route: gp2Routing
        .workingGroups({})
        .workingGroup({ workingGroupId: workingGroup.id })
        .workspace({}).$,
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
    'does not render the add modal when the user is not an Administrator',
    async (role) => {
      const workingGroup = gp2Fixtures.createWorkingGroupResponse();
      workingGroup.members = [
        {
          userId: '23',
          firstName: 'Tony',
          lastName: 'Stark',
          role: 'Lead',
        },
      ];
      mockGetWorkingGroup.mockResolvedValueOnce(workingGroup);
      await renderWorkingGroupDetail({
        id: workingGroup.id,
        userId: '23',
        role,
        route: gp2Routing
          .workingGroups({})
          .workingGroup({ workingGroupId: workingGroup.id })
          .workspace({})
          .add({}).$,
      });
      expect(
        screen.queryByRole('heading', { name: /Add resource/i }),
      ).not.toBeInTheDocument();
    },
  );

  it('renders the add modal when the user is an Administrator', async () => {
    const workingGroup = gp2Fixtures.createWorkingGroupResponse();
    workingGroup.members = [
      {
        userId: '23',
        firstName: 'Tony',
        lastName: 'Stark',
        role: 'Lead',
      },
    ];
    mockGetWorkingGroup.mockResolvedValueOnce(workingGroup);
    await renderWorkingGroupDetail({
      id: workingGroup.id,
      userId: '23',
      role: 'Administrator',
      route: gp2Routing
        .workingGroups({})
        .workingGroup({ workingGroupId: workingGroup.id })
        .workspace({})
        .add({}).$,
    });
    expect(
      screen.getByRole('heading', { name: /Add resource/i }),
    ).toBeInTheDocument();
  });

  describe('Resources Modal', () => {
    const workingGroup = gp2Fixtures.createWorkingGroupResponse();
    workingGroup.members = [
      {
        userId: '23',
        firstName: 'Tony',
        lastName: 'Stark',
        role: 'Lead',
      },
    ];

    it('does render the add and edit button to Administrators', async () => {
      mockGetWorkingGroup.mockResolvedValueOnce(workingGroup);
      await renderWorkingGroupDetail({
        id: workingGroup.id,
        userId: '23',
        role: 'Administrator',
        route: gp2Routing
          .workingGroups({})
          .workingGroup({ workingGroupId: workingGroup.id })
          .workspace({}).$,
      });

      expect(screen.getByRole('link', { name: /add/i })).toBeVisible();
      expect(screen.getByRole('link', { name: /edit/i })).toBeVisible();
    });

    it.each(gp2Model.userRoles.filter((role) => role !== 'Administrator'))(
      'does not render the add and edit button to non Administrators - %s',
      async (role) => {
        mockGetWorkingGroup.mockResolvedValueOnce(workingGroup);
        await renderWorkingGroupDetail({
          id: workingGroup.id,
          userId: '23',
          role,
          route: gp2Routing
            .workingGroups({})
            .workingGroup({ workingGroupId: workingGroup.id })
            .workspace({}).$,
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

      mockGetWorkingGroup.mockResolvedValueOnce(workingGroup);
      mockPutWorkingGroupResources.mockResolvedValueOnce(workingGroup);
      await renderWorkingGroupDetail({
        id: workingGroup.id,
        userId: '23',
        role: 'Administrator',
        route: gp2Routing
          .workingGroups({})
          .workingGroup({ workingGroupId: workingGroup.id })
          .workspace({}).$,
      });

      const addButton = screen.getByRole('link', { name: /add/i });
      userEvent.click(addButton);
      const typeBox = await screen.findByRole('textbox', { name: /type/i });
      userEvent.type(typeBox, `${type}{enter}`);
      const titleBox = screen.getByRole('textbox', { name: /title/i });
      userEvent.type(titleBox, title);
      const saveButton = screen.getByRole('button', { name: /save/i });
      userEvent.click(saveButton);

      expect(mockPutWorkingGroupResources).toHaveBeenCalledWith(
        workingGroup.id,
        [...workingGroup.resources!, { title, type }],
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

      const workingGroupResources = { ...workingGroup, resources };
      mockGetWorkingGroup.mockResolvedValueOnce(workingGroupResources);
      mockPutWorkingGroupResources.mockResolvedValueOnce(workingGroupResources);
      await renderWorkingGroupDetail({
        id: workingGroupResources.id,
        userId: '23',
        role: 'Administrator',
        route: gp2Routing
          .workingGroups({})
          .workingGroup({ workingGroupId: workingGroupResources.id })
          .workspace({}).$,
      });

      const editButton = screen.getAllByRole('link', { name: /edit/i })[1]!;
      userEvent.click(editButton);
      const titleBox = screen.getByRole('textbox', { name: /title/i });
      userEvent.clear(titleBox);
      userEvent.type(titleBox, title);
      const saveButton = screen.getByRole('button', { name: /save/i });
      userEvent.click(saveButton);

      expect(mockPutWorkingGroupResources).toHaveBeenCalledWith(
        workingGroup.id,
        [resources[0], { ...resources[1], title }, resources[2]],
        expect.anything(),
      );
      await waitFor(() => expect(saveButton).toBeEnabled());
    });
  });
  describe('the upcoming events tab', () => {
    it('can be switched to', async () => {
      const workingGroup = gp2Fixtures.createWorkingGroupResponse();
      mockGetWorkingGroup.mockResolvedValueOnce(workingGroup);
      await renderWorkingGroupDetail({ id: workingGroup.id });
      userEvent.click(await screen.findByText(/upcoming events \(1\)/i));
      expect(await screen.findByText(/Event 0/i)).toBeVisible();
    });
  });

  describe('the past events tab', () => {
    it('can be switched to', async () => {
      const workingGroup = gp2Fixtures.createWorkingGroupResponse();
      mockGetWorkingGroup.mockResolvedValueOnce(workingGroup);
      await renderWorkingGroupDetail({ id: workingGroup.id });
      userEvent.click(await screen.findByText(/past events \(1\)/i));
      expect(await screen.findByText(/Event 0/i)).toBeVisible();
    });
  });
  it('displays the correct count', async () => {
    const workingGroup = gp2Fixtures.createWorkingGroupResponse();
    mockGetWorkingGroup.mockResolvedValueOnce(workingGroup);
    mockGetEvents
      .mockResolvedValueOnce(createEventListAlgoliaResponse(2))
      .mockResolvedValueOnce(createEventListAlgoliaResponse(3));
    await renderWorkingGroupDetail({ id: workingGroup.id });
    expect(await screen.findByText(/upcoming events \(2\)/i)).toBeVisible();
    expect(await screen.findByText(/past events \(3\)/i)).toBeVisible();
  });

  describe('Duplicate Output', () => {
    it('allows a user who is an Administrator to duplicate an output', async () => {
      const workingGroup = gp2Fixtures.createWorkingGroupResponse();

      mockGetWorkingGroup.mockResolvedValue(workingGroup);

      const output = gp2Fixtures.createOutputResponse();

      mockGetOutput.mockResolvedValueOnce({
        ...output,
        title: 'Test Output',
        workingGroups: [workingGroup],
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
            createProjectAlgoliaRecord(gp2Fixtures.createProjectResponse()),
          ],
        }),
      );

      await renderWorkingGroupDetail({
        id: workingGroup.id,
        userId: '23',
        role: 'Administrator',
        route: gp2Routing
          .workingGroups({})
          .workingGroup({ workingGroupId: workingGroup.id })
          .duplicateOutput({ outputId: output.id }).$,
      });

      expect(screen.getByLabelText(/Title/i)).toHaveValue(
        'Copy of Test Output',
      );
      expect(screen.getByLabelText(/URL/i)).toHaveValue('');
    });

    it('will show a page not found if output does not exist', async () => {
      const workingGroup = gp2Fixtures.createWorkingGroupResponse();
      mockGetWorkingGroup.mockResolvedValue(workingGroup);

      mockGetOutput.mockResolvedValueOnce(undefined);
      await renderWorkingGroupDetail({
        id: workingGroup.id,
        userId: '23',
        role: 'Administrator',
        route: gp2Routing
          .workingGroups({})
          .workingGroup({ workingGroupId: workingGroup.id })
          .duplicateOutput({ outputId: 'test-id' }).$,
      });
      expect(screen.getByText(/sorry.+page/i)).toBeVisible();
    });
  });
});
