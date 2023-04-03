import { WorkingGroupsPage } from '@asap-hub/gp2-components';
import { NotFoundPage } from '@asap-hub/react-components';
import { gp2 } from '@asap-hub/routing';
import { lazy, useEffect, useState } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Frame from '../Frame';

const loadWorkingGroupList = () =>
  import(/* webpackChunkName: "working-groups-list" */ './WorkingGroupList');
const loadWorkingGroupDetail = () =>
  import(
    /* webpackChunkName: "working-groups-detail" */ './WorkingGroupDetail'
  );

const WorkingGroupList = lazy(loadWorkingGroupList);
const WorkingGroupDetail = lazy(loadWorkingGroupDetail);

const { workingGroups } = gp2;
const Routes: React.FC<Record<string, never>> = () => {
  useEffect(() => {
    loadWorkingGroupList().then(loadWorkingGroupDetail);
  }, []);
  const { path } = useRouteMatch();

  const [currentTime] = useState(new Date());
  return (
    <Switch>
      <Route exact path={path}>
        <WorkingGroupsPage>
          <Frame title="Working Groups">
            <WorkingGroupList />
          </Frame>
        </WorkingGroupsPage>
      </Route>
      <Route path={path + workingGroups({}).workingGroup.template}>
        <WorkingGroupDetail currentTime={currentTime} />
      </Route>
      <Route component={NotFoundPage} />
    </Switch>
  );
};

export default Routes;
