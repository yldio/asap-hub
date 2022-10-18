import { gp2, useRouteParams } from '@asap-hub/routing';

import { Frame, useBackHref } from '@asap-hub/frontend-utils';
import {
  WorkingGroupDetailPage,
  WorkingGroupOverview,
  Resources,
} from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';
import { Redirect, Route, Switch } from 'react-router-dom';

import { useCurrentUser } from '@asap-hub/react-context';
import { useWorkingGroupById } from './state';

const { workingGroups } = gp2;

const WorkingGroupDetail = () => {
  const { workingGroupId } = useRouteParams(workingGroups({}).workingGroup);
  const workingGroupData = useWorkingGroupById(workingGroupId);
  const backHref = useBackHref() ?? workingGroups({}).$;
  const currentUser = useCurrentUser();
  const isWorkingGroupMember =
    workingGroupData?.members.some(
      ({ userId }) => userId === currentUser?.id,
    ) || false;

  if (workingGroupData) {
    return (
      <WorkingGroupDetailPage
        backHref={backHref}
        {...workingGroupData}
        isWorkingGroupMember={isWorkingGroupMember}
      >
        <Switch>
          <Route
            path={
              workingGroups({}).workingGroup({ workingGroupId }).overview({}).$
            }
          >
            <Frame title="Overview">
              <WorkingGroupOverview {...workingGroupData} />
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
                <Resources resources={workingGroupData.resources} />
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
