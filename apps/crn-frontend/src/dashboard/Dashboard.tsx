import { Frame } from '@asap-hub/frontend-utils';
import { ConfirmModal, DashboardPage } from '@asap-hub/react-components';
import {
  useCurrentUserCRN,
  useCurrentUserTeamRolesCRN,
} from '@asap-hub/react-context';
import { dashboard as dashboardRoute } from '@asap-hub/routing';
import { FC, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';

import { usePrefetchCalendars } from '../events/calendar/state';
import { CARD_VIEW_PAGE_SIZE } from '../hooks';
import { usePrefetchTeams } from '../network/teams/state';
import { usePatchUserById, useUserById } from '../network/users/state';

import Body from './Body';
import { useDashboardState, useReminderState } from './state';

const Dashboard: FC<Record<string, never>> = () => {
  const [date] = useState(new Date());

  const currentUser = useCurrentUserCRN();
  if (!currentUser) {
    throw new Error('Failed to find out who is currently logged in');
  }
  const displayModal = useRouteMatch(
    dashboardRoute({}).dismissGettingStarted({}).$,
  );

  const { firstName, id, teams } = currentUser;
  const dashboard = useDashboardState();
  const { items: reminders } = useReminderState();

  const roles = useCurrentUserTeamRolesCRN();
  usePrefetchTeams({
    currentPage: 0,
    pageSize: CARD_VIEW_PAGE_SIZE,
    searchQuery: '',
    filters: new Set(),
  });
  usePrefetchCalendars();
  const patchUser = usePatchUserById(id);
  const user = useUserById(id);

  return (
    <>
      <DashboardPage firstName={firstName}>
        <Frame title={null}>
          <Body
            {...dashboard}
            reminders={reminders}
            date={date}
            user={currentUser}
            dismissedGettingStarted={user?.dismissedGettingStarted}
            roles={roles}
            userId={id}
            teamId={teams[0]?.id}
          />
        </Frame>
      </DashboardPage>
      {displayModal && (
        <ConfirmModal
          backHref="/"
          error="There was an error and we were unable to dismiss the guides"
          title="Remove help guides from dashboard?"
          description="You will not be able to see them again on the dashboard but you can always access them on the Guides &amp; Tutorials page."
          cancelText="Cancel"
          confirmText="Remove"
          onSave={() => patchUser({ dismissedGettingStarted: true })}
        />
      )}
    </>
  );
};

export default Dashboard;
