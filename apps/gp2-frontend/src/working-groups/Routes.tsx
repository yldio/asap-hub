import { WorkingGroupsPage } from '@asap-hub/gp2-components';
import { gp2 } from '@asap-hub/routing';
import { lazy, useEffect, useState } from 'react';
import { Redirect, Route, Routes, useMatch } from 'react-router-dom';
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
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadWorkingGroupList().then(loadWorkingGroupDetail);
  }, []);
  const { path } = useMatch();

  const [currentTime] = useState(new Date());
  return (
    <Routes>
      <Route exact path={path + gp2.workingGroups({}).operational.template}>
        <WorkingGroupsPage>
          <Frame title="Working Groups">
            <WorkingGroupList role={'operational'} />
          </Frame>
        </WorkingGroupsPage>
      </Route>
      <Route exact path={path + gp2.workingGroups({}).support.template}>
        <WorkingGroupsPage>
          <Frame title="Working Groups">
            <WorkingGroupList role={'support'} />
          </Frame>
        </WorkingGroupsPage>
      </Route>
      <Route exact path={path + gp2.workingGroups({}).complexDisease.template}>
        <WorkingGroupsPage>
          <Frame title="Working Groups">
            <WorkingGroupList role={'complexDisease'} />
          </Frame>
        </WorkingGroupsPage>
      </Route>
      <Route exact path={path + gp2.workingGroups({}).monogenic.template}>
        <WorkingGroupsPage>
          <Frame title="Working Groups">
            <WorkingGroupList role={'monogenic'} />
          </Frame>
        </WorkingGroupsPage>
      </Route>
      <Route path={path + workingGroups({}).workingGroup.template}>
        <WorkingGroupDetail currentTime={currentTime} />
      </Route>
      <Redirect to={path + gp2.workingGroups({}).operational.template} />
    </Routes>
  );
};

export default Routes;
