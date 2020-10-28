import React, { Suspense } from 'react';

import {
  DashboardPage,
  Paragraph,
  NotFoundPage,
} from '@asap-hub/react-components';
import { useCurrentUser } from '@asap-hub/react-context';

import { useDashboard } from '../api';
import ErrorBoundary from '../errors/ErrorBoundary';

const loadBody = () =>
  import(/* webpackChunkName: "dashboard-body" */ './Body');
const Body = React.lazy(loadBody);
loadBody();

const Dashboard: React.FC<{}> = () => {
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
      hrefTeamWorkspace:
        teams?.length > 0 ? `/network/teams/${teams[0].id}` : undefined,
      hrefUsersNetwork: '/network/users',
    };
    return (
      <DashboardPage firstName={firstName}>
        <ErrorBoundary>
          <Suspense fallback="Loading...">
            <Body {...data} />
          </Suspense>
        </ErrorBoundary>
      </DashboardPage>
    );
  }

  return <NotFoundPage />;
};

export default Dashboard;
