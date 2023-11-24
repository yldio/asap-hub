import { DashboardPage } from '@asap-hub/gp2-components';

import { FC, lazy, useEffect, useState } from 'react';
import Frame from '../Frame';

const loadBody = () =>
  import(/* webpackChunkName: "dashboard-body" */ './Body');
const Body = lazy(loadBody);

const Dashboard: FC<Record<string, never>> = () => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadBody();
  }, []);
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
