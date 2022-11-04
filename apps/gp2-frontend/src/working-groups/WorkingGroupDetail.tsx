import { Frame, useBackHref } from '@asap-hub/frontend-utils';
import {
  ResourceModal,
  WorkingGroupDetailPage,
  WorkingGroupOverview,
  WorkingGroupResources,
} from '@asap-hub/gp2-components';
import { gp2 as gp2Model } from '@asap-hub/model';
import { NotFoundPage } from '@asap-hub/react-components';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { gp2 as gp2Routing, useRouteParams } from '@asap-hub/routing';
import { Redirect, Route, Switch } from 'react-router-dom';
import { usePutWorkingGroupResources, useWorkingGroupById } from './state';

const { workingGroups } = gp2Routing;

const WorkingGroupDetail = () => {
  const { workingGroupId } = useRouteParams(workingGroups({}).workingGroup);
  const workingGroup = useWorkingGroupById(workingGroupId);
  const backHref = useBackHref() ?? workingGroups({}).$;
  const currentUser = useCurrentUserGP2();
  const isWorkingGroupMember =
    workingGroup?.members.some(({ userId }) => userId === currentUser?.id) ||
    false;
  // const isAdministrator = currentUser?.role === 'Administrator';
  const isAdministrator = true;
  const updateWorkingGroupResources =
    usePutWorkingGroupResources(workingGroupId);

  if (workingGroup) {
    return (
      <WorkingGroupDetailPage
        backHref={backHref}
        {...workingGroup}
        isWorkingGroupMember={isWorkingGroupMember}
      >
        <Switch>
          <Route
            path={
              workingGroups({}).workingGroup({ workingGroupId }).overview({}).$
            }
          >
            <Frame title="Overview">
              <WorkingGroupOverview {...workingGroup} />
            </Frame>
          </Route>
          {isWorkingGroupMember && (
            <Route
              path={
                workingGroups({}).workingGroup({ workingGroupId }).resources({})
                  .$
              }
            >
              <Frame title="Resources">
                <WorkingGroupResources
                  {...workingGroup}
                  add={
                    workingGroups({})
                      .workingGroup({ workingGroupId })
                      .resources({})
                      .add({}).$
                  }
                  isAdministrator={isAdministrator}
                />
                <Route
                  path={
                    workingGroups({})
                      .workingGroup({ workingGroupId })
                      .resources({})
                      .add({}).$
                  }
                >
                  <ResourceModal
                    backHref={
                      workingGroups({})
                        .workingGroup({ workingGroupId })
                        .resources({}).$
                    }
                    onSave={(resources: gp2Model.Resource) =>
                      updateWorkingGroupResources([
                        ...(workingGroup.resources || []),
                        resources,
                      ])
                    }
                  />
                </Route>
              </Frame>
            </Route>
          )}
          <Redirect
            to={
              workingGroups({}).workingGroup({ workingGroupId }).overview({}).$
            }
          />
        </Switch>
      </WorkingGroupDetailPage>
    );
  }
  return <NotFoundPage />;
};

export default WorkingGroupDetail;
