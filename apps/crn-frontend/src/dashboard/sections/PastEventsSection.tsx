import { User } from '@asap-hub/auth';
import { getEventListOptions } from '@asap-hub/frontend-utils';
import {
  DashboardSection,
  PastEventsDashboardCard,
} from '@asap-hub/react-components';
import { events as eventsRoute } from '@asap-hub/routing';
import { FC } from 'react';

import { useEvents } from '../../events/state';

type PastEventsSectionProps = {
  date: Date;
  user: User;
};

const PastEventsSection: FC<PastEventsSectionProps> = ({ date, user }) => {
  const { items: pastEvents } = useEvents(
    getEventListOptions(date, {
      past: true,
      pageSize: 3,
      currentPage: 0,
      constraint: { notStatus: 'Cancelled' },
    }),
    user,
  );

  return (
    <DashboardSection
      title="Past Events"
      description="Explore previous events and learn about what was discussed."
      viewAllHref={eventsRoute({}).past({}).$}
      viewAllTestId="view-past-events"
    >
      <PastEventsDashboardCard events={pastEvents} />
    </DashboardSection>
  );
};

export default PastEventsSection;
