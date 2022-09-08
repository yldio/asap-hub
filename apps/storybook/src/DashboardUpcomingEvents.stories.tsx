import { createListEventResponse } from '@asap-hub/fixtures';
import { DashboardUpcomingEvents } from '@asap-hub/react-components';
import { number } from '@storybook/addon-knobs';

export default {
  title: 'Organisms / Dashboard / Upcoming Events',
};

const numberOfEvents = number('Number of Events', 3);

export const Default = () => (
  <DashboardUpcomingEvents
    upcomingEvents={createListEventResponse(numberOfEvents).items}
    upcomingEventsCount={numberOfEvents}
  />
);

export const Empty = () => <DashboardUpcomingEvents />;
