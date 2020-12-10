import React, { Suspense } from 'react';

import {
  DashboardPage,
  NotFoundPage,
  Loading,
} from '@asap-hub/react-components';
import { useCurrentUser } from '@asap-hub/react-context';

import { useDashboard } from '../api';
import ErrorBoundary from '../errors/ErrorBoundary';
import { DISCOVER_PATH, NETWORK_PATH } from '../routes';
import { TEAMS_PATH } from '../network/routes';

const loadBody = () =>
  import(/* webpackChunkName: "dashboard-body" */ './Body');
const Body = React.lazy(loadBody);
loadBody();

const Dashboard: React.FC<{}> = () => {
  const { firstName, id, teams = [] } = useCurrentUser() ?? {};
  const { loading, data: dashboard } = useDashboard();

  if (loading) {
    return <Loading />;
  }

  if (dashboard) {
    const data = {
      ...dashboard,
      hrefDiscoverAsap: DISCOVER_PATH,
      hrefSharedResearch: '/shared-research',
      hrefNewsAndEvents: '/news-and-events',
      hrefProfile: `${NETWORK_PATH}/users/${id}`,
      hrefTeamsNetwork: `${NETWORK_PATH}/${TEAMS_PATH}`,
      hrefTeamWorkspace:
        teams?.length > 0
          ? `${NETWORK_PATH}/${TEAMS_PATH}/${teams[0].id}`
          : undefined,
      hrefUsersNetwork: `${NETWORK_PATH}/users`,
    };
    return (
      <DashboardPage firstName={firstName}>
        <ErrorBoundary>
          <Suspense fallback={<Loading />}>
            <Body {...data} />
          </Suspense>
        </ErrorBoundary>
      </DashboardPage>
    );
  }

  return <NotFoundPage />;
};

export default Dashboard;
