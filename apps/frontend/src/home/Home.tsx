import React from 'react';

import {
  DashboardPage,
  DashboardPageBody,
  Paragraph,
  NotFoundPage,
} from '@asap-hub/react-components';
import { useCurrentUser } from '@asap-hub/react-context';

import { useDashboard } from '../api';
import ErrorBoundary from '../errors/ErrorBoundary';

const Home: React.FC<{}> = () => {
  const { firstName, id, teams = [] } = useCurrentUser() ?? {};
  const { loading, data: dashboard } = useDashboard();

  if (loading) {
    return <Paragraph>Loading...</Paragraph>;
  }

  if (dashboard) {
    const data = {
      ...dashboard,
      hrefDiscoverAsap: '/discover',
      hrefSharedResearch: '/shared-research',
      hrefNewsAndEvents: '/news-and-events',
      hrefProfile: `/network/users/${id}`,
      hrefTeamsNetwork: '/network/teams',
      hrefTeamWorkspace: teams?.length > 0 ? teams[0].id : undefined,
      hrefUsersNetwork: '/network/users',
    };
    return (
      <DashboardPage firstName={firstName}>
        <ErrorBoundary>
          <DashboardPageBody {...data} />
        </ErrorBoundary>
      </DashboardPage>
    );
  }

  return <NotFoundPage />;
};

export default Home;
