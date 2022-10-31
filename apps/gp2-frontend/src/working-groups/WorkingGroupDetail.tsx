import { gp2, useRouteParams } from '@asap-hub/routing';

import { Frame, useBackHref } from '@asap-hub/frontend-utils';
import {
  WorkingGroupDetailPage,
  WorkingGroupOverview,
  WorkingGroupResources,
  ResourceModal,
} from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';
import { useCurrentUser } from '@asap-hub/react-context';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useWorkingGroupById } from './state';

const { workingGroups } = gp2;

const WorkingGroupDetail = () => {
  const { workingGroupId } = useRouteParams(workingGroups({}).workingGroup);
  const workingGroup = useWorkingGroupById(workingGroupId);
  const backHref = useBackHref() ?? workingGroups({}).$;
  const currentUser = useCurrentUser();
  const isWorkingGroupMember =
    workingGroup?.members.some(({ userId }) => userId === currentUser?.id) ||
    false;

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
                  resourcesRoute={
                    workingGroups({})
                      .workingGroup({ workingGroupId })
                      .resources({}).$
                  }
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
