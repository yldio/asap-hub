import { UserNoEvents } from '@asap-hub/react-components';
import { text } from '@storybook/addon-knobs';

export default {
  title: 'Templates / User Profile / Upcoming Events',
  component: UserNoEvents,
};

export const ViewOnly = () => (
  <UserNoEvents
    past={false}
    link={text(
      'Explore Upcoming Events',
      'https://example.com/upcoming-events',
    )}
  />
);
