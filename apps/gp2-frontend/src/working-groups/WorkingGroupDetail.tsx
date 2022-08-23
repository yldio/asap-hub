import { useRouteParams, gp2 } from '@asap-hub/routing';

import { Frame, useBackHref } from '@asap-hub/frontend-utils';
import { Redirect, Route, Switch } from 'react-router-dom';
import { WorkingGroupDetailPage } from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';

import { useWorkingGroupById } from './state';

const { workingGroups } = gp2;
const WorkingGroupDetail = () => {
  const { workingGroupId } = useRouteParams(workingGroups({}).workingGroup);
  const workingGroupData = useWorkingGroupById(workingGroupId);
  const backHref = useBackHref() ?? workingGroups({}).$;
  if (workingGroupData) {
    return (
      <WorkingGroupDetailPage backHref={backHref} {...workingGroupData}>
        <Switch>
          <Route
            path={
              workingGroups({}).workingGroup({ workingGroupId }).overview({}).$
            }
          >
            <Frame title="Overview">Overview</Frame>
          </Route>
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
