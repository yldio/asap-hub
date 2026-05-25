import { getEventListOptions } from '@asap-hub/frontend-utils';
import {
  DashboardSection,
  DashboardUpcomingEvents,
  eventMapper,
} from '@asap-hub/react-components';
import { events as eventsRoute } from '@asap-hub/routing';
import { FC } from 'react';

import { useEvents } from '../../events/state';

type UpcomingEventsSectionProps = {
  date: Date;
};

const UpcomingEventsSection: FC<UpcomingEventsSectionProps> = ({ date }) => {
  const { items } = useEvents(
    getEventListOptions(date, {
      past: false,
      pageSize: 3,
    }),
  );
  const upcomingEvents = items.map(eventMapper);

  return (
    <DashboardSection
      title="Upcoming Events"
      description="Here are some upcoming events."
      viewAllHref={
        upcomingEvents.length > 3 ? eventsRoute({}).upcoming({}).$ : undefined
      }
      viewAllTestId="view-upcoming-events"
    >
      <DashboardUpcomingEvents upcomingEvents={upcomingEvents} />
    </DashboardSection>
  );
};

export default UpcomingEventsSection;
