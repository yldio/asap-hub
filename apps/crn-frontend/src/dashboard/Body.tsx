import { ComponentProps, FC } from 'react';
import { User } from '@asap-hub/auth';
import { DashboardPageBody } from '@asap-hub/react-components';
import { useEvents } from '../events/state';
import { getEventListOptions } from '../events/options';
import { useResearchOutputs } from '../shared-research/state';

type BodyProps = Omit<
  ComponentProps<typeof DashboardPageBody>,
  'pastEvents'
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

  const upcomingEvents = useEvents(
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

  return (
    <DashboardPageBody
      {...props}
      pastEvents={pastEvents}
      upcomingEvents={upcomingEvents}
      recentSharedOutputs={recentSharedOutputs}
    />
  );
};

export default Body;
