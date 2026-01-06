import { getEventListOptions } from '@asap-hub/frontend-utils';
import { DashboardPageBody } from '@asap-hub/gp2-components';
import { gp2 } from '@asap-hub/model';
import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { useCurrentUserProjectRolesGP2 } from '@asap-hub/react-context/src/auth';
import { useMemo, useRef } from 'react';
import { eventMapper } from '../events/EventsList';
import { useEvents } from '../events/state';
import { useOutputs } from '../outputs/state';
import { useUsers } from '../users/state';
import { useDashboard, useNews, useReminderState } from './state';

const PAGE_SIZE = 3;
const MINUTE_MS = 60000;

type DashboardBodyProps = { currentTime: Date };

const Body: React.FC<DashboardBodyProps> = ({ currentTime }) => {
  const news = useNews();
  const dashboard = useDashboard();

  // Capture timestamp on first render only to ensure stable options
  const stableTimestampRef = useRef<number | null>(null);
  if (stableTimestampRef.current === null) {
    stableTimestampRef.current =
      Math.floor(currentTime.getTime() / MINUTE_MS) * MINUTE_MS;
  }
  const stableTimestamp = stableTimestampRef.current;

  // Memoize options objects to ensure stable references for promise caching
  const upcomingOptions = useMemo(
    () =>
      getEventListOptions<gp2.EventConstraint>(new Date(stableTimestamp), {
        past: false,
        pageSize: PAGE_SIZE,
      }),
    [stableTimestamp],
  );

  const pastOptions = useMemo(
    () =>
      getEventListOptions<gp2.EventConstraint>(new Date(stableTimestamp), {
        past: true,
        pageSize: PAGE_SIZE,
      }),
    [stableTimestamp],
  );

  const { items: upcomingEvents, total: totalOfUpcomingEvents } =
    useEvents(upcomingOptions);

  const { items: pastEvents, total: totalOfPastEvents } =
    useEvents(pastOptions);

  // Memoize options objects to ensure stable references for promise caching
  const usersOptions = useMemo(
    () => ({
      searchQuery: '',
      filters: new Set<string>(),
      currentPage: 0,
      pageSize: 3,
    }),
    [],
  );

  const outputsOptions = useMemo(
    () => ({
      searchQuery: '',
      filters: new Set<string>(),
      currentPage: 0,
      pageSize: 5,
    }),
    [],
  );

  const { items: latestUsers } = useUsers(usersOptions);

  const { items: recentOutputs, total: totalOutputs } =
    useOutputs(outputsOptions);

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

  const { items: reminders } = useReminderState();

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
