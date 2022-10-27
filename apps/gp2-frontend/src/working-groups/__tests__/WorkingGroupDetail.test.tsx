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
import { getWorkingGroup } from '../api';
import { refreshWorkingGroupState } from '../state';
import WorkingGroupDetail from '../WorkingGroupDetail';

jest.mock('../api');

const renderWorkingGroupDetail = async ({
  id,
  userId = '11',
  route,
}: {
  id: string;
  userId?: string;
  route?: string;
}) => {
  render(
    <RecoilRoot
      initializeState={({ set }) => {
        set(refreshWorkingGroupState(id), Math.random());
      }}
    >
      <Suspense fallback="loading">
        <Auth0Provider user={{ id: userId }}>
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
beforeEach(() => {
  jest.resetAllMocks();
});
describe('WorkingGroupDetail', () => {
  const mockGetWorkingGroup = getWorkingGroup as jest.MockedFunction<
    typeof getWorkingGroup
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

  it('clicking on the overview tab loads the resources', async () => {
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
});
