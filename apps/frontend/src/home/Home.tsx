import React from 'react';

import { DashboardPage, DashboardPageBody } from '@asap-hub/react-components';
import { useCurrentUser } from '@asap-hub/react-context';

const Home: React.FC<{}> = () => {
  const { firstName = 'Unknown' } = useCurrentUser() ?? {};
  return (
    <DashboardPage firstName={firstName}>
      <DashboardPageBody pages={[]} newsAndEvents={[]} />
    </DashboardPage>
  );
};

export default Home;
