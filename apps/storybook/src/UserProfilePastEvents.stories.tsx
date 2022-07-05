import { UserNoEvents } from '@asap-hub/react-components';
import { text } from '@storybook/addon-knobs';

export default {
  title: 'Templates / User Profile / Past Events',
  component: UserNoEvents,
};

export const ViewOnly = () => (
  <UserNoEvents
    past={true}
    link={text('Explore Past Events', 'https://example.com/upcoming-events')}
  />
);
