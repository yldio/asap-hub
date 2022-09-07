import { FC, lazy } from 'react';
import { DashboardPage, ConfirmModal } from '@asap-hub/react-components';
import { dashboard as dashboardRoute } from '@asap-hub/routing';
import {
  useCurrentUser,
  useCurrentUserTeamRoles,
} from '@asap-hub/react-context';
import { usePrefetchTeams } from '@asap-hub/crn-frontend/src/network/teams/state';
import { CARD_VIEW_PAGE_SIZE } from '@asap-hub/crn-frontend/src/hooks';
import { usePrefetchCalendars } from '@asap-hub/crn-frontend/src/events/calendar/state';
import { Frame } from '@asap-hub/frontend-utils';
import { useRouteMatch } from 'react-router-dom';

import { useDashboardState, useReminderState } from './state';
import { usePatchUserById, useUserById } from '../network/users/state';
import { useEvents } from '../events/state';
import { getEventListOptions } from '../events/options';

const loadBody = () =>
  import(/* webpackChunkName: "dashboard-body" */ './Body');
const Body = lazy(loadBody);
loadBody();

type DashboardProps = {
  currentTime: Date;
};

const Dashboard: FC<DashboardProps> = ({ currentTime }) => {
  const currentUser = useCurrentUser();
  if (!currentUser) {
    throw new Error('Failed to find out who is currently logged in');
  }
  const displayModal = useRouteMatch(
    dashboardRoute({}).dismissGettingStarted({}).$,
  );

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
  const patchUser = usePatchUserById(id);
  const user = useUserById(id);

  const pageSize = 3;
  const upcomingEvents = useEvents(
    getEventListOptions(currentTime, {
      past: false,
      pageSize,
    }),
  );

  return (
    <>
      <DashboardPage
        firstName={firstName}
        dismissedGettingStarted={user?.dismissedGettingStarted}
      >
        <Frame title={null}>
          <Body
            {...dashboard}
            reminders={items}
            dismissedGettingStarted={user?.dismissedGettingStarted}
            roles={roles}
            userId={id}
            teamId={teams[0]?.id}
            upcomingEvents={upcomingEvents}
          />
        </Frame>
      </DashboardPage>
      {displayModal && (
        <ConfirmModal
          backHref="/"
          error="There was an error and we were unable to dismiss the guides"
          title="Remove help guides from dashboard?"
          description="You will not be able to see them again on the dashboard but you can always access them on the Discover ASAP page."
          cancelText="Cancel"
          confirmText="Remove"
          onSave={() => patchUser({ dismissedGettingStarted: true })}
        />
      )}
    </>
  );
};

export default Dashboard;
