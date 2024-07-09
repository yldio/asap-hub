import { WorkingGroupsPage } from '@asap-hub/gp2-components';
import { gp2 } from '@asap-hub/routing';
import { lazy, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
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
const WorkingGroupRoutes: React.FC<Record<string, never>> = () => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadWorkingGroupList().then(loadWorkingGroupDetail);
  }, []);
  // const { path } = useMatch();

  const [currentTime] = useState(new Date());
  return (
    <Routes>
      <Route
        path={workingGroups.DEFAULT.$.OPERATIONAL.relativePath}
        element={
          <WorkingGroupsPage>
            <Frame title="Working Groups">
              <WorkingGroupList role={'operational'} />
            </Frame>
          </WorkingGroupsPage>
        }
      />
      <Route
        path={workingGroups.DEFAULT.$.SUPPORT.relativePath}
        element={
          <WorkingGroupsPage>
            <Frame title="Working Groups">
              <WorkingGroupList role={'support'} />
            </Frame>
          </WorkingGroupsPage>
        }
      />
      <Route
        path={workingGroups.DEFAULT.$.COMPLEX_DISEASE.relativePath}
        element={
          <WorkingGroupsPage>
            <Frame title="Working Groups">
              <WorkingGroupList role={'complexDisease'} />
            </Frame>
          </WorkingGroupsPage>
        }
      />
      <Route
        path={workingGroups.DEFAULT.$.MONOGENIC.relativePath}
        element={
          <WorkingGroupsPage>
            <Frame title="Working Groups">
              <WorkingGroupList role={'monogenic'} />
            </Frame>
          </WorkingGroupsPage>
        }
      />
      <Route
        path={workingGroups.DEFAULT.$.DETAILS.relativePath}
        element={<WorkingGroupDetail currentTime={currentTime} />}
      />
      <Route
        path="*"
        element={
          <Navigate to={workingGroups.DEFAULT.$.OPERATIONAL.relativePath} />
        }
      />
    </Routes>
  );
};

export default WorkingGroupRoutes;
