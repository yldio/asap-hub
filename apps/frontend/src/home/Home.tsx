import React from 'react';

import {
  DashboardPage,
  DashboardPageBody,
  Paragraph,
} from '@asap-hub/react-components';
import { useCurrentUser } from '@asap-hub/react-context';
import { useDashboard } from '../api';

const Home: React.FC<{}> = () => {
  const { firstName = 'Unknown', id, teams = [] } = useCurrentUser() ?? {};
  const { loading, data: dashboard, error } = useDashboard();

  if (loading) {
    return <Paragraph>Loading...</Paragraph>;
  }

  if (dashboard) {
    const data = {
      ...dashboard,
      hrefProfile: `/network/users/${id}`,
      hrefTeamWorkspace: teams?.length > 0 ? teams[0].id : undefined,
    };
    return (
      <DashboardPage firstName={firstName}>
        <DashboardPageBody {...data} />
      </DashboardPage>
    );
  }

  return (
    <Paragraph>
      {error.name}
      {': '}
      {error.message}
    </Paragraph>
  );
};

export default Home;
