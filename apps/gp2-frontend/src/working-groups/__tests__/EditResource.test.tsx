import { gp2 as gp2Model } from '@asap-hub/model';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { workingGroups } from '@asap-hub/routing/src/gp2';
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
import EditResource from '../EditResource';
import { refreshWorkingGroupState } from '../state';
import { getWorkingGroup, putWorkingGroupResources } from '../api';

jest.mock('../api');

const renderWorkingGroupDetail = async ({
  id,
  userId = '11',
  route,
  role = 'Trainee',
  children,
}: {
  id: string;
  userId?: string;
  route?: string;
  role?: gp2Model.UserRole;
  children: JSX.Element;
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
                {children}
              </Route>
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );

  await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};

describe('edit resources', () => {
  const mockGetWorkingGroup = getWorkingGroup as jest.MockedFunction<
    typeof getWorkingGroup
  >;

  const mockPutWorkingGroupResources =
    putWorkingGroupResources as jest.MockedFunction<
      typeof putWorkingGroupResources
    >;

  it('see if modal appears', async () => {
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

    const resources = workingGroups({})
      .workingGroup({ workingGroupId: workingGroup.id })
      .resources({}).$;

    const props = {
      workingGroupId: workingGroup.id,
      workingGroup,
      backHref: resources,
      updateWorkingGroupResources: jest.fn(),
    };

    await renderWorkingGroupDetail({
      id: workingGroup.id,
      userId: '23',
      role: 'Administrator',
      route: gp2Routing
        .workingGroups({})
        .workingGroup({ workingGroupId: workingGroup.id })
        .resources({}).$,
      children: <EditResource {...props} />,
    });

    expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();
  });

  it('see if content is empty', async () => {
    const workingGroup = gp2Fixtures.createWorkingGroupResponse();
    workingGroup.members = [
      {
        userId: '23',
        firstName: 'Tony',
        lastName: 'Stark',
        role: 'Lead',
      },
    ];
    delete workingGroup.resources;
    mockGetWorkingGroup.mockResolvedValueOnce(workingGroup);

    const resources = workingGroups({})
      .workingGroup({ workingGroupId: workingGroup.id })
      .resources({}).$;

    const props = {
      workingGroupId: workingGroup.id,
      workingGroup,
      backHref: resources,
      updateWorkingGroupResources: jest.fn(),
    };

    await renderWorkingGroupDetail({
      id: workingGroup.id,
      userId: '23',
      role: 'Administrator',
      route: gp2Routing
        .workingGroups({})
        .workingGroup({ workingGroupId: workingGroup.id })
        .resources({}).$,
      children: <EditResource {...props} />,
    });

    expect(
      screen.getByRole('textbox', { name: 'Resource Type (required)' }),
    ).toHaveValue('');
  });

  it('can submit a form when form data is valid for editing', async () => {
    const workingGroup = gp2Fixtures.createWorkingGroupResponse();
    workingGroup.members = [
      {
        userId: '23',
        firstName: 'Tony',
        lastName: 'Stark',
        role: 'Lead',
      },
    ];

    const title = 'example42 title';
    const type = 'Note';

    const resources = workingGroups({})
      .workingGroup({ workingGroupId: workingGroup.id })
      .resources({}).$;

    const props = {
      workingGroupId: workingGroup.id,
      workingGroup,
      backHref: resources,
      updateWorkingGroupResources: jest.fn(),
    };

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
      children: <EditResource {...props} />,
    });

    const typeBox = await screen.findByRole('textbox', { name: /type/i });
    userEvent.type(typeBox, `${type}{enter}`);
    const titleBox = screen.getByRole('textbox', { name: /title/i });
    userEvent.type(titleBox, title);
    const saveButton = screen.getByRole('button', { name: /save/i });
    userEvent.click(saveButton);

    await waitFor(() => expect(saveButton).toBeEnabled());
  });
});
