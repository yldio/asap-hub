import { getEventListOptions } from '@asap-hub/frontend-utils';
import { DashboardPageBody } from '@asap-hub/gp2-components';
import { gp2, ReminderResponse } from '@asap-hub/model';
import ReminderItem from '@asap-hub/react-components/src/molecules/ReminderItem';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { useCurrentUserProjectRolesGP2 } from '@asap-hub/react-context/src/auth';
import { ComponentProps } from 'react';
import { eventMapper } from '../events/EventsList';
import { useEvents } from '../events/state';
import { useOutputs } from '../outputs/state';
import { useUsers } from '../users/state';
import { useDashboard, useNews } from './state';

const pageSize = 3;

type DashboardBodyProps = { currentTime: Date };

const Body: React.FC<DashboardBodyProps> = ({ currentTime }) => {
  const news = useNews();
  const dashboard = useDashboard();
  const { items: upcomingEvents, total: totalOfUpcomingEvents } = useEvents(
    getEventListOptions<gp2.EventConstraint>(currentTime, {
      past: false,
      pageSize,
    }),
  );

  const { items: pastEvents, total: totalOfPastEvents } = useEvents(
    getEventListOptions<gp2.EventConstraint>(currentTime, {
      past: true,
      pageSize,
    }),
  );

  const { items: latestUsers } = useUsers({
    searchQuery: '',
    filters: new Set(),
    currentPage: 0,
    pageSize: 3,
  });

  const { items: recentOutputs, total: totalOutputs } = useOutputs({
    searchQuery: '',
    filters: new Set(),
    currentPage: 0,
    pageSize: 5,
  });

  const stats = dashboard.items[0]?.latestStats || {
    sampleCount: 0,
    cohortCount: 0,
    articleCount: 0,
  };
  const announcements = dashboard.items[0]?.announcements || [];
  const guides = dashboard.items[0]?.guides || [];

  const currentUser = useCurrentUserGP2();
  const isAdministrator = currentUser?.role === 'Administrator';
  const userProjectRoles = useCurrentUserProjectRolesGP2();

  const canPublish =
    isAdministrator ||
    userProjectRoles.some((role) => role === 'Project manager');

  // TODO: fix this
  const reminders: (Pick<ReminderResponse, 'id'> &
    ComponentProps<typeof ReminderItem>)[] = [];
  return (
    <DashboardPageBody
      canPublish={canPublish}
      news={news}
      latestStats={stats}
      upcomingEvents={upcomingEvents.map(eventMapper)}
      totalOfUpcomingEvents={totalOfUpcomingEvents}
      pastEvents={pastEvents}
      totalOfPastEvents={totalOfPastEvents}
      reminders={reminders}
      announcements={announcements}
      guides={guides}
      recentOutputs={recentOutputs || []}
      totalOutputs={totalOutputs}
      latestUsers={latestUsers || []}
    />
  );
};

export default Body;
