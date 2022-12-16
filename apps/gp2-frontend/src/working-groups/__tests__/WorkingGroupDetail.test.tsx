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
import { getWorkingGroup, putWorkingGroupResources } from '../api';
import { refreshWorkingGroupState } from '../state';
import WorkingGroupDetail from '../WorkingGroupDetail';

jest.mock('../api');

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
    <RecoilRoot
      initializeState={({ set }) => {
        set(refreshWorkingGroupState(id), Math.random());
      }}
    >
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
                <WorkingGroupDetail />
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );

  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};
beforeEach(jest.resetAllMocks);
describe('WorkingGroupDetail', () => {
  const mockGetWorkingGroup = getWorkingGroup as jest.MockedFunction<
    typeof getWorkingGroup
  >;
  const mockPutWorkingGroupResources =
    putWorkingGroupResources as jest.MockedFunction<
      typeof putWorkingGroupResources
    >;

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
      expect(screen.getByRole('link', { name: /resources/i })).toBeVisible();
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
        screen.queryByRole('link', { name: /resources/i }),
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
          .resources({}).$,
      });
      expect(
        screen.getByRole('heading', { name: /Resource List/i }),
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
          .resources({}).$,
      });
      expect(
        screen.queryByRole('heading', { name: /Resource List/i }),
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
    userEvent.click(screen.getByRole('link', { name: /resources/i }));
    expect(
      screen.getByRole('heading', { name: /Resource List/i }),
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
          .resources({})
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
        .resources({})
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
          .resources({}).$,
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
            .resources({}).$,
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
          .resources({}).$,
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
          .resources({}).$,
      });

      const editButton = screen.getAllByRole('link', { name: /edit/i })[1];
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
});
