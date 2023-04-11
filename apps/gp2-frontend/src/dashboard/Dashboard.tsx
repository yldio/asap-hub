import { DashboardPage } from '@asap-hub/gp2-components';

import { FC, lazy, useState } from 'react';
import Frame from '../Frame';

const loadBody = () =>
  import(/* webpackChunkName: "dashboard-body" */ './Body');
const Body = lazy(loadBody);
loadBody();

const Dashboard: FC<Record<string, never>> = () => {
  const [currentTime] = useState(new Date());

  return (
    <DashboardPage>
      <Frame title={null}>
        <Body currentTime={currentTime} />
      </Frame>
    </DashboardPage>
  );
};

export default Dashboard;
