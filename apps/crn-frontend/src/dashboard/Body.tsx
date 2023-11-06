import { ComponentProps, FC } from 'react';
import { User } from '@asap-hub/auth';
import { DashboardPageBody, eventMapper } from '@asap-hub/react-components';
import { activeUserMembershipStatus } from '@asap-hub/model';
import { getEventListOptions } from '@asap-hub/frontend-utils';

import { useEvents } from '../events/state';
import { useGuidesByCollection } from '../guides/state';
import { useResearchOutputs } from '../shared-research/state';
import { useUsers } from '../network/users/state';

type BodyProps = Omit<
  ComponentProps<typeof DashboardPageBody>,
  'pastEvents' | 'recommendedUsers' | 'guides'
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
    filters: new Set([activeUserMembershipStatus]),
    currentPage: 0,
    pageSize: 3,
  }).items;

  const guides = useGuidesByCollection('Home');

  return (
    <DashboardPageBody
      {...props}
      guides={guides ? guides.items : []}
      pastEvents={pastEvents}
      upcomingEvents={items.map(eventMapper)}
      recentSharedOutputs={recentSharedOutputs}
      recommendedUsers={recommendedUsers}
    />
  );
};

export default Body;
