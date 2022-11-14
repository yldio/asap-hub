import { gp2 as gp2Model } from '@asap-hub/model';
import { gp2 as gp2Routing } from '@asap-hub/routing';
import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { workingGroups } from '@asap-hub/routing/build/gp2';
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';

import { Suspense } from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../auth/test-utils';
import EditResource from '../EditResource';
import { refreshWorkingGroupState } from '../state';
import { getWorkingGroup } from '../api';

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
});
