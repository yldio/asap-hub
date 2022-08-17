import { FC, lazy } from 'react';
import { DashboardPage, NotFoundPage } from '@asap-hub/react-components';
import {
  useCurrentUser,
  useCurrentUserTeamRoles,
} from '@asap-hub/react-context';
import { usePrefetchTeams } from '@asap-hub/crn-frontend/src/network/teams/state';
import { CARD_VIEW_PAGE_SIZE } from '@asap-hub/crn-frontend/src/hooks';
import { usePrefetchCalendars } from '@asap-hub/crn-frontend/src/events/calendar/state';
import { Frame } from '@asap-hub/frontend-utils';

import { useDashboardState, useReminderState } from './state';

const loadBody = () =>
  import(/* webpackChunkName: "dashboard-body" */ './Body');
const Body = lazy(loadBody);
loadBody();

const Dashboard: FC<Record<string, never>> = () => {
  const currentUser = useCurrentUser();
  if (!currentUser) {
    throw new Error('Failed to find out who is currently logged in');
  }

  const { firstName, id, teams } = currentUser;
  const dashboard = useDashboardState();
  const { items } = useReminderState();
  const roles = useCurrentUserTeamRoles();
  usePrefetchTeams({
    currentPage: 0,
    pageSize: CARD_VIEW_PAGE_SIZE,
    searchQuery: '',
    filters: new Set(),
  });
  usePrefetchCalendars();

  if (dashboard) {
    return (
      <DashboardPage firstName={firstName}>
        <Frame title={null}>
          <Body
            {...dashboard}
            reminders={items}
            roles={roles}
            userId={id}
            teamId={teams[0]?.id}
          />
        </Frame>
      </DashboardPage>
    );
  }

  return <NotFoundPage />;
};

export default Dashboard;
