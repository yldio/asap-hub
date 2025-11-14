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
const RoutesComponent: React.FC<Record<string, never>> = () => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadWorkingGroupList().then(loadWorkingGroupDetail);
  }, []);

  const [currentTime] = useState(new Date());
  return (
    <Routes>
      <Route
        path="operational"
        element={
          <WorkingGroupsPage>
            <Frame title="Working Groups">
              <WorkingGroupList role={'operational'} />
            </Frame>
          </WorkingGroupsPage>
        }
      />
      <Route
        path="support"
        element={
          <WorkingGroupsPage>
            <Frame title="Working Groups">
              <WorkingGroupList role={'support'} />
            </Frame>
          </WorkingGroupsPage>
        }
      />
      <Route
        path="complex-disease"
        element={
          <WorkingGroupsPage>
            <Frame title="Working Groups">
              <WorkingGroupList role={'complexDisease'} />
            </Frame>
          </WorkingGroupsPage>
        }
      />
      <Route
        path="monogenic"
        element={
          <WorkingGroupsPage>
            <Frame title="Working Groups">
              <WorkingGroupList role={'monogenic'} />
            </Frame>
          </WorkingGroupsPage>
        }
      />
      <Route
        path=":workingGroupId/*"
        element={<WorkingGroupDetail currentTime={currentTime} />}
      />
      <Route index element={<Navigate to="operational" replace />} />
    </Routes>
  );
};

export default RoutesComponent;
