import { ComponentProps, FC } from 'react';
import { User } from '@asap-hub/auth';
import { DashboardPageBody } from '@asap-hub/react-components';
import { activeUserTag } from '@asap-hub/model';
import { getEventListOptions } from '@asap-hub/frontend-utils';

import { useEvents } from '../events/state';
import { useResearchOutputs } from '../shared-research/state';
import { useUsers } from '../network/users/state';
import { eventMapper } from '../events/EventList';

type BodyProps = Omit<
  ComponentProps<typeof DashboardPageBody>,
  'pastEvents' | 'recommendedUsers'
> & {
  date: Date;
  user: User;
};

const Body: FC<BodyProps> = ({ date, user, ...props }) => {
  const pageSize = 3;
  const { items: pastEvents } = useEvents(
    getEventListOptions(date, {
      past: true,
      pageSize,
      currentPage: 0,
      constraint: { notStatus: 'Cancelled' },
    }),
    user,
  );

  const { items } = useEvents(
    getEventListOptions(date, {
      past: false,
      pageSize,
    }),
  );

  const recentSharedOutputs = useResearchOutputs({
    searchQuery: '',
    filters: new Set(),
    currentPage: 0,
    pageSize: 5,
  });

  const recommendedUsers = useUsers({
    searchQuery: '',
    filters: new Set([activeUserTag]),
    currentPage: 0,
    pageSize: 3,
  }).items;

  return (
    <DashboardPageBody
      {...props}
      pastEvents={pastEvents}
      upcomingEvents={items.map(eventMapper)}
      recentSharedOutputs={recentSharedOutputs}
      recommendedUsers={recommendedUsers}
    />
  );
};

export default Body;
